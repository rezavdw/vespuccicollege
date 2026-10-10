import Reveal from "./Reveal";
import { ArrowLink, container } from "./ui";

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

export default function WhyVespucci() {
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

        <ul className="mt-14 lg:mt-20">
          {points.map((point, i) => (
            <li key={point.title} className="border-t border-navy/15 last:border-b">
              <Reveal delay={i * 0.06} className="grid gap-x-10 gap-y-3 py-8 lg:grid-cols-12 lg:py-10">
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] lg:col-span-5 lg:text-[2rem]">
                  {point.title}
                </h3>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="max-w-[62ch] text-lg leading-relaxed text-slate">{point.text}</p>
                  {point.link && (
                    <div className="mt-2">
                      <ArrowLink href={point.link.href}>{point.link.label}</ArrowLink>
                    </div>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
