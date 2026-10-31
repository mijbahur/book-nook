import { BookOpen, Loader2 } from "lucide-react";
import { getAllBooks } from "@/lib/books";
import { BookCard } from "@/components/books/book-card";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "All Books",
    description:
        "Browse every book on the BookNook shelves, filtered by category.",
};

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

async function BooksContent() {
    // const res = await fetch("http://localhost:8000/books");
    // const data = await res.json();
    const { books, error } = await getAllBooks();
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl space-y-3">
                <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    The whole collection
                </p>
                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                    All Books
                </h1>
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
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book, index) => (
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

const ALLBookPage = async () => {
    return (
        <Suspense fallback={<BooksSkeleton />}>
            <BooksContent />
        </Suspense>
    );
};

export default ALLBookPage;
