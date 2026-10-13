import Reveal from "./Reveal";
import { BrushStroke, container } from "./ui";

const moments = [
  {
    year: "1999",
    title: "De start",
    text: "De Stichting Nederlands Middelbaar Onderwijs Curaçao wordt opgericht, op verzoek van het ministerie van Defensie.",
  },
  {
    year: "2024",
    title: "25 jaar Vespucci",
    text: "De school viert haar 25-jarig jubileum.",
  },
  {
    year: "Nu",
    title: "Een school voor het hele eiland",
    text: "Mavo, havo en vwo voor leerlingen die tijdelijk op Curaçao zijn en voor leerlingen die hier wonen.",
  },
];

export default function Timeline() {
  return (
    <section aria-labelledby="tijdlijn" className="py-20 lg:py-28">
      <div className={container}>
        <h2 id="tijdlijn" className="text-2xl font-semibold tracking-[-0.02em] lg:text-3xl">
          Sinds 1999 op Curaçao
        </h2>
        <ol className="mt-10 grid gap-y-10 md:grid-cols-3 lg:mt-14">
          {moments.map((moment, i) => (
            <li key={moment.year} className="relative border-t-2 border-navy/15 pt-8 md:pr-10">
              <span aria-hidden="true" className="absolute -top-[9px] left-0 h-4 w-4 rounded-full border-2 border-orange bg-chalk" />
              <Reveal delay={i * 0.08}>
                <p className="relative isolate inline-block font-display text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                  {i === 0 && (
                    <BrushStroke className="absolute -inset-x-3 bottom-0 -z-10 h-[0.45em] w-[calc(100%+1.5rem)] text-peach" />
                  )}
                  {moment.year}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.01em]">{moment.title}</h3>
                <p className="mt-2 max-w-[38ch] leading-relaxed text-slate">{moment.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
