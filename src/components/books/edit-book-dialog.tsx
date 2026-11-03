"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { updateBook } from "@/lib/books";
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
import {
    BookFields,
    bookFormFromBook,
    type BookFormValues,
} from "@/components/books/book-fields";
import { useRouter } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type EditBookDialogProps = {
    book: Book;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: (book: Book) => void;
};

export function EditBookDialog({
    book,
    open,
    onOpenChange,
    onSaved,
}: EditBookDialogProps) {
    const router = useRouter();
    const [form, setForm] = useState<BookFormValues>(() =>
        bookFormFromBook(book),
    );
    const [isSaving, setIsSaving] = useState(false);

    const update = <K extends keyof BookFormValues>(
        field: K,
        value: BookFormValues[K],
    ) => setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.category) return;

        setIsSaving(true);

        const token = await getTokenFromClient();

        try {
            const changes = {
                title: form.title.trim(),
                author: form.author.trim(),
                category: form.category,
                image: form.image.trim(),
                description: form.description.trim(),
                totalCopies: Math.max(1, Number(form.totalCopies) || 1),
            };

            const saved = await updateBook(
                book._id,
                changes,
                token,
            );

            toast.success("Book updated successfully!");
            onSaved({ ...saved, ...changes });
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not update the book. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit book</DialogTitle>
                    <DialogDescription>
                        Update the details of “{book.title}”. Changes are
                        visible to every reader right away.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <BookFields
                        idPrefix="edit-book"
                        values={form}
                        onChange={update}
                        disabled={isSaving}
                    />

                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    disabled={isSaving}
                                />
                            }
                        >
                            Cancel
                        </DialogClose>
                        <Button type="submit" size="lg" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <LoaderCircle
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                    Saving
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
