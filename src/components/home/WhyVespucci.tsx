"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";
import { ArrowLink, BrushStroke, container } from "./ui";

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

  return (
    <section aria-labelledby="waarom" className="py-20 lg:py-32">
      <div className={container}>
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 id="waarom" className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Een Nederlands diploma, een Caribische jeugd.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pt-3">
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
                <BrushStroke variant="swoosh" className="absolute -bottom-16 -left-20 -z-10 w-80 text-peach" />
                <div className="absolute inset-0 overflow-hidden bg-sand">
                  {points.map((point, i) => (
                    <Image
                      key={point.title}
                      src={point.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 470px, 40vw"
                      className={`object-cover transition-opacity duration-700 ease-out-expo motion-reduce:transition-none ${point.image.className} ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
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
                className="relative border-t border-navy/15 py-9 last:border-b lg:py-14"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-px left-0 hidden h-0.5 w-full origin-left bg-orange transition-transform duration-700 ease-out-expo motion-reduce:transition-none lg:block ${
                    i === active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <div className="relative mb-6 aspect-[16/10] overflow-hidden bg-sand lg:hidden">
                  <Image
                    src={point.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 1px, 100vw"
                    className={`object-cover ${point.image.className}`}
                  />
                </div>
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] lg:text-[2rem]">
                  {point.title}
                </h3>
                <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-slate">{point.text}</p>
                {point.link && (
                  <div className="mt-2">
                    <ArrowLink href={point.link.href}>{point.link.label}</ArrowLink>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
