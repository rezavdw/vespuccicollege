"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { ArrowLink, BrushStroke, CompassRose, Waypoint, container } from "./ui";

type Stop = {
  title: string;
  years?: string;
  text: string;
  link?: { label: string; href: string };
  /** Een van de drie richtingen na de splitsing. */
  branch?: boolean;
  /** Linkerbovenhoek op de wegenkaart, in kaarteenheden. */
  x: number;
  y: number;
};

// De wegenkaart is 3400×640 eenheden; de drie richtingen lopen op y = 120, 300 en 480.
const WORLD = { w: 3400, h: 640 };
const LANES = [120, 300, 480];

const stops: Stop[] = [
  {
    title: "Tweejarige brugklas",
    years: "Leerjaar 1–2",
    text: "We kijken eerst goed op welk niveau je het beste kunt instromen. Daarna heb je twee jaar om te laten zien wat je kunt.",
    link: { label: "Over de brugklas", href: "/onderwijs/tweejarige-brugklas" },
    x: 700,
    y: 362,
  },
  {
    title: "Vwo",
    years: "Leerjaar 3–6",
    text: "Het derde leerjaar staat in het teken van een gemotiveerde keuze voor de jaren daarna.",
    link: { label: "Over het vwo", href: "/onderwijs/vwo" },
    branch: true,
    x: 1410,
    y: LANES[0] + 34,
  },
  {
    title: "Havo",
    years: "Leerjaar 3–5",
    text: "In het derde leerjaar krijg je nog alle vakken. Daarna werk je toe naar je examen.",
    link: { label: "Over de havo", href: "/onderwijs/havo" },
    branch: true,
    x: 1410,
    y: LANES[1] + 34,
  },
  {
    title: "Mavo",
    years: "Leerjaar 3–4",
    text: "In leerjaar 3 en 4 krijg je de lesstof die belangrijk is voor je examen.",
    link: { label: "Over de mavo", href: "/onderwijs/mavo" },
    branch: true,
    x: 1410,
    y: LANES[2] + 34,
  },
  {
    title: "Diploma",
    text: "Je sluit af met een Nederlands diploma dat past bij wat jij kunt.",
    x: 2530,
    y: 372,
  },
  {
    title: "Vervolgonderwijs",
    text: "Goed voorbereid op je vervolgopleiding en op de maatschappij.",
    x: 2990,
    y: 312,
  },
];

const TRUNK =
  "M160 300C300 300 320 380 460 380S700 240 860 240S1000 300 1100 300";
const BRANCHES = [
  "M1100 300C1220 300 1240 120 1380 120H2060C2200 120 2220 300 2340 300",
  "M1100 300H2340",
  "M1100 300C1220 300 1240 480 1380 480H2060C2200 480 2220 300 2340 300",
];
const FINISH = "M2340 300H2620";
const ONWARD = "M2620 300C2800 300 2860 220 3040 220S3300 260 3400 260";
const ROADS = [TRUNK, ...BRANCHES, FINISH, ONWARD];

// Etappes van de rit als deel (0–1) van de scroll: splitsing, samenkomst, diploma.
const FORK = 0.22;
const MERGE = 0.68;
const DIPLOMA = 0.78;
const STATION_X = 1380;
const ALL = "111111";

/** Leerjaarpaaltjes op de weg: `road` is "trunk" of de richting (0–2). */
const marks: { road: "trunk" | 0 | 1 | 2; x: number; label: string }[] = [
  { road: "trunk", x: 250, label: "1" },
  { road: "trunk", x: 660, label: "2" },
  ...[3, 4, 5, 6].map((year, i) => ({
    road: 0 as const,
    x: STATION_X + i * 226.7,
    label: String(year),
  })),
  ...[3, 4, 5].map((year, i) => ({
    road: 1 as const,
    x: STATION_X + i * 340,
    label: String(year),
  })),
  ...[3, 4].map((year, i) => ({
    road: 2 as const,
    x: STATION_X + i * 680,
    label: String(year),
  })),
];

