import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
    // baseURL: "https://booknook-server-pi-ten.vercel.app",
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [jwtClient()],
});