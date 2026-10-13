"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLink, BrushStroke, CompassRose, Waypoint, container } from "./ui";
import useMediaQuery from "./useMediaQuery";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Moment = {
  when: string;
  title: string;
  text: string;
  link?: { label: string; href: string };
  /** Foto, of een gekleurd vlak met een groot woord zolang er nog geen foto is. */
  image?: { src: string; alt: string; position: string };
  panel?: { word: string; tone: "orange" | "navy" };
};

// TODO: bij schoolreis en gala een eigen foto van de school; nu een gekleurd vlak.
const moments: Moment[] = [
  {
    when: "Elke week",
    title: "Mentorles",
    text: "In de mentorlessen leer je jezelf en elkaar kennen. Je mentor is je eerste aanspreekpunt.",
    image: {
      src: "/legacy/ee1ed749efdc-tweejarige-brugklas-scaled-rnynwn4xmn0xmbu15agdvv7y2cmqly3rnw5vnwp8h4.jpg",
      alt: "Docent kijkt mee met twee leerlingen achter een laptop",
      position: "object-[62%_center]",
    },
  },
  {
    when: "Elke dinsdag",
    title: "Keuzewerktijd",
    text: "Het vijfde uur kies je zelf bij welk vak je wilt werken, met de vakdocent erbij voor je vragen.",
    link: { label: "Over kwt en begeleidingsles", href: "/begeleiding/kwt-begeleidingsles" },
    image: {
      src: "/legacy/9a0b85c1da20-Individuele-begeleiding1920px.jpg",
      alt: "Docent helpt een leerling met haar werkboek",
      position: "object-[60%_center]",
    },
  },
  {
    when: "Om de week",
    title: "Leerlingenraad",
    text: "Vertegenwoordigers van elke klas vergaderen om de twee weken en denken mee over schoolfeesten, regels en de schoolkrant.",
    link: { label: "Over de leerlingenraad", href: "/begeleiding/leerlingenraad" },
    image: {
      src: "/legacy/11c71005260e-leerlingenraad.webp",
      alt: "De leerlingenraad aan het water in Willemstad",
      position: "object-[32%_center]",
    },
  },
  {
    when: "Elk jaar",
    title: "Werkweek",
    text: "Elk leerjaar heeft een eigen programma, met bijvoorbeeld stages, kampen of de voorbereiding op het examen.",
    link: { label: "Stages en werkweken", href: "/begeleiding/stages-werkweken" },
    image: {
      src: "/legacy/39b3894762db-verlof1.webp",
      alt: "Leerling klimt gezekerd tegen een rotswand",
      position: "object-[45%_center]",
    },
  },
  {
    when: "In de examenjaren",
    title: "Schoolreis",
    text: "De examenklassen en voor-examenklassen gaan samen op reis, meestal naar een land in Zuid-Amerika.",
    link: { label: "School- en studiereizen", href: "/begeleiding/school-en-studiereizen" },
    panel: { word: "Zuid-Amerika", tone: "orange" },
  },
  {
    when: "Elk jaar",
    title: "Gala",
    text: "Het jaarlijkse gala, met aan het eind van de avond het jaarboek voor iedereen.",
    panel: { word: "Gala", tone: "navy" },
  },
];

// Vanaf dit formaat blijft het scherm staan en schuift de strook met de scroll mee.
const ROOMY = "(min-width: 768px) and (min-height: 460px)";

