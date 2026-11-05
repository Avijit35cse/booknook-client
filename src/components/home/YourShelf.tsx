import Link from "next/link";
import { ArrowRight, BookMarked, Layers, Search } from "lucide-react";

const features = [
  {
    icon: BookMarked,
    title: "Build your collection",
    description:
      "Add the books you love and keep them together in one calm, organised space.",
  },
  {
    icon: Layers,
    title: "Keep it organised",
    description:
      "Group titles by category so every shelf stays easy to browse and revisit.",
  },
  {
    icon: Search,
    title: "Find any title fast",
    description:
      "Search the catalogue and jump back to a favourite in just a couple of clicks.",
  },
];

const YourShelf = () => {
  return (
    <section
      aria-labelledby="your-shelf-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        <div className="absolute -top-24 -right-32 size-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -left-40 size-[26rem] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 [background-image:radial-gradient(circle,rgba(24,61,50,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_left,black,transparent)] lg:block" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase sm:text-sm">
              <span aria-hidden className="h-px w-8 bg-accent/70" />
              Your shelf
            </p>

            <h2
              id="your-shelf-heading"
              className="mt-5 font-heading text-4xl leading-[1.06] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.4rem]"
            >
              A shelf that feels like{" "}
              <span className="relative inline-block text-primary">
                yours.
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[0.09em] w-full rounded-full bg-accent/35"
                />
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Add the books you love, keep your collection organised by
              category, and return to any title whenever you are ready for the
              next chapter.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/books"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_16px_34px_-18px_rgba(24,61,50,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_20px_40px_-18px_rgba(24,61,50,0.75)] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Browse Books
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>

              <Link
                href="/add-book"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-6 py-3.5 text-sm font-semibold text-foreground shadow-xs backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Add a Book
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2.25rem] bg-linear-to-br from-accent/20 via-transparent to-primary/10 blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-primary p-5 shadow-[0_30px_80px_-45px_rgba(24,61,50,0.85)] sm:p-7 lg:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-accent/20 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_55%)]"
              />

              <div className="relative space-y-3">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      key={feature.title}
                      className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.075] sm:p-5"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#F0C9A8] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </span>

                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                          {feature.title}
                        </h3>

                        <p className="mt-1 text-sm leading-relaxed text-primary-foreground/65">
                          {feature.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div
                aria-hidden
                className="relative mt-6 flex h-24 items-end gap-1.5 overflow-hidden pt-5"
              >
                <span className="h-10 w-3 rounded-t-sm bg-accent/80" />
                <span className="h-12 w-3 rounded-t-sm bg-[#F0C9A8]/75" />
                <span className="h-8 w-3 rounded-t-sm bg-primary-foreground/25" />
                <span className="h-11 w-3 rounded-t-sm bg-accent/45" />
                <span className="h-14 w-3 rounded-t-sm bg-primary-foreground/15" />
                <span className="h-9 w-3 rounded-t-sm bg-[#8C9B7A]/80" />

                <span className="ml-auto flex items-center gap-1.5 pb-1">
                  <span className="size-1 rounded-full bg-accent/60" />
                  <span className="size-1 rounded-full bg-accent/40" />
                  <span className="size-1 rounded-full bg-accent/20" />
                </span>

                <span className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-white/20 via-white/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourShelf;
