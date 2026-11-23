# Backend code for the borrow system

What the `/borrows` and `/my-borrows` pages call. Written for **Express + the
official `mongodb` driver** (same stack as `docs/backend-books.md`).

You do **not** need to create the `borrows` collection by hand — MongoDB creates
it the first time a document is inserted.

## Endpoint contract used by the frontend

| Method   | Path                        | Purpose                                  |
| -------- | --------------------------- | ---------------------------------------- |
| `POST`   | `/borrows`                  | Borrow a book, take one copy off the shelf |
| `GET`    | `/borrows`                  | List the reader's active borrows          |
| `DELETE` | `/borrows/:id`              | Return a book, give the copy back         |

- Protected routes require a verified Bearer JWT. The backend derives the
  reader identity from the verified token, never from a client-supplied email.
- `borrowDate` and `returnDate` are **computed on the server**. The browser
  never sends them, so nobody can give themselves a longer deadline.
- `returnDate` is the **due date**: `borrowDate + 14 days`.

## `routes/borrows.js`

```js
import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js"; // <- your existing Mongo connection helper

const router = Router();

const LOAN_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Case-insensitive exact match on an email field. */
function emailFilter(email) {
    return { $regex: `^${escapeRegExp(email.trim())}$`, $options: "i" };
}

function sameEmail(a, b) {
    return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

function booksCollection() {
    return getDb().collection("books");
}

function borrowsCollection() {
    return getDb().collection("borrows");
}

/**
 * The verifyToken middleware must validate the JWT and attach its verified
 * claims to req.user before these routes run.
 */
function getRequester(req) {
    const email = req.user?.email;
    return typeof email === "string" ? { email: email.trim() } : null;
}

function requireRequester(req, res) {
    const requester = getRequester(req);

    if (!requester) {
        res.status(401).json({ message: "You need to be signed in." });
        return null;
    }

    return requester;
}

/* ---------------------------------------------------------------- */
/* POST /borrows                                                    */
/* ---------------------------------------------------------------- */
router.post("/borrows", async (req, res) => {
    const requester = requireRequester(req, res);
    if (!requester) return;

    const { bookId, userName } = req.body ?? {};

    if (!ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: "Invalid book id." });
    }

    const _id = new ObjectId(bookId);

    try {
        const book = await booksCollection().findOne({ _id });

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        // The owner keeps their own copy on the shelf.
        if (sameEmail(book.ownerEmail, requester.email)) {
            return res
                .status(400)
                .json({ message: "This book is already on your shelf." });
        }

        // One active loan per reader per book.
        const existing = await borrowsCollection().findOne({
            bookId: String(_id),
            userEmail: emailFilter(requester.email),
        });

        if (existing) {
            return res.status(409).json({
                message: "You already have this book. Return it first.",
            });
        }

        // Atomically take one copy. If two people race for the last copy,
        // only one of these updates can match `totalCopies > 0`.
        const claimed = await booksCollection().findOneAndUpdate(
            { _id, totalCopies: { $gt: 0 } },
            { $inc: { totalCopies: -1 }, $set: { updatedAt: new Date() } },
            { returnDocument: "after" },
        );

        if (!claimed) {
            return res
                .status(409)
                .json({ message: "No copies of this book are available." });
        }

        const borrowDate = new Date();
        const returnDate = new Date(borrowDate.getTime() + LOAN_DAYS * DAY_MS);

        const document = {
            bookId: String(_id),
            bookTitle: book.title,
            bookImage: book.image,
            userName: String(userName ?? "").trim() || "BookNook reader",
            userEmail: requester.email,
            borrowDate: borrowDate.toISOString(),
            returnDate: returnDate.toISOString(),
            createdAt: borrowDate,
        };

        let inserted;
        try {
            inserted = await borrowsCollection().insertOne(document);
        } catch (error) {
            // Put the copy back so the shelf is not short-changed.
            await booksCollection().updateOne(
                { _id },
                { $inc: { totalCopies: 1 } },
            );
            throw error;
        }

        res.status(201).json({
            _id: inserted.insertedId.toString(),
            ...document,
        });
    } catch (error) {
        console.error("POST /borrows failed:", error);
        res.status(500).json({ message: "Could not borrow this book." });
    }
});

/* ------------------------------------------------------------------ */
/* GET /borrows                                                        */
/* ------------------------------------------------------------------ */
router.get("/borrows", async (req, res) => {
    const requester = requireRequester(req, res);
    if (!requester) return;

    try {
        const borrows = await borrowsCollection()
            .find({ userEmail: emailFilter(requester.email) })
            .sort({ borrowDate: -1 })
            .toArray();

        res.json(borrows);
    } catch (error) {
        console.error("GET /borrows failed:", error);
        res.status(500).json({ message: "Could not load your borrows." });
    }
});

/* ------------------------------------------------------------------ */
/* DELETE /borrows/:id  (return a book)                                */
/* ------------------------------------------------------------------ */
router.delete("/borrows/:id", async (req, res) => {
    const requester = requireRequester(req, res);
    if (!requester) return;

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid borrow id." });
    }

    try {
        const _id = new ObjectId(id);
        const borrow = await borrowsCollection().findOne({ _id });

        if (!borrow) {
            return res.status(404).json({ message: "Borrow not found." });
        }

        if (!sameEmail(borrow.userEmail, requester.email)) {
            return res
                .status(403)
                .json({ message: "You can only return your own borrows." });
        }

        await borrowsCollection().deleteOne({ _id });

        // Give the copy back.
        if (ObjectId.isValid(borrow.bookId)) {
            await booksCollection().updateOne(
                { _id: new ObjectId(borrow.bookId) },
                { $inc: { totalCopies: 1 }, $set: { updatedAt: new Date() } },
            );
        }

        res.status(200).json({ deleted: true, _id: id });
    } catch (error) {
        console.error(`DELETE /borrows/${id} failed:`, error);
        res.status(500).json({ message: "Could not return this book." });
    }
});

export default router;
```

