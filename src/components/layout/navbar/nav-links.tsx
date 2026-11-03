"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";

const links = [
    { href: "/", label: "Home", active: true },
    { href: "/books", label: "All Books", active: true },
    { href: "/add-book", label: "Add Book", active: false },
    { href: "/my-books", label: "My Books", active: false },
    { href: "/my-borrows", label: "My Borrows", active: false },
];

type NavLinksProps = {
    mobile?: boolean;
    isLoggedIn: boolean;
};

export function NavLinks({ mobile = false, isLoggedIn }: NavLinksProps) {
    const pathname = usePathname();
    const visibleLinks = links.filter((link) => link.active || isLoggedIn);
    const isCurrentLink = (href: string) =>
        pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    if (mobile) {
        return (
            <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile navigation"
            >
                {visibleLinks.map((link) => {
                    const isActive = isCurrentLink(link.href);

                    return (
                        <SheetClose
                            key={link.href}
                            nativeButton={false}
                            render={
                                <Link
                                    href={link.href}
                                    aria-current={
                                        isActive ? "page" : undefined
                                    }
                                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                />
                            }
                        >
                            {link.label}
                        </SheetClose>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
        >
            {visibleLinks.map((link) => {
                const isActive = isCurrentLink(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
