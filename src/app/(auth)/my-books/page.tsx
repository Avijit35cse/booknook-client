"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    totalCopies: number;
    availableCopies: number;
};

const MyBooksPage = () => {

    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const { data: session, isPending } = authClient.useSession();


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

                if (!response.ok) {
                    throw new Error("Failed to fetch books");
                }

                const data: Book[] = await response.json();
                setBooks(data);
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Fetch my books error:", error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadBooks();

        return () => controller.abort();
    }, [isPending, session, router]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">My Books</h1>
            <p className="text-gray-500 mt-2">
                Manage the books you have added to BookNook.
            </p>
        </div>

        {loading ? (
            <p>Loading your books...</p>
        ) : books.length === 0 ? (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold">
                    You haven&apos;t added any books yet.
                </h2>
                <button
                    onClick={() => router.push("/add-book")}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Add Your First Book
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div
                        key={book._id}
                        className="border rounded-xl overflow-hidden shadow-sm"
                    >
                        <div className="relative h-64 bg-gray-100">
                            <Image
                                src={book.image}
                                alt={book.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-5">
                            <h2 className="text-xl font-bold">
                                {book.title}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                By {book.author}
                            </p>

                            <p className="mt-3">
                                Category: {book.category}
                            </p>

                            <p className="mt-1">
                                Total Copies: {book.totalCopies}
                            </p>

                            <p className="mt-1">
                                Available Copies: {book.availableCopies}
                            </p>

                            <div className="flex gap-3 mt-5">
                                <button
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                                >
                                    Edit
                                </button>

                                <button
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
    );
};

export default MyBooksPage;