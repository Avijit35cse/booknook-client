import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://booknook-server-pi-ten.vercel.app",
});