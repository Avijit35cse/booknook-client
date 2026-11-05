import Link from "next/link";
import { BookOpen, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const CONTACT_EMAIL = "ovicse35@outlook.com";
const WHATSAPP_NUMBER = "01812880953";
const WHATSAPP_URL = "https://wa.me/8801812880953";
const CONTACT_NUMBER = "01934050150";
const LOCATION = "Dhaka, Bangladesh";

// Evaluated once when the module loads (at build time for prerendered pages),
// rather than during render, where Cache Components rejects clock reads.
const CURRENT_YEAR = new Date().getFullYear();

const exploreLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
];

const libraryLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
];

const linkClassName =
    "group relative inline-flex items-center text-sm text-primary-foreground/70 transition-colors duration-300 hover:text-accent focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none";

const columnTitleClassName =
    "flex items-center justify-center gap-2.5 font-heading text-lg font-semibold text-primary-foreground lg:justify-start";

const contactRowClassName =
    "group flex items-start justify-center gap-3 rounded-xl px-2 py-2 text-center transition-colors duration-300 hover:bg-white/[0.045] focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none lg:justify-start lg:text-left";

const contactIconClassName =
    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent/10";

const contactLabelClassName =
    "block text-[10px] font-semibold tracking-[0.18em] text-primary-foreground/60 uppercase";

const contactValueClassName =
    "mt-0.5 block text-sm text-primary-foreground/80 transition-colors duration-300 group-hover:text-accent";

export default function Footer() {
    return (
        <footer className="relative isolate overflow-hidden border-t border-white/[0.06] bg-primary text-primary-foreground">
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 left-1/4 size-[32rem] rounded-full bg-accent/[0.08] blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-52 right-0 size-[34rem] rounded-full bg-[#2A5A4A]/40 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
            />
            <BookOpen
                aria-hidden
                strokeWidth={1}
                className="pointer-events-none absolute -right-12 -bottom-20 size-80 text-white/[0.035]"
            />

            <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-[1.55fr_0.85fr_0.85fr_1.3fr] lg:gap-14 lg:text-left">
                    {/* Brand */}
                    <div className="min-w-0">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
                        >
                            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:-rotate-3 group-hover:border-accent/40 group-hover:bg-white/15">
                                <BookOpen className="size-6" aria-hidden />
                            </span>
                            <span className="font-heading text-2xl font-bold tracking-tight">
                                BookNook
                            </span>
                        </Link>

                        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed break-words text-primary-foreground/70 lg:mx-0">
                            A calm, modern library for discovering, borrowing,
                            and keeping track of the books you love — from your
                            next chapter to the ones worth revisiting.
                        </p>

                        <div
                            aria-hidden
                            className="mx-auto mt-6 h-px w-16 bg-linear-to-r from-accent to-transparent lg:mx-0"
                        />
                    </div>

                    {/* Explore */}
                    <nav aria-label="Explore" className="min-w-0">
                        <h2 className={columnTitleClassName}>
                            <span
                                aria-hidden
                                className="size-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(217,139,82,0.12)]"
                            />
                            Explore
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {exploreLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={linkClassName}
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute -left-3 h-px w-0 bg-accent transition-all duration-300 group-hover:w-2"
                                        />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Your library */}
                    <nav aria-label="Your library" className="min-w-0">
                        <h2 className={columnTitleClassName}>
                            <span
                                aria-hidden
                                className="size-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(217,139,82,0.12)]"
                            />
                            Your Library
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {libraryLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={linkClassName}
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute -left-3 h-px w-0 bg-accent transition-all duration-300 group-hover:w-2"
                                        />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div className="min-w-0">
                        <h2 className={columnTitleClassName}>
                            <span
                                aria-hidden
                                className="size-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(217,139,82,0.12)]"
                            />
                            Contact
                        </h2>

                        <ul className="mt-5 space-y-1.5">
                            <li>
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className={contactRowClassName}
                                >
                                    <span className={contactIconClassName}>
                                        <Mail
                                            className="size-4"
                                            aria-hidden
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span
                                            className={contactLabelClassName}
                                        >
                                            Email
                                        </span>
                                        <span
                                            className={`${contactValueClassName} truncate`}
                                        >
                                            {CONTACT_EMAIL}
                                        </span>
                                    </span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={contactRowClassName}
                                >
                                    <span className={contactIconClassName}>
                                        <MessageCircle
                                            className="size-4"
                                            aria-hidden
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span
                                            className={contactLabelClassName}
                                        >
                                            WhatsApp
                                        </span>
                                        <span className={contactValueClassName}>
                                            {WHATSAPP_NUMBER}
                                        </span>
                                    </span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href={`tel:${CONTACT_NUMBER}`}
                                    className={contactRowClassName}
                                >
                                    <span className={contactIconClassName}>
                                        <Phone
                                            className="size-4"
                                            aria-hidden
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span
                                            className={contactLabelClassName}
                                        >
                                            Contact
                                        </span>
                                        <span className={contactValueClassName}>
                                            {CONTACT_NUMBER}
                                        </span>
                                    </span>
                                </a>
                            </li>

                            <li>
                                <div className={contactRowClassName}>
                                    <span className={contactIconClassName}>
                                        <MapPin
                                            className="size-4"
                                            aria-hidden
                                        />
                                    </span>
                                    <span className="min-w-0">
                                        <span
                                            className={contactLabelClassName}
                                        >
                                            Where to find us
                                        </span>
                                        <span className={contactValueClassName}>
                                            {LOCATION}
                                        </span>
                                        <span className="mt-1 block text-xs leading-relaxed text-primary-foreground/60">
                                            An online-first library based in
                                            Dhaka, Bangladesh, welcoming readers
                                            everywhere.
                                        </span>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center text-xs text-primary-foreground/65 lg:flex-row lg:items-center lg:justify-between lg:text-left">
                    <p>© {CURRENT_YEAR} BookNook. All rights reserved.</p>
                    <span
                        aria-hidden
                        className="hidden h-px w-24 bg-linear-to-r from-accent/60 to-transparent sm:block"
                    />
                </div>
            </div>
        </footer>
    );
}
