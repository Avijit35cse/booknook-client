import Link from "next/link";
export const instant = false;

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
    const response = await fetch("http://localhost:5000/books", {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }

    const books: Book[] = await response.json();

    return (
        <div>
            <h1>All Books</h1>

            {books.map((book) => (
                <div key={book._id}>
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>
                    <p>{book.category}</p>
                    <p>{book.description}</p>
                    <p>Available Copies: {book.availableCopies}</p>
                    <Link href={`/books/${book._id}`}>
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default AllBooksPage;