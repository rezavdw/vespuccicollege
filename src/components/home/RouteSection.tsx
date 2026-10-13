"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLink, BrushStroke, CompassRose, Waypoint, container } from "./ui";
import useHydrated from "./useHydrated";
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

// Etappes van de route als deel (0–1) van de scroll: splitsing, diploma, aankomst.
const FORK = 0.2;
const DIPLOMA = 0.72;
const ARRIVAL = 0.965;
const STATION_X = 430;
const ALL = "111111";

/** Scheepje van bovenaf, met de boeg naar rechts; draait mee met de koers. */
function Vessel({ innerRef }: { innerRef: (node: SVGGElement | null) => void }) {
  return (
    <g ref={innerRef} opacity="0">
      <path
        d="M14 0C9-6.5-6-7.5-11-5.5V5.5C-6 7.5 9 6.5 14 0Z"
        fill="var(--color-navy)"
        stroke="var(--color-sand)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M-5 0H6" stroke="var(--color-orange)" strokeWidth="1.75" strokeLinecap="round" />
    </g>
  );
}

const rays = Array.from({ length: 16 }, (_, i) => i);

export default function RouteSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const sidePaths = useRef<(SVGPathElement | null)[]>([]);
  const vessels = useRef<(SVGGElement | null)[]>([]);
  const flags = useRef(ALL);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: mapRef, offset: ["start 0.6", "0.8 0.6"] });
  // Een lichte veer, zodat de scheepjes glijden in plaats van met het scrollwiel mee te schokken.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });

  // Welke haltes al bereikt zijn; zonder JavaScript en bij verminderde beweging allemaal.
  const [progressed, setReached] = useState(ALL);
  const reached = still ? ALL : progressed;
  const armed = useHydrated() && !still;
  // Richting (0–2) waar de bezoeker op dit moment naar kijkt.
  const [focus, setFocus] = useState<number | null>(null);

  // De lijn wordt in drie etappes getekend: brugklas, de drie richtingen, het slot.
  const trunk = useTransform(progress, [0, FORK], [0, 1]);
  const branches = useTransform(progress, [FORK, DIPLOMA], [0, 1]);
  const finish = useTransform(progress, [DIPLOMA, 1], [0, 1]);
  const arrival = useTransform(progress, [0.95, 1], [0, 1]);
  const bearing = useSpring(useTransform(scrollYProgress, [0, 1], [-120, 0]), { stiffness: 60, damping: 9 });

  const place = useCallback((p: number) => {
    const map = mapRef.current;
    if (!map) return;
    const onBranch = Math.min(1, Math.max(0, (p - FORK) / (DIPLOMA - FORK)));
    let next: boolean[];

    if (window.matchMedia("(min-width: 1280px)").matches) {
      // Het middelste scheepje vaart de rechte lijn: brugklas, havo, diploma en verder.
      const x =
        p < FORK ? 60 + 240 * (p / FORK) : p < DIPLOMA ? 300 + 560 * onBranch : 860 + 268 * ((p - DIPLOMA) / (1 - DIPLOMA));
      const main = vessels.current[1];
      main?.setAttribute("transform", `translate(${x.toFixed(1)} 380)`);
      main?.setAttribute("opacity", p <= 0.002 ? "0" : String(Math.min(1, Math.max(0, (0.985 - p) / 0.03))));

      const side = [0, 2].map((i) => {
        const path = sidePaths.current[i];
        const vessel = vessels.current[i];
        if (!path || !vessel) return false;
        const at = path.getTotalLength() * onBranch;
        const a = path.getPointAtLength(at);
        const b = path.getPointAtLength(at + 2);
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        vessel.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
        vessel.setAttribute("opacity", onBranch > 0.01 && onBranch < 0.995 ? "1" : "0");
        return onBranch > 0 && a.x >= STATION_X;
      });
      next = [p > 0.004, side[0], x >= STATION_X, side[1], p >= DIPLOMA, p >= ARRIVAL];
    } else {
      // Mobiel: een halte is bereikt zodra de verticale lijn bij het bolletje is.
      const items = listRef.current ? [...listRef.current.children] : [];
      const tip = p >= 0.999 ? Infinity : p * map.offsetHeight;
      next = items.map((item) => (item as HTMLElement).offsetTop + 8 <= tip);
    }

    const value = next.map((on) => (on ? "1" : "0")).join("");
    if (value !== flags.current) {
      flags.current = value;
      setReached(value);
    }
  }, []);

  useMotionValueEvent(progress, "change", place);

  useEffect(() => {
    if (still) return;
    place(progress.get());
    const onResize = () => place(progress.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [still, place, progress]);

  const on = (i: number) => reached[i] === "1";
  const branchOf = (i: number) => (i >= 1 && i <= 3 ? i - 1 : null);

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

        <div ref={mapRef} id="routekaart" className="relative mt-14 xl:mt-10 xl:aspect-[1200/820]">
          {/* De doorlopende route komt bij het vertrekpunt binnen en gaat bij de pijl weer verder. */}
          <Waypoint className="-left-7 top-[calc(46.34%-6rem)]" triggerEl="routekaart" triggerAt={-0.12} />
          <Waypoint className="left-[5%] top-[46.34%]" curve="vh" triggerEl="routekaart" triggerAt={0} />
          <Waypoint className="left-[95%] top-[46.34%]" gap triggerEl="routekaart" triggerAt={0.8} />
          <Waypoint className="-right-7 top-[calc(46.34%+6rem)]" curve="hv" triggerEl="routekaart" triggerAt={0.95} />
          {/* Desktop: de kaart met de getekende route */}
          <svg
            viewBox="0 0 1200 820"
            fill="none"
            aria-hidden="true"
            className="absolute inset-0 hidden h-full w-full xl:block"
          >
            <g stroke="var(--color-navy)" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9">
              <path d={TRUNK} />
              {BRANCHES.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  ref={(node) => {
                    sidePaths.current[i] = node;
                  }}
                />
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
                  {BRANCHES.map((d, i) => (
                    <motion.path
                      key={d}
                      d={d}
                      className="route-branch"
                      data-dim={focus !== null && focus !== i ? "" : undefined}
                      data-lit={focus === i ? "" : undefined}
                      style={{ pathLength: branches }}
                    />
                  ))}
                  <motion.path d={FINISH} style={{ pathLength: finish }} />
                </>
              )}
            </g>

            {/* Vertrekpunt */}
            <g transform="translate(60 380)" data-on={on(0) ? "" : undefined}>
              <circle r="17" stroke="var(--color-orange)" strokeWidth="2" className="route-ping" />
              <circle r="9" fill="var(--color-orange)" />
              <circle r="17" stroke="var(--color-orange)" strokeWidth="1.5" />
            </g>

            {/* Haltes van de drie richtingen */}
            {[130, 380, 630].map((cy, i) => (
              <g key={cy} transform={`translate(${STATION_X} ${cy})`} data-on={on(i + 1) ? "" : undefined}>
                <circle r="9" stroke="var(--color-orange)" strokeWidth="2" className="route-ping" />
                <circle r="9" fill="var(--color-sand)" stroke="var(--color-navy)" strokeWidth="2" />
                <circle r="9" fill="var(--color-orange)" className="route-dot" />
              </g>
            ))}

            {/* Diploma: de drie richtingen komen samen en het zegel wordt gezet. */}
            <g transform="translate(860 380)" data-on={on(4) ? "" : undefined}>
              {[0, 1, 2].map((i) => (
                <circle
                  key={i}
                  r="16"
                  stroke="var(--color-orange)"
                  strokeWidth="2"
                  className="route-ping"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
              <g stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round">
                {rays.map((i) => (
                  <path
                    key={i}
                    d={`M25 0H${i % 2 ? 31 : 37}`}
                    pathLength="1"
                    transform={`rotate(${i * 22.5})`}
                    className="route-ray"
                    style={{ transitionDelay: `${120 + i * 22}ms` }}
                  />
                ))}
              </g>
              <circle r="16" fill="var(--color-sand)" stroke="var(--color-navy)" strokeWidth="2" />
              <g className="route-seal">
                <circle r="16" fill="var(--color-orange)" />
                <path d="M0-10 2.4-2.4 10 0 2.4 2.4 0 10-2.4 2.4-10 0-2.4-2.4Z" fill="var(--color-navy)" />
              </g>
            </g>

            {/* De route gaat verder */}
            <path d="M1124 366l16 14-16 14" stroke="var(--color-navy)" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <motion.path
              key={still ? "arrow-still" : "arrow-moving"}
              d="M1122 362l20 18-20 18"
              stroke="var(--color-orange)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={still ? undefined : { opacity: arrival }}
            />

            {/* Eén scheepje vertrekt, drie varen elk hun richting en komen samen bij het diploma. */}
            {!still &&
              [0, 1, 2].map((i) => (
                <Vessel
                  key={i}
                  innerRef={(node) => {
                    vessels.current[i] = node;
                  }}
                />
              ))}
          </svg>

          {/* De kompasroos zwaait mee en komt tot rust bij aankomst. */}
          <motion.div
            aria-hidden="true"
            className="absolute bottom-[4%] right-[3%] hidden h-40 w-40 text-navy/30 xl:block"
            style={still ? undefined : { rotate: bearing }}
          >
            <CompassRose className="h-full w-full" />
          </motion.div>

          {/* Mobiel: dezelfde route, verticaal */}
          <div className="absolute bottom-0 left-[7px] top-2 w-0.5 bg-navy/20 xl:hidden" aria-hidden="true">
            {still ? (
              <div className="h-full w-full bg-orange" />
            ) : (
              <motion.div className="h-full w-full origin-top bg-orange" style={{ scaleY: progress }} />
            )}
            <svg viewBox="0 0 16 10" fill="none" className="absolute -bottom-0.5 -left-[7px] h-2.5 w-4 text-orange">
              <path d="m2 2 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <ol ref={listRef} className="pb-8 xl:pb-0">
            {stops.map((stop, i) => {
              const branch = branchOf(i);
              return (
                <li
                  key={stop.title}
                  style={{ "--inset": stop.inset, "--w": stop.width } as CSSProperties}
                  data-on={on(i) ? "" : undefined}
                  onMouseEnter={branch === null ? undefined : () => setFocus(branch)}
                  onMouseLeave={branch === null ? undefined : () => setFocus(null)}
                  onFocus={branch === null ? undefined : () => setFocus(branch)}
                  onBlur={branch === null ? undefined : () => setFocus(null)}
                  className={`group relative pb-10 last:pb-0 xl:absolute xl:w-[var(--w)] xl:pb-0 xl:pl-0 xl:[inset:var(--inset)] ${
                    stop.branch ? "pl-16" : "pl-10"
                  } ${stop.alignEnd ? "xl:text-right" : ""}`}
                >
                  <span aria-hidden="true" className="xl:hidden">
                    {stop.branch && (
                      <span className="absolute left-2 top-[0.8rem] h-0.5 w-5 origin-left bg-navy/20">
                        <span className="route-stub absolute inset-0 origin-left bg-orange" />
                      </span>
                    )}
                    <span
                      className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-navy bg-sand ${
                        stop.branch ? "left-6" : "left-0"
                      }`}
                    >
                      <span className="route-dot absolute -inset-0.5 rounded-full bg-orange" />
                    </span>
                  </span>
                  {/* De tekst komt op inkt zodra de route de halte bereikt. */}
                  <div className="route-card" data-armed={armed ? "" : undefined}>
                    {stop.years && <p className="chart-note text-ember">{stop.years}</p>}
                    <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.02em] xl:text-[1.7rem]">
                      {i === 4 ? (
                        <span className="relative isolate inline-block">
                          {stop.title}
                          <BrushStroke className="route-brush absolute -inset-x-3 -bottom-1 -z-10 h-[0.55em] text-orange/65" />
                        </span>
                      ) : (
                        stop.title
                      )}
                    </h3>
                    <p className="mt-2 max-w-[46ch] leading-relaxed text-slate xl:text-[0.95rem]">{stop.text}</p>
                    {stop.link && (
                      <div className="mt-1">
                        <ArrowLink href={stop.link.href}>{stop.link.label}</ArrowLink>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
