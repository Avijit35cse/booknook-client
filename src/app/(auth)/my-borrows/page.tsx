"use client";

import Image from 'next/image';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOpen, CalendarDays, ImageOff, Library, Loader2 } from 'lucide-react';

import { toast } from '@/components/ui/toast';

type BorrowRecord = {
    _id: string;
    bookId: string;
    bookTitle: string;
    bookImage: string;
    userName: string;
    userEmail: string;
    borrowDate: string;
    returnDate: string;
};

const skeletonRows = Array.from({ length: 4 }, (_, index) => index);

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const MyBorrowPage = () => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [returningId, setReturningId] = useState<string | null>(null);

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    useEffect(() => {
        const fetchBorrows = async () => {
            if (!session?.user?.email) return;

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/borrows?userEmail=${encodeURIComponent(session.user.email)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch borrow records");
                }

                const data: BorrowRecord[] = await response.json();
                setBorrows(data);
            } catch (error) {
                console.error("Fetch borrow error:", error);
                toast.error(
                    "Could not load your borrows",
                    "Please refresh the page to try again.",
                    { id: "my-borrows-load-error" }
                );
            } finally {
                setLoading(false);
            }
        };

        if (!isPending && session) {
            fetchBorrows();
        }
    }, [isPending, session]);

    const handleReturn = async (borrowId: string) => {
        const borrow = borrows.find((record) => record._id === borrowId);
        setReturningId(borrowId);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/borrows/${borrowId}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to return book");
            }

            setBorrows((previousBorrows) =>
                previousBorrows.filter((record) => record._id !== borrowId)
            );

            toast.success(
                "Book returned",
                borrow
                    ? `"${borrow.bookTitle}" is back in the library.`
                    : "The book is back in the library."
            );
        } catch (error) {
            console.error("Return error:", error);
            toast.error(
                "Could not return the book",
                error instanceof Error ? error.message : "Please try again."
            );
        } finally {
            setReturningId(null);
        }
    };

    if (isPending) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4">
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Checking your session…
                </p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4">
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Redirecting to sign in…
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <header className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                    <BookOpen className="size-4" aria-hidden />
                    On loan
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                        My Borrows
                    </h1>
                    {!loading && borrows.length > 0 && (
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                            {borrows.length} {borrows.length === 1 ? "book" : "books"}
                        </span>
                    )}
                </div>

                <p className="mt-3 text-muted-foreground">
                    Keep track of the books you have borrowed and when they are due back.
                </p>
            </header>

            <div className="mt-8">
                {loading ? (
                    <div className="space-y-4">
                        {skeletonRows.map((row) => (
                            <div
                                key={row}
                                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:p-5"
                            >
                                <div className="aspect-[3/4] w-24 shrink-0 animate-pulse rounded-lg bg-muted sm:w-28" />
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                                    <div className="h-12 w-full max-w-sm animate-pulse rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : borrows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                            <Library className="size-6" aria-hidden />
                        </span>
                        <h2 className="mt-5 font-heading text-2xl font-semibold">
                            No borrows yet
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            You have not borrowed any books yet. Explore the collection and find
                            your next read.
                        </p>
                        <Link
                            href="/books"
                            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                        >
                            <BookOpen className="size-4" aria-hidden />
                            Browse the library
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {borrows.map((borrow) => {
                            const isReturning = returningId === borrow._id;

                            return (
                                <article
                                    key={borrow._id}
                                    className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:p-5"
                                >
                                    <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary sm:w-28">
                                        {borrow.bookImage ? (
                                            <Image
                                                src={borrow.bookImage}
                                                alt={borrow.bookTitle}
                                                fill
                                                sizes="112px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-1.5 px-2 text-center text-muted-foreground">
                                                <ImageOff
                                                    className="size-5"
                                                    aria-hidden
                                                />
                                                <span className="text-[10px] leading-tight font-medium">
                                                    No cover
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-heading text-lg font-semibold sm:text-xl">
                                            {borrow.bookTitle}
                                        </h2>

                                        <dl className="mt-3 grid grid-cols-2 gap-2 sm:max-w-sm">
                                            <div className="rounded-lg bg-secondary/60 px-3 py-2">
                                                <dt className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                                    <CalendarDays className="size-3" aria-hidden />
                                                    Borrowed
                                                </dt>
                                                <dd className="mt-0.5 text-sm font-semibold">
                                                    {formatDate(borrow.borrowDate)}
                                                </dd>
                                            </div>

                                            <div className="rounded-lg bg-secondary/60 px-3 py-2">
                                                <dt className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                                    <CalendarDays className="size-3" aria-hidden />
                                                    Return by
                                                </dt>
                                                <dd className="mt-0.5 text-sm font-semibold">
                                                    {formatDate(borrow.returnDate)}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="flex items-center sm:w-36 sm:shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleReturn(borrow._id)}
                                            disabled={isReturning}
                                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isReturning ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" aria-hidden />
                                                    Returning…
                                                </>
                                            ) : (
                                                "Return book"
                                            )}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBorrowPage;
