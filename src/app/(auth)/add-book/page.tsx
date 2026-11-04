"use client";

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookPlus, ImagePlus, Loader2, UploadCloud } from 'lucide-react';

import { toast } from '@/components/ui/toast';
import { apiFetch } from '@/lib/api';

type BookFormData = {
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    totalCopies: number;
};

const fieldClassName =
    "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const labelClassName = "mb-1.5 block text-sm font-medium text-foreground";

const AddBookPage = () => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [formData, setFormData] = useState<BookFormData>({
        title: "",
        author: "",
        category: "",
        image: "",
        description: "",
        totalCopies: 1,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "totalCopies" ? Number(value) : value,
        }));
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("That file is not an image", "Please choose a JPG, PNG, or WebP file.");
            return;
        }

        if (file.size > 32 * 1024 * 1024) {
            toast.error("Image is too large", "Please choose an image under 32 MB.");
            return;
        }

        setIsUploading(true);

        try {
            const imageData = new FormData();
            imageData.append("image", file);

            const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

            if (!apiKey) {
                throw new Error("ImgBB API key is missing.");
            }

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${apiKey}`,
                {
                    method: "POST",
                    body: imageData,
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error("Image upload failed.");
            }

            setFormData((previous) => ({
                ...previous,
                image: result.data.display_url,
            }));

            toast.success("Cover uploaded", "Your book cover is ready.");
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error(
                "Could not upload the cover",
                error instanceof Error ? error.message : "Please try again."
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.image) {
            toast.error("Cover required", "Please upload a book image before saving.");
            return;
        }

        setIsSubmitting(true);

        try {
            const bookData = {
                ...formData,
                availableCopies: formData.totalCopies,
                addedBy: session?.user?.email,
                addedByName: session?.user?.name,
                addedDate: new Date(),
            };

            const response = await apiFetch("/books", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
});

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add book");
            }

            toast.success(
                "Book added",
                `"${formData.title}" is now part of the BookNook collection.`
            );
            router.push("/my-books");
        } catch (error) {
            console.error("Add book error:", error);
            toast.error(
                "Could not add the book",
                error instanceof Error ? error.message : "Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    if (isPending) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4">
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Checking your session…
                </p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4">
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Redirecting to sign in…
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <header className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                    <BookPlus className="size-4" aria-hidden />
                    Share with the library
                </p>
                <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    Add a new book
                </h1>
                <p className="mt-3 text-muted-foreground">
                    Add a title to the BookNook collection. Members will be able to
                    discover and borrow it right away.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-8"
            >
                <div>
                    <span className={labelClassName}>Book cover</span>

                    <div className="mt-1.5">
                        {formData.image ? (
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-secondary">
                                <Image
                                    src={formData.image}
                                    alt="Book cover preview"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 256px"
                                    className="object-cover"
                                />
                                <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-xs font-medium text-primary-foreground">
                                    Cover ready
                                </span>
                            </div>
                        ) : (
                            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/50 px-4 text-center">
                                <ImagePlus className="size-7 text-muted-foreground" aria-hidden />
                                <p className="text-sm font-medium text-foreground">No cover yet</p>
                                <p className="text-xs text-muted-foreground">
                                    Upload a JPG, PNG, or WebP image.
                                </p>
                            </div>
                        )}
                    </div>

                    <label
                        htmlFor="book-image"
                        className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring/40"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" aria-hidden />
                                Uploading…
                            </>
                        ) : (
                            <>
                                <UploadCloud className="size-4" aria-hidden />
                                {formData.image ? "Replace image" : "Upload image"}
                            </>
                        )}
                    </label>

                    <input
                        id="book-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="sr-only"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="title" className={labelClassName}>
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g. The Midnight Library"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="author" className={labelClassName}>
                            Author
                        </label>
                        <input
                            id="author"
                            type="text"
                            name="author"
                            placeholder="e.g. Matt Haig"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className={labelClassName}>
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className={fieldClassName}
                        >
                            <option value="">Select category</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Kids">Kids</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description" className={labelClassName}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="What is this book about?"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full resize-y rounded-lg border border-border bg-background px-3.5 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="totalCopies" className={labelClassName}>
                            Total copies
                        </label>
                        <input
                            id="totalCopies"
                            type="number"
                            name="totalCopies"
                            min="1"
                            value={formData.totalCopies}
                            onChange={handleChange}
                            required
                            className={fieldClassName}
                        />
                    </div>

                    <p className="self-end text-sm text-muted-foreground sm:pb-3">
                        Available copies will match the total when you add the book.
                    </p>
                    <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="addedByName" className={labelClassName}>
                                Your name
                            </label>
                            <input
                                id="addedByName"
                                type="text"
                                value={session.user.name ?? ""}
                                readOnly
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label htmlFor="addedByEmail" className={labelClassName}>
                                Your email
                            </label>
                            <input
                                id="addedByEmail"
                                type="email"
                                value={session.user.email ?? ""}
                                readOnly
                                className={fieldClassName}
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={() => router.push("/my-books")}
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden />
                                    Adding book…
                                </>
                            ) : (
                                <>
                                    <BookPlus className="size-4" aria-hidden />
                                    Add book
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddBookPage;
