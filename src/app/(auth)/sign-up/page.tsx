"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


const SignUpPage = () => {

    const router = useRouter();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")

    //Loading state & Error Message state

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");



    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage("")
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.")
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setErrorMessage("Password must contain at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(password)) {
            setErrorMessage("Password must contain at least one lowercase letter.");
            return;
        }

        setIsLoading(true);
        try {

            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                image,
                callbackURL: "/sign-in",
            });

            if (error) {
                setErrorMessage(error.message || "Registration failed.")
                return;
            }

            console.log("Registration successful:", data);
            router.push("/sign-in");

        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.")
            console.error("Registration error:", error);

        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleSignUp = async () => {
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:3000/",
            });

            if (error) {
                setErrorMessage(error.message || "Google sign up failed.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong with Google sign up.");
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="url"
                    placeholder="Your Photo URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && (
                    <p className="text-sm text-red-500">
                        {errorMessage}
                    </p>
                )}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>

            <button
                type="button"
                onClick={handleGoogleSignUp}
            >
                Continue with Google

            </button>

            <p>
                Already have an account?{" "}
                <Link href="/sign-in">
                    Sign In
                </Link>
            </p>
        </div>
    );
}



export default SignUpPage;
