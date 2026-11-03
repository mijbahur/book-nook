"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

type AuthActionsProps = {
    user:
        | {
              name: string;
              email: string;
              image?: string | null;
          }
        | undefined;
    refetch: () => void;
    mobile?: boolean;
};

export function AuthActions({
    user,
    refetch,
    mobile = false,
}: AuthActionsProps) {
    const router = useRouter();

    const handleEditProfile = () => {
        toast("Edit profile is coming soon.");
    };

    const handleSignOut = async () => {
        const { error } = await authClient.signOut();

        if (error) {
            toast.error(error.message ?? "Could not sign out. Please try again.");
            return;
        }

        refetch();
        router.push("/login");
        router.refresh();
    };

    // Logged out, mobile
    if (!user && mobile) {
        return (
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

    // Logged out, desktop
    if (!user) {
        return (
            <div className="hidden items-center gap-2 md:flex">
                <Link
                    href="/login"
                    className={buttonVariants({ variant: "ghost", size: "lg" })}
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

    // Logged in, mobile
    if (mobile) {
        return (
            <div className="mt-auto flex flex-col gap-4 border-t p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                        <AvatarImage
                            referrerPolicy="no-referrer"
                            src={user.image ?? undefined}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <SheetClose
                        nativeButton={false}
                        render={
                            <Link
                                href="/profile"
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleEditProfile();
                                }}
                                className={buttonVariants({
                                    variant: "outline",
                                    size: "lg",
                                    className: "w-full",
                                })}
                            />
                        }
                    >
                        Edit Profile
                    </SheetClose>
                    <Button
                        variant="destructive"
                        size="lg"
                        className="w-full cursor-pointer"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </Button>
                </div>
            </div>
        );
    }

    // Logged in, desktop
    return (
        <div className="hidden items-center gap-2 md:flex">
            <Popover>
                <PopoverTrigger
                    render={
                        <button
                            type="button"
                            aria-label="Open account menu"
                            className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <Avatar className="size-10">
                                <AvatarImage
                                    referrerPolicy="no-referrer"
                                    src={user.image ?? undefined}
                                />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    }
                />
                <PopoverContent>
                    <PopoverHeader className="flex flex-col gap-4 p-4">
                        <PopoverTitle>{user.name}</PopoverTitle>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-muted-foreground">
                                {user.email}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleEditProfile}
                                className="cursor-pointer"
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="cursor-pointer"
                                onClick={handleSignOut}
                            >
                                Sign out
                            </Button>
                        </div>
                    </PopoverHeader>
                </PopoverContent>
            </Popover>
        </div>
    );
}
