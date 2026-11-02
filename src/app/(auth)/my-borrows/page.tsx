"use client";
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

const MyBorrowPage = () => {

    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);

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
                    `http://localhost:5000/borrows?userEmail=${encodeURIComponent(session.user.email)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch borrow records");
                }

                const data: BorrowRecord[] = await response.json();
                setBorrows(data);

            } catch (error) {
                console.error("Fetch borrow error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!isPending && session) {
            fetchBorrows();
        }
    }, [isPending, session]);
    if (isPending) {
        return <p>Checking authentication...</p>;
    }

    if (!session) {
        return <p>Redirecting to Sign In...</p>;
    }

    const handleReturn = async (borrowId: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/borrows/${borrowId}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to return book");
            }

            setBorrows((previousBorrows) =>
                previousBorrows.filter((borrow) => borrow._id !== borrowId)
            );

        } catch (error) {
            console.error("Return error:", error);
        }
    };

    return (
        <div>
            <h1>My Borrows</h1>

            {loading ? (
                <p>Loading borrow records...</p>
            ) : borrows.length === 0 ? (
                <p>You have not borrowed any books yet.</p>
            ) : (
                <div>
                    {borrows.map((borrow) => (
                        <div key={borrow._id}>
                            <Image
                                src={borrow.bookImage}
                                alt={borrow.bookTitle}
                                width={100}
                                height={150}
                            />

                            <h2>{borrow.bookTitle}</h2>

                            <p>
                                Borrow Date:{" "}
                                {new Date(borrow.borrowDate).toLocaleDateString()}
                            </p>

                            <p>
                                Return Date:{" "}
                                {new Date(borrow.returnDate).toLocaleDateString()}
                            </p>
                            <button onClick={() => handleReturn(borrow._id)}>
                                Return Book
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBorrowPage;