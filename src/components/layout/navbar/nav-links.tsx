"use client";

import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";

const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    { href: "/my-books", label: "My Books" },
];

type NavLinksProps = {
    mobile?: boolean;
};

export function NavLinks({ mobile = false }: NavLinksProps) {
    if (mobile) {
        return (
            <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile navigation"
            >
                {links.map((link) => (
                    <SheetClose
                        key={link.href}
                        nativeButton={false}
                        render={
                            <Link
                                href={link.href}
                                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                            />
                        }
                    >
                        {link.label}
                    </SheetClose>
                ))}
            </nav>
        );
    }

    return (
        <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
        >
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
