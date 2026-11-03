"use client";
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState , Suspense } from 'react';
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Sparkles,
} from 'lucide-react';

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

const inputClassName =
    "h-12 w-full rounded-xl border border-border bg-background/70 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const fieldIconClassName =
    "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground";


const SignInForm = () => {

    const searchParams = useSearchParams();
    const callbackURL = searchParams.get("callbackURL") || "/";
   

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();

        setErrorMessage("");
        setIsLoading(true);

        try {

            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                setErrorMessage(error.message || "Invalid email or password.");
                return;
            }

            console.log("Sign in successful:", data);
            window.location.assign(callbackURL);
            // router.refresh();
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.");
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }

    }

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}${callbackURL}`,
            });

            if (error) {
                setErrorMessage(error.message || "Google sign in failed.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong with Google sign in.");
            console.error(error);
        }
    };

    return (
        <div className="mt-7">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="sign-in-email" className={labelClassName}>
                        Email
                    </label>
                    <div className="relative">
                        <Mail className={fieldIconClassName} aria-hidden />
                        <input
                            id="sign-in-email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`${inputClassName} pr-3.5 pl-11`}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="sign-in-password" className={labelClassName}>
                        Password
                    </label>
                    <div className="relative">
                        <Lock className={fieldIconClassName} aria-hidden />
                        <input
                            id="sign-in-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`${inputClassName} pr-12 pl-11`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                            className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" aria-hidden />
                            ) : (
                                <Eye className="size-4" aria-hidden />
                            )}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div
                        role="alert"
                        className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3"
                    >
                        <AlertCircle
                            className="mt-0.5 size-4 shrink-0 text-destructive"
                            aria-hidden
                        />
                        <p className="text-sm leading-relaxed text-destructive">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                            Signing In...
                        </>
                    ) : (
                        <>
                            Sign In
                            <ArrowRight
                                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                                aria-hidden
                            />
                        </>
                    )}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3" aria-hidden>
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    or continue with
                </span>
                <span className="h-px flex-1 bg-border" />
            </div>

            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/25 hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="size-[18px] shrink-0"
                    aria-hidden="true"
                >
                    <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.6v3h3.86c2.26-2.08 3.58-5.15 3.58-8.84Z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
                    />
                </svg>
                Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                New to BookNook?{" "}
                <Link
                    href="/sign-up"
                    className="font-semibold text-primary underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                    Create an account
                </Link>
            </p>
        </div>
    );
};

const SignInPage = () => {
    return (
        <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
            {/* Background decoration */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 -right-24 size-96 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-t-full border border-border/60" />
                <div className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-t-full border border-border/40" />
                <BookOpen
                    className="absolute -right-10 -bottom-10 size-64 rotate-12 text-primary/[0.04]"
                    strokeWidth={1}
                />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_30px_70px_-40px_rgba(24,61,50,0.55)]">
                    <div
                        aria-hidden
                        className="h-1.5 w-full bg-linear-to-r from-primary via-primary/80 to-accent"
                    />

                    <div className="p-6 sm:p-8">
                        <header>
                            <div className="flex items-center gap-2.5">
                                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                    <BookOpen className="size-5" aria-hidden />
                                </span>
                                <span className="font-heading text-2xl font-bold text-primary">
                                    BookNook
                                </span>
                            </div>

                            <p className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                                <Sparkles className="size-3.5" aria-hidden />
                                Your next chapter
                            </p>

                            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground text-balance">
                                Welcome back to BookNook
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Sign in to pick up where you left off and return
                                to the books waiting on your shelf.
                            </p>
                        </header>

                        <Suspense
                            fallback={
                                <div className="mt-7 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-background/60 px-4 py-12 text-center">
                                    <Loader2
                                        className="size-5 animate-spin text-primary"
                                        aria-hidden
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Loading sign-in...
                                    </p>
                                </div>
                            }
                        >
                            <SignInForm />
                        </Suspense>
                    </div>
                </div>

                <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                    <Lock className="size-3.5 text-primary/70" aria-hidden />
                    Your details stay between you and BookNook.
                </p>
            </div>
        </section>
    );
}

export default SignInPage;
