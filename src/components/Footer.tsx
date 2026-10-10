import Image from "next/image";
import Link from "next/link";
import { contact } from "@/lib/site";

const linkClass =
  "inline-flex min-h-11 items-center underline decoration-chalk/30 decoration-1 underline-offset-[6px] transition-colors hover:text-orange hover:decoration-orange";

export default function Footer() {
  return (
    <footer className="bg-navy text-chalk">
      <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="font-display text-3xl font-semibold tracking-[-0.02em]">Vespucci College</p>
          <p className="mt-3 max-w-xs text-lg leading-relaxed text-mist">Ontdek jezelf, creëer je toekomst.</p>
          <p className="chart-note mt-8 text-mist">
            {contact.locality}, {contact.country} <span aria-hidden="true">· {contact.coordinates}</span>
          </p>
        </div>

        <div className="lg:col-span-3">
          <h2 className="chart-note font-sans text-mist">Adres</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {contact.street}
            <br />
            {contact.locality}, {contact.country}
          </address>
          <a href={contact.maps} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Bekijk op Google Maps<span className="sr-only"> (opent in een nieuw tabblad)</span>
          </a>
        </div>

        <div className="lg:col-span-4">
          <h2 className="chart-note font-sans text-mist">Contact</h2>
          <ul className="mt-1">
            <li>
              <a href={contact.phoneHref} className={linkClass}>
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className={linkClass}>
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Vespucci College op Facebook<span className="sr-only"> (opent in een nieuw tabblad)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-5 py-8 sm:px-8 lg:justify-between lg:px-12">
          <Image src="/images/nat.keurmerk.png" alt="Nationaal keurmerk" width={560} height={230} sizes="140px" className="h-14 w-auto" />
          <Image src="/images/logo-nob-ves.png" alt="Stichting NOB" width={560} height={230} sizes="140px" className="h-14 w-auto" />
          <Image
            src="/images/min_ocw_logo-scaled.png"
            alt="Ministerie van Onderwijs, Cultuur en Wetenschap"
            width={2560}
            height={943}
            sizes="140px"
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-x-8 gap-y-2 px-5 py-5 text-sm text-mist sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <nav aria-label="Footermenu">
          <ul className="flex gap-6">
            {[
              { label: "Home", href: "/" },
              { label: "Agenda", href: "/agenda" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center transition-colors hover:text-orange">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>© {new Date().getFullYear()} Vespucci College</p>
      </div>
    </footer>
  );
}
