import type { Book, BookCategory, IBorrow, NewBorrow } from "@/lib/types";
import { sameEmail } from "@/lib/utils";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export type BooksResult = {
    books: Book[];
    error: boolean;
};

export type BorrowsResult = {
    borrows: IBorrow[];
    error: boolean;
};

export type NewBook = Omit<Book, "_id">;

export type BookUpdate = {
    title: string;
    author: string;
    category: BookCategory;
    image: string;
    description: string;
    totalCopies: number;
};

export class ApiError extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message ?? `BookNook API request failed with ${status}.`);
        this.name = "ApiError";
        this.status = status;
    }
}

async function errorMessage(response: Response): Promise<string | undefined> {
    try {
        const data = (await response.json()) as {
            message?: string;
            error?: string;
        };
        return data.message ?? data.error;
    } catch {
        return undefined;
    }
}

// ---------- books ----------

export async function createBook(book: NewBook, token?: string) {
    const res = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
    });
    if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
    return res.json();
}

export async function getLatestBooks(limit = 6): Promise<BooksResult> {
    try {
        console.log(API_URL);
        const res = await fetch(
            `${API_URL}/books?limit=${limit}&sort=createdAt`,
        );
        if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
        const books: Book[] = await res.json();
        return { books: books.slice(0, limit), error: false };
    } catch (error) {
        console.error("Failed to load latest books:", error);
        return { books: [], error: true };
    }
}

export async function getAllBooks(): Promise<BooksResult> {
    try {
        const res = await fetch(`${API_URL}/books`, {
            cache: "no-store",
        });
        if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
        const books: Book[] = await res.json();
        return { books, error: false };
    } catch (error) {
        console.error("Failed to load books:", error);
        return { books: [], error: true };
    }
}

export async function getBooksByOwner(
    ownerEmail: string,
    token?: string,
): Promise<BooksResult> {
    try {
        const res = await fetch(
            `${API_URL}/books?ownerEmail=${encodeURIComponent(ownerEmail)}`,
            {
                cache: "no-store",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
        );
        if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
        const books: Book[] = await res.json();
        return {
            books: books.filter((book) =>
                sameEmail(book.ownerEmail, ownerEmail),
            ),
            error: false,
        };
    } catch (error) {
        console.error("Failed to load your books:", error);
        return { books: [], error: true };
    }
}

export async function getBookById(id: string): Promise<Book | null> {
    try {
        const res = await fetch(`${API_URL}/book/${encodeURIComponent(id)}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
        return await res.json();
    } catch (error) {
        console.error(`Failed to load book ${id}:`, error);
        return null;
    }
}

export async function updateBook(
    id: string,
    book: BookUpdate,
    token?: string,
): Promise<Book> {
    const res = await fetch(`${API_URL}/book/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
    });
    if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
    return res.json();
}

export async function deleteBook(
    id: string,
    token?: string,
) {
    const res = await fetch(`${API_URL}/book/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
    return res.json();
}

// ---------- borrows ----------
export async function createBorrow(
    borrow: NewBorrow,
    token?: string,
): Promise<IBorrow> {
    const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(borrow),
    });
    if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
    return res.json();
}

export async function getBorrowsByUser(
    userEmail: string,
    token?: string,
): Promise<BorrowsResult> {
    try {
        const res = await fetch(
            `${API_URL}/borrows?userEmail=${encodeURIComponent(userEmail)}`,
            {
                cache: "no-store",
                headers: { authorization: `Bearer ${token}` },
            },
        );
        if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
        const borrows: IBorrow[] = await res.json();
        return {
            borrows: borrows.filter((borrow) =>
                sameEmail(borrow.userEmail, userEmail),
            ),
            error: false,
        };
    } catch (error) {
        console.error("Failed to load your borrows:", error);
        return { borrows: [], error: true };
    }
}

export async function returnBorrow(
    id: string,
    token?: string,
) {
    const res = await fetch(`${API_URL}/borrow/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
    return res.json();
}
