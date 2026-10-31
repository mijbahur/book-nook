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
