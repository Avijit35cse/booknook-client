import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
        throw new Error("Authentication required. Please login.");
    }

    const baseURL = API_URL?.replace(/\/+$/, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const response = await fetch(`${baseURL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response;
}