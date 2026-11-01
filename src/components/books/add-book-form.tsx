"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { BOOK_CATEGORIES, type BookCategory } from "@/lib/types";
import { createBook } from "@/lib/books";
import { Button } from "@/components/ui/button";

const inputClassName =
    "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

type BookForm = {
    title: string;
    author: string;
    category: BookCategory | "";
    image: string;
    description: string;
};

const initialForm: BookForm = {
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
};

export function AddBookForm() {
    const [form, setForm] = useState<BookForm>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = <K extends keyof BookForm>(field: K, value: BookForm[K]) =>
        setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.category) return;

        setIsSubmitting(true);

        try {
            const res = await createBook({
                ...form,
                category: form.category,
                ownerName: "test",
                ownerEmail: "test@gmail.com",
                createdAt: new Date().toISOString(),
                totalCopies: 1,
            });
            console.log("res", res);

            toast.success("Book added successfully!");
            setForm(initialForm);
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
                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="text-sm font-medium">
                            Book Title
                            <input
                                className={inputClassName}
                                id="title"
                                type="text"
                                autoComplete="off"
                                maxLength={160}
                                placeholder="Enter the book title"
                                value={form.title}
                                onChange={(event) =>
                                    update("title", event.target.value)
                                }
                                required
                            />
                        </label>

                        <label className="text-sm font-medium">
                            Author Name
                            <input
                                className={inputClassName}
                                id="author"
                                type="text"
                                autoComplete="off"
                                maxLength={120}
                                placeholder="Enter the author's name"
                                value={form.author}
                                onChange={(event) =>
                                    update("author", event.target.value)
                                }
                                required
                            />
                        </label>

                        <label className="text-sm font-medium">
                            Category
                            <select
                                className={inputClassName}
                                id="category"
                                value={form.category}
                                onChange={(event) =>
                                    update(
                                        "category",
                                        event.target.value as BookCategory,
                                    )
                                }
                                required
                            >
                                <option value="" disabled>
                                    Choose a category
                                </option>
                                {BOOK_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm font-medium">
                            Book Image URL
                            <input
                                className={inputClassName}
                                id="image"
                                type="url"
                                placeholder="https://example.com/cover.jpg"
                                value={form.image}
                                onChange={(event) =>
                                    update("image", event.target.value)
                                }
                                required
                            />
                        </label>
                    </div>

                    <label className="block text-sm font-medium">
                        Short Description
                        <textarea
                            className={`${inputClassName} min-h-32 resize-y`}
                            id="description"
                            maxLength={500}
                            placeholder="What should readers know about this book?"
                            value={form.description}
                            onChange={(event) =>
                                update("description", event.target.value)
                            }
                            required
                        />
                    </label>
                    <div className="grid gap-6 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
                        <label className="text-sm font-medium">
                            Your Name
                            <input
                                className={`${inputClassName} bg-muted`}
                                type="text"
                                value={""}
                                placeholder="Loaded from account"
                                readOnly
                            />
                        </label>
                        <label className="text-sm font-medium">
                            Your Email
                            <input
                                className={`${inputClassName} bg-muted`}
                                type="email"
                                value={""}
                                placeholder="Loaded from account"
                                readOnly
                            />
                        </label>
                        {(
                            <p className="text-sm text-muted-foreground sm:col-span-2">
                                Account details and submission will be available
                                once authentication is connected.
                            </p>
                        )}
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