"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { BookCard } from "@/components/books/book-card";
import { Input } from "@/components/ui/input";
import type { Book, BookCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type BookSort = "title-asc" | "title-desc";
type CategoryFilter = BookCategory | "All";

type BookExplorerProps = {
    books: Book[];
    categories: readonly BookCategory[];
    initialCategory: CategoryFilter;
    initialQuery: string;
    initialSort: BookSort;
    error: boolean;
};

function FilterPill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card text-foreground hover:bg-muted",
            )}
        >
            {label}
        </button>
    );
}

export function BookExplorer({
    books,
    categories,
    initialCategory,
    initialQuery,
    initialSort,
    error,
}: BookExplorerProps) {
    const [category, setCategory] = useState<CategoryFilter>(initialCategory);
    const [query, setQuery] = useState(initialQuery);
    const [sort, setSort] = useState<BookSort>(initialSort);

    const visibleBooks = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();

        return books
            .filter(
                (book) =>
                    category === "All" || book.category === category,
            )
            .filter(
                (book) =>
                    !normalizedQuery ||
                    [book.title, book.author, book.category, book.description]
                        .join(" ")
                        .toLocaleLowerCase()
                        .includes(normalizedQuery),
            )
            .sort((a, b) =>
                sort === "title-asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title),
            );
    }, [books, category, query, sort]);

    return (
        <>
            <form
                className="mb-6 flex flex-col gap-3 sm:flex-row"
                role="search"
                onSubmit={(event) => event.preventDefault()}
            >
                <label className="relative min-w-0 flex-1">
                    <span className="sr-only">
                        Search books by title, author, or description
                    </span>
                    <Search
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search title, author, or description"
                        className="h-11 pl-9"
                    />
                </label>
                <label className="sm:w-52">
                    <span className="sr-only">Sort books alphabetically</span>
                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(
                                event.target.value === "title-desc"
                                    ? "title-desc"
                                    : "title-asc",
                            )
                        }
                        className="h-11 w-full cursor-pointer rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
                    >
                        <option value="title-asc">Title: A to Z</option>
                        <option value="title-desc">Title: Z to A</option>
                    </select>
                </label>
            </form>

            <div
                className="mb-10 flex flex-wrap gap-2"
                role="group"
                aria-label="Filter books by category"
            >
                <FilterPill
                    label="All"
                    active={category === "All"}
                    onClick={() => setCategory("All")}
                />
                {categories.map((bookCategory) => (
                    <FilterPill
                        key={bookCategory}
                        label={bookCategory}
                        active={category === bookCategory}
                        onClick={() => setCategory(bookCategory)}
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
                        {query
                            ? "No books match your search"
                            : "Nothing on this shelf yet"}
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        {query
                            ? "Try another title, author, or search term."
                            : `No ${category === "All" ? "" : `${category} `}books have been shared so far.`}
                    </p>
                </div>
            ) : (
                <>
                    <p
                        className="mb-4 text-sm text-muted-foreground"
                        aria-live="polite"
                    >
                        {visibleBooks.length}{" "}
                        {visibleBooks.length === 1 ? "book" : "books"} found
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleBooks.map((book, index) => (
                            <BookCard
                                key={book._id}
                                book={book}
                                priority={index < 3}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
