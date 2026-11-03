"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { toast } from "@/components/ui/toast";

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

const fieldClassName =
    "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

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
            toast.error("That file is not an image", "Please choose a JPG, PNG, or WebP file.");
            return;
        }

        setUploading(true);

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
            toast.success("Cover updated", "The new cover is ready to save.");
        } catch (err) {
            toast.error(
                "Could not upload the cover",
                err instanceof Error ? err.message : "Upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const borrowedCopies = book.totalCopies - book.availableCopies;

        if (form.totalCopies < 1 || !Number.isInteger(form.totalCopies)) {
            toast.error("Invalid copy count", "Total copies must be at least 1.");
            return;
        }

        if (form.totalCopies < borrowedCopies) {
            toast.error(
                "Too few copies",
                `At least ${borrowedCopies} copies are currently borrowed.`
            );
            return;
        }

        setLoading(true);

        try {
            const updatedBook = {
                ...form,
                availableCopies: form.totalCopies - borrowedCopies,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Update failed.");

            onUpdated({ ...book, ...updatedBook });
            onClose();
        } catch (err) {
            toast.error(
                "Could not update the book",
                err instanceof Error ? err.message : "Update failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-book-title"
                className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:rounded-2xl sm:p-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="edit-book-title" className="font-heading text-2xl font-semibold">
                            Edit book
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update the details shown on the BookNook shelf.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close edit dialog"
                        className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                        <X className="size-4" aria-hidden />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="edit-title" className={labelClassName}>
                            Title
                        </label>
                        <input
                            id="edit-title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Book title"
                            required
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-author" className={labelClassName}>
                            Author
                        </label>
                        <input
                            id="edit-author"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            placeholder="Author"
                            required
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-category" className={labelClassName}>
                            Category
                        </label>
                        <select
                            id="edit-category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className={fieldClassName}
                        >
                            <option value="">Select category</option>
                            {["Fiction", "Science", "History", "Kids", "Others"].map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="edit-description" className={labelClassName}>
                            Description
                        </label>
                        <textarea
                            id="edit-description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Book description"
                            required
                            rows={4}
                            className="w-full resize-y rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-copies" className={labelClassName}>
                            Total copies
                        </label>
                        <input
                            id="edit-copies"
                            type="number"
                            name="totalCopies"
                            min="1"
                            value={form.totalCopies}
                            onChange={handleChange}
                            required
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <span className={labelClassName}>Book cover</span>
                        <div className="flex items-center gap-3">
                            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                                {form.image ? (
                                    <Image
                                        src={form.image}
                                        alt="Book cover"
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <ImagePlus
                                        className="absolute inset-0 m-auto size-4 text-muted-foreground"
                                        aria-hidden
                                    />
                                )}
                            </div>

                            <label
                                htmlFor="edit-image"
                                className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring/40"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                                        Uploading…
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus className="size-3.5" aria-hidden />
                                        Replace
                                    </>
                                )}
                            </label>

                            <input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="sr-only"
                            />
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden />
                                    Updating…
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
