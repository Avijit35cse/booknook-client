
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    BookOpen,
    Bookmark,
    Mail,
    UserRound,
    ArrowRight,
    Loader2,
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/sign-in");
        }
    }, [isPending, user, router]);

    if (isPending || !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-[70vh] bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">

                {/* Page Heading */}
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                        BookNook Account
                    </p>

                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        Your personal information and reading activity.
                    </p>
                </div>

                {/* Profile Card */}
                <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

                    <div className="flex flex-col items-center gap-4 border-b border-border bg-muted/40 px-6 py-10">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarImage
                                src={user.image || ""}
                                alt={user.name || "User"}
                            />
                            <AvatarFallback className="text-3xl">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground">
                                {user.name}
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                BookNook Member
                            </p>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="space-y-5 p-6 sm:p-8">

                        <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Full Name
                                </p>
                                <p className="mt-1 truncate font-semibold text-foreground">
                                    {user.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Mail className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Email Address
                                </p>
                                <p className="mt-1 break-all font-semibold text-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Quick Links */}
                    <div className="grid gap-4 border-t border-border bg-muted/20 p-6 sm:grid-cols-2 sm:p-8">

                        <Link
                            href="/my-books"
                            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-foreground">
                                        My Books
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Manage your books
                                    </p>
                                </div>
                            </div>

                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/my-borrows"
                            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <Bookmark className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-foreground">
                                        My Borrows
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        View borrowed books
                                    </p>
                                </div>
                            </div>

                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </Link>

                    </div>
                </section>

            </div>
        </main>
    );
}
