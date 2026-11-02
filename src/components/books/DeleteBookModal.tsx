
"use client";

import { useState } from "react";

type Props = {
    bookId: string;
    bookTitle: string;
    onClose: () => void;
    onDeleted: () => void;
};

export default function DeleteBookModal({
    bookId,
    bookTitle,
    onClose,
    onDeleted,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`http://localhost:5000/books/${bookId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Delete failed.");
            }

            onDeleted();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 text-gray-900">
                <h2 className="mb-3 text-xl font-bold">Delete Book?</h2>

                <p className="mb-5 text-gray-600">
                    Are you sure you want to delete <strong>{bookTitle}</strong>?
                </p>

                {error && <p className="mb-4 text-red-600">{error}</p>}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-lg border py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 rounded-lg bg-red-600 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
