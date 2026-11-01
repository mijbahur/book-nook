import type { Metadata } from "next";

import { AddBookForm } from "@/components/books/add-book-form";
import { requireCurrentUser } from "@/lib/current-user";

export const metadata: Metadata = {
    title: "Add a Book",
    description: "Share a book with the BookNook community.",
};

export default async function AddBookPage() {
    // Private route: the reader is resolved once, here, and passed down as data.
    const user = await requireCurrentUser();

    return <AddBookForm user={user} />;
}