const legs = [
  { label: "Brugklas", from: 0, to: FORK },
  { label: "Mavo · havo · vwo", from: FORK, to: MERGE },
  { label: "Diploma", from: MERGE, to: DIPLOMA },
  { label: "Vervolg", from: DIPLOMA, to: 1 },
];

// De rit vraagt wat ruimte; alleen op telefoonformaat tonen we de route als lijst onder elkaar.
const STAGE_QUERY = "(min-width: 768px) and (min-height: 460px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeTo = (query: string) => (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const subscribeStage = subscribeTo(STAGE_QUERY);
const subscribeReduced = subscribeTo(REDUCED_QUERY);

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function pointAt(path: SVGPathElement, t: number) {
  const length = path.getTotalLength();
  const at = length * clamp(t);
  const a = path.getPointAtLength(Math.max(0, at - 1));
  const b = path.getPointAtLength(Math.min(length, at + 1));
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

/** Auto van bovenaf, met de neus naar rechts; draait mee met de weg. */
function Car({ innerRef }: { innerRef: (node: SVGGElement | null) => void }) {
  return (
    <g ref={innerRef} opacity="0">
      <ellipse cx="-2" cy="3" rx="27" ry="14" fill="#0b1030" opacity="0.35" />
      <rect
        x="-25"
        y="-12.5"
        width="50"
        height="25"
        rx="9"
        fill="var(--color-orange)"
      />
      <rect
        x="-15"
        y="-9.5"
        width="27"
        height="19"
        rx="5"
        fill="var(--color-navy)"
      />
      <rect
        x="-9"
        y="-10"
        width="14"
        height="20"
        rx="3"
        fill="var(--color-peach)"
      />
      <path
        d="M22-8.5v4M22 4.5v4"
        stroke="var(--color-chalk)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

function Leg({
  label,
  from,
  to,
  progress,
  active,
}: {
  label: string;
  from: number;
  to: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  return (
    <div className="flex-1">
      <div className="h-0.5 bg-navy/15">
        <motion.div
          className="h-full origin-left bg-orange"
          style={{ scaleX }}
        />
      </div>
      <p
        className={`chart-note mt-2 transition-colors duration-500 ${active ? "text-navy" : "text-navy/45"}`}
      >
        {label}
      </p>
    </div>
  );
}

const rays = Array.from({ length: 16 }, (_, i) => i);
const scenery = [
  { kind: "cactus", x: 330, y: 250 },
  { kind: "palm", x: 560, y: 520 },
  { kind: "cactus", x: 1180, y: 110 },
  { kind: "palm", x: 1230, y: 590 },
  { kind: "palm", x: 2230, y: 110 },
  { kind: "cactus", x: 2250, y: 560 },
  { kind: "cactus", x: 2760, y: 180 },
  { kind: "palm", x: 3300, y: 180 },
];

export default function RouteSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const roads = useRef<(SVGPathElement | null)[]>([]);
  const cars = useRef<(SVGGElement | null)[]>([]);
  const markRefs = useRef<(SVGGElement | null)[]>([]);
  const flags = useRef(ALL);
  const signRef = useRef<SVGGElement>(null);
  const finishRef = useRef<SVGGElement>(null);
  const sealRef = useRef<SVGGElement>(null);

  // Op de server en tijdens hydratie de lijst; daarna de rit, als het scherm die aankan.
  const staged = useSyncExternalStore(
    subscribeStage,
    () => window.matchMedia(STAGE_QUERY).matches,
    () => false,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => true,
  );
  // Alleen de lijst staat bij verminderde beweging stil; de rit stuur je zelf met scrollen.
  const frozen = reducedMotion && !staged;

  const ride = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const walk = useScroll({
    target: worldRef,
    offset: ["start 0.6", "0.8 0.6"],
  });
  // Een lichte veer, zodat de auto glijdt in plaats van met het scrollwiel mee te schokken.
  const progress = useSpring(ride.scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.0004,
  });
  const walked = useSpring(walk.scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.0005,
  });

  // Welke haltes al bereikt zijn; zonder JavaScript en bij verminderde beweging allemaal.
  const [progressed, setReached] = useState(ALL);
  const reached = frozen ? ALL : progressed;
  const armed = !frozen;
  // Etappe (0–3) waarin de auto nu rijdt.
  const [leg, setLeg] = useState(0);
  // Richting (0–2) waar de bezoeker op dit moment naar kijkt.
  const [focus, setFocus] = useState<number | null>(null);

  // De rijstrook kleurt oranje waar je geweest bent.
  const drawn = [
    useTransform(progress, [0, FORK], [0, 1]),
    useTransform(progress, [FORK, MERGE], [0, 1]),
    useTransform(progress, [MERGE, DIPLOMA], [0, 1]),
    useTransform(progress, [DIPLOMA, 1], [0, 1]),
  ];
  // De weg wordt vlak voor de auto uit aangelegd: je ziet steeds alleen de etappe waar je bent.
  const built = useTransform(
    progress,
    [FORK - 0.05, MERGE - 0.14, MERGE - 0.04, DIPLOMA - 0.06, DIPLOMA + 0.12],
    [1100, 2340, 2620, 2620, WORLD.w],
  );
  const bearing = useSpring(
    useTransform(ride.scrollYProgress, [0, 1], [-200, 0]),
    { stiffness: 60, damping: 9 },
  );
  const carTop = useTransform(walked, (v) => `${v * 100}%`);

  const commit = useCallback((next: boolean[]) => {
    const value = next.map((on) => (on ? "1" : "0")).join("");
    if (value !== flags.current) {
      flags.current = value;
      setReached(value);
    }
  }, []);

  /** De rit: auto's, camera, paaltjes en haltes voor scrollpositie `p`. */
  const drive = useCallback(
    (p: number) => {
      const world = worldRef.current;
      const [trunk, vwo, havo, mavo, finish, onward] = roads.current;
      if (!world || !trunk || !vwo || !havo || !mavo || !finish || !onward)
        return;

      const onBranch = clamp((p - FORK) / (MERGE - FORK));
      const away = clamp((p - DIPLOMA) / (1 - DIPLOMA));
      // De middelste auto rijdt de hele weg: brugklas, havo, diploma en verder.
      const main =
        p < FORK
          ? pointAt(trunk, p / FORK)
          : p < MERGE
            ? pointAt(havo, onBranch)
            : p < DIPLOMA
              ? pointAt(finish, (p - MERGE) / (DIPLOMA - MERGE))
              : pointAt(onward, away);
      const sides = [pointAt(vwo, onBranch), main, pointAt(mavo, onBranch)];

      sides.forEach((at, i) => {
        const car = cars.current[i];
        if (!car) return;
        car.setAttribute(
          "transform",
          `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) rotate(${at.angle.toFixed(1)})`,
        );
        const visible =
          i === 1
            ? clamp((0.97 - away) / 0.1)
            : onBranch > 0.004 && onBranch < 0.996
              ? 1
              : 0;
        car.setAttribute("opacity", String(visible));
      });

      const scale = world.offsetHeight / WORLD.h;
      const view = window.innerWidth;
      const stage = p < FORK ? 0 : p < MERGE ? 1 : p < DIPLOMA + 0.07 ? 2 : 3;
      // De camera rijdt mee en houdt de auto links van het midden. Bij verminderde
      // beweging glijdt hij niet, maar springt hij per etappe naar een vast beeld.
      const framed = [0, view / 2 - 1720 * scale, -Infinity, -Infinity][stage];
      const shift = clamp(
        reducedMotion
          ? Math.min(framed, view * 0.85 - main.x * scale)
          : view * 0.38 - main.x * scale,
        view - world.offsetWidth,
        0,
      );
      // Op lage schermen krimpen de teksten mee met de kaart.
      world.style.setProperty("--card-zoom", Math.min(1, scale / 0.94).toFixed(3));
      world.style.transform = `translate3d(${shift.toFixed(1)}px,0,0)`;

      const laneX = (i: number) =>
        onBranch <= 0 ? -Infinity : onBranch >= 1 ? Infinity : sides[i].x;
      marks.forEach((mark, i) => {
        const x =
          mark.road === "trunk"
            ? p >= FORK
              ? Infinity
              : p > 0.004
                ? main.x
                : -Infinity
            : laneX(mark.road);
        markRefs.current[i]?.toggleAttribute("data-on", x >= mark.x - 4);
      });

      signRef.current?.toggleAttribute("data-on", p >= 0.1);
      finishRef.current?.toggleAttribute("data-on", p >= MERGE - 0.07);
      sealRef.current?.toggleAttribute("data-on", p >= MERGE - 0.05);
      setLeg(stage);

      commit([
        true,
        laneX(0) >= STATION_X,
        laneX(1) >= STATION_X,
        laneX(2) >= STATION_X,
        p >= DIPLOMA,
        away >= 0.4,
      ]);
    },
    [commit, reducedMotion],
  );

  /** De lijst: een halte is bereikt zodra de verticale weg bij het bolletje is. */
  const stroll = useCallback(
    (p: number) => {
      const world = worldRef.current;
      if (!world) return;
      const tip = p >= 0.999 ? Infinity : p * world.offsetHeight;
      const items = listRef.current ? [...listRef.current.children] : [];
      commit(items.map((item) => (item as HTMLElement).offsetTop + 8 <= tip));
    },
    [commit],
  );

  useMotionValueEvent(progress, "change", (p) => staged && drive(p));
  useMotionValueEvent(
    walked,
    "change",
    (p) => !staged && !frozen && stroll(p),
  );

  useEffect(() => {
    const world = worldRef.current;
    if (!world || frozen) return;
    const update = () =>
      staged ? drive(progress.get()) : stroll(walked.get());

    // De paaltjes op het bochtige eerste stuk volgen de weg.
    const trunk = roads.current[0];
    if (staged && trunk) {
      marks.forEach((mark, i) => {
        if (mark.road !== "trunk") return;
        let low = 0;
        let high = 1;
        for (let step = 0; step < 18; step++) {
          const mid = (low + high) / 2;
          if (pointAt(trunk, mid).x < mark.x) low = mid;
          else high = mid;
        }
        const at = pointAt(trunk, low);
        markRefs.current[i]?.setAttribute(
          "transform",
          `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`,
        );
      });
    }

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      world.style.transform = "";
    };
  }, [staged, frozen, drive, stroll, progress, walked]);

  const on = (i: number) => reached[i] === "1";
  const branchOf = (i: number) => (i >= 1 && i <= 3 ? i - 1 : null);

  return (
    <section
      id="opleidingen"
      aria-labelledby="route"
      data-stage={staged ? "" : undefined}
      className="relative isolate scroll-mt-20 overflow-x-clip bg-sand pb-20 pt-20 stage:pb-0! lg:pb-32 lg:pt-32"
    >
      <div
        className="chart-grid absolute inset-0 -z-10 text-navy"
        aria-hidden="true"
      />

      {/* De doorlopende route komt hier aan; de weg neemt het over tot de volgende sectie. */}
      <div
        className={`${container} pointer-events-none absolute inset-0`}
        aria-hidden="true"
      >
        <div className="relative h-full">
          <Waypoint className="-left-7 top-24" />
          <Waypoint className="-right-7 bottom-10" gap />
        </div>
      </div>

      <div className={container}>
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <h2
            id="route"
            className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] lg:col-span-7"
          >
            Jouw route, van brugklas tot diploma.
          </h2>
          <p className="max-w-[52ch] text-lg leading-relaxed text-slate lg:col-span-4 lg:col-start-9 lg:pt-3">
            Iedereen begint in de tweejarige brugklas. Daarna volg je de
            richting die bij je past: mavo, havo of vwo.
          </p>
        </div>
      </div>

      {/* De rit: het scherm blijft staan terwijl je over de weg scrolt. */}
      <div
        ref={pinRef}
        id="routekaart"
        className="relative mt-14 stage:mt-10 stage:h-[420vh]"
      >
        <div className="stage:sticky stage:top-0 stage:h-screen stage:overflow-hidden">
          {/* Waar je bent op de route */}
          <div
            className={`${container} absolute inset-x-0 top-24 z-10 hidden stage:block`}
            aria-hidden="true"
          >
            <div className="flex gap-3">
              {legs.map((item, i) => (
                <Leg
                  key={item.label}
                  {...item}
                  progress={progress}
                  active={i === leg}
                />
              ))}
            </div>
          </div>

          <div
            ref={worldRef}
            className="route-world relative mx-auto w-full max-w-7xl px-5 will-change-transform sm:px-8 stage:absolute stage:left-0 stage:mx-0! stage:max-w-none! stage:px-0! lg:px-12"
          >
            <svg
              viewBox={`0 0 ${WORLD.w} ${WORLD.h}`}
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 hidden h-full w-full stage:block"
            >
              {/* Kadushi's en palmen langs de weg */}
              <g
                stroke="var(--color-navy)"
                strokeOpacity="0.22"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {scenery.map((item) =>
                  item.kind === "cactus" ? (
                    <path
                      key={`${item.x}-${item.y}`}
                      transform={`translate(${item.x} ${item.y})`}
                      strokeWidth="8"
                      d="M0 0V-52M0-18H-13V-34M0-28H13V-44"
                    />
                  ) : (
                    <path
                      key={`${item.x}-${item.y}`}
                      transform={`translate(${item.x} ${item.y})`}
                      strokeWidth="3.5"
                      d="M0 0C3-20-3-36 5-52M5-52c-11-7-23-2-27 7M5-52c-5-13-16-18-25-13M5-52c9-11 20-11 27-4M5-52c13-2 22 5 24 16M5-52c2-11 11-18 20-18"
                    />
                  ),
                )}
              </g>

              {/* De weg bestaat tot hier; de rest wordt aangelegd terwijl je rijdt. */}
              <clipPath id="route-built">
                <motion.rect x="0" y="0" height={WORLD.h} width={built} />
              </clipPath>

              {/* Berm en asfalt */}
              <g
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#route-built)"
              >
                <path
                  d={ROADS.join("")}
                  stroke="var(--color-navy)"
                  strokeOpacity="0.14"
                  strokeWidth="62"
                />
                {ROADS.map((d, i) => (
                  <path
                    key={d}
                    d={d}
                    ref={(node) => {
                      roads.current[i] = node;
                    }}
                    stroke="var(--color-navy)"
                    strokeWidth="46"
                  />
                ))}
                {ROADS.map((d) => (
                  <path
                    key={d}
                    d={d}
                    stroke="var(--color-chalk)"
                    strokeOpacity="0.55"
                    strokeWidth="2.5"
                    strokeDasharray="16 18"
                    strokeLinecap="butt"
                  />
                ))}
              </g>

              {/* Startstreep */}
              <path
                d="M160 277V323"
                stroke="var(--color-chalk)"
                strokeWidth="5"
              />

              {/* Finish: geblokte streep vlak voor het diploma */}
              <g transform="translate(2512 277)">
                <g ref={finishRef} className="route-pop">
                  {Array.from({ length: 12 }, (_, i) => (
                    <rect
                      key={i}
                      x={(i % 2) * 7.67}
                      y={Math.floor(i / 2) * 7.67}
                      width="7.67"
                      height="7.67"
                      fill="var(--color-chalk)"
                      opacity={(i + Math.floor(i / 2)) % 2 ? 0.95 : 0.2}
                    />
                  ))}
                </g>
              </g>

              {/* De gereden weg */}
              <g stroke="var(--color-orange)" strokeWidth="6">
                <motion.path d={TRUNK} style={{ pathLength: drawn[0] }} />
                {BRANCHES.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    className="route-branch"
                    data-dim={focus !== null && focus !== i ? "" : undefined}
                    data-lit={focus === i ? "" : undefined}
                    style={{ pathLength: drawn[1] }}
                  />
                ))}
                <motion.path d={FINISH} style={{ pathLength: drawn[2] }} />
                <motion.path d={ONWARD} style={{ pathLength: drawn[3] }} />
              </g>

              {/* Wegwijzer voor de splitsing */}
              <g transform="translate(948 130)">
                <g ref={signRef} className="route-pop">
                  <path
                    d="M34 92v36M126 92v36"
                    stroke="var(--color-navy)"
                    strokeWidth="5"
                  />
                  <rect
                    width="160"
                    height="96"
                    rx="8"
                    fill="var(--color-navy)"
                  />
                  <rect
                    x="5"
                    y="5"
                    width="150"
                    height="86"
                    rx="5"
                    stroke="var(--color-chalk)"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                  />
                  <g
                    className="font-display"
                    fill="var(--color-chalk)"
                    fontSize="17"
                    fontWeight="600"
                  >
                    <text x="18" y="31">
                      Vwo
                    </text>
                    <text x="18" y="55">
                      Havo
                    </text>
                    <text x="18" y="79">
                      Mavo
                    </text>
                  </g>
                  <g
                    stroke="var(--color-orange)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M118 31l14-10M124 20h8v8" />
                    <path d="M116 49h18M128 43l6 6-6 6" />
                    <path d="M118 67l14 10M124 78h8v-8" />
                  </g>
                </g>
              </g>

              {/* Leerjaarpaaltjes: lichten op als je erlangs rijdt */}
              <g clipPath="url(#route-built)">
                {marks.map((mark, i) => (
                  <g
                    key={`${mark.road}-${mark.label}`}
                    ref={(node) => {
                      markRefs.current[i] = node;
                    }}
                    transform={`translate(${mark.x} ${mark.road === "trunk" ? 300 : LANES[mark.road]})`}
                  >
                    <circle
                      r="15"
                      stroke="var(--color-orange)"
                      strokeWidth="2.5"
                      className="route-ping"
                    />
                    <circle
                      r="15"
                      fill="var(--color-sand)"
                      stroke="var(--color-navy)"
                      strokeWidth="2"
                    />
                    <circle
                      r="15"
                      fill="var(--color-orange)"
                      className="route-dot"
                    />
                    <text
                      y="5.5"
                      textAnchor="middle"
                      className="font-display"
                      fill="var(--color-navy)"
                      fontSize="16"
                      fontWeight="700"
                    >
                      {mark.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Diploma: de drie richtingen komen samen en het zegel wordt gezet. */}
              <g transform="translate(2620 300) scale(1.9)">
                <g ref={sealRef} className="route-pop">
                  <g data-on={on(4) ? "" : undefined}>
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
                    <g
                      stroke="var(--color-orange)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      {rays.map((i) => (
                        <path
                          key={i}
                          d={`M22 0H${i % 2 ? 27 : 32}`}
                          pathLength="1"
                          transform={`rotate(${i * 22.5 + 11.25})`}
                          className="route-ray"
                          style={{ transitionDelay: `${120 + i * 22}ms` }}
                        />
                      ))}
                    </g>
                    <circle
                      r="16"
                      fill="var(--color-sand)"
                      stroke="var(--color-navy)"
                      strokeWidth="2"
                    />
                    <g className="route-seal">
                      <circle
                        r="16"
                        fill="var(--color-orange)"
                        stroke="var(--color-sand)"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M0-10 2.4-2.4 10 0 2.4 2.4 0 10-2.4 2.4-10 0-2.4-2.4Z"
                        fill="var(--color-navy)"
                      />
                    </g>
                  </g>
                </g>
              </g>

              {/* Eén auto vertrekt, drie rijden elk hun richting en komen samen bij het diploma. */}
              {[0, 2, 1].map((i) => (
                <Car
                  key={i}
                  innerRef={(node) => {
                    cars.current[i] = node;
                  }}
                />
              ))}
            </svg>

            {/* De kompasroos zwaait mee en komt tot rust bij aankomst. */}
            <motion.div
              aria-hidden="true"
              className="absolute left-[81%] top-[66%] hidden h-36 w-36 text-navy/30 stage:block"
              style={reducedMotion ? undefined : { rotate: bearing }}
            >
              <CompassRose className="h-full w-full" />
            </motion.div>

            {/* Lijst: dezelfde route als een weg naar beneden */}
            <div
              className="absolute bottom-0 left-5 top-2 w-3 rounded-full bg-navy stage:hidden sm:left-8 lg:left-12"
              aria-hidden="true"
            >
              <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-chalk/50" />
              {frozen ? (
                <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 rounded-full bg-orange" />
              ) : (
                <>
                  <motion.div
                    className="absolute inset-y-0 left-1/2 -ml-0.5 w-1 origin-top rounded-full bg-orange"
                    style={{ scaleY: walked }}
                  />
                  <motion.div
                    className="absolute left-1/2 -ml-[7px] -mt-3 h-6 w-3.5 rounded-[5px] bg-orange ring-2 ring-sand"
                    style={{ top: carTop }}
                  >
                    <span className="absolute inset-x-[3px] top-1.5 h-2.5 rounded-sm bg-navy" />
                  </motion.div>
                </>
              )}
            </div>

            <ol ref={listRef} className="pb-8 stage:pb-0">
              {stops.map((stop, i) => {
                const branch = branchOf(i);
                return (
                  <li
                    key={stop.title}
                    style={
                      {
                        "--x": `${(stop.x / WORLD.w) * 100}%`,
                        "--y": `${(stop.y / WORLD.h) * 100}%`,
                      } as CSSProperties
                    }
                    data-on={on(i) ? "" : undefined}
                    onMouseEnter={
                      branch === null ? undefined : () => setFocus(branch)
                    }
                    onMouseLeave={
                      branch === null ? undefined : () => setFocus(null)
                    }
                    onFocus={
                      branch === null ? undefined : () => setFocus(branch)
                    }
                    onBlur={branch === null ? undefined : () => setFocus(null)}
                    className={`relative pb-10 last:pb-0 stage:absolute stage:left-[var(--x)] stage:top-[var(--y)] stage:pb-0 stage:pl-0 ${
                      stop.branch
                        ? "pl-16 stage:w-[33rem]"
                        : "pl-10 stage:w-[19rem]"
                    }`}
                  >
                    <span aria-hidden="true" className="stage:hidden">
                      {stop.branch && (
                        <span className="absolute left-2 top-[0.8rem] h-0.5 w-5 origin-left bg-navy/20">
                          <span className="route-stub absolute inset-0 origin-left bg-orange" />
                        </span>
                      )}
                      <span
                        className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-navy bg-sand ${
                          stop.branch ? "left-6" : "-left-0.5"
                        }`}
                      >
                        <span className="route-dot absolute -inset-0.5 rounded-full bg-orange" />
                      </span>
                    </span>
                    {/* De tekst komt op inkt zodra je bij de halte bent. */}
                    <div
                      className={`route-card ${stop.branch ? "stage:grid stage:grid-cols-[11rem_1fr] stage:gap-x-6" : ""}`}
                      data-armed={armed ? "" : undefined}
                    >
                      <div>
                        {stop.years && (
                          <p className="chart-note text-ember">{stop.years}</p>
                        )}
                        <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.02em] stage:text-[1.7rem]">
                          {i === 4 ? (
                            <span className="relative isolate inline-block">
                              {stop.title}
                              <BrushStroke className="route-brush absolute -inset-x-3 -bottom-1 -z-10 h-[0.55em] text-orange/65" />
                            </span>
                          ) : (
                            stop.title
                          )}
                        </h3>
                        {stop.branch && stop.link && (
                          <div className="hidden stage:block">
                            <ArrowLink href={stop.link.href}>
                              {stop.link.label}
                            </ArrowLink>
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className={`mt-2 max-w-[46ch] leading-relaxed text-slate stage:text-[0.95rem] ${
                            stop.branch ? "stage:mt-5 stage:leading-snug" : ""
                          }`}
                        >
                          {stop.text}
                        </p>
                        {stop.link && (
                          <div
                            className={`mt-1 ${stop.branch ? "stage:hidden" : ""}`}
                          >
                            <ArrowLink href={stop.link.href}>
                              {stop.link.label}
                            </ArrowLink>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
