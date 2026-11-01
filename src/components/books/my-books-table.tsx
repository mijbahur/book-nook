"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Library, Pencil, Trash2 } from "lucide-react";

import type { Book, CurrentUser } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { EditBookDialog } from "@/components/books/edit-book-dialog";
import { DeleteBookDialog } from "@/components/books/delete-book-dialog";

type MyBooksTableProps = {
    user: CurrentUser;
    books: Book[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
});

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return dateFormatter.format(date);
}

export function MyBooksTable({ user, books }: MyBooksTableProps) {
    const [items, setItems] = useState(books);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [deletingBook, setDeletingBook] = useState<Book | null>(null);

    const handleSaved = (saved: Book) => {
        setItems((current) =>
            current.map((book) => (book._id === saved._id ? saved : book)),
        );
    };

    const handleDeleted = (id: string) => {
        setItems((current) => current.filter((book) => book._id !== id));
    };

    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground" />
                <h2 className="font-heading text-xl font-semibold">
                    Your shelf is empty
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    You have not added any books yet, {user.name}. Share one
                    from your collection to get started.
                </p>
                <Link
                    href="/add-book"
                    className={buttonVariants({
                        size: "lg",
                        className: "mt-6",
                    })}
                >
                    Add your first book
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
                            Books added by {user.name}
                        </caption>
                        <thead className="bg-muted/60 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold"
                                >
                                    Book
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold"
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold"
                                >
                                    Copies
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-semibold"
                                >
                                    Added
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-right font-semibold"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/70">
                            {items.map((book) => (
                                <tr
                                    key={book._id}
                                    className="align-middle transition-colors hover:bg-muted/40"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                                <Image
                                                    src={book.image}
                                                    alt=""
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/books/${book._id}`}
                                                    className="block max-w-64 truncate font-medium hover:text-primary hover:underline"
                                                >
                                                    {book.title}
                                                </Link>
                                                <span className="block max-w-64 truncate text-xs text-muted-foreground">
                                                    by {book.author}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                            {book.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Library
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                            {book.totalCopies}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                        {formatDate(book.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setEditingBook(book)
                                                }
                                            >
                                                <Pencil
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                Edit
                                                <span className="sr-only">
                                                    {book.title}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="lg"
                                                onClick={() =>
                                                    setDeletingBook(book)
                                                }
                                            >
                                                <Trash2
                                                    className="size-3.5"
                                                    aria-hidden="true"
                                                />
                                                Delete
                                                <span className="sr-only">
                                                    {book.title}
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

            {editingBook && (
                <EditBookDialog
                    key={editingBook._id}
                    book={editingBook}
                    open
                    onOpenChange={(open) => {
                        if (!open) setEditingBook(null);
                    }}
                    onSaved={handleSaved}
                />
            )}

            {deletingBook && (
                <DeleteBookDialog
                    key={deletingBook._id}
                    book={deletingBook}
                    open
                    onOpenChange={(open) => {
                        if (!open) setDeletingBook(null);
                    }}
                    onDeleted={handleDeleted}
                />
            )}
        </>
    );
}
