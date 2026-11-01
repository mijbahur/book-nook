"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

type AuthActionsProps = {
    user: {
        name: string;
    } | undefined;
    refetch: () => void;
    mobile?: boolean;
};

export function AuthActions({
    user,
    refetch,
    mobile = false,
}: AuthActionsProps) {
    const handleSignOut = async () => {
        await authClient.signOut();
        refetch();
    };

    if (user) {
        return (
            <div
                className={
                    mobile
                        ? "mt-auto flex flex-col gap-2 border-t p-4"
                        : "hidden items-center gap-6 md:flex"
                }
            >
                <span className="text-sm font-medium text-muted-foreground text-center ">
                    Signed in as {user.name}
                </span>

                <Button
                    variant={"destructive"}
                    size={mobile ? "lg" : "sm"}
                    onClick={handleSignOut}
                >
                    Sign out
                </Button>
            </div>
        );
    }

    if (mobile) {
        return (
            <div className="my-auto flex flex-col gap-2 border-t p-4">
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
                            href="/signup"
                            className={buttonVariants({
                                size: "lg",
                                className: "w-full",
                            })}
                        />
                    }
                >
                    Sign Up
                </SheetClose>
            </div>
        );
    }

    return (
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
                href="/signup"
                className={buttonVariants({
                    size: "lg",
                    className: "px-4",
                })}
            >
                Sign Up
            </Link>
        </div>
    );
}