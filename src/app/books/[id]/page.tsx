import Image from "next/image";
import BorrowButton from "@/components/books/BorrowButton";

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

    const response = await fetch(`http://localhost:5000/books/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch book");
    }

    const data = await response.json();
    const book: Book = data.result;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Image
                src={book.image}
                alt={book.title}
                width={256}
                height={320}
                loading="eager"
                className="w-64 h-80 object-cover rounded-lg"
            />

            <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
            <p>{book.description}</p>
            <p>Available Copies: {book.availableCopies}</p>
            <BorrowButton
                bookId={book._id}
                availableCopies={book.availableCopies}
                bookTitle={book.title}
                bookImage={book.image}
            />
        </div>
    );
};

export default BookDetailsPage;