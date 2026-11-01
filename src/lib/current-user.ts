import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Book, CurrentUser } from "@/lib/types";

/**
 * ---------------------------------------------------------------------------
 * THE ONLY PLACE THAT KNOWS WHO IS LOGGED IN
 * ---------------------------------------------------------------------------
 * Every page and component in the app reads the signed-in reader through
 * `getCurrentUser()` / `requireCurrentUser()`. Nothing else hardcodes a name
 * or an email.
 *
 * When authentication is connected, replace the body of `getCurrentUser()`
 * with a lookup of the real session, for example:
 *
 *     const session = await auth();            // NextAuth, Better Auth, ...
 *     // or
 *     const token = (await cookies()).get("token")?.value;
 *     const session = await verifyToken(token); // your own JWT helper
 *
 *     if (!session) return null;
 *     return { name: session.name, email: session.email };
 *
 * and delete `FALLBACK_USER` below. That is the *entire* change required —
 * /my-books, /add-book and every edit/delete/ownership check follow
 * automatically.
 */

/**
 * Temporary stand-in until the login flow exists.
 * Delete this constant when you wire up the real session.
 */
export const FALLBACK_USER: CurrentUser = {
    name: "Nora Reader",
    email: "nora@booknook.dev",
};

/**
 * Returns the signed-in reader, or `null` when nobody is logged in.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
    // Touching cookies() opts this route into dynamic rendering, which is what
    // a private, per-user page needs. It also keeps the swap to real auth a
    // no-op for every caller.
    await cookies();

    // TODO(auth): replace with the real session lookup (see the note above).
    return FALLBACK_USER;
}

/**
 * Same as `getCurrentUser()`, but sends anonymous visitors to the login page.
 * Use this at the top of every private route.
 */
export async function requireCurrentUser(): Promise<CurrentUser> {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}

/**
 * Case-insensitive ownership check. A book belongs to a reader when the
 * `ownerEmail` stored on the book matches the signed-in reader's email.
 */
export function isBookOwner(
    book: Pick<Book, "ownerEmail">,
    user: Pick<CurrentUser, "email">,
): boolean {
    return sameEmail(book.ownerEmail, user.email);
}

export function sameEmail(a: string | undefined | null, b: string): boolean {
    return (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
}
