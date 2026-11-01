import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import type { Book, CurrentUser } from "@/lib/types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    return {
        name: session.user.name,
        email: session.user.email,
    };
}
export async function requireCurrentUser(): Promise<CurrentUser> {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}

export function isBookOwner(
    book: Pick<Book, "ownerEmail">,
    user: Pick<CurrentUser, "email">,
): boolean {
    return sameEmail(book.ownerEmail, user.email);
}

export function sameEmail(a: string | undefined | null, b: string): boolean {
    return (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
}
