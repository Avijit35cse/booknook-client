"use client";
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

    return (
        <div>
            <h1>My Borrows Page</h1>
        </div>
    );
};

export default MyBorrowPage;