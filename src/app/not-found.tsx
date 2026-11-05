
import Link from "next/link";
import { ArrowLeft, BookOpen, SearchX } from "lucide-react";

const NotFound = () => {
    return (
        <main className="flex min-h-[75vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BookOpen className="size-10" aria-hidden />
                </div>

                <p className="mt-8 text-sm font-semibold tracking-[0.3em] text-primary">
                    BOOKNOOK
                </p>

                <h1 className="mt-4 font-heading text-7xl font-bold tracking-tight text-foreground sm:text-8xl">
                    404
                </h1>

                <div className="mt-5 flex items-center justify-center gap-2">
                    <SearchX className="size-5 text-muted-foreground" aria-hidden />
                    <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                        Page Not Found
                    </h2>
                </div>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Oops! The page you&apos;re looking for doesn&apos;t exist
                    or may have been moved. Let&apos;s get you back to your
                    reading journey.
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <ArrowLeft className="size-4" aria-hidden />
                    Back to Home
                </Link>

                <p className="mt-10 text-xs text-muted-foreground">
                    Happy reading with BookNook!
                </p>
            </div>
        </main>
    );
};

export default NotFound;
