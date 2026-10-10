"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { ArrowLink, CompassRose, container } from "./ui";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Stop = {
  title: string;
  years?: string;
  text: string;
  link?: { label: string; href: string };
  /** Een van de drie richtingen na de splitsing. */
  branch?: boolean;
  /** Positie op de kaart (desktop): CSS `inset` en breedte binnen het 1200×820-vlak. */
  inset: string;
  width: string;
  alignEnd?: boolean;
};

// De kaart is 1200×820 eenheden; de drie richtingen lopen op y = 130, 380 en 630.
const stops: Stop[] = [
  {
    title: "Tweejarige brugklas",
    years: "Leerjaar 1–2",
    text: "We kijken eerst goed op welk niveau je het beste kunt instromen. Daarna heb je twee jaar om te laten zien wat je kunt.",
    link: { label: "Over de brugklas", href: "/onderwijs/tweejarige-brugklas" },
    inset: "calc(46.34% + 1.5rem) auto auto 5%",
    width: "19%",
  },
  {
    title: "Vwo",
    years: "Leerjaar 3–6",
    text: "Het derde leerjaar staat in het teken van een gemotiveerde keuze voor de jaren daarna.",
    link: { label: "Over het vwo", href: "/onderwijs/vwo" },
    branch: true,
    inset: "calc(15.85% + 1.25rem) auto auto 35.8%",
    width: "25%",
  },
  {
    title: "Havo",
    years: "Leerjaar 3–5",
    text: "In het derde leerjaar krijg je nog alle vakken. Daarna werk je toe naar je examen.",
    link: { label: "Over de havo", href: "/onderwijs/havo" },
    branch: true,
    inset: "calc(46.34% + 1.25rem) auto auto 35.8%",
    width: "25%",
  },
  {
    title: "Mavo",
    years: "Leerjaar 3–4",
    text: "In leerjaar 3 en 4 krijg je de lesstof die belangrijk is voor je examen.",
    link: { label: "Over de mavo", href: "/onderwijs/mavo" },
    branch: true,
    inset: "calc(76.83% + 1.25rem) auto auto 35.8%",
    width: "25%",
  },
  {
    title: "Diploma",
    text: "Je sluit af met een Nederlands diploma dat past bij wat jij kunt.",
    inset: "calc(46.34% + 1.5rem) auto auto 73.5%",
    width: "21.5%",
  },
  {
    title: "Vervolgonderwijs",
    text: "Goed voorbereid op je vervolgopleiding en op de maatschappij.",
    inset: "auto 5% calc(53.66% + 1.5rem) auto",
    width: "21.5%",
    alignEnd: true,
  },
];

const TRUNK = "M60 380H300";
const BRANCHES = [
  "M300 380C365 380 365 130 430 130H730C795 130 795 380 860 380",
  "M300 380H860",
  "M300 380C365 380 365 630 430 630H730C795 630 795 380 860 380",
];
const FINISH = "M860 380H1128";

