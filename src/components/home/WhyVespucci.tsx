"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
import { ArrowLink, BrushStroke, container } from "./ui";
import useHydrated from "./useHydrated";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

// TODO: per kernpunt een eigen foto van de school (les, begeleiding, werkweek).
const points = [
  {
    title: "Nederlands diploma op Curaçao",
    text: "Ons onderwijs is ingericht volgens de Nederlandse onderwijswetgeving. Je sluit mavo, havo of vwo af met een Nederlands diploma. Ga je terug naar Nederland of blijf je op het eiland: je opleiding loopt gewoon door.",
    image: { src: "/images/home-mobile-scaled.jpg", className: "object-top" },
  },
  {
    title: "Kleine klassen, rust in de les",
    text: "Dankzij de kleine klassen houden docenten de vorderingen van alle leerlingen goed in het oog. Er is rust in de les en tijd voor jouw vragen.",
    image: { src: "/images/Groepsfoto-personeel-2026.webp", className: "object-center" },
  },
  {
    title: "Begeleiding op maat",
    text: "Gaat het met een vak even niet lekker? Dan zijn er keuzewerktijd en begeleidingslessen om je bij te spijkeren. Je kunt je ook inschrijven voor huiswerkbegeleiding.",
    link: { label: "Over huiswerkbegeleiding", href: "/begeleiding/huiswerkbegeleiding" },
    image: { src: "/images/links.webp", className: "object-top" },
  },
  {
    title: "Ontdekken buiten de klas",
    text: "In werkweken, projectweken, stages en studiereizen ontdek je waar je passie ligt, waar je goed in bent en waar je nog extra aandacht voor nodig hebt.",
    link: { label: "Stages en werkweken", href: "/begeleiding/stages-werkweken" },
    image: { src: "/images/vwo.webp", className: "object-center" },
  },
];

export default function WhyVespucci() {
  const [active, setActive] = useState(0);
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
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-7">
            <p className="max-w-[60ch] leading-relaxed text-slate">
              Het Vespucci College valt onder de Stichting Nederlands Middelbaar Onderwijs Curaçao, in 1999 opgericht op
              verzoek van het ministerie van Defensie. De school staat open voor alle leerlingen: voor wie hier een
              paar jaar woont, en voor wie op Curaçao is geboren of blijft.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-10 lg:mt-24 lg:grid-cols-12">
          {/* Desktop: één vast beeld dat meewisselt met het kernpunt in beeld */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative isolate aspect-[4/5]">
                <BrushStroke
                  variant="swoosh"
                  className="absolute -bottom-16 -left-20 -z-10 w-80 text-peach transition-transform duration-1000 ease-out-expo motion-reduce:transition-none"
                  style={{ transform: `rotate(${active * 22}deg) scale(${1 + active * 0.04})` }}
                />
                <div className="absolute inset-0 overflow-hidden bg-sand">
                  {points.map((point, i) => (
                    <div
                      key={point.title}
                      className="why-shot absolute inset-0"
                      data-ahead={i > active ? "" : undefined}
                      data-active={i === active ? "" : undefined}
                    >
                      <Image
                        src={point.image.src}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 470px, 40vw"
                        className={`object-cover ${point.image.className}`}
                      />
                    </div>
                  ))}
                </div>
                {/* Peilschaal: welk kernpunt in beeld is */}
                <div aria-hidden="true" className="absolute -right-6 top-0 flex h-full flex-col gap-1.5">
                  {points.map((point, i) => (
                    <span key={point.title} className="relative w-0.5 flex-1 bg-navy/15">
                      <span
                        className={`absolute inset-0 origin-top bg-orange transition-transform duration-700 ease-out-expo motion-reduce:transition-none ${
                          i <= active ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ul className="lg:col-span-6 lg:col-start-7">
            {points.map((point, i) => (
              <motion.li
                key={point.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className="relative border-t border-navy/15 py-9 last:border-b lg:py-16"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-px left-0 hidden h-0.5 w-full origin-left bg-orange transition-transform duration-700 ease-out-expo motion-reduce:transition-none lg:block ${
                    i === active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <PointImage src={point.image.src} className={point.image.className} still={still} />
                {/* Op desktop staat het kernpunt in beeld op inkt; de rest wacht op zijn beurt. */}
                <div
                  className={`transition-opacity duration-500 motion-reduce:transition-none ${
                    armed && i !== active ? "lg:opacity-50" : ""
                  }`}
                >
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] lg:text-[2.25rem]">
                    {point.title}
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-slate">{point.text}</p>
                  {point.link && (
                    <div className="mt-2">
                      <ArrowLink href={point.link.href}>{point.link.label}</ArrowLink>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Mobiel: het beeld bij een kernpunt wordt van links naar rechts onthuld zodra het in beeld scrolt. */
function PointImage({ src, className, still }: { src: string; className: string; still: boolean }) {
  return (
    <motion.div
      key={still ? "still" : "moving"}
      data-reveal
      initial={still ? false : { clipPath: "inset(0% 100% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-6 aspect-[16/10] overflow-hidden bg-sand lg:hidden"
    >
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 1px, 100vw" className={`object-cover ${className}`} />
    </motion.div>
  );
}
