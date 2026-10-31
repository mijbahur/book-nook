import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";

function XLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={className}
            fill="currentColor"
        >
            <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.23l-4.88-6.38L6.5 22H3.36l7.24-8.28L2.8 2h6.39l4.41 5.83L18.9 2Zm-1.09 17.84h1.73L7.32 3.99H5.46l12.35 15.85Z" />
        </svg>
    );
}

export function Footer() {
    return (
        <footer className="border-t border-border/70 bg-secondary/35">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
                <div className="max-w-sm space-y-4">
                    <Logo />
                    <p className="text-sm leading-6 text-muted-foreground">
                        A small online library for curious readers. Discover a
                        new story, borrow a favorite, and share the books that
                        shaped you.
                    </p>
                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="BookNook on X"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                        <XLogo className="size-4" />
                    </a>
                </div>

                <div className="space-y-4">
                    <h2 className="font-heading text-lg font-semibold">
                        Contact
                    </h2>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2.5">
                            <Mail
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            <a
                                className="hover:text-foreground"
                                href="mailto:hello@booknook.dev"
                            >
                                hello@booknook.dev
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            <a
                                className="hover:text-foreground"
                                href="tel:+8801782168223"
                            >
                                (+880) 1782168223
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <MapPin
                                className="size-4 text-primary"
                                aria-hidden="true"
                            />
                            <span>Dhaka, Bangladesh</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="font-heading text-lg font-semibold">
                        Explore
                    </h2>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li>
                            <Link className="hover:text-foreground" href="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="hover:text-foreground"
                                href="/books"
                            >
                                All Books
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="hover:text-foreground"
                                href="/login"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="hover:text-foreground"
                                href="/register"
                            >
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-border/70">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>© 2026 BookNook. All rights reserved.</p>
                    <p>
                        Made for readers who like to wander between the shelves.
                    </p>
                </div>
            </div>
        </footer>
    );
}
