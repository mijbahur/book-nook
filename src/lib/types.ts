export const BOOK_CATEGORIES = [
    "Fiction",
    "Science",
    "History",
    "Kids",
    "Others",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export type CurrentUser = {
    name: string;
    email: string;
};

export type Book = {
    _id: string;
    title: string;
    author: string;
    category: BookCategory;
    image: string;
    description: string;
    ownerName: string;
    ownerEmail: string;
    createdAt: string;
    totalCopies: number;
};

export interface IBorrow {
    _id: string;
    bookId: string;
    bookTitle: string;
    bookImage: string;
    userName: string;
    userEmail: string;
    borrowDate: string;
    /** Due date, set by the backend to `borrowDate + 14 days`. */
    returnDate: string;
}

/**
 * What the browser sends when borrowing. The dates are deliberately excluded:
 * the backend stamps `borrowDate` and computes `returnDate`, so a borrower
 * cannot hand themselves a longer deadline.
 */
export type NewBorrow = Omit<IBorrow, "_id" | "borrowDate" | "returnDate">;
