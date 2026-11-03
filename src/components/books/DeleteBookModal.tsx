"use client";

import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";

import { toast } from "@/components/ui/toast";

type Props = {
    bookId: string;
    bookTitle: string;
    onClose: () => void;
    onDeleted: () => void;
};

export default function DeleteBookModal({
    bookId,
    bookTitle,
    onClose,
    onDeleted,
}: Props) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Delete failed.");
            }

            onDeleted();
        } catch (err) {
            toast.error(
                "Could not delete the book",
                err instanceof Error ? err.message : "Delete failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-book-title"
                className="w-full max-w-md rounded-t-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:rounded-2xl sm:p-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <Trash2 className="size-5" aria-hidden />
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close delete dialog"
                        className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </div>

                <h2
                    id="delete-book-title"
                    className="mt-4 font-heading text-xl font-semibold"
                >
                    Delete this book?
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <strong className="font-medium text-foreground">{bookTitle}</strong> will be
                    removed from BookNook. This action cannot be undone.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-destructive px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" aria-hidden />
                                Deleting…
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" aria-hidden />
                                Delete book
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
