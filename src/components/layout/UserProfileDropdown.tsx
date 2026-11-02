
"use client";

import { useState } from "react";
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
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Open user menu"
                className="flex items-center gap-2 rounded-full p-1 hover:bg-muted"
            >
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>

                <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <>
                    <button
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border bg-background p-4 shadow-xl">

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
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                                >
                                    <Icon className="h-4 w-4" />
                                    {name}
                                </Link>
                            ))}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t pt-3">
                            <button
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-muted"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
