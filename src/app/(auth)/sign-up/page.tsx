"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState ,type SyntheticEvent } from "react";


const SignUpPage = () => {

    const router = useRouter();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async(e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {data, error} = await authClient.signUp.email({
            name,
            email,
            password,
        });

        if (error) {
            console.error("Sign up failed:", error.message);
            return;
        }

        console.log("Sign up successful:", data);
        router.push("/sign-in");
    }

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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
        
  

export default SignUpPage;
