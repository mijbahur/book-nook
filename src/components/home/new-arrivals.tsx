import Link from "next/link";
import { io } from "next/cache";
import { BookOpen, Loader2 } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestBooks } from "@/lib/books";

export function NewArrivalsSkeleton() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                    />
                    Loading the newest books
                </div>
                <Skeleton className="h-10 w-64 max-w-full" />
                <Skeleton className="h-5 w-full max-w-lg" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-border/70 bg-card"
                    >
                        <Skeleton className="aspect-2/3 w-full rounded-none" />
                        <div className="space-y-3 p-4">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export async function NewArrivals() {
    await io();
    const { books, error } = await getLatestBooks(6);
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl space-y-3">
                <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    Fresh off the shelf
                </p>
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                    New Arrivals
                </h2>
                <p className="text-muted-foreground">
                    The latest additions to the BookNook shelves, ready for
                    their first reader.
                </p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
                    <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                    <h3 className="font-heading text-xl font-semibold">
                        The shelf is taking a moment
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        We could not load the newest books right now. Please
                        refresh the page and try again.
                    </p>
                </div>
            ) : books.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
                    <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                    <h3 className="font-heading text-xl font-semibold">
                        No books on the shelf yet
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        New arrivals will appear here as soon as the first book
                        is added.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            )}

            <div className="mt-10 flex justify-center">
                <Link
                    href="/books"
                    className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "h-11 rounded-full px-6",
                    })}
                >
                    See All Books
                </Link>
            </div>
        </section>
    );
}
