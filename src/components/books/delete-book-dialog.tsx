"use client";

import { useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { deleteBook } from "@/lib/books";
import type { Book } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type DeleteBookDialogProps = {
    book: Book;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (id: string) => void;
};

export function DeleteBookDialog({
    book,
    open,
    onOpenChange,
    onDeleted,
}: DeleteBookDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        const token = await getTokenFromClient();

        try {
            await deleteBook(book._id, token);

            toast.success(`“${book.title}” was deleted.`);
            onDeleted(book._id);
            onOpenChange(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not delete the book. Please try again.",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent className="max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <span className="mb-1 inline-flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <TriangleAlert className="size-5" aria-hidden="true" />
                    </span>
                    <DialogTitle>Delete this book?</DialogTitle>
                    <DialogDescription>
                        “{book.title}” by {book.author} will be permanently
                        removed from your shelf. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                disabled={isDeleting}
                            />
                        }
                    >
                        Keep Book
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        size="lg"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <LoaderCircle
                                    className="animate-spin"
                                    aria-hidden="true"
                                />
                                Deleting
                            </>
                        ) : (
                            "Delete Book"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
