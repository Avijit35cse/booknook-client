import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookMarked, Layers, Tag } from "lucide-react";
import BorrowButton from "@/components/books/BorrowButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface BookDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

interface Book {
    _id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    image: string;
    availableCopies: number;
}

export const instant = false;

const BookDetailsPage = async ({ params }: BookDetailsPageProps) => {
    const { id } = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch book");
    }

    const data = await response.json();
    const book: Book = data.result;

    const isAvailable = book.availableCopies > 0;

    return (
        <ProtectedRoute>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <Link
                href="/books"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
                <ArrowLeft className="size-4" aria-hidden />
                Back to all books
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
                <div className="mx-auto w-full max-w-xs lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                        <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 320px"
                            loading="eager"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
                            <Tag className="size-3.5" aria-hidden />
                            {book.category}
                        </span>

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                isAvailable
                                    ? "bg-primary/10 text-primary"
                                    : "bg-destructive/10 text-destructive"
                            }`}
                        >
                            <span
                                aria-hidden
                                className={`size-1.5 rounded-full ${
                                    isAvailable ? "bg-primary" : "bg-destructive"
                                }`}
                            />
                            {isAvailable ? "Available to borrow" : "All copies borrowed"}
                        </span>
                    </div>

                    <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                        {book.title}
                    </h1>

                    <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                        by <span className="font-medium text-foreground">{book.author}</span>
                    </p>

                    <div className="mt-7 border-t border-border pt-7">
                        <h2 className="font-heading text-xl font-semibold">About this book</h2>
                        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                            {book.description}
                        </p>
                    </div>

                    <dl className="mt-7 grid max-w-md grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border bg-card p-4">
                            <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                <Layers className="size-3.5" aria-hidden />
                                Category
                            </dt>
                            <dd className="mt-1.5 text-sm font-semibold text-foreground">
                                {book.category}
                            </dd>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-4">
                            <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                <BookMarked className="size-3.5" aria-hidden />
                                Copies left
                            </dt>
                            <dd className="mt-1.5 text-sm font-semibold text-foreground">
                                {book.availableCopies}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-7 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-heading text-lg font-semibold">
                                    {isAvailable ? "Ready for your next chapter" : "Currently unavailable"}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {isAvailable
                                        ? `${book.availableCopies} ${
                                              book.availableCopies === 1 ? "copy" : "copies"
                                          } available for a 7-day borrow.`
                                        : "All copies are borrowed. Please check back soon."}
                                </p>
                            </div>

                            <div className="w-full shrink-0 sm:w-auto sm:min-w-44">
                                <BorrowButton
                                    bookId={book._id}
                                    availableCopies={book.availableCopies}
                                    bookTitle={book.title}
                                    bookImage={book.image}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
};

export default BookDetailsPage;
