"use client";

import { authClient } from "@/lib/auth-client";
import EditBookModal from "@/components/books/EditBookModal";
import DeleteBookModal from "@/components/books/DeleteBookModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookPlus, Library, Pencil, Trash2 } from "lucide-react";

import { toast } from "@/components/ui/toast";

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
};

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

const MyBooksPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [deleteBook, setDeleteBook] = useState<Book | null>(null);

    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace("/sign-in");
            return;
        }

        const controller = new AbortController();

        const loadBooks = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/books?addedBy=${encodeURIComponent(session.user.email)}`,
                    { signal: controller.signal }
                );

                if (!response.ok) throw new Error("Failed to fetch books");

                setBooks(await response.json());
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error(error);
                    toast.error("Could not load your books", "Please refresh the page to try again.", {
                        id: "my-books-load-error",
                    });
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadBooks();
        return () => controller.abort();
    }, [isPending, session, router]);

    if (isPending || loading) {
        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-9 w-56 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {skeletonCards.map((card) => (
                        <div
                            key={card}
                            className="overflow-hidden rounded-2xl border border-border bg-card"
                        >
                            <div className="aspect-[3/4] animate-pulse bg-muted" />
                            <div className="space-y-3 p-5">
                                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                                <div className="h-10 w-full animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <header className="max-w-2xl">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                        <Library className="size-4" aria-hidden />
                        Your collection
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                            My Books
                        </h1>
                        {books.length > 0 && (
                            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                                {books.length} {books.length === 1 ? "book" : "books"}
                            </span>
                        )}
                    </div>

                    <p className="mt-3 text-muted-foreground">
                        Manage the books you have added to BookNook.
                    </p>
                </header>

                <button
                    type="button"
                    onClick={() => router.push("/add-book")}
                    className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:w-auto"
                >
                    <BookPlus className="size-4" aria-hidden />
                    Add a book
                </button>
            </div>

            {books.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                        <Library className="size-6" aria-hidden />
                    </span>
                    <h2 className="mt-5 font-heading text-2xl font-semibold">
                        Your shelf is waiting
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        You haven&apos;t added any books yet. Share your first title with the
                        BookNook community.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/add-book")}
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    >
                        <BookPlus className="size-4" aria-hidden />
                        Add your first book
                    </button>
                </div>
            ) : (
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => (
                        <article
                            key={book._id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                                <Image
                                    src={book.image}
                                    alt={book.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                                />
                                <span className="absolute top-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                                    {book.category}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <h2 className="line-clamp-2 font-heading text-lg font-semibold">
                                    {book.title}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    by {book.author}
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg bg-secondary/60 px-3 py-2">
                                        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                            Total
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold">
                                            {book.totalCopies}{" "}
                                            {book.totalCopies === 1 ? "copy" : "copies"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-secondary/60 px-3 py-2">
                                        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                            Available
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold">
                                            {book.availableCopies}{" "}
                                            {book.availableCopies === 1 ? "copy" : "copies"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2 pt-0">
                                    <button
                                        type="button"
                                        onClick={() => setEditBook(book)}
                                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                                    >
                                        <Pencil className="size-3.5" aria-hidden />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDeleteBook(book)}
                                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-destructive/10 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:outline-none"
                                    >
                                        <Trash2 className="size-3.5" aria-hidden />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {editBook && (
                <EditBookModal
                    book={editBook}
                    onClose={() => setEditBook(null)}
                    onUpdated={(updatedBook) => {
                        setBooks(previous =>
                            previous.map(book =>
                                book._id === updatedBook._id ? updatedBook : book
                            )
                        );
                        setEditBook(null);
                        toast.success(
                            "Book updated",
                            `"${updatedBook.title}" has been saved.`
                        );
                    }}
                />
            )}

            {deleteBook && (
                <DeleteBookModal
                    bookId={deleteBook._id}
                    bookTitle={deleteBook.title}
                    onClose={() => setDeleteBook(null)}
                    onDeleted={() => {
                        setBooks(previous =>
                            previous.filter(book => book._id !== deleteBook._id)
                        );
                        setDeleteBook(null);
                        toast.success(
                            "Book deleted",
                            `"${deleteBook.title}" has been removed from your shelf.`
                        );
                    }}
                />
            )}
        </div>
    );
};

export default MyBooksPage;