Mount it alongside your other routes:

```js
import borrowRoutes from "./routes/borrows.js";

app.use(express.json());
app.use(borrowRoutes); // /borrows, /borrows/:id
```

## Indexes (run once, safe to run on every boot)

```js
const borrows = getDb().collection("borrows");
await borrows.createIndex({ userEmail: 1, borrowDate: -1 });
await borrows.createIndex({ bookId: 1, userEmail: 1 }, { unique: true });
```

The second one makes "one active loan per reader per book" a database rule,
not just an application rule. It is safe because a returned borrow is deleted,
so the slot frees up for the next loan.

## Things worth knowing

- **Your `GET /books/:id` currently returns `200` with an empty body**, which
  breaks the book details page. The frontend now falls back to finding the book
  in `GET /books`, but the endpoint should still be fixed. A working version:

  ```js
  router.get("/books/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid book id." });
      }

      const book = await getDb()
          .collection("books")
          .findOne({ _id: new ObjectId(id) });

      if (!book) {
          return res.status(404).json({ message: "Book not found." });
      }

      res.json(book);
  });
  ```

- **Borrowing twice** is blocked in three places: the button on the details
  page (disabled when the reader owns the book or copies run out), the
  `existing` check in `POST /borrows`, and the unique index above.
- **Deleting a book that someone has borrowed** is not handled here. If you
  allow it, return a borrow whose book no longer exists and the `$inc` above
  simply matches nothing — no crash, but the reader keeps a dangling borrow.
  Consider deleting that book's borrows in your `DELETE /books/:id` handler.
- Make sure `verifyToken` runs before these routes and attaches the verified
  JWT claims to `req.user`. The `getRequester()` helper then reads the user's
  identity from those trusted claims. Keep the token in the
  `Authorization: Bearer <token>` header; do not authorize from a query or
  request-body email.
