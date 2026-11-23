import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { io } from "next/cache";
import { Suspense } from "react";

import { BookExplorer } from "@/components/books/book-explorer";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBooks } from "@/lib/books";
import { BOOK_CATEGORIES, type BookCategory } from "@/lib/types";

export const metadata: Metadata = {
    title: "All Books",
    description:
        "Search, filter, and sort every book on the BookNook shelves.",
};

type BooksPageProps = {
    searchParams: Promise<{
        category?: string | string[];
        q?: string | string[];
        sort?: string | string[];
    }>;
};

type CategoryFilter = BookCategory | "All";
type BookSort = "title-asc" | "title-desc";

function firstValue(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function parseCategory(
    value: string | string[] | undefined,
): CategoryFilter {
    const raw = Array.isArray(value) ? value[0] : value;

    return (
        BOOK_CATEGORIES.find(
            (category) => category.toLowerCase() === raw?.toLowerCase(),
        ) ?? "All"
    );
}

function parseSort(value: string | string[] | undefined): BookSort {
    return firstValue(value) === "title-desc" ? "title-desc" : "title-asc";
}

function BooksSkeleton() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                    />
                    Loading the shelves
                </div>
                <Skeleton className="h-10 w-56" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="mb-10 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="h-9 w-20 rounded-full"
                    />
                ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="aspect-2/2 w-full rounded-xl"
                    />
                ))}
            </div>
        </section>
    );
}

async function BooksContent({
    searchParams,
}: {
    searchParams: BooksPageProps["searchParams"];
}) {
    const { category, q, sort } = await searchParams;
    const query = firstValue(q)?.trim() ?? "";

    await io();
    const { books, error } = await getAllBooks();

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl space-y-3">
                <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    The whole collection
                </p>
                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                    All Books
                </h1>
                <p className="text-muted-foreground">
                    Browse every title on the shelf, or narrow the collection
                    by category, search, or sort titles alphabetically.
                </p>
            </div>

            <BookExplorer
                books={books}
                categories={BOOK_CATEGORIES}
                initialCategory={parseCategory(category)}
                initialQuery={query}
                initialSort={parseSort(sort)}
                error={error}
            />
        </section>
    );
}

const ALLBookPage = async ({ searchParams }: BooksPageProps) => {
    return (
        <Suspense fallback={<BooksSkeleton />}>
            <BooksContent searchParams={searchParams} />
        </Suspense>
    );
};

export default ALLBookPage;
