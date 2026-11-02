
"use client";

import Image from "next/image";
import { useState } from "react";

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    totalCopies: number;
    availableCopies: number;
};

type Props = {
    book: Book;
    onClose: () => void;
    onUpdated: (updatedBook: Book) => void;
};

export default function EditBookModal({ book, onClose, onUpdated }: Props) {
    const [form, setForm] = useState({
        title: book.title,
        author: book.author,
        category: book.category,
        image: book.image,
        description: book.description || "",
        totalCopies: book.totalCopies,
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "totalCopies" ? Number(value) : value,
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
            if (!key) throw new Error("ImgBB API key is missing.");

            const data = new FormData();
            data.append("image", file);

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${key}`,
                { method: "POST", body: data }
            );

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error("Image upload failed.");
            }

            setForm(prev => ({ ...prev, image: result.data.display_url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const borrowedCopies = book.totalCopies - book.availableCopies;

        if (form.totalCopies < 1 || !Number.isInteger(form.totalCopies)) {
            setError("Total copies must be at least 1.");
            return;
        }

        if (form.totalCopies < borrowedCopies) {
            setError(`At least ${borrowedCopies} copies are currently borrowed.`);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const updatedBook = {
                ...form,
                availableCopies: form.totalCopies - borrowedCopies,
            };

            const response = await fetch(`http://localhost:5000/books/${book._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Update failed.");

            onUpdated({ ...book, ...updatedBook });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 text-gray-900">
                <div className="mb-5 flex justify-between">
                    <h2 className="text-2xl font-bold">Edit Book</h2>
                    <button type="button" onClick={onClose} className="text-2xl">×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Book Title"
                        required
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        placeholder="Author"
                        required
                        className="w-full rounded-lg border p-3"
                    />

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="">Select Category</option>
                        {["Fiction", "Science", "History", "Kids", "Others"].map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Book Description"
                        required
                        rows={4}
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="number"
                        name="totalCopies"
                        min="1"
                        value={form.totalCopies}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border p-3"
                    />

                    <input type="file" accept="image/*" onChange={handleImageUpload} />

                    {uploading && <p>Uploading image...</p>}

                    {form.image && (
                        <div className="relative h-40 w-28">
                            <Image src={form.image} alt="Book cover" fill className="rounded object-cover" />
                        </div>
                    )}

                    {error && <p className="text-red-600">{error}</p>}

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 rounded-lg border py-3">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-1 rounded-lg bg-blue-600 py-3 text-white disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
