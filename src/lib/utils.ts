export { cn } from "cn";

export function sameEmail(a: string | undefined | null, b: string): boolean {
    return (a ?? "").trim().toLowerCase() === b.trim().toLowerCase();
}
