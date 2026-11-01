"use client";
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const SignInPage = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();

        setErrorMessage("");
        setIsLoading(true);

        try{

            const { data , error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                setErrorMessage(error.message || "Invalid email or password.");
                return;
            }

            console.log("Sign in successful:", data);
            router.push("/");
            router.refresh();
        } catch(error){
            setErrorMessage("Something went wrong. Please try again.");
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }

    }

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
        </div>
    );
};

export default SignInPage;
