"use client";
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type BookFormData = {
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    totalCopies: number;
};

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
    const [uploadError, setUploadError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

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
            setUploadError("Please select an image file.");
            return;
        }

        if (file.size > 32 * 1024 * 1024) {
            setUploadError("Image size must be less than 32 MB.");
            return;
        }

        setIsUploading(true);
        setUploadError("");

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

        } catch (error) {
            console.error("Image upload error:", error);
            setUploadError(
                error instanceof Error ? error.message : "Image upload failed."
            );
        } finally {
            setIsUploading(false);
        }
    };


    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.image) {
            setSubmitError("Please upload a book image.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const bookData = {
                ...formData,
                availableCopies: formData.totalCopies,
                addedBy: session?.user?.email,
                addedByName: session?.user?.name,
                addedDate: new Date(),
            };

            const response = await fetch("http://localhost:5000/books", {
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

            console.log("Book added successfully:", result);
            router.push("/my-books");

        } catch (error) {
            console.error("Add book error:", error);
            setSubmitError(
                error instanceof Error ? error.message : "Failed to add book"
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
        return <p>Checking authentication...</p>;
    }

    if (!session) {
        return <p>Redirecting to Sign In...</p>;
    }

    return (
        <div>
            <h1>Add New Book</h1>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Book Title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="author"
                    placeholder="Author Name"
                    value={formData.author}
                    onChange={handleChange}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                {isUploading && <p>Uploading image...</p>}

                {uploadError && <p>{uploadError}</p>}

                {formData.image && (
                    <div>
                        <p>Image uploaded successfully!</p>
                        <Image src={formData.image} alt="Book preview" width={120} height={160} />
                    </div>
                )}

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                </select>

                <textarea
                    name="description"
                    placeholder="Book Description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="totalCopies"
                    min="1"
                    value={formData.totalCopies}
                    onChange={handleChange}
                />
                {submitError && <p>{submitError}</p>}
                <button type="submit" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? "Adding Book..." : "Add Book"}
                </button>
            </form>
        </div>
    );
};

export default AddBookPage;