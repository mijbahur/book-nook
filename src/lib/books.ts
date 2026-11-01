import type { Book, BookCategory } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type BooksResult = {
    books: Book[];
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

class ApiError extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message ?? `BookNook API request failed with ${status}.`);
        this.name = "ApiError";
        this.status = status;
    }
}

export { ApiError };

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new ApiError(response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export async function createBook(book: NewBook): Promise<void> {
    const response = await fetch(`${API_URL}/add-book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(book),
            });

    if (!response.ok) {
        throw new ApiError(response.status);
    }
     return response.json();
}
/**
 * Identifies the reader for owner-scoped writes.
 *
 * This header is the temporary stand-in for a real session. When
 * authentication is connected, swap it for the `Authorization` header that
 * your backend verifies and keep the same ownership checks on the server.
 */
function ownerHeaders(ownerEmail: string): Record<string, string> {
    return {
        "Content-Type": "application/json",
        "X-User-Email": ownerEmail,
    };
}

function sameEmail(a: string | undefined, b: string): boolean {
    return (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
}



export async function getLatestBooks(limit = 6): Promise<BooksResult> {
    try {
        const books = await request<Book[]>(
            `/books?limit=${limit}&sort=createdAt`,
        );

        return { books: books.slice(0, limit), error: false };
    } catch (error) {
        console.error("Failed to load latest books:", error);
        return { books: [], error: true };
    }
}

export async function getAllBooks(): Promise<BooksResult> {
    try {
        const books = await request<Book[]>(`/books`);

        return { books, error: false };
    } catch (error) {
        console.error("Failed to load books:", error);
        return { books: [], error: true };
    }
}

/**
 * Books added by one reader.
 *
 * The `ownerEmail` query parameter lets the backend filter server-side. The
 * result is also filtered here, so the page can never leak somebody else's
 * books even if the backend ignores the parameter.
 */
export async function getBooksByOwner(ownerEmail: string): Promise<BooksResult> {
    try {
        const books = await request<Book[]>(
            `/books?ownerEmail=${encodeURIComponent(ownerEmail)}`,
        );

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
        const data = await request<Book>(`/book/${encodeURIComponent(id)}`);
        return data;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }

        console.error(`Failed to load book ${id}:`, error);
        return null;
    }
}

export async function updateBook(
    id: string,
    book: BookUpdate,
    ownerEmail: string,
): Promise<Book> {
    const response = await fetch(`${API_URL}/book/${encodeURIComponent(id)}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...ownerHeaders(ownerEmail),
                },
                body: JSON.stringify(book),
            });

    if (!response.ok) {
        throw new ApiError(response.status);
    }
     return response.json();
}

export async function deleteBook(
    id: string,
    ownerEmail: string,
): Promise<void> {
    const response = await fetch(`${API_URL}/book/${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: ownerHeaders(ownerEmail),
            });

    if (!response.ok) {
        throw new ApiError(response.status);
    }
     return response.json();
}
