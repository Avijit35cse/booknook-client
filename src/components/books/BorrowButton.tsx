"use client";
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type BorrowButtonProps = {
    bookId: string;
    availableCopies: number;
    bookTitle: string;
    bookImage: string;
};

const BorrowButton = ({
    bookId,
    availableCopies,
    bookTitle,
    bookImage,
}: BorrowButtonProps) => {

    const { data: session, isPending } = authClient.useSession();

    const router = useRouter();
    const userEmail = session?.user?.email;

    const userName = session?.user?.name;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleBorrow = async () => {
        if (!userEmail || !userName) {
            setMessage("Please login before borrowing.");
            return;
        }
        setIsSubmitting(true);
        setMessage("");

        const borrowDate = new Date();
        const returnDate = new Date(borrowDate);
        returnDate.setDate(returnDate.getDate() + 7);

        const borrowData = {
            bookId,
            bookTitle,
            bookImage,
            userName,
            userEmail,
            borrowDate,
            returnDate,
        };

        try {
            const response = await fetch("http://localhost:5000/borrows", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(borrowData),
            });

            const result = await response.json();

            if (!response.ok) {
                setMessage(result.message || "Failed to borrow book");
                return;
            }

            setMessage("Book borrowed successfully!");
            setIsModalOpen(false);
            router.refresh();

        } catch (error) {
            console.error("Borrow error:", error);
            setMessage("Something went wrong!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <button
                disabled={isPending || availableCopies <= 0}
                onClick={() => {
                    if (!session) {
                        router.push(
                            `/sign-in?callbackURL=${encodeURIComponent(window.location.pathname)}`
                        );
                        return;
                    }

                    setIsModalOpen(true);
                }}
            >
                {availableCopies <= 0 ? "Not Available" : "Borrow Book"}
            </button>
            {isModalOpen && (
                <div>
                    <h2>Confirm Borrow</h2>

                    <p>Book: {bookTitle}</p>

                    <label>Your Name</label>
                    <input value={userName || ""} readOnly />

                    <label>Your Email</label>
                    <input value={userEmail || ""} readOnly />

                    <button onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </button>

                    <button
                        onClick={handleBorrow}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Borrowing..." : "Confirm Borrow"}
                    </button>
                </div>
            )}
            <p>{userEmail || "User not logged in"}</p>
            {message && (
                <p>{message}</p>
            )}
        </div>
    );
};

export default BorrowButton;