"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LoaderCircle,
    LockKeyhole,
    Mail,
    FileImage,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const initialForm = {
    name: "",
    email: "",
    image: "",
    password: "",
};

const SignUpPage = () => {
    const router = useRouter();
    const [form, setForm] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = (field: keyof typeof form, value: string) =>
        setForm((current) => ({ ...current, [field]: value }));

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.target);
        const user = Object.fromEntries(formData.entries()) as {
            name: string;
            image: string;
            email: string;
            password: string;
        };

        console.log("formData", formData);
        console.log("user", user);

        const { data, error } = await authClient.signUp.email({
            ...user,
        });

        console.log(data);

        setIsSubmitting(false);

        if (error) {
            toast.error(error.message ?? "Could not create your account.");
            return;
        }

        toast.success("Account created successfully!");
        setTimeout(() => {
            setForm(initialForm);
            router.push("/login");
        }, 3000);
    };

    return (
        <section className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="mb-8 space-y-3 text-center">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Join the reading room
                    </p>
                    <h1 className="font-heading text-4xl font-bold tracking-tight">
                        Create your account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create a reader profile to borrow books and share your
                        own collection.
                    </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <div className="relative">
                                <UserRound
                                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Your name"
                                    className="h-11 pl-9"
                                    value={form.name}
                                    onChange={(event) =>
                                        update("name", event.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <div className="relative">
                                <FileImage
                                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="image"
                                    name="image"
                                    type="url"
                                    autoComplete="image"
                                    placeholder="Image url"
                                    className="h-11 pl-9"
                                    value={form.image}
                                    onChange={(event) =>
                                        update("image", event.target.value)
                                    }
                                    // required
                                />
                            </div>
                        </div>

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
                                    value={form.email}
                                    onChange={(event) =>
                                        update("email", event.target.value)
                                    }
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
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="h-11 pl-9"
                                    value={form.password}
                                    onChange={(event) =>
                                        update("password", event.target.value)
                                    }
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="h-11 w-full rounded-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                    Creating account
                                </>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default SignUpPage;
