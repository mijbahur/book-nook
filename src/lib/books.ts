import type { Book } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

export type BooksResult = {
    books: Book[];
    error: boolean;
};

class ApiError extends Error {
    status: number;

    constructor(status: number) {
        super(`BookNook API request failed with ${status}.`);
        this.name = "ApiError";
        this.status = status;
    }
}

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new ApiError(response.status);
    }

    return response.json() as Promise<T>;
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
        const books = await request<Book[]>(
            `/books`,
        );

        return { books, error: false };
    } catch (error) {
        console.error("Failed to load books:", error);
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

