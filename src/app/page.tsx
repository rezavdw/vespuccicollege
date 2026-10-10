import type { Metadata } from "next";
import ClosingCta from "@/components/home/ClosingCta";
import Hero from "@/components/home/Hero";
import KeyFigures, { type KeyFigure } from "@/components/home/KeyFigures";
import QuickLinks from "@/components/home/QuickLinks";
import Relocation from "@/components/home/Relocation";
import RouteSection from "@/components/home/RouteSection";
import SchoolLife from "@/components/home/SchoolLife";
import Team from "@/components/home/Team";
import Voices from "@/components/home/Voices";
import WhyVespucci from "@/components/home/WhyVespucci";
import { SITE_URL, contact } from "@/lib/site";

const title = "Vespucci College — Nederlands onderwijs op Curaçao";
const description =
  "Mavo, havo en vwo met een Nederlands diploma op Curaçao. Kleine klassen, veel persoonlijke begeleiding en rust in de les. Ontdek jezelf, creëer je toekomst.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: "Vespucci College",
    title,
    description,
    images: [
      {
        url: "/images/home-mobile-scaled.jpg",
        width: 2560,
        height: 1673,
        alt: "Leerlingen van het Vespucci College voor de schoolmuur met het logo",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  name: "Vespucci College",
  slogan: "Ontdek jezelf, creëer je toekomst.",
  url: SITE_URL,
  telephone: contact.phoneHref.replace("tel:", ""),
  email: contact.email,
  foundingDate: "1999",
  image: `${SITE_URL}/images/home-mobile-scaled.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    addressLocality: contact.locality,
    addressCountry: "CW",
  },
  sameAs: [contact.facebook],
};

// TODO: slagingspercentage, klassengrootte en leerlingaantal laten aanleveren door de school.
const keyFigures: KeyFigure[] = [
  { label: "Slagingspercentage" },
  { label: "Gemiddelde klassengrootte" },
  { label: "Leerlingen" },
  { label: "Opgericht", value: "1999" },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Zonder JavaScript blijft alles zichtbaar. */}
      <noscript>
        <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
      </noscript>

      <Hero />
      <QuickLinks />
      <WhyVespucci />
      <RouteSection />
      <Relocation />
      <SchoolLife />
      <Voices />
      <Team />
      <KeyFigures figures={keyFigures} />
      <ClosingCta />
    </>
  );
}
