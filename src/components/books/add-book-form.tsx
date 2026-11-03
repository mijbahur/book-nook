"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import type { CurrentUser } from "@/lib/types";
import { createBook } from "@/lib/books";
import { Button } from "@/components/ui/button";
import {
    BookFields,
    bookFieldClassName,
    emptyBookForm,
    type BookFormValues,
} from "@/components/books/book-fields";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type AddBookFormProps = {
    user: CurrentUser;
};

export function AddBookForm({ user }: AddBookFormProps) {
    const [form, setForm] = useState<BookFormValues>(emptyBookForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = <K extends keyof BookFormValues>(
        field: K,
        value: BookFormValues[K],
    ) => setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.category) return;

        setIsSubmitting(true);
        const token = await getTokenFromClient();

        try {
            await createBook({
                title: form.title.trim(),
                author: form.author.trim(),
                category: form.category,
                image: form.image.trim(),
                description: form.description.trim(),
                totalCopies: Math.max(1, Number(form.totalCopies) || 1),
                ownerName: user.name,
                ownerEmail: user.email,
                createdAt: new Date().toISOString(),
            }, token);

            toast.success("Book added successfully!");
            setForm(emptyBookForm);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 space-y-3">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Grow the collection
                    </p>
                    <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                        Add a Book
                    </h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Share a favorite from your shelf with the BookNook
                        community.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-7 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-8"
                >
                    <BookFields
                        idPrefix="add-book"
                        values={form}
                        onChange={update}
                        disabled={isSubmitting}
                    />

                    <div className="grid gap-6 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
                        <label className="text-sm font-medium">
                            Your Name
                            <input
                                className={`${bookFieldClassName} bg-muted`}
                                type="text"
                                value={user.name}
                                readOnly
                            />
                        </label>
                        <label className="text-sm font-medium">
                            Your Email
                            <input
                                className={`${bookFieldClassName} bg-muted`}
                                type="email"
                                value={user.email}
                                readOnly
                            />
                        </label>
                        <p className="text-sm text-muted-foreground sm:col-span-2">
                            These details come from your account and are shown
                            to readers who borrow this book.
                        </p>
                    </div>

                    <div className="flex justify-end border-t border-border/70 pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full sm:w-auto"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                    Adding Book
                                </>
                            ) : (
                                "Add Book"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
