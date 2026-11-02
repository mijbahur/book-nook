import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { io } from "next/cache";
import { Suspense } from "react";

import { BookCard } from "@/components/books/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBooks } from "@/lib/books";
import { BOOK_CATEGORIES, type BookCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "All Books",
    description:
        "Browse every book on the BookNook shelves, filtered by category.",
};

type BooksPageProps = {
    searchParams: Promise<{ category?: string | string[] }>;
};

type CategoryFilter = BookCategory | "All";

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

function FilterPill({
    label,
    href,
    active,
}: {
    label: string;
    href: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card text-foreground hover:bg-muted",
            )}
        >
            {label}
        </Link>
    );
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
    // const res = await fetch("http://localhost:8000/books");
    // const data = await res.json();
    const { category } = await searchParams;
    const activeCategory = parseCategory(category);

    await io();
    const { books, error } = await getAllBooks();

    const visibleBooks =
        activeCategory === "All"
            ? books
            : books.filter((book) => book.category === activeCategory);

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
                    by category.
                </p>
            </div>

            <div
                className="mb-10 flex flex-wrap gap-2"
                role="group"
                aria-label="Filter books by category"
            >
                <FilterPill
                    label="All"
                    href="/books"
                    active={activeCategory === "All"}
                />
                {BOOK_CATEGORIES.map((category) => (
                    <FilterPill
                        key={category}
                        label={category}
                        href={`/books?category=${category}`}
                        active={activeCategory === category}
                    />
                ))}
            </div>

            {error ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                    <h2 className="font-heading text-xl font-semibold">
                        We could not open the shelves
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        Please refresh the page and try again.
                    </p>
                </div>
            ) : visibleBooks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                    <h2 className="font-heading text-xl font-semibold">
                        Nothing on this shelf yet
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        No {activeCategory === "All" ? "" : `${activeCategory} `}
                        books have been shared so far.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleBooks.map((book, index) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            priority={index < 3}
                        />
                    ))}
                </div>
            )}
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
