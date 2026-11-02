"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MyBooksPage = () => {

    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    if (isPending) {
        return <p>Checking authentication...</p>;
    }

    if (!session) {
        return <p>Redirecting to Sign In...</p>;
    }



    return (
        <div>
            <h1>My Books Page</h1>
        </div>
    );
};

export default MyBooksPage;