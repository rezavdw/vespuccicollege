import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met het Vespucci College op Curaçao: stuur een bericht, bel of kom langs in Julianadorp.",
  alternates: { canonical: "/contact" },
};

const MAP_EMBED = "https://maps.google.com/maps?q=vespucci%20college&t=m&z=13&output=embed&iwloc=near";

const icon = "h-5 w-5 shrink-0 text-orange";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const details = [
  {
    label: "Telefoonnummer",
    value: contact.phone,
    href: contact.phoneHref,
    path: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15 15 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z",
  },
  {
    label: "Adres",
    value: `${contact.street}, ${contact.locality}, ${contact.country}`,
    href: contact.maps,
    external: true,
    path: "M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  },
  {
    label: "E-mail",
    value: contact.email,
    href: `mailto:${contact.email}`,
    path: "M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-navy/10 bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate">
            <Link href="/" className="hover:text-ember hover:underline">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-navy">
              Contact
            </span>
          </nav>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Contact</h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-slate">
            Een vraag over aanmelden, verhuizen of de school? Stuur ons een bericht, bel of kom langs.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-x-16 gap-y-14 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <section aria-labelledby="formulier" className="lg:col-span-7">
          <h2 id="formulier" className="text-3xl font-semibold tracking-[-0.02em]">
            Contactformulier
          </h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>

        <aside aria-labelledby="gegevens" className="lg:col-span-5">
          <div className="bg-navy p-8 text-chalk sm:p-10">
            <h2 id="gegevens" className="text-2xl font-semibold tracking-[-0.02em]">
              Contactgegevens
            </h2>
            <ul className="mt-8 space-y-7">
              {details.map((item) => (
                <li key={item.label} className="flex gap-4">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={`mt-0.5 ${icon}`} {...stroke}>
                    <path d={item.path} />
                  </svg>
                  <div>
                    <p className="chart-note text-mist">{item.label}</p>
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-1 inline-block text-lg underline decoration-chalk/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-orange"
                    >
                      {item.value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <iframe
            src={MAP_EMBED}
            title="Kaart: Vespucci College, Julianadorp"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-72 w-full border border-t-0 border-navy/15"
          />
        </aside>
      </div>
    </>
  );
}
