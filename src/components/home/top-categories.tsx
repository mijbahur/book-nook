import Link from "next/link";
import { Atom, Feather, Landmark, Smile, Sparkles } from "lucide-react";

import type { BookCategory } from "@/lib/types";

const categories: {
    name: BookCategory;
    blurb: string;
    icon: typeof Feather;
}[] = [
    {
        name: "Fiction",
        blurb: "Novels and imagined worlds",
        icon: Feather,
    },
    {
        name: "Science",
        blurb: "Big ideas and discovery",
        icon: Atom,
    },
    {
        name: "History",
        blurb: "Stories from the past",
        icon: Landmark,
    },
    {
        name: "Kids",
        blurb: "Adventures for young readers",
        icon: Smile,
    },
    {
        name: "Others",
        blurb: "Essays, habits, and more",
        icon: Sparkles,
    },
];

export function TopCategories() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl space-y-3">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Find your corner
                    </p>
                    <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                        Top Categories
                    </h2>
                    <p className="text-muted-foreground">
                        Start with a mood, a curiosity, or a young reader&apos;s
                        next adventure.
                    </p>
                </div>

                <Link
                    href="/books"
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                >
                    Browse the full collection
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <Link
                            key={category.name}
                            href={`/books?category=${category.name}`}
                            className="group rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                        >
                            <span className="mb-5 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <h3 className="font-heading text-xl font-semibold">
                                {category.name}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {category.blurb}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
