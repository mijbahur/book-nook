"use client";

import { useState } from "react";
import { LoaderCircle, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { returnBorrow } from "@/lib/books";
import type { IBorrow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

type ReturnBookDialogProps = {
    borrow: IBorrow;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onReturned: (id: string) => void;
};

export function ReturnBookDialog({
    borrow,
    open,
    onOpenChange,
    onReturned,
}: ReturnBookDialogProps) {
    const [isReturning, setIsReturning] = useState(false);

    const handleConfirm = async () => {
        setIsReturning(true);
        const token = await getTokenFromClient();

        try {
            await returnBorrow(borrow._id, token);

            toast.success(`“${borrow.bookTitle}” is back on the shelf.`);
            onReturned(borrow._id);
            onOpenChange(false);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not return this book. Please try again.",
            );
        } finally {
            setIsReturning(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent className="max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <span className="mb-1 inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <DialogClose><Undo2 className="size-5 cursor-pointer" aria-hidden="true" /></DialogClose>
                    </span>
                    <DialogTitle>Return this book?</DialogTitle>
                    <DialogDescription>
                        “{borrow.bookTitle}” will be removed from your borrows
                        and one copy goes back to the shelf.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose
                        render={
                            <Button
                                className="cursor-pointer"
                                type="button"
                                variant="outline"
                                size="lg"
                                disabled={isReturning}
                            />
                        }
                    >
                        Keep Borrowing
                    </DialogClose>
                    <Button
                        className="cursor-pointer"
                        type="button"
                        size="lg"
                        onClick={handleConfirm}
                        disabled={isReturning}
                    >
                        {isReturning ? (
                            <>
                                <LoaderCircle
                                    className="animate-spin"
                                    aria-hidden="true"
                                />
                                Returning
                            </>
                        ) : (
                            "Return Book"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
