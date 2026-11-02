"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function BooksError({
    error,
    retry,
}: {
    error: unknown;
    retry: () => void;
}) {
    useEffect(() => {
        console.error("Failed to load the book collection:", error);
    }, [error]);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-6" aria-hidden />
                </span>

                <h1 className="mt-5 font-heading text-2xl font-semibold">
                    We couldn&apos;t load the shelves
                </h1>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    The book collection is temporarily unavailable. Please try
                    again in a moment.
                </p>

                <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <button
                        type="button"
                        onClick={() => retry()}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                        <RefreshCw className="size-4" aria-hidden />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
