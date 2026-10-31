import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
    className?: string;
    compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
    return (
        <Link
            href="/"
            className={cn(
                "group inline-flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight",
                className,
            )}
        >
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:-rotate-6">
                <BookOpen className="size-5" aria-hidden="true" />
            </span>
            {!compact && (
                <span>
                    Book<span className="text-primary">Nook</span>
                </span>
            )}
        </Link>
    );
}
