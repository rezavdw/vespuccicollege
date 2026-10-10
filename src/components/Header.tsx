"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contact, navigation } from "@/lib/site";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`h-4 w-4 ${className}`}>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenSub(null);
  }

  const isActive = (href: string, children?: { href: string }[]) =>
    href === "/" ? pathname === "/" : pathname === href || !!children?.some((c) => c.href === pathname);

  return (
    <header
      className={`sticky top-0 z-50 bg-chalk/95 backdrop-blur transition-shadow ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Vespucci College — home">
          <Image src="/images/logo.webp" alt="Vespucci College" width={150} height={112} priority className="h-16 w-auto sm:h-[72px]" />
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 font-display text-[15px] font-medium transition-colors hover:text-ember ${
                    isActive(item.href, item.children) ? "text-ember" : "text-navy"
                  }`}
                >
                  {item.label}
                  {item.children && <Chevron className="transition-transform group-hover:rotate-180" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="w-64 overflow-hidden rounded-xl border border-navy/5 bg-white py-2 shadow-xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-5 py-2 text-sm transition-colors hover:bg-cream hover:text-ember ${
                              pathname === child.href ? "text-ember" : "text-navy"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={contact.magister}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-orange px-6 py-2.5 font-display text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white sm:inline-block"
          >
            Magister
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobiel-menu"
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
            className="grid h-11 w-11 place-items-center rounded-full bg-navy text-white xl:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobiel-menu"
          aria-label="Mobiel menu"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-navy/10 bg-white xl:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {navigation.map((item) => (
              <li key={item.label} className="border-b border-navy/5 last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenSub((s) => (s === item.label ? null : item.label))}
                      aria-expanded={openSub === item.label}
                      className="flex w-full items-center justify-between py-3 text-left font-display font-medium text-navy"
                    >
                      {item.label}
                      <Chevron className={`transition-transform ${openSub === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openSub === item.label && (
                      <ul className="mb-3 space-y-1 border-l-2 border-orange pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`block py-1.5 text-sm ${pathname === child.href ? "text-ember" : "text-navy/80"}`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-3 font-display font-medium ${isActive(item.href) ? "text-ember" : "text-navy"}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="px-4 pb-6 sm:hidden">
            <a
              href={contact.magister}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-orange py-3 text-center font-display font-semibold text-navy"
            >
              Magister
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
