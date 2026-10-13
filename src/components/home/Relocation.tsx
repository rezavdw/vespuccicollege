import Reveal from "./Reveal";
import CrossingMap from "./CrossingMap";
import { ArrowLink, Waypoint, container } from "./ui";

const steps = [
  {
    title: "Kennismaken",
    text: "Neem contact met ons op, ook als je nog in Nederland woont. We vertellen je hoe de school werkt en hoe we je bij de verhuizing begeleiden.",
    link: { label: "Begeleiding bij verhuizing", href: "/begeleiding/begeleiding-bij-verhuizing" },
  },
  {
    title: "Inventarisatieformulier",
    text: "Vul het inventarisatieformulier in. Zo weten we waar je vandaan komt en op welk niveau je het beste kunt instromen.",
    link: { label: "Naar het formulier", href: "/aanmelding-info/inventarisatieformulier" },
  },
  {
    title: "Inschrijven",
    text: "Past het? Dan schrijf je je in en regelen we samen wat er nog nodig is.",
    link: { label: "Inschrijven", href: "/aanmelding-info/inschrijven" },
  },
  {
    title: "Eerste schooldag",
    text: "Je begint in een kleine klas, met docenten die je snel leren kennen.",
  },
];

export default function Relocation() {
  return (
    <section aria-labelledby="verhuizen" className="relative isolate overflow-hidden bg-navy py-20 text-chalk lg:py-32">
      <div className="chart-grid absolute inset-0 -z-10 text-chalk" aria-hidden="true" />

      <div className={`${container} relative grid gap-x-10 gap-y-14 lg:grid-cols-12`}>
        <Waypoint className="bottom-0 right-5" />
        <Reveal className="lg:col-span-5">
          <h2
            id="verhuizen"
            className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            Verhuizen naar Curaçao?
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-mist">
            Een school kiezen op afstand is spannend. Omdat we lesgeven volgens het Nederlandse curriculum, loopt je
            opleiding gewoon door. Instromen kan het hele schooljaar, en we begeleiden je bij de overstap.
          </p>

          <CrossingMap className="mt-10 w-full max-w-xl text-chalk" />
        </Reveal>

        <ol className="lg:col-span-6 lg:col-start-7">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-chalk/20 last:border-b">
              <Reveal delay={i * 0.07} className="grid grid-cols-[3.25rem_1fr] gap-x-4 py-7 sm:grid-cols-[4.5rem_1fr]">
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-semibold leading-none tracking-[-0.02em] text-orange tabular-nums sm:text-4xl"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-mist">{step.text}</p>
                  {step.link && (
                    <div className="mt-1">
                      <ArrowLink href={step.link.href} className="text-orange">
                        {step.link.label}
                      </ArrowLink>
                    </div>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
