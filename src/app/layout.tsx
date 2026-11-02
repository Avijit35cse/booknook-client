import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toast";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookNook | Discover Your Next Read",
    template: "%s | BookNook",
  },
  description:
    "Discover, borrow, and manage your favorite books with BookNook.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, playfair.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Navbar></Navbar>
        <main className="flex-1">
          {children}
        </main>
        <Footer></Footer>
        <Toaster />
        </body>
    </html>
  );
}
