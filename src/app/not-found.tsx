import type { Metadata } from "next";
import Link from "next/link";
import { BookX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for is not on the BookNook shelves.",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <span className="mb-6 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
        <BookX className="size-8" aria-hidden="true" />
      </span>
      <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
        404 — Off the shelf
      </p>
      <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        This page is not on our shelves.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you were looking for may have been moved, or the book is no
        longer part of the collection.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className={buttonVariants({
            size: "lg",
            className: "h-11 rounded-full px-6",
          })}
        >
          Back home
        </Link>
        <Link
          href="/books"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "h-11 rounded-full px-6",
          })}
        >
          Browse all books
        </Link>
      </div>
    </section>
  );
}
