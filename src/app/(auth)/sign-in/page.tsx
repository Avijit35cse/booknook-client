"use client";
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState , Suspense } from 'react';


const SignInForm = () => {

    const searchParams = useSearchParams();
    const callbackURL = searchParams.get("callbackURL") || "/";
   

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {errorMessage && (
                    <p className="text-sm text-red-500">
                        {errorMessage}
                    </p>
                )}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <button type="button" onClick={handleGoogleSignIn}>
                Continue with Google
            </button>

            <p>
                Don&apos;t have an account?{" "}
                <Link href="/sign-up">
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

const SignInPage = () => {
    return (
        <div>
            <h1>Sign In</h1>
            <Suspense fallback={<p>Loading sign-in ...</p>}>
                <SignInForm />
            </Suspense>
        </div>
    );
}

export default SignInPage;
