import type { Metadata } from "next";
import Link from "next/link";
import InventoryForm from "@/components/InventoryForm";
import { contact, navigation } from "@/lib/site";

const href = "/aanmelding-info/inventarisatieformulier";

export const metadata: Metadata = {
  title: "Inventarisatieformulier",
  description: "Geef door of uw kind volgend schooljaar leerling van het Vespucci College blijft.",
  alternates: { canonical: href },
};

export default function InventoryPage() {
  const section = navigation.find((item) => item.children?.some((child) => child.href === href));

  return (
    <>
      <section className="border-b border-navy/10 bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate">
            <Link href="/" className="hover:text-ember hover:underline">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            {section && (
              <>
                <span>{section.label}</span>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span aria-current="page" className="text-navy">
              Inventarisatieformulier
            </span>
          </nav>
          <h1 className="max-w-4xl hyphens-auto text-[1.85rem] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Inventarisatieformulier
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-slate">
            Laat ons weten of uw kind volgend schooljaar leerling van het Vespucci College blijft. Invullen duurt een
            minuut.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8 lg:py-16">
        <article className="min-w-0 max-w-2xl">
          <InventoryForm />
        </article>

        <aside className="min-w-0 lg:border-l lg:border-navy/10 lg:pl-8">
          <div className="sticky top-28">
            <nav aria-label={section?.label ?? "Pagina's"}>
              <p className="mb-4 font-display text-lg font-semibold">{section?.label ?? "Vespucci College"}</p>
              <ul className="space-y-1">
                {(section?.children ?? []).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.href === href ? "page" : undefined}
                      className={`block border-l-2 px-4 py-3 text-sm transition-colors ${
                        item.href === href
                          ? "border-orange bg-sand font-semibold text-navy"
                          : "border-transparent text-slate hover:border-orange hover:bg-sand"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 border-t border-navy/10 pt-6 text-sm leading-relaxed text-slate">
              <p className="font-display text-base font-semibold text-navy">Vragen over het formulier?</p>
              <p className="mt-2">
                Bel{" "}
                <a href={contact.phoneHref} className="font-semibold text-ember underline underline-offset-4">
                  {contact.phone}
                </a>{" "}
                of mail{" "}
                <a href={`mailto:${contact.email}`} className="font-semibold text-ember underline underline-offset-4">
                  {contact.email}
                </a>
                .
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
