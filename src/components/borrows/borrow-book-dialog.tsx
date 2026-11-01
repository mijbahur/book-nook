"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookOpen, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { createBorrow } from "@/lib/books";
import type { Book, CurrentUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { bookFieldClassName } from "@/components/books/book-fields";

const LOAN_DAYS = 14;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

type BorrowBookDialogProps = {
    book: Book;
    user: CurrentUser;
};

export function BorrowBookDialog({ book, user }: BorrowBookDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dueDate = addDays(new Date(), LOAN_DAYS);

    const handleConfirm = async () => {
        setIsSubmitting(true);

        try {
            const borrow = await createBorrow({
                bookId: book._id,
                bookTitle: book.title,
                bookImage: book.image,
                userName: user.name,
                userEmail: user.email,
            });

            toast.success(
                `You borrowed “${book.title}”. Please return it by ${dateFormatter.format(new Date(borrow.returnDate))}.`,
            );
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not borrow this book. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger
                render={
                    <Button
                        size="lg"
                        className="h-11 rounded-full px-6"
                        aria-label={`Borrow ${book.title}`}
                    />
                }
            >
                <BookOpen className="size-4" aria-hidden="true" />
                Borrow This Book
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Borrow this book</DialogTitle>
                    <DialogDescription>
                        You can keep the book for {LOAN_DAYS} days. Bring it
                        back to the shelf when you are done.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                            src={book.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-medium">{book.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                            by {book.author}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">
                        User Name
                        <input
                            className={`${bookFieldClassName} bg-muted`}
                            type="text"
                            value={user.name}
                            readOnly
                        />
                    </label>
                    <label className="block text-sm font-medium">
                        User Email
                        <input
                            className={`${bookFieldClassName} bg-muted`}
                            type="email"
                            value={user.email}
                            readOnly
                        />
                    </label>

                    <div className="flex items-start justify-between gap-4 rounded-lg border border-border/70 bg-card px-3 py-2.5 text-sm">
                        <span className="text-muted-foreground">Due back</span>
                        <span className="font-medium">
                            {dateFormatter.format(dueDate)}
                        </span>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                disabled={isSubmitting}
                            />
                        }
                    >
                        Cancel
                    </DialogClose>
                    <Button
                        type="button"
                        size="lg"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle
                                    className="animate-spin"
                                    aria-hidden="true"
                                />
                                Borrowing
                            </>
                        ) : (
                            "Confirm Borrow"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
