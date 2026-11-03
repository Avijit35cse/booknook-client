"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace(
                `/sign-in?callbackURL=${encodeURIComponent(
                    window.location.pathname + window.location.search
                )}`
            );
        }
    }, [isPending, session, router]);

    if (isPending || !session) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-muted-foreground">Checking authentication...</p>
            </div>
        );
    }

    return <>{children}</>;
}