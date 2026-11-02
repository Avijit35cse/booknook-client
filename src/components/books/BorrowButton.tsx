"use client";
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React from 'react';

const BorrowButton = () => {

    const { data: session, isPending } = authClient.useSession();

    const router = useRouter();
    const userEmail = session?.user?.email;
    return (
        <div>
            <button
                disabled={isPending}
                onClick={() => {
                    if (!session) {
                        router.push(`/sign-in?callbackURL=${encodeURIComponent(window.location.pathname)}`);
                        return;
                    } else {
                        console.log("Logged in user:", userEmail);
                    }
                }}
            >
                Borrow Book
            </button>
            <p>{userEmail || "User not logged in"}</p>
        </div>
    );
};

export default BorrowButton;