export default function SchoolLife() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const roomy = useMediaQuery(ROOMY);
  const still = usePrefersReducedMotion();
  // Op telefoonformaat: een gewone strook die je zelf opzij veegt.
  const pinned = roomy;

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0004 });
  const travel = useMotionValue(0);
  // Bij verminderde beweging volgt de strook de scroll direct, zonder naveren.
  const smooth = useTransform([progress, travel], ([p, distance]: number[]) => -p * distance);
  const direct = useTransform([scrollYProgress, travel], ([p, distance]: number[]) => -p * distance);
  const x = still ? direct : smooth;
  // De foto's schuiven in hun lijst iets tegen de strook in.
  const drift = useTransform(progress, [0, 1], ["4%", "-4%"]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    let zoom = 1;
    const measure = () => {
      // Op lage schermen krimpt de strook, zodat foto en tekst onder de kop passen.
      const room = track.parentElement?.clientHeight ?? 0;
      const natural = track.getBoundingClientRect().height / zoom;
      zoom = natural > 0 && room > 0 ? Math.min(1, room / natural) : 1;
      track.style.zoom = String(zoom);
      travel.set(Math.max(0, track.getBoundingClientRect().width - window.innerWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      track.style.zoom = "";
    };
  }, [pinned, travel]);

  return (
    <section aria-labelledby="leven-op-school" className="relative z-20 bg-chalk">
      <div className={`${container} pointer-events-none absolute inset-0`} aria-hidden="true">
        <div className="relative h-full">
          <Waypoint className="left-5 top-0" />
        </div>
      </div>

      <div ref={pinRef} className={pinned ? "h-[300vh]" : ""}>
        <div className={pinned ? "sticky top-0 flex h-screen flex-col overflow-hidden pb-8 pt-28" : "py-20"}>
          <div className={container}>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2
                id="leven-op-school"
                className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
              >
                Leven op school.
              </h2>
              <p className="max-w-[44ch] text-lg leading-relaxed text-slate">
                School is meer dan lessen. Dit zijn de momenten waar je naar uitkijkt.
              </p>
            </div>
            <div className="mt-6 h-0.5 bg-navy/15" aria-hidden="true">
              {pinned && <motion.div className="h-full origin-left bg-orange" style={{ scaleX: still ? scrollYProgress : progress }} />}
            </div>
          </div>

          <div
            className={
              pinned ? "flex min-h-0 flex-1 items-center" : "mt-10 snap-x snap-mandatory scroll-pl-5 overflow-x-auto pb-6 sm:scroll-pl-8"
            }
          >
            <motion.ul
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className="flex w-max gap-5 px-5 will-change-transform sm:gap-7 sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))]"
            >
              {moments.map((moment, i) => (
                <li
                  key={moment.title}
                  className={`w-[min(78vw,22rem)] shrink-0 snap-start ${
                    pinned && i % 2 ? "[@media(min-height:780px)]:mt-12" : ""
                  }`}
                >
                  <div
                    className={`relative isolate h-[clamp(10rem,calc(100vh-31rem),26rem)] overflow-hidden ${
                      moment.panel?.tone === "navy" ? "bg-navy text-chalk" : moment.panel ? "bg-orange text-navy" : "bg-sand"
                    }`}
                  >
                    {moment.image && (
                      <motion.div className="absolute -inset-x-[6%] inset-y-0" style={pinned && !still ? { x: drift } : undefined}>
                        <Image
                          src={moment.image.src}
                          alt={moment.image.alt}
                          fill
                          sizes="(min-width: 640px) 400px, 85vw"
                          className={`object-cover ${moment.image.position}`}
                        />
                      </motion.div>
                    )}
                    {moment.panel && (
                      <>
                        {moment.panel.tone === "orange" ? (
                          <CompassRose className="absolute -right-16 -top-16 -z-10 h-72 w-72 text-navy/25" />
                        ) : (
                          <BrushStroke variant="swoosh" className="absolute -bottom-10 -right-12 -z-10 w-72 text-orange/70" />
                        )}
                        <p
                          aria-hidden="true"
                          className="absolute inset-x-6 bottom-6 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.03em]"
                        >
                          {moment.panel.word}
                        </p>
                      </>
                    )}
                  </div>
                  <p className="chart-note mt-5 text-ember">{moment.when}</p>
                  <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.02em]">{moment.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{moment.text}</p>
                  {moment.link && <ArrowLink href={moment.link.href}>{moment.link.label}</ArrowLink>}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
