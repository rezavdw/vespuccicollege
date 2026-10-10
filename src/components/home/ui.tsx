import Link from "next/link";
import type { ReactNode } from "react";

export const container = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

const buttonStyles = {
  accent: "bg-orange text-navy hover:bg-navy hover:text-chalk",
  accentOnDark: "bg-orange text-navy hover:bg-chalk",
  ink: "bg-navy text-chalk hover:bg-chalk hover:text-navy",
  outline: "text-navy ring-1 ring-inset ring-navy/30 hover:bg-navy hover:text-chalk hover:ring-navy",
  outlineOnAccent: "text-navy ring-1 ring-inset ring-navy/45 hover:bg-navy hover:text-chalk hover:ring-navy",
};

export function Button({
  href,
  children,
  variant = "accent",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 py-3 font-display text-[0.95rem] font-semibold transition-colors duration-200 ${buttonStyles[variant]}`}
    >
      {children}
      <ArrowRight className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
    </Link>
  );
}

/** Tekstlink met pijl, voor "lees verder"-achtige verwijzingen. */
export function ArrowLink({
  href,
  children,
  className = "text-ember",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center gap-2 font-display text-[0.95rem] font-semibold underline decoration-current/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-current ${className}`}
    >
      {children}
      <ArrowRight className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
    </Link>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
    >
      <path d="M3.5 10h13M11.5 5l5 5-5 5" />
    </svg>
  );
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
    >
      <path d="M6 14 14.5 5.5M7.5 5.5h7v7" />
    </svg>
  );
}

/** Kompasroos, puur decoratief. Kleur volgt `currentColor`. */
export function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="96" strokeWidth="1" />
      <circle cx="100" cy="100" r="78" strokeWidth="1" strokeDasharray="1 5.8" />
      <circle cx="100" cy="100" r="34" strokeWidth="1" />
      <path d="M100 4v192M4 100h192" strokeWidth="1" />
      <path d="m32 32 136 136M168 32 32 168" strokeWidth="1" opacity=".5" />
      <path d="M100 14 111 89l75 11-75 11-11 75-11-75-75-11 75-11Z" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M100 14 111 89H100Z M186 100l-75 11v-11Z M100 186 89 111h11Z M14 100l75-11v11Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Onzichtbaar ankerpunt voor de doorlopende route (`JourneyLine`). Plaats het met
 * `left-*`/`top-*` binnen een `relative` ouder; alleen actief vanaf `xl`.
 */
export function Waypoint({
  className,
  curve,
  gap,
  origin,
  triggerEl,
  triggerAt,
}: {
  className: string;
  /** Vorm van het stuk ernaartoe: "s" (standaard), "vh" of "hv" voor een bocht. */
  curve?: "s" | "vh" | "hv";
  /** Begin hier een nieuw stuk lijn in plaats van door te trekken. */
  gap?: boolean;
  /** Teken hier het vertrekpunt. */
  origin?: boolean;
  /** Bereik dit punt wanneer de scroll bij dit deel (0–1) van het element met dit id is. */
  triggerEl?: string;
  triggerAt?: number;
}) {
  return (
    <span
      aria-hidden="true"
      data-waypoint=""
      data-curve={curve}
      data-gap={gap ? "" : undefined}
      data-origin={origin ? "" : undefined}
      data-trigger-el={triggerEl}
      data-trigger-at={triggerAt}
      className={`pointer-events-none absolute hidden h-px w-px xl:block ${className}`}
    />
  );
}

const strokes = {
  underline: { src: "/images/brush-underline.png", className: "" },
  swoosh: { src: "/images/brush-swoosh.png", className: "aspect-square" },
};

/**
 * Droge penseelstreek zoals in het logo, puur decoratief. De PNG is een masker,
 * dus de kleur volgt `currentColor`.
 */
export function BrushStroke({
  variant = "underline",
  className = "",
}: {
  variant?: keyof typeof strokes;
  className?: string;
}) {
  const stroke = strokes[variant];
  return (
    <span
      aria-hidden="true"
      style={{ maskImage: `url(${stroke.src})`, WebkitMaskImage: `url(${stroke.src})` }}
      className={`pointer-events-none block bg-current [mask-repeat:no-repeat] [mask-size:100%_100%] ${stroke.className} ${className}`}
    />
  );
}
