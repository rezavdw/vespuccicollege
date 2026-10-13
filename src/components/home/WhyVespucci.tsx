"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Parallax from "./Parallax";
import Reveal from "./Reveal";
import { ArrowLink, BrushStroke, container } from "./ui";
import useHydrated from "./useHydrated";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const points = [
  {
    title: "Nederlands diploma op Curaçao",
    text: "Ons onderwijs is ingericht volgens de Nederlandse onderwijswetgeving. Je sluit mavo, havo of vwo af met een Nederlands diploma. Ga je terug naar Nederland of blijf je op het eiland: je opleiding loopt gewoon door.",
  },
  {
    title: "Kleine klassen, rust in de les",
    text: "Dankzij de kleine klassen houden docenten de vorderingen van alle leerlingen goed in het oog. Er is rust in de les en tijd voor jouw vragen.",
  },
  {
    title: "Begeleiding op maat",
    text: "Gaat het met een vak even niet lekker? Dan zijn er keuzewerktijd en begeleidingslessen om je bij te spijkeren. Je kunt je ook inschrijven voor huiswerkbegeleiding.",
    link: { label: "Over huiswerkbegeleiding", href: "/begeleiding/huiswerkbegeleiding" },
  },
  {
    title: "Ontdekken buiten de klas",
    text: "In werkweken, projectweken, stages en studiereizen ontdek je waar je passie ligt, waar je goed in bent en waar je nog extra aandacht voor nodig hebt.",
    link: { label: "Stages en werkweken", href: "/begeleiding/stages-werkweken" },
  },
];

/** Eén vlak van de collage: veegt van onder naar boven in beeld. */
function Panel({
  src,
  alt,
  className,
  delay,
  still,
}: {
  src: string;
  alt: string;
  className: string;
  delay: number;
  still: boolean;
}) {
  return (
    <motion.div
      key={still ? "still" : "moving"}
      data-reveal
      initial={still ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
      className={`relative overflow-hidden ${className}`}
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover object-top" />
    </motion.div>
  );
}

export default function WhyVespucci() {
  // De penseelstreek onder de kop wordt gezet zodra de kop in beeld is; zonder JavaScript staat hij er al.
  const armed = useHydrated();
  const [struck, setStruck] = useState(false);
  const still = usePrefersReducedMotion();

  return (
    <section aria-labelledby="waarom" className="relative isolate overflow-x-clip py-20 lg:py-32">
      <div className={container}>
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:gap-y-12">
          <motion.h2
            id="waarom"
            onViewportEnter={() => setStruck(true)}
            viewport={{ once: true, margin: "0px 0px -25% 0px" }}
            className="text-[clamp(2.4rem,6.2vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:wrap] lg:col-span-12"
          >
            <span className="block lg:whitespace-nowrap">Een Nederlands diploma,</span>
            <span className="block lg:whitespace-nowrap lg:pl-[1.6em]">
              een{" "}
              <span className="relative isolate inline-block">
                Caribische jeugd.
                <BrushStroke
                  className="why-brush absolute -inset-x-[0.15em] -bottom-[0.1em] -z-10 h-[0.6em] text-orange/80"
                  hidden={armed && !struck && !still}
                />
              </span>
            </span>
          </motion.h2>
        </div>

        <div className="mt-12 grid items-start gap-x-10 gap-y-14 lg:mt-20 lg:grid-cols-12">
          {/* Collage: drie leerlingen op de kleuren van het eiland */}
          <div className="relative isolate lg:sticky lg:top-28 lg:col-span-6">
            <BrushStroke variant="swoosh" className="absolute -bottom-6 -left-10 -z-10 w-48 text-peach lg:-bottom-20 lg:-left-24 lg:w-96" />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Parallax distance={18}>
                <Panel
                  src="/images/links.webp"
                  alt="Leerling met schoolboeken"
                  className="aspect-[6/11] bg-orange"
                  delay={0}
                  still={still}
                />
              </Parallax>
              <Parallax distance={-18} className="h-full [&>div]:h-full">
                <div className="grid h-full grid-rows-2 gap-3 pt-10 sm:gap-4 lg:pt-16">
                  <Panel
                    src="/images/rechtsboven.webp"
                    alt="Leerling springt juichend omhoog"
                    className="bg-sun"
                    delay={0.12}
                    still={still}
                  />
                  <Panel
                    src="/images/rechtsonder.webp"
                    alt="Leerling met de armen in de lucht"
                    className="bg-blue"
                    delay={0.24}
                    still={still}
                  />
                </div>
              </Parallax>
            </div>
            <p className="chart-note mt-5 flex items-center gap-3 text-slate">
              <span>Nederland · 52°N</span>
              <span aria-hidden="true" className="h-px flex-1 bg-navy/20" />
              <span>Curaçao · 12°N</span>
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="max-w-[60ch] text-lg leading-relaxed text-slate">
                Het Vespucci College valt onder de Stichting Nederlands Middelbaar Onderwijs Curaçao, in 1999 opgericht
                op verzoek van het ministerie van Defensie. De school staat open voor alle leerlingen: voor wie hier een
                paar jaar woont, en voor wie op Curaçao is geboren of blijft.
              </p>
            </Reveal>

            <ul className="mt-10 lg:mt-14">
              {points.map((point) => (
                <li key={point.title} className="relative border-t border-navy/15 py-8 last:border-b lg:py-10">
                  {/* De oranje lijn wordt getrokken zodra het kernpunt in beeld komt. */}
                  <motion.span
                    key={still ? "still" : "moving"}
                    aria-hidden="true"
                    data-reveal
                    initial={still ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                    transition={{ duration: 0.9, ease: EASE_OUT }}
                    className="absolute -top-px left-0 h-0.5 w-16 origin-left bg-orange"
                  />
                  <Reveal>
                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] lg:text-[1.9rem]">
                      {point.title}
                    </h3>
                    <p className="mt-3 max-w-[58ch] leading-relaxed text-slate">{point.text}</p>
                    {point.link && (
                      <div className="mt-2">
                        <ArrowLink href={point.link.href}>{point.link.label}</ArrowLink>
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
