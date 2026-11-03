# BookNook

A cozy online library where readers can browse a shared collection, borrow books, track due dates, and put their own favorites on the shelf.

BookNook is a **Next.js 16** frontend backed by an **external REST API** for books and borrows, with **Better Auth + MongoDB** handling accounts, sessions, and JWT issuance.

**Live site:** [booknook-frontend-neon.vercel.app](https://booknook-frontend-neon.vercel.app) — deployed on Vercel  
**API:** [booknook-backend-mocha.vercel.app](https://booknook-backend-mocha.vercel.app) — live books/borrows service  
**Client repo:** [github.com/mijbahur/book-nook](https://github.com/mijbahur/book-nook)  
**Server repo:** [github.com/mijbahur/booknook-server](https://github.com/mijbahur/booknook-server)

The production site is built from this repository. The Google OAuth redirect URI for the Vercel domain is documented under [Deployment](#deployment). The Google-auth commit and the theme/motion changes described in [What's new](#whats-new) are still local, so they will appear on the live site only after they are pushed and redeployed.

---

## Features

- **Browse the collection** — home page with a hero slider, new arrivals, how-it-works, and category shortcuts.
- **Search by category** — `/books` lists every title and filters by Fiction, Science, History, Kids, or Others.
- **Book details** — cover, author, description, owner, and copies available.
- **Borrow and return** — borrow a copy for 14 days, see a live due-date/overdue badge, and return it from My Borrows.
- **Share your own books** — add a book with title, author, category, cover URL, description, and number of copies.
- **Manage your shelf** — edit or delete books from My Books.
- **Accounts** — email/password signup and login, plus Google sign-in and Google sign-up.
- **Auth feedback** — toast errors, a spinner + disabled submit button while a login, signup, or Google redirect is in flight, and a redirect to `/login` after signup.
- **Password rules** — at least 6 characters including an uppercase and a lowercase letter. The composition rule is enforced by the signup form; Better Auth enforces the minimum length.
- **Active navigation** — the current route is highlighted in both the desktop nav and the mobile sheet.
- **Route protection** — signed-out visitors are redirected to `/login` for private pages.
- **JWT-authenticated API calls** — every write and every private read sends a Bearer token to the backend.
- **Light/dark theme** — a navbar toggle switches between the warm paper-toned light theme and a cool blue dark theme via `next-themes`.
- **Responsive UI** — mobile sheet navigation, skeleton loading states, a global route loading screen, and toast feedback.

---

## What's new

### Google authentication and auth polish — commit `9a83694` (unpushed)

The latest local commit adds the Google flow and tightens the auth UX:

- **Google OAuth provider** configured in Better Auth via `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
- **Google buttons** on both `/login` and `/signup`, with a "Redirecting to Google" pending state and an error return to the same page.
- **No auto sign-in after signup** (`autoSignIn: false`). A new account shows a success toast and is sent to `/login`.
- **Password policy** lowered to a 6-character minimum, with an uppercase + lowercase requirement and matching helper text on signup.
- **Per-form loading state** — submit buttons disable and show a spinner while authenticating.
- **"Forgot password?"** button on login, currently a "coming soon" toast.
- **Active nav links** derived from `usePathname()` for desktop and mobile.
- **Global loading screen** at `src/app/loading.tsx`.
- **`.env*` ignored** in `.gitignore` so local secrets cannot be committed.

### Local working-tree changes (uncommitted)

These changes are in the working tree but not yet committed or deployed:

- **Theme provider** — `next-themes` now wraps the app in `src/app/layout.tsx` with the `class` strategy, light as the default, and system preference disabled.
- **Theme toggle** — `src/components/themeBtn.tsx` adds a sun/moon button to the navbar.
- **Cool-blue dark palette** — the dark tokens in `src/app/globals.css` moved from warm brown to blue/slate.
- **Navbar layout** — the theme toggle and mobile menu now sit together, with desktop auth actions beside them.
- **Motion dependency** — `framer-motion` was added for upcoming scroll-reveal animations.
- **Scaffolds in progress** — `src/components/home/reveal.tsx` (currently empty) and `src/contexts/theme.ts` (unused; the toggle uses `next-themes` directly).
- **Docs** — this README rewrite and `docs/backend-borrows.md`.

---

## Tech stack

| Layer          | Technology                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org) (App Router, React Compiler enabled)      |
| Language       | TypeScript                                                                 |
| UI             | React 19, Tailwind CSS 4, shadcn/ui (Base UI), Lucide icons, Sonner toasts |
| Motion         | Swiper (hero slider); Framer Motion installed for scroll-reveal (not wired up yet) |
| Auth           | [Better Auth](https://www.better-auth.com) with the JWT plugin             |
| Auth database  | MongoDB via `@better-auth/mongo-adapter`                                   |
| Data transport | `fetch` to an external REST API (`NEXT_PUBLIC_API_URL`)                    |
| Tooling        | ESLint 9, `eslint-config-next`, Turbopack, `@tailwindcss/turbopack`        |

> **Note:** MongoDB is used directly by the auth layer only. Books and borrows are stored by the separate backend API, not by Next.js route handlers in this repository.

---

## Architecture

```
Browser
  │
  ├── Next.js App Router (this repo, :3000)
  │     ├── Better Auth  ──── MongoDB (users, sessions, accounts)
  │     ├── proxy.ts (middleware) — session-based route protection
  │     └── lib/books.ts — fetch + Bearer JWT
  │
  └── External books/borrows REST API (NEXT_PUBLIC_API_URL)
        ├── GET    /books
        ├── GET    /book/:id
        ├── POST   /add-book
        ├── PATCH  /book/:id
        ├── DELETE /book/:id
        ├── POST   /borrows
        ├── GET    /borrows?userEmail=...
        └── DELETE /borrow/:id
```

- **Server Components** read books and borrows directly with a server-issued JWT (`getTokenFromServer`).
- **Client Components** (dialogs and forms) mint a JWT from the browser session (`getTokenFromClient`) before calling the API.
- **`src/proxy.ts`** is the Next.js 16 replacement for `middleware.ts`. It protects `/my-books`, `/my-borrows`, `/add-book`, and redirects signed-in users away from `/login` and `/signup`.

---

## Getting started

### Prerequisites

- Node.js 20+ and npm
- A MongoDB connection string (Atlas or local)
- The books/borrows REST API running (see [Backend contract](#backend-contract))
- Optional: a Google OAuth client for social sign-in

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` (or `.env`) in the project root:

```env
# Required
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:8000

# Required only for Google sign-in
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

| Variable                 | Required | Description                                                                 |
| ------------------------ | :------: | --------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`     |    ✅    | Secret used to sign sessions/JWTs. Use a long random string.                 |
| `BETTER_AUTH_URL`        |    ✅    | Public base URL of this app. Used by the auth client.                       |
| `MONGODB_URI`            |    ✅    | MongoDB connection string. The app uses the `booknook` database.            |
| `NEXT_PUBLIC_API_URL`    |    ✅    | Base URL of the external books/borrows REST API. Exposed to the browser.    |
| `GOOGLE_CLIENT_ID`       |    —     | Google OAuth client ID.                                                     |
| `GOOGLE_CLIENT_SECRET`   |    —     | Google OAuth client secret.                                                 |

For Google sign-in, register this authorized redirect URI in the Google Cloud console:

```
{BETTER_AUTH_URL}/api/auth/callback/google
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

---

## Available scripts

| Script          | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the development server          |
| `npm run build` | Create a production build             |
| `npm start`     | Serve the production build            |
| `npm run lint`  | Run ESLint                            |

---

## Pages and routes

| Route          | Access        | Description                                              |
| -------------- | ------------- | -------------------------------------------------------- |
| `/`            | Public        | Hero slider, new arrivals, how it works, top categories  |
| `/books`       | Public        | All books with category filters                          |
| `/books/[id]`  | Public        | Book details with borrow action                          |
| `/login`       | Guests only   | Email/password + Google login                            |
| `/signup`      | Guests only   | Account creation + Google sign-up                        |
| `/add-book`    | Signed in     | Share a new book                                         |
| `/my-books`    | Signed in     | Edit/delete the books you own                            |
| `/my-borrows`  | Signed in     | View loans, due dates, and return books                  |
| `/api/auth/*`  | —             | Better Auth handler (`toNextJsHandler`)                  |

Unknown book IDs render the custom not-found page.

---

## Backend contract

The frontend expects an Express-like REST API at `NEXT_PUBLIC_API_URL`. Reads of the collection are public; writes and user-specific reads require `Authorization: Bearer <jwt>`.

### Books

| Method   | Endpoint                | Auth | Purpose                                  |
| -------- | ----------------------- | :--: | ---------------------------------------- |
| `GET`    | `/books`                |  —   | List books. Supports `limit`, `sort`, `ownerEmail` |
| `GET`    | `/book/:id`             |  —   | Fetch a single book                      |
| `POST`   | `/add-book`             |  ✅  | Create a book                            |
| `PATCH`  | `/book/:id`             |  ✅  | Update a book                            |
| `DELETE` | `/book/:id`             |  ✅  | Delete a book                            |

### Borrows

| Method   | Endpoint                     | Auth | Purpose                                  |
| -------- | ---------------------------- | :--: | ---------------------------------------- |
| `POST`   | `/borrows`                   |  ✅  | Borrow one copy of a book                |
| `GET`    | `/borrows?userEmail=<email>` |  ✅  | List the signed-in reader's active loans |
| `DELETE` | `/borrow/:id`                |  ✅  | Return a book                            |

Borrow dates are computed on the server: `borrowDate` is "now" and `returnDate` is the due date, 14 days later. The browser never sends them, so a reader cannot extend their own deadline.

A complete reference implementation of the borrow routes, including copy counting and race-condition handling, lives in [`docs/backend-borrows.md`](docs/backend-borrows.md).

### Data shapes

```ts
type Book = {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others";
  image: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string; // ISO date
  totalCopies: number;
};

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string; // ISO date, set by the server
  returnDate: string; // ISO due date, borrowDate + 14 days
};
```

### Rules enforced by the UI and API

- Owners cannot borrow their own book.
- A reader cannot hold two active loans of the same book.
- A book with `totalCopies < 1` cannot be borrowed.
- Returning a book deletes the borrow and increments the book's available copies.
- API errors are surfaced as toast messages via a small `ApiError` wrapper in `src/lib/books.ts`.

---

## Project structure

```
book-nook/
├── docs/
│   └── backend-borrows.md        # Reference Express implementation for borrows
├── public/                       # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/login|signup   # Auth pages
│   │   ├── add-book/             # Share a book
│   │   ├── api/auth/[...all]/    # Better Auth route handler
│   │   ├── books/                # Collection + book details
│   │   ├── my-books/             # Owner dashboard
│   │   ├── my-borrows/           # Reader loans
│   │   ├── layout.tsx            # Fonts, theme provider, navbar, footer, toaster
│   │   ├── loading.tsx           # Global route loading screen
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Tailwind theme tokens and utilities
│   ├── components/
│   │   ├── auth/                 # Google sign-in button
│   │   ├── books/                # Cards, forms, edit/delete dialogs, table
│   │   ├── borrows/              # Borrow/return dialogs, loans table
│   │   ├── home/                 # Hero, new arrivals, how it works, categories
│   │   ├── layout/               # Navbar, footer, logo, auth actions
│   │   ├── ui/                   # shadcn/Base UI primitives
│   │   └── themeBtn.tsx          # Light/dark toggle
│   ├── contexts/
│   │   └── theme.ts              # Theme context scaffold (not wired up yet)
│   ├── lib/
│   │   ├── auth.ts               # Better Auth server config (MongoDB + JWT)
│   │   ├── auth-client.ts        # Browser auth client
│   │   ├── books.ts              # REST API client for books and borrows
│   │   ├── current-user.ts       # Session helpers + owner check
│   │   ├── getTokenFrom*.ts      # JWT helpers for server and client
│   │   ├── types.ts              # Shared domain types
│   │   └── utils.ts              # cn() and case-insensitive email compare
│   └── proxy.ts                  # Route protection (Next.js 16 middleware)
├── next.config.ts                # React Compiler, image hosts, Turbopack CSS
├── components.json               # shadcn configuration
└── package.json
```

---

## How auth works

1. A reader signs up or logs in with email/password, or chooses **Continue with Google**.
2. Email signup does **not** auto sign-in. The account is created, a success toast appears, and the reader is redirected to `/login`.
3. Google sign-in goes through Better Auth's Google provider and returns to `/` on success, or back to `/login` / `/signup` on error. In production the callback is `https://booknook-frontend-neon.vercel.app/api/auth/callback/google`.
4. Passwords must be at least 6 characters; the signup form additionally requires one uppercase and one lowercase letter.
5. Better Auth stores users, sessions, and accounts in MongoDB (`booknook` database).
6. The JWT plugin exposes tokens through `auth.api.getToken()` on the server and `authClient.token()` in the browser.
7. Private pages call `requireCurrentUser()`; the proxy also redirects unauthenticated requests before render.
8. API calls attach `Authorization: Bearer <token>`. The backend verifies the JWT and derives the reader's identity from the token claims — never from a client-supplied email.

---

## Notes and current limitations

- The external books/borrows API must be running; without it, pages show friendly empty/error states instead of crashing.
- "Forgot password?" and "Edit Profile" are placeholders that display a "coming soon" toast.
- Google sign-in requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. If they are missing, the provider is registered with empty credentials and the Google button will fail.
- The uppercase/lowercase password rule is checked by the signup form; Better Auth itself enforces only the 6-character minimum.
- `framer-motion` and `src/components/home/reveal.tsx` are staged for scroll-reveal animations but are not wired into any page yet.
- `src/contexts/theme.ts` is an unused scaffold; the navbar toggle uses `next-themes` directly.
- The theme defaults to light and system preference is disabled (`enableSystem={false}`), so the toggle is the only way to switch themes.
- Cover images are rendered with `next/image`; allowed hosts are configured in `next.config.ts` (`images.pexels.com` and `covers.openlibrary.org`). Add new hosts there if you use other image sources.
- The hero slider uses remote Pexels images, so it needs network access.
- Authentication uses a MongoDB database literally named `booknook` (see `src/lib/auth.ts`).

---

## Deployment

The live frontend is deployed at **https://booknook-frontend-neon.vercel.app** and the API at **https://booknook-backend-mocha.vercel.app**. The app is a standard Next.js deployment and also works on any Node.js host.

1. Set every environment variable from the table above in your hosting provider.
2. For the Vercel deployment, use `BETTER_AUTH_URL=https://booknook-frontend-neon.vercel.app` and register these Google OAuth values:
   - **Authorized JavaScript origin:** `https://booknook-frontend-neon.vercel.app`
   - **Authorized redirect URI:** `https://booknook-frontend-neon.vercel.app/api/auth/callback/google`
3. Make sure `NEXT_PUBLIC_API_URL` points at a publicly reachable backend (`https://booknook-backend-mocha.vercel.app` in production) and that its CORS policy allows your frontend origin.
4. Build and start with `npm run build && npm start`, or let Vercel build on push.

Pushing `main` triggers a new Vercel deployment. The Google-auth commit (`9a83694`) is still ahead of `origin/main`, and the theme/motion work is uncommitted, so neither is on the live site yet.

For platform-specific guidance, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## License

No license has been declared for this project.
