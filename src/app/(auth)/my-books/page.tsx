
"use client";

import { authClient } from "@/lib/auth-client";
import EditBookModal from "@/components/books/EditBookModal";
import DeleteBookModal from "@/components/books/DeleteBookModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

const MyBooksPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [deleteBook, setDeleteBook] = useState<Book | null>(null);
    const [message, setMessage] = useState("");

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
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadBooks();
        return () => controller.abort();
    }, [isPending, session, router]);

    if (isPending || loading) {
        return <p className="py-20 text-center">Loading your books...</p>;
    }

    if (!session) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="text-3xl font-bold">My Books</h1>
            <p className="mb-8 mt-2 text-gray-500">
                Manage the books you have added to BookNook.
            </p>

            {message && (
                <p className="mb-5 rounded-lg bg-green-100 p-3 text-green-700">
                    {message}
                </p>
            )}

            {books.length === 0 ? (
                <div className="py-16 text-center">
                    <h2 className="text-xl font-semibold">
                        You haven&apos;t added any books yet.
                    </h2>
                    <button
                        onClick={() => router.push("/add-book")}
                        className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
                    >
                        Add Your First Book
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map(book => (
                        <div key={book._id} className="overflow-hidden rounded-xl border shadow-sm">
                            <div className="relative h-64 bg-gray-100">
                                <Image
                                    src={book.image}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="p-5">
                                <h2 className="text-xl font-bold">{book.title}</h2>
                                <p className="mt-1 text-gray-500">By {book.author}</p>
                                <p className="mt-3">Category: {book.category}</p>
                                <p className="mt-1">Total Copies: {book.totalCopies}</p>
                                <p className="mt-1">Available Copies: {book.availableCopies}</p>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setMessage("");
                                            setEditBook(book);
                                        }}
                                        className="flex-1 rounded-lg bg-blue-600 py-2 text-white"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => {
                                            setMessage("");
                                            setDeleteBook(book);
                                        }}
                                        className="flex-1 rounded-lg bg-red-600 py-2 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
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
                        setMessage("Book updated successfully!");
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
                        setMessage("Book deleted successfully!");
                    }}
                />
            )}
        </div>
    );
};

export default MyBooksPage;
