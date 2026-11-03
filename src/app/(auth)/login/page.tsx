"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/google-button";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const user = Object.fromEntries(formData.entries()) as {
            email: string;
            password: string;
        };

        console.log("formData", formData);
        console.log("user", user);

        setIsSubmitting(true);

        const { error } = await authClient.signIn.email({
            ...user,
        });

        setIsSubmitting(false);

        if (error) {
            toast.error(error.message ?? "Invalid email or password.");
            return;
        }

        toast.success("Logged in successfully!");
        router.push("/");
        router.refresh();
    };

    return (
        <section className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="mb-8 space-y-3 text-center">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Welcome back
                    </p>
                    <h1 className="font-heading text-4xl font-bold tracking-tight">
                        Login to BookNook
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to borrow books and keep track of what you are
                        reading.
                    </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
                    <GoogleButton
                        label="Login with Google"
                        errorCallbackURL="/login"
                    />

                    <div className="my-6 flex items-center gap-3">
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            or
                        </span>
                        <span className="h-px flex-1 bg-border" />
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail
                                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="h-11 pl-9"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <LockKeyhole
                                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-11 pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="h-11 w-full rounded-full cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                    Logging in
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    New to BookNook?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default LoginPage;
