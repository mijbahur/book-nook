"use client";

import { Menu } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { NavLinks } from "@/components/layout/navbar/nav-links";
import { AuthActions } from "@/components/layout/navbar/auth-actions";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

function NavbarSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading navigation"
            className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
            <div className="flex items-center gap-2.5">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-5 w-20" />
            </div>

            <nav
                aria-label="Loading links"
                className="hidden items-center gap-3 md:flex"
            >
                <Skeleton className="h-9 w-16 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
            </nav>

            <div className="hidden items-center gap-2 md:flex">
                <Skeleton className="h-10 w-20 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
            </div>

            <Skeleton className="size-10 rounded-md md:hidden" />
        </div>
    );
}

export function Navbar() {
    const { data: session, isPending, refetch } = authClient.useSession();

    const user = session?.user;

    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
            {isPending ? (
                <NavbarSkeleton />
            ) : (
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Logo />
                    <NavLinks isLoggedIn={Boolean(user)} />

                    <AuthActions user={user} refetch={refetch} />

                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden cursor-pointer"
                                    aria-label="Open navigation menu"
                                />
                            }
                        >
                            <Menu className="size-5" />
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="flex w-[min(20rem,85vw)] flex-col"
                        >
                            <SheetHeader className="border-b">
                                <SheetTitle>
                                    <Logo />
                                </SheetTitle>
                            </SheetHeader>

                            <NavLinks mobile isLoggedIn={Boolean(user)} />

                            <AuthActions user={user} refetch={refetch} mobile />
                        </SheetContent>
                    </Sheet>
                </div>
            )}
        </header>
    );
}
