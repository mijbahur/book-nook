import type { Metadata } from "next";
import { AddBookForm } from "@/components/books/add-book-form";

export const metadata: Metadata = {
    title: "Add a Book",
    description: "Share a book with the BookNook community.",
};

export default function AddBookPage() {
    return <AddBookForm />;
}
