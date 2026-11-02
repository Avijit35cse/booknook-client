"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import {
  Swiper,
  SwiperSlide,
  type SwiperClass,
} from "swiper/react";

import "swiper/css";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "cream" | "forest" | "sand";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  theme: Theme;
  books: [string, string, string];
};

const slides: Slide[] = [
  {
    eyebrow: "Your next chapter",
    title: "Every book you borrow, in one place.",
    description:
      "Browse the BookNook catalogue and borrow the stories you want to read next — no queues, no clutter.",
    theme: "cream",
    books: [
      "from-primary to-[#0F2A22]",
      "from-accent to-[#B26C3A]",
      "from-[#41604F] to-primary",
    ],
  },
  {
    eyebrow: "Your shelf",
    title: "A shelf that remembers what you love.",
    description:
      "Add the books you own, keep them organised, and make your collection easy to find again.",
    theme: "forest",
    books: [
      "from-[#F8F6F0] to-[#E3DED0]",
      "from-accent to-[#B26C3A]",
      "from-[#41705C] to-[#1E4A3D]",
    ],
  },
  {
    eyebrow: "Borrow with confidence",
    title: "Know what's due, before it's due.",
    description:
      "Follow your borrows in one calm list and plan your next read without losing track of a single page.",
    theme: "sand",
    books: [
      "from-[#2A4A3E] to-primary",
      "from-[#E8B27F] to-accent",
      "from-[#8C9B7A] to-[#4F6350]",
    ],
  },
];

const themeStyles: Record<
  Theme,
  {
    section: string;
    eyebrow: string;
    body: string;
    arch: string;
    glow: string;
    cta: string;
    rule: string;
  }
> = {
  cream: {
    section: "bg-background text-foreground",
    eyebrow: "text-accent",
    body: "text-muted-foreground",
    arch: "border-border/70 bg-secondary/60",
    glow: "bg-accent/15",
    cta: "",
    rule: "bg-border",
  },
  forest: {
    section: "bg-primary text-primary-foreground",
    eyebrow: "text-[#F0C9A8]",
    body: "text-primary-foreground/75",
    arch: "border-white/10 bg-white/5",
    glow: "bg-accent/20",
    cta: "bg-background text-foreground hover:bg-background/90",
    rule: "bg-white/20",
  },
  sand: {
    section: "bg-secondary text-secondary-foreground",
    eyebrow: "text-accent",
    body: "text-muted-foreground",
    arch: "border-border/70 bg-background/60",
    glow: "bg-primary/10",
    cta: "",
    rule: "bg-border",
  },
};

function Book({
  cover,
  className,
  delay,
}: {
  cover: string;
  className?: string;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-linear-to-br shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] ring-1 ring-black/10 transition-transform duration-500 ease-out group-hover/art:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none",
        cover,
        className,
      )}
      style={{ transitionDelay: delay }}
    >
      <span aria-hidden className="absolute inset-y-0 left-2 w-px bg-white/30" />
      <span aria-hidden className="absolute inset-y-0 left-3.5 w-px bg-black/15" />
      <BookOpen
        aria-hidden
        className="absolute top-5 left-1/2 size-5 -translate-x-1/2 text-white/80"
      />
      <div aria-hidden className="absolute inset-x-4 bottom-5 space-y-2">
        <span className="block h-px w-3/4 bg-white/45" />
        <span className="block h-px w-1/2 bg-white/30" />
      </div>
    </div>
  );
}

function BookStack({ books, theme }: { books: Slide["books"]; theme: Theme }) {
  return (
    <div
      aria-hidden
      className="group/art relative mx-auto w-full max-w-[20rem] sm:max-w-[22rem]"
    >
      <div
        className={cn(
          "absolute inset-x-4 top-0 bottom-8 rounded-t-[12rem] border",
          themeStyles[theme].arch,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -inset-6 rounded-full blur-3xl",
          themeStyles[theme].glow,
        )}
      />

      <div className="relative flex items-end justify-center gap-3 px-2 pt-10 pb-10 sm:gap-4">
        <Book
          cover={books[0]}
          delay="0ms"
          className="h-52 w-20 -rotate-6 sm:h-64 sm:w-24"
        />
        <Book
          cover={books[1]}
          delay="60ms"
          className="h-60 w-24 sm:h-72 sm:w-28"
        />
        <Book
          cover={books[2]}
          delay="120ms"
          className="h-52 w-20 rotate-6 sm:h-60 sm:w-24"
        />
      </div>

      <div
        className={cn(
          "absolute inset-x-8 bottom-6 h-6 rounded-full blur-xl",
          theme === "forest" ? "bg-black/30" : "bg-primary/15",
        )}
      />
    </div>
  );
}

export function HeroSlider() {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!swiper || reduceMotion || hovered || focused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (!document.hidden) {
        swiper.slideNext();
      }
    }, 6000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, focused, hovered, reduceMotion, swiper]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      swiper?.slidePrev();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      swiper?.slideNext();
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(false);
    }
  }

  return (
    <section
      aria-label="Featured BookNook highlights"
      className="relative border-b border-border/60 bg-background"
    >
      <h1 className="sr-only">
        BookNook — discover, borrow and track your next read
      </h1>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="BookNook highlights"
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={handleBlur}
      >
        <Swiper
          loop
          speed={reduceMotion ? 0 : 650}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          className="w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              className="h-auto"
            >
              <div
                className={cn(
                  "relative isolate overflow-hidden",
                  themeStyles[slide.theme].section,
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-24 -right-24 size-80 rounded-full blur-3xl",
                    themeStyles[slide.theme].glow,
                  )}
                />

                <div className="mx-auto grid min-h-[34rem] w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[38rem] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-20">
                  <div className="relative max-w-xl">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase",
                        themeStyles[slide.theme].eyebrow,
                      )}
                    >
                      <Sparkles className="size-3.5" aria-hidden />
                      {slide.eyebrow}
                    </span>

                    <h2 className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>

                    <p
                      className={cn(
                        "mt-5 max-w-lg text-base leading-relaxed sm:text-lg",
                        themeStyles[slide.theme].body,
                      )}
                    >
                      {slide.description}
                    </p>

                    <div
                      aria-hidden
                      className={cn(
                        "mt-8 h-px w-16",
                        themeStyles[slide.theme].rule,
                      )}
                    />

                    <div className="mt-8">
                      <Link
                        href="/books"
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "group/cta",
                          themeStyles[slide.theme].cta,
                        )}
                      >
                        Browse Books
                        <ArrowRight
                          aria-hidden
                          className="transition-transform duration-300 group-hover/cta:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                        />
                      </Link>
                    </div>
                  </div>

                  <BookStack books={slide.books} theme={slide.theme} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}: {slides[activeIndex].eyebrow}
      </p>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-6 pb-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => swiper?.slideToLoop(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                activeIndex === index
                  ? "w-10 bg-primary"
                  : "w-4 bg-foreground/15 hover:bg-foreground/30",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden font-heading text-sm text-muted-foreground tabular-nums sm:block">
            <span className="text-foreground">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mx-1 text-border">/</span>
            {String(slides.length).padStart(2, "0")}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous slide"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next slide"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
