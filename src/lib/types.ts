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
