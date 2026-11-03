"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Loader2, X } from "lucide-react";

import { toast } from "@/components/ui/toast";

type BorrowButtonProps = {
    bookId: string;
    availableCopies: number;
    bookTitle: string;
    bookImage: string;
};

const BorrowButton = ({
    bookId,
    availableCopies,
    bookTitle,
    bookImage,
}: BorrowButtonProps) => {
    const { data: session, isPending } = authClient.useSession();

    const router = useRouter();
    const userEmail = session?.user?.email;
    const userName = session?.user?.name;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isUnavailable = availableCopies <= 0;

    const handleBorrow = async () => {
        if (!userEmail || !userName) {
            toast.error("Please sign in", "You need an account before borrowing a book.");
            return;
        }
        setIsSubmitting(true);

        const borrowDate = new Date();
        const returnDate = new Date(borrowDate);
        returnDate.setDate(returnDate.getDate() + 7);

        const borrowData = {
            bookId,
            bookTitle,
            bookImage,
            userName,
            userEmail,
            borrowDate,
            returnDate,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(borrowData),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(
                    "Could not borrow this book",
                    result.message || "Please try again in a moment."
                );
                return;
            }

            toast.success(
                "Book borrowed",
                `"${bookTitle}" is yours for the next 7 days.`
            );
            setIsModalOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Borrow error:", error);
            toast.error("Something went wrong", "Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                disabled={isPending || isUnavailable}
                onClick={() => {
                    if (!session) {
                        router.push(
                            `/sign-in?callbackURL=${encodeURIComponent(window.location.pathname)}`
                        );
                        return;
                    }

                    setIsModalOpen(true);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
                {isPending ? (
                    <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Checking account…
                    </>
                ) : isUnavailable ? (
                    "Not available"
                ) : (
                    <>
                        <BookOpen className="size-4" aria-hidden />
                        Borrow this book
                    </>
                )}
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="borrow-dialog-title"
                        className="w-full max-w-md rounded-t-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:rounded-2xl sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="borrow-dialog-title"
                                    className="font-heading text-xl font-semibold"
                                >
                                    Confirm your borrow
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    You can keep this book for 7 days.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close borrow dialog"
                                className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        </div>

                        <div className="mt-5 rounded-xl border border-border bg-secondary/60 p-4">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Book
                            </p>
                            <p className="mt-1 font-heading text-lg font-semibold">{bookTitle}</p>
                        </div>

                        <div className="mt-4 grid gap-3">
                            <div>
                                <label className="text-sm font-medium text-foreground" htmlFor="borrow-name">
                                    Your name
                                </label>
                                <input
                                    id="borrow-name"
                                    value={userName || ""}
                                    readOnly
                                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-muted/60 px-3 text-sm text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground" htmlFor="borrow-email">
                                    Your email
                                </label>
                                <input
                                    id="borrow-email"
                                    value={userEmail || ""}
                                    readOnly
                                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-muted/60 px-3 text-sm text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleBorrow}
                                disabled={isSubmitting}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" aria-hidden />
                                        Borrowing…
                                    </>
                                ) : (
                                    "Confirm borrow"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowButton;
