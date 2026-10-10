import Link from "next/link";
import { contact } from "@/lib/site";
import { ArrowUpRight, container } from "./ui";

const links = [
  { label: "Magister", href: contact.magister, external: true },
  { label: "Roosters", href: "/onderwijs/roosters" },
  { label: "Examenrooster", href: "/onderwijs/examenrooster" },
  { label: "Agenda", href: "/agenda" },
  { label: "Boekenlijst", href: "/onderwijs/boekenlijst" },
  { label: "Verlof aanvragen", href: "/aanmelding-info/verlof-aanvragen" },
];

const linkClass =
  "flex min-h-12 items-center gap-1.5 px-3 font-display text-[0.95rem] font-medium text-chalk underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors hover:text-orange hover:decoration-orange lg:px-4";

export default function QuickLinks() {
  return (
    <nav aria-labelledby="snelkoppelingen" className="bg-navy text-chalk">
      <div className={`${container} flex flex-col gap-x-8 py-3 lg:flex-row lg:items-center lg:py-2`}>
        <h2 id="snelkoppelingen" className="chart-note shrink-0 py-2 font-sans text-mist">
          Voor leerlingen en ouders
        </h2>
        <ul className="-mx-3 grid flex-1 grid-cols-2 sm:grid-cols-3 lg:mx-0 lg:flex lg:flex-wrap lg:justify-end">
          {links.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-orange" />
                  <span className="sr-only">(opent in een nieuw tabblad)</span>
                </a>
              ) : (
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
