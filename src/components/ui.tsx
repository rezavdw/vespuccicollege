import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-3 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] ${
        light ? "text-sun" : "text-orange"
      }`}
    >
      <span className="h-0.5 w-8 rounded-full bg-current" aria-hidden="true" />
      {children}
    </p>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "orange",
}: {
  href: string;
  children: ReactNode;
  variant?: "orange" | "navy" | "white";
}) {
  const styles = {
    orange: "bg-orange text-white hover:bg-navy",
    navy: "bg-navy text-white hover:bg-orange",
    white: "bg-white text-navy hover:bg-orange hover:text-white",
  }[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold transition-[color,background-color,box-shadow] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange ${styles}`}
    >
      {children}
      <Arrow className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`h-4 w-4 ${className}`}>
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}
