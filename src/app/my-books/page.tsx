import { Suspense } from "react";
import type { Metadata } from "next";
import { io } from "next/cache";
import Link from "next/link";
import { BookOpen, Loader2, Plus } from "lucide-react";

import { getBooksByOwner } from "@/lib/books";
import { requireCurrentUser } from "@/lib/current-user";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MyBooksTable } from "@/components/books/my-books-table";

export const metadata: Metadata = {
    title: "My Books",
    description: "Manage the books you have shared with BookNook.",
};

function MyBooksSkeleton() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                    />
                    Opening your shelf
                </div>
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-xl" />
                ))}
            </div>
        </section>
    );
}

async function MyBooksContent() {
    
    const user = await requireCurrentUser();

    await io();
    const { books, error } = await getBooksByOwner(user.email);

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl space-y-3">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        {user.name}&rsquo;s shelf
                    </p>
                    <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                        My Books
                    </h1>
                    <p className="text-muted-foreground">
                        Every book you have shared. Edit the details or remove
                        a book from the collection at any time.
                    </p>
                </div>

                <Link
                    href="/add-book"
                    className={buttonVariants({
                        size: "lg",
                        className: "h-11 shrink-0 rounded-full px-5",
                    })}
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Add a Book
                </Link>
            </div>

            {error ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                    <h2 className="font-heading text-xl font-semibold">
                        We could not open your shelf
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        Please refresh the page and try again.
                    </p>
                </div>
            ) : (
                <MyBooksTable user={user} books={books} />
            )}
        </section>
    );
}

export default function MyBooksPage() {
    return (
        <Suspense fallback={<MyBooksSkeleton />}>
            <MyBooksContent />
        </Suspense>
    );
}
