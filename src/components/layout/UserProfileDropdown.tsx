
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    ChevronDown,
    UserRound,
    BookOpen,
    Bookmark,
    LogOut,
} from "lucide-react";

type Props = {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
};

export default function UserProfileDropdown({ user }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const handleSignOut = async () => {
        const { error } = await authClient.signOut();

        if (error) {
            console.error("Sign out failed:", error);
            toast.error("Could not sign out", "Please try again.");
            return;
        }

        setOpen(false);
        toast.success("Signed out", "See you at your next chapter.");
        router.push("/");
        router.refresh();
    };

    const menuLinks = [
        { name: "My Profile", href: "/profile", icon: UserRound },
        { name: "My Books", href: "/my-books", icon: BookOpen },
        { name: "My Borrows", href: "/my-borrows", icon: Bookmark },
    ];

    return (
        <div className="relative">
            {/* Avatar Trigger */}
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-label={open ? "Close user menu" : "Open user menu"}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>

                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                    aria-hidden
                />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <>
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                    />

                    <div
                        role="menu"
                        className="absolute right-0 top-[calc(100%+0.5rem)] z-50 max-h-[calc(100vh-5.5rem)] w-[calc(100vw-2rem)] max-w-72 overflow-y-auto overscroll-contain rounded-xl border bg-background p-4 shadow-xl"
                    >
                        {/* User Information */}
                        <div className="flex items-center gap-3 border-b pb-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.image || ""} alt={user.name} />
                                <AvatarFallback>
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                                <p className="truncate font-semibold">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-1 py-3">
                            {menuLinks.map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    role="menuitem"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                                >
                                    <Icon className="h-4 w-4" aria-hidden />
                                    {name}
                                </Link>
                            ))}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t pt-3">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                            >
                                <LogOut className="h-4 w-4" aria-hidden />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
