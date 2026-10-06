import Image from "next/image";
import Link from "next/link";
import { contact } from "@/lib/site";

const items = [
  { label: "Telefoon", value: contact.phone, href: contact.phoneHref, icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" },
  { label: "E-mail", value: contact.email, href: `mailto:${contact.email}`, icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
  { label: "Adres", value: contact.address, href: "https://maps.google.com/?q=Vespucci+College+St.Michielsweg+14+Julianadorp+Curacao", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
  { label: "Facebook", value: "Vespucci College op Facebook", href: contact.facebook, icon: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => {
          const external = item.href.startsWith("http");
          return (
            <a
              key={item.label}
              href={item.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start gap-4"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-orange transition-colors group-hover:bg-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">{item.label}</span>
                <span className="block break-words text-sm text-white/75 group-hover:text-white">{item.value}</span>
              </span>
            </a>
          );
        })}
      </div>

      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <Image src="/images/nat.keurmerk.png" alt="Nationaal keurmerk" width={560} height={230} className="h-14 w-auto" />
          <Image src="/images/logo-nob-ves.png" alt="Stichting NOB" width={560} height={230} className="h-14 w-auto" />
          <Image src="/images/min_ocw_logo-scaled.png" alt="Ministerie van Onderwijs, Cultuur en Wetenschap" width={2560} height={943} className="h-12 w-auto" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white/70 sm:flex-row sm:px-6 lg:px-8">
          <nav aria-label="Footermenu" className="flex gap-6">
            <Link href="/" className="hover:text-orange">Home</Link>
            <Link href="/agenda" className="hover:text-orange">Agenda</Link>
            <Link href="/contact" className="hover:text-orange">Contact</Link>
          </nav>
          <p>Vespucci College — {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
