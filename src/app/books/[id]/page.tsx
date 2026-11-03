import { Metadata } from "next";
import { ArrowLeft, BookOpen, Library, Loader2, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookById } from "@/lib/books";
import { getCurrentUser, isBookOwner } from "@/lib/current-user";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { Suspense } from "react";
import { BorrowBookDialog } from "@/components/borrows/borrow-book-dialog";

export const metadata: Metadata = {
    title: "Book Details",
    description: "Read more about a book on the BookNook shelves.",
};

function BookDetailSkeleton() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Opening the book
            </div>
            <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
                <Skeleton className="aspect-4/3 w-full rounded-2xl" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-11 w-48 rounded-full" />
                </div>
            </div>
        </section>
    );
}
async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await io();
    const [book, user] = await Promise.all([
        getBookById(id),
        getCurrentUser(),
    ]);

    if (!book) {
        notFound();
    }
    return (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <Link
                href="/books"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to all books
            </Link>

            <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
                <div className="relative mx-auto aspect-2/3 w-full max-w-[320px] overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-lg shadow-primary/5">
                    <Image
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 80vw, 320px"
                        className="object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {book.category}
                        </span>
                        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                            {book.title}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            by {book.author}
                        </p>
                    </div>

                    <p className="max-w-2xl leading-7 text-muted-foreground">
                        {book.description}
                    </p>

                    <dl className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 text-sm sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <UserRound
                                className="mt-0.5 size-4 text-primary"
                                aria-hidden="true"
                            />
                            <div>
                                <dt className="text-muted-foreground">
                                    Shared by
                                </dt>
                                <dd className="font-medium">
                                    {book.ownerName}
                                </dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Library
                                className="mt-0.5 size-4 text-primary"
                                aria-hidden="true"
                            />
                            <div>
                                <dt className="text-muted-foreground">
                                    Copies available
                                </dt>
                                <dd className="font-medium">
                                    {book.totalCopies}{" "}
                                    {book.totalCopies === 1 ? "copy" : "copies"}
                                </dd>
                            </div>
                        </div>
                    </dl>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {!user ? (
                            <Link
                                href="/login"
                                className={buttonVariants({
                                    size: "lg",
                                    className: "h-11 rounded-full px-6",
                                })}
                            >
                                <BookOpen className="size-4" aria-hidden="true" />
                                Login to borrow
                            </Link>
                        ) : isBookOwner(book, user) ? (
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-11 rounded-full px-6 bg-card"
                                disabled
                            >
                                <BookOpen className="size-4" aria-hidden="true" />
                                This is your book
                            </Button>
                        ) : book.totalCopies < 1 ? (
                            <Button
                                size="lg"
                                className="h-11 rounded-full px-6"
                                disabled
                            >
                                <BookOpen className="size-4" aria-hidden="true" />
                                No copies available
                            </Button>
                        ) : (
                            <BorrowBookDialog book={book} user={user} />
                        )}
                        <Link
                            href="/books"
                            className={buttonVariants({
                                variant: "outline",
                                size: "lg",
                                className: "h-11 rounded-full px-6 bg-card cursor-pointer",
                            })}
                        >
                            Keep browsing
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
const BookDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    return (
        <Suspense fallback={<BookDetailSkeleton />}>
            <BookDetail params={params} />
        </Suspense>
    );
};

export default BookDetailsPage;
