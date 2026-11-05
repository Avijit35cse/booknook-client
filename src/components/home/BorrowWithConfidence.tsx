import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find your next read",
    description:
      "Browse the catalogue and open any title to see its details and availability.",
  },
  {
    icon: BookOpen,
    title: "Borrow in a click",
    description:
      "Confirm your borrow and the available copies update straight away.",
  },
  {
    icon: CalendarCheck,
    title: "Return on time",
    description:
      "Follow due dates in My Borrows and return a book once you are finished.",
  },
];

const BorrowWithConfidence = () => {
  return (
    <section
      aria-labelledby="borrow-confidence-heading"
      className="relative overflow-hidden bg-secondary py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/15 to-transparent" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(24,61,50,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,61,50,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.22em] text-accent uppercase sm:text-sm">
            <span aria-hidden className="h-px w-8 bg-accent/70" />
            Borrow with confidence
            <span aria-hidden className="h-px w-8 bg-accent/70" />
          </p>

          <h2
            id="borrow-confidence-heading"
            className="mt-5 font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-secondary-foreground sm:text-5xl"
          >
            Know what you borrowed, and when it is due.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every borrow is recorded with its borrow and return dates, so your
            next read never slips past you.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-[0_1px_2px_rgba(24,61,50,0.04),0_18px_40px_-32px_rgba(24,61,50,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_26px_60px_-32px_rgba(24,61,50,0.4)] sm:p-7"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-8 top-0 h-px origin-center scale-x-0 bg-linear-to-r from-transparent via-accent/70 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />

                <Icon
                  aria-hidden
                  className="pointer-events-none absolute -right-5 -bottom-5 -z-10 size-28 text-primary/[0.035] transition-colors duration-500 group-hover:text-accent/[0.06]"
                />

                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-[#2A5A4A] text-primary-foreground shadow-[0_12px_24px_-14px_rgba(24,61,50,0.8)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                    <Icon className="size-5" aria-hidden />
                  </span>

                  <span className="font-heading text-3xl leading-none font-semibold text-primary/10 tabular-nums transition-colors duration-300 group-hover:text-accent/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                <span aria-hidden className="mt-auto block pt-6">
                  <span className="block h-px w-full bg-linear-to-r from-border via-border/70 to-transparent transition-colors duration-300 group-hover:from-accent/50 group-hover:via-accent/20" />
                </span>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
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
            href="/my-borrows"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/80 px-6 py-3.5 text-sm font-semibold text-foreground shadow-xs backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            View My Borrows
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BorrowWithConfidence;
