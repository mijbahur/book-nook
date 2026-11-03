import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const isAuthPage =
        request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/signup";

    if (session?.user && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAuthPage) {
        return NextResponse.next();
    }

    if (!session?.user) {
        const url = new URL("/login", request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/my-books/:path*",
        "/my-borrows/:path*",
        "/add-book/:path*",
        "/login",
        "/signup",
    ],
};
