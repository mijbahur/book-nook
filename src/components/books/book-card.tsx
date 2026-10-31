import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Book } from "@/lib/types";

type BookCardProps = {
    book: Book;
    priority?: boolean;
};

export function BookCard({ book, priority = false }: BookCardProps) {
    return (
        <Card className="group h-full gap-4 overflow-hidden pt-0">
            <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
                <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                    {book.category}
                </span>
            </div>

            <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">
                    {book.title}
                </CardTitle>
                <CardDescription>by {book.author}</CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
                <Link
                    href={`/books/${book._id}`}
                    className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "w-full",
                    })}
                >
                    View Details
                </Link>
            </CardContent>
        </Card>
    );
}
