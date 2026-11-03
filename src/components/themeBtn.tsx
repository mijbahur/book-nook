"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunMoon } from "lucide-react";

export default function ThemeBtn() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-full"
            aria-label="Toggle theme"
            title="Toggle theme"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            <SunMoon className="size-5" aria-hidden="true" />
        </Button>
    );
}
