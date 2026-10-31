import Link from "next/link";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";

const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Logo />

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

                <div className="hidden items-center gap-2 md:flex">
                    <Link
                        href="/login"
                        className={buttonVariants({
                            variant: "ghost",
                            size: "lg",
                        })}
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className={buttonVariants({
                            size: "lg",
                            className: "px-4",
                        })}
                    >
                        Register
                    </Link>
                </div>

                <Sheet>
                    <SheetTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Open navigation menu"
                            />
                        }
                    >
                        <Menu className="size-5" />
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[min(20rem,85vw)]">
                        <SheetHeader className="border-b">
                            <SheetTitle>
                                <Logo />
                            </SheetTitle>
                        </SheetHeader>

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

                        <div className="mt-auto flex flex-col gap-2 border-t p-4">
                            <SheetClose
                                nativeButton={false}
                                render={
                                    <Link
                                        href="/login"
                                        className={buttonVariants({
                                            variant: "outline",
                                            size: "lg",
                                            className: "w-full",
                                        })}
                                    />
                                }
                            >
                                Login
                            </SheetClose>
                            <SheetClose
                                nativeButton={false}
                                render={
                                    <Link
                                        href="/register"
                                        className={buttonVariants({
                                            size: "lg",
                                            className: "w-full",
                                        })}
                                    />
                                }
                            >
                                Register
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
