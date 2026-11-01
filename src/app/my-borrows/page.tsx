import { Suspense } from "react";
import type { Metadata } from "next";
import { io } from "next/cache";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";

import { getBorrowsByUser } from "@/lib/books";
import { requireCurrentUser } from "@/lib/current-user";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MyBorrowsTable } from "@/components/borrows/my-borrows-table";

export const metadata: Metadata = {
    title: "My Borrows",
    description: "The books you have borrowed from BookNook.",
};

function MyBorrowsSkeleton() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                    />
                    Checking your loans
                </div>
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-xl" />
                ))}
            </div>
        </section>
    );
}

async function MyBorrowsContent() {
    // Private route: nothing below renders for a signed-out visitor.
    const user = await requireCurrentUser();

    await io();
    const { borrows, error } = await getBorrowsByUser(user.email);

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl space-y-3">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        On loan to {user.name}
                    </p>
                    <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                        My Borrows
                    </h1>
                    <p className="text-muted-foreground">
                        Every book you have borrowed, with the date it is due
                        back. Return a book whenever you are finished with it.
                    </p>
                </div>

                <Link
                    href="/books"
                    className={buttonVariants({
                        size: "lg",
                        className: "h-11 shrink-0 rounded-full px-5",
                    })}
                >
                    <BookOpen className="size-4" aria-hidden="true" />
                    Browse Books
                </Link>
            </div>

            {error ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                    <h2 className="font-heading text-xl font-semibold">
                        We could not load your borrows
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        Please refresh the page and try again.
                    </p>
                </div>
            ) : (
                <MyBorrowsTable user={user} borrows={borrows} />
            )}
        </section>
    );
}

export default function MyBorrowsPage() {
    return (
        <Suspense fallback={<MyBorrowsSkeleton />}>
            <MyBorrowsContent />
        </Suspense>
    );
}
