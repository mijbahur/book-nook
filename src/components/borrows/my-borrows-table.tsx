"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarClock, Undo2 } from "lucide-react";

import type { CurrentUser, IBorrow } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { ReturnBookDialog } from "@/components/borrows/return-book-dialog";

type MyBorrowsTableProps = {
    user: CurrentUser;
    borrows: IBorrow[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
});

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return dateFormatter.format(date);
}

/** Days between today and the due date. Negative means overdue. */
function daysUntil(value: string) {
    const due = new Date(value);

    if (Number.isNaN(due.getTime())) {
        return null;
    }

    const today = new Date();
    const startOfToday = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
    );
    const startOfDue = Date.UTC(
        due.getUTCFullYear(),
        due.getUTCMonth(),
        due.getUTCDate(),
    );

    return Math.round((startOfDue - startOfToday) / DAY_MS);
}

function DueBadge({ returnDate }: { returnDate: string }) {
    const days = daysUntil(returnDate);

    if (days === null) {
        return null;
    }

    if (days < 0) {
        return (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                Overdue by {Math.abs(days)} {Math.abs(days) === 1 ? "day" : "days"}
            </span>
        );
    }

    if (days === 0) {
        return (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Due today
            </span>
        );
    }

    return (
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Due in {days} {days === 1 ? "day" : "days"}
        </span>
    );
}

export function MyBorrowsTable({ user, borrows }: MyBorrowsTableProps) {
    const [items, setItems] = useState(borrows);
    const [returningBorrow, setReturningBorrow] = useState<IBorrow | null>(null);

    const handleReturned = (id: string) => {
        setItems((current) => current.filter((borrow) => borrow._id !== id));
    };

    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                <h2 className="font-heading text-xl font-semibold">
                    No books borrowed yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Nothing on loan right now, {user.name}. Browse the shelves
                    and borrow something good.
                </p>
                <Link
                    href="/books"
                    className={buttonVariants({
                        size: "lg",
                        className: "mt-6",
                    })}
                >
                    Browse all books
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-3xl border-collapse text-left text-sm">
                        <caption className="sr-only">
                            Books borrowed by {user.name}
                        </caption>
                        <thead className="bg-muted/60 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                    Book
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                    Borrow Date
                                </th>
                                <th scope="col" className="px-4 py-3 font-semibold">
                                    Return Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-right font-semibold"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/70">
                            {items.map((borrow) => (
                                <tr
                                    key={borrow._id}
                                    className="align-middle transition-colors hover:bg-muted/40"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                                <Image
                                                    src={borrow.bookImage}
                                                    alt=""
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/books/${borrow.bookId}`}
                                                    className="block max-w-64 truncate font-medium hover:text-primary hover:underline"
                                                >
                                                    {borrow.bookTitle}
                                                </Link>
                                                <span className="block max-w-64 truncate text-xs text-muted-foreground">
                                                    Borrow ID {borrow._id.slice(-6)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                        {formatDate(borrow.borrowDate)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                            <CalendarClock
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            {formatDate(borrow.returnDate)}
                                        </span>
                                        <DueBadge returnDate={borrow.returnDate} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setReturningBorrow(borrow)
                                                }
                                            >
                                                <Undo2
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                Return Book
                                                <span className="sr-only">
                                                    {borrow.bookTitle}
                                                </span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {returningBorrow && (
                <ReturnBookDialog
                    key={returningBorrow._id}
                    borrow={returningBorrow}
                    open
                    onOpenChange={(open) => {
                        if (!open) setReturningBorrow(null);
                    }}
                    onReturned={handleReturned}
                />
            )}
        </>
    );
}
