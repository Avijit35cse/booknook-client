import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ImageOff, Library } from "lucide-react";

export const instant = false;

export const metadata: Metadata = {
    title: "All Books",
    description:
        "Browse every title on the BookNook shelves, check availability, and find your next read.",
};

interface Book {
    _id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    image: string;
    availableCopies: number;
}

const AllBooksPage = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }

    const books: Book[] = await response.json();

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <header className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                    <Library className="size-4" aria-hidden />
                    Browse the collection
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        All Books
                    </h1>

                    {books.length > 0 && (
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                            {books.length} {books.length === 1 ? "title" : "titles"}
                        </span>
                    )}
                </div>

                <p className="mt-3 text-muted-foreground">
                    Every book on the BookNook shelves, from fresh arrivals to
                    old favourites. Explore the collection, check what is
                    available, and find your next chapter.
                </p>
            </header>

            {books.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                        <BookOpen className="size-6" aria-hidden />
                    </span>

                    <h2 className="mt-5 font-heading text-2xl font-semibold">
                        The shelves are empty for now
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        No books have been added to BookNook yet. Check back soon
                        or be the first to share a title with the community.
                    </p>

                    <Link
                        href="/add-book"
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                        <BookOpen className="size-4" aria-hidden />
                        Add the first book
                    </Link>
                </div>
            ) : (
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => {
                        const isAvailable = book.availableCopies > 0;

                        return (
                            <article
                                key={book._id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                                    {book.image ? (
                                        <Image
                                            src={book.image}
                                            alt={`Cover of ${book.title}`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
                                            <ImageOff
                                                className="size-7"
                                                aria-hidden
                                            />
                                            <p className="text-xs font-medium">
                                                No cover available
                                            </p>
                                        </div>
                                    )}

                                    <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                                        {book.category}
                                    </span>

                                    <span
                                        className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
                                            isAvailable
                                                ? "bg-primary/95 text-primary-foreground"
                                                : "bg-destructive/95 text-white"
                                        }`}
                                    >
                                        <span
                                            aria-hidden
                                            className="size-1.5 rounded-full bg-current"
                                        />
                                        {isAvailable
                                            ? "Available"
                                            : "All copies borrowed"}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h2 className="line-clamp-2 font-heading text-lg leading-snug font-semibold break-words">
                                        {book.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        by{" "}
                                        <span className="font-medium text-foreground">
                                            {book.author}
                                        </span>
                                    </p>

                                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                        {book.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            <span className="text-sm font-semibold text-foreground">
                                                {book.availableCopies}
                                            </span>{" "}
                                            {book.availableCopies === 1
                                                ? "copy"
                                                : "copies"}{" "}
                                            available
                                        </p>

                                        <Link
                                            href={`/books/${book._id}`}
                                            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                                        >
                                            View Details
                                            <ArrowRight
                                                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                                                aria-hidden
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllBooksPage;
