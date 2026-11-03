
import Link from "next/link";
export const instant = false;

export const dynamic = "force-dynamic";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  image: string;
  availableCopies: number;
  dateAdded?: string;
  createdAt?: string;
}

const NewArrivals = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch new arrivals");
  }

  const books: Book[] = await response.json();

  // Latest books first
  const latestBooks = [...books]
    .sort((a, b) => {
      const dateA = new Date(
        a.dateAdded || a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.dateAdded || b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Fresh from our shelves
          </p>

          <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            New Arrivals
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Discover the latest books added to our library
            and find your next favourite read.
          </p>
        </div>

        {/* Book Cards */}
        {latestBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {latestBooks.map((book) => (
              <div
                key={book._id}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Book Image */}
                <div className="h-64 overflow-hidden bg-secondary">
                  {book.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Book Information */}
                <div className="flex flex-col p-5">
                  <span className="mb-3 w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {book.category}
                  </span>

                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    By {book.author}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {book.description}
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-5 inline-flex w-fit items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            No books available yet.
          </p>
        )}

        {/* See All Books Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/books"
            className="rounded-md bg-primary px-7 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            See All Books →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NewArrivals;
