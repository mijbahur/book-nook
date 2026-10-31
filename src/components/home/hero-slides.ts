export type HeroSlide = {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    alt: string;
};

export const heroSlides: HeroSlide[] = [
    {
        eyebrow: "Welcome to BookNook",
        title: "Find your next favorite story.",
        text: "Wander through a hand-picked collection of fiction, history, science, and stories for young readers.",
        image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=2000",
        alt: "Shelves filled with books in a cozy bookstore",
    },
    {
        eyebrow: "Borrow in a few clicks",
        title: "A library that fits your reading life.",
        text: "Choose a book, confirm your borrow, and return it when you are done. No late-night library runs required.",
        image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=2000",
        alt: "A quiet library with tall bookshelves",
    },
    {
        eyebrow: "Share what you love",
        title: "Add a book. Start a new conversation.",
        text: "Put a favorite title on the shelf and help another reader discover the story they did not know they needed.",
        image: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=2000",
        alt: "A stack of books waiting to be read",
    },
];
