import { BookOpen } from "lucide-react";

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-9 w-52 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
            <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-full flex flex-col items-center justify-center gap-3 py-6">
                    <div className="relative flex size-16 items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/15" />
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                        <BookOpen className="size-6 text-primary" />
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">
                        Loading books...
                    </p>
                </div>
                {skeletonCards.map((card) => (
                    <div
                        key={card}
                        className="overflow-hidden rounded-2xl border border-border bg-card"
                    >
                        <div className="aspect-[3/4] animate-pulse bg-muted" />
                        <div className="space-y-3 p-5">
                            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                            <div className="h-4 w-full animate-pulse rounded bg-muted" />
                            <div className="h-10 w-full animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