export default function RouteSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: mapRef, offset: ["start 0.8", "end 0.6"] });

  // De lijn wordt in drie etappes getekend: brugklas, de drie richtingen, het slot.
  const trunk = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const branches = useTransform(scrollYProgress, [0.2, 0.72], [0, 1]);
  const finish = useTransform(scrollYProgress, [0.72, 1], [0, 1]);
  const stations = useTransform(scrollYProgress, [0.3, 0.37], [0, 1]);
  const diploma = useTransform(scrollYProgress, [0.7, 0.76], [0, 1]);
  const arrival = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  return (
    <section
      id="opleidingen"
      aria-labelledby="route"
      className="relative isolate scroll-mt-20 overflow-hidden bg-sand py-20 lg:py-32"
    >
      <div className="chart-grid absolute inset-0 -z-10 text-navy" aria-hidden="true" />

      <div className={container}>
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <h2
            id="route"
            className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] lg:col-span-7"
          >
            Jouw route, van brugklas tot diploma.
          </h2>
          <p className="max-w-[52ch] text-lg leading-relaxed text-slate lg:col-span-4 lg:col-start-9 lg:pt-3">
            Iedereen begint in de tweejarige brugklas. Daarna volg je de richting die bij je past: mavo, havo of vwo.
          </p>
        </div>

        <div ref={mapRef} className="relative mt-14 xl:mt-10 xl:aspect-[1200/820]">
          {/* Desktop: de kaart met de getekende route */}
          <svg
            viewBox="0 0 1200 820"
            fill="none"
            aria-hidden="true"
            className="absolute inset-0 hidden h-full w-full xl:block"
          >
            <g stroke="var(--color-navy)" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9">
              <path d={TRUNK} />
              {BRANCHES.map((d) => (
                <path key={d} d={d} />
              ))}
              <path d={FINISH} />
            </g>

            {/* Bij verminderde beweging staat de route er meteen volledig. */}
            <g stroke="var(--color-orange)" strokeWidth="5">
              {still ? (
                <path d={[TRUNK, ...BRANCHES, FINISH].join("")} />
              ) : (
                <>
                  <motion.path d={TRUNK} style={{ pathLength: trunk }} />
                  {BRANCHES.map((d) => (
                    <motion.path key={d} d={d} style={{ pathLength: branches }} />
                  ))}
                  <motion.path d={FINISH} style={{ pathLength: finish }} />
                </>
              )}
            </g>

            {/* Vertrekpunt */}
            <circle cx="60" cy="380" r="9" fill="var(--color-orange)" />
            <circle cx="60" cy="380" r="17" stroke="var(--color-orange)" strokeWidth="1.5" />

            {/* Haltes van de drie richtingen */}
            {[130, 380, 630].map((cy) => (
              <g key={cy}>
                <circle cx="430" cy={cy} r="9" fill="var(--color-sand)" stroke="var(--color-navy)" strokeWidth="2" />
                {still ? (
                  <circle cx="430" cy={cy} r="9" fill="var(--color-orange)" />
                ) : (
                  <motion.circle cx="430" cy={cy} r="9" fill="var(--color-orange)" style={{ opacity: stations }} />
                )}
              </g>
            ))}

            {/* Diploma */}
            <circle cx="860" cy="380" r="13" fill="var(--color-sand)" stroke="var(--color-navy)" strokeWidth="2" />
            <motion.g key={still ? "still" : "moving"} style={still ? undefined : { opacity: diploma }}>
              <circle cx="860" cy="380" r="13" fill="var(--color-orange)" />
              <circle cx="860" cy="380" r="22" stroke="var(--color-orange)" strokeWidth="1.5" />
            </motion.g>

            {/* De route gaat verder */}
            <path d="M1124 366l16 14-16 14" stroke="var(--color-navy)" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <motion.path
              key={still ? "still" : "moving"}
              d="M1122 362l20 18-20 18"
              stroke="var(--color-orange)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={still ? undefined : { opacity: arrival }}
            />
          </svg>

          <CompassRose className="absolute bottom-[4%] right-[3%] hidden h-40 w-40 text-navy/30 xl:block" />

          {/* Mobiel: dezelfde route, verticaal */}
          <div className="absolute bottom-0 left-[7px] top-2 w-0.5 bg-navy/20 xl:hidden" aria-hidden="true">
            {still ? (
              <div className="h-full w-full bg-orange" />
            ) : (
              <motion.div className="h-full w-full origin-top bg-orange" style={{ scaleY: scrollYProgress }} />
            )}
            <svg viewBox="0 0 16 10" fill="none" className="absolute -bottom-0.5 -left-[7px] h-2.5 w-4 text-orange">
              <path d="m2 2 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <ol className="pb-8 xl:pb-0">
            {stops.map((stop) => (
              <li
                key={stop.title}
                style={{ "--inset": stop.inset, "--w": stop.width } as CSSProperties}
                className={`relative pb-10 last:pb-0 xl:absolute xl:w-[var(--w)] xl:pb-0 xl:pl-0 xl:[inset:var(--inset)] ${
                  stop.branch ? "pl-16" : "pl-10"
                } ${stop.alignEnd ? "xl:text-right" : ""}`}
              >
                <span aria-hidden="true" className="xl:hidden">
                  {stop.branch && <span className="absolute left-2 top-[0.8rem] h-0.5 w-5 bg-navy/20" />}
                  <span
                    className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-navy bg-sand ${
                      stop.branch ? "left-6" : "left-0"
                    }`}
                  />
                </span>
                {stop.years && <p className="chart-note text-ember">{stop.years}</p>}
                <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.02em] xl:text-[1.7rem]">
                  {stop.title}
                </h3>
                <p className="mt-2 max-w-[46ch] leading-relaxed text-slate xl:text-[0.95rem]">{stop.text}</p>
                {stop.link && (
                  <div className="mt-1">
                    <ArrowLink href={stop.link.href}>{stop.link.label}</ArrowLink>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
