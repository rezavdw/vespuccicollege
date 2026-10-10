import Reveal from "./Reveal";
import { container } from "./ui";

// TODO: vervangen door echte interviews + foto
const voices = [
  {
    quote:
      "Het grootste voordeel vind ik dat er in de les veel meer rust is. In Nederland is de leraar vaak bezig met orde; hier niet. Je krijgt echt de kans om je optimaal te ontwikkelen.",
    name: "Thijs",
    role: "Leerling vwo",
  },
  {
    quote:
      "De klassen zijn veel kleiner en daardoor is er meer persoonlijke aandacht voor je. Al je vragen worden beantwoord, er is veel begeleiding en we doen vaak activiteiten.",
    name: "Abby",
    role: "Leerling havo, een half jaar op school",
  },
  {
    quote: "Mijn dochter zit nu in haar tweede jaar en ik ben buitengewoon tevreden met de vooruitgang die ze maakt.",
    name: "Ouder",
    role: "Moeder van een tweedejaars",
  },
];

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M0 36V21.6C0 9.6 6.4 2.4 19.2 0l2.4 5.6c-6 1.8-9 5.2-9.2 10.4h8.8v20H0Zm26.4 0V21.6c0-12 6.4-19.2 19.2-21.6L48 5.6c-6 1.8-9 5.2-9.2 10.4h8.8v20H26.4Z" />
    </svg>
  );
}

export default function Voices() {
  const [lead, ...others] = voices;
  return (
    <section aria-labelledby="stemmen" className="bg-sand py-20 lg:py-32">
      <div className={container}>
        <h2 id="stemmen" className="text-2xl font-semibold tracking-[-0.02em] lg:text-3xl">
          Wat leerlingen en ouders zeggen
        </h2>

        <Reveal className="mt-10 lg:mt-14">
          <figure className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
            <QuoteMark className="h-9 w-12 text-orange lg:col-span-1 lg:mt-3 lg:h-12 lg:w-16" />
            <div className="lg:col-span-10">
              <blockquote className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.14] tracking-[-0.025em] text-pretty">
                <p>{lead.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-lg font-semibold">{lead.name}</span>
                <span className="text-slate">{lead.role}</span>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <div className="mt-14 grid gap-x-10 lg:mt-20 lg:grid-cols-12">
          {others.map((voice, i) => (
            <Reveal
              key={voice.name}
              delay={i * 0.08}
              className={`border-t border-navy/20 py-8 ${i === 0 ? "lg:col-span-5 lg:col-start-2" : "lg:col-span-5"}`}
            >
              <figure>
                <blockquote className="text-xl leading-relaxed text-pretty">
                  <p>{voice.quote}</p>
                </blockquote>
                <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display font-semibold">{voice.name}</span>
                  <span className="text-slate">{voice.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
