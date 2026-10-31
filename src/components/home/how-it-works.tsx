import { BookOpenCheck, Compass, Undo2 } from "lucide-react";

const steps = [
    {
        icon: Compass,
        title: "Browse the shelves",
        text: "Explore new arrivals and the full collection. Every book card shows the title, author, and category at a glance.",
    },
    {
        icon: BookOpenCheck,
        title: "Borrow a book",
        text: "Open a book you like, confirm the borrow, and it is added to your personal reading list for a few days.",
    },
    {
        icon: Undo2,
        title: "Return when done",
        text: "Finished the story? Return it from My Borrows so the next reader can pick it up.",
    },
];

export function HowItWorks() {
    return (
        <section className="border-y border-border/70 bg-secondary/35">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Simple by design
                    </p>
                    <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                        How Borrowing Works
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Three small steps between you and your next good read.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.title}
                                className="relative rounded-2xl border border-border/70 bg-card p-7 shadow-sm"
                            >
                                <span className="absolute top-6 right-6 font-heading text-4xl font-bold text-primary/10">
                                    0{index + 1}
                                </span>
                                <span className="mb-5 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                                    <Icon
                                        className="size-6"
                                        aria-hidden="true"
                                    />
                                </span>
                                <h3 className="font-heading text-xl font-semibold">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {step.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
