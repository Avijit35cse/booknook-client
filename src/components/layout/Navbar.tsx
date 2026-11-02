
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Menu, BookOpen } from "lucide-react";

export default function Navbar() {

    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    const handleSignOut = async () => {
        const { error } = await authClient.signOut();

        if (error) {
            console.error("Sign out failed:", error);
            return;
        }

        router.push("/");
        router.refresh();
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "All Books", href: "/all-books" },
        ...(user
            ? [ 
                { name: "Add Book", href: "/add-book" },
                { name: "My Books", href: "/my-books" },
                { name: "My Borrows", href: "/my-borrows" },
            ]
            : []),
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-7 w-7 text-primary" />

                    <span className="font-heading text-2xl font-bold text-primary">
                        BookNook
                    </span>
                </Link>

                {/* Desktop Navigation */}

                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop User Section */}
                <div className="hidden items-center gap-3 md:flex">
                    {isPending ? (
                        <span className="text-sm text-muted-foreground">
                            Loading...
                        </span>
                    ) : user ? (
                        <>
                            <span className="text-sm text-foreground">
                                Hi, {user.name}
                            </span>

                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={user.image || ""}
                                    alt={user.name}
                                />
                                <AvatarFallback>
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>

                            <Button onClick={handleSignOut} size="sm">
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Sign In
                        </Link>
                    )}
                </div>


                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger
                          nativeButton = {true}
                            render={
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Open menu"
                                />
                            }
                        >
                            <Menu className="h-5 w-5" />
                        </SheetTrigger>

                        <SheetContent side="right" className="w-[280px]">
                            <SheetHeader>
                                <SheetTitle className="font-heading text-2xl text-primary">
                                    BookNook
                                </SheetTitle>
                            </SheetHeader>

                            <div className="mt-8 flex flex-col gap-5">
                                {navLinks.map((link) => (
                                    <SheetClose
                                        key={link.href}
                                        nativeButton = {false} 
                                        render={
                                            <Link
                                                href={link.href}
                                                className="text-base font-medium transition-colors hover:text-accent"
                                            >
                                                {link.name}
                                            </Link>
                                        }
                                    />
                                ))}

                                <div className="border-t border-border pt-5">
                                    {isPending ? (
                                        <span className="text-sm text-muted-foreground">
                                            Loading...
                                        </span>
                                    ) : user ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage
                                                        src={user.image || ""}
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback>
                                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span className="text-sm font-medium">
                                                    Hi, {user.name}
                                                </span>
                                            </div>

                                            <Button onClick={handleSignOut} className="w-full">
                                                Sign Out
                                            </Button>
                                        </div>
                                    ) : (
                                        <SheetClose
                                            nativeButton = {false}
                                            render={
                                                <Link
                                                    href="/sign-in"
                                                    className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                                >
                                                    Sign In
                                                </Link>
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </nav>
        </header>
    );
}
