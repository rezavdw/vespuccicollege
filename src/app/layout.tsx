import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Vespucci College — Ontdek jezelf, creëer je toekomst",
    template: "%s | Vespucci College",
  },
  description:
    "Het Vespucci College op Curaçao biedt hoogwaardig Nederlands onderwijs op mavo, havo en vwo niveau, in kleine klassen met veel persoonlijke aandacht.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Ga naar de inhoud
        </a>
        <Header />
        <main id="inhoud" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
