import Image from "next/image";
import Reveal from "./Reveal";
import { ArrowLink, container } from "./ui";

export default function Team() {
  return (
    <section aria-labelledby="team" className="pt-20 lg:pt-32">
      <div className={container}>
        <div className="grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <h2 id="team" className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Het team dat voor je klaarstaat.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-[48ch] text-lg leading-relaxed text-slate">
              Maak kennis met ons enthousiaste en professionele team van docenten en medewerkers.
            </p>
            <div className="mt-1">
              <ArrowLink href="/onze-school/onze-organisatie">Onze organisatie</ArrowLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="-mx-5 mt-10 sm:-mx-8 lg:-mx-12 lg:mt-14">
          <Image
            src="/images/Groepsfoto-personeel-2026.webp"
            alt="Groepsfoto van het personeel van het Vespucci College voor een kleurrijke muurschildering met een schildpad en een kompasroos"
            width={1920}
            height={900}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="aspect-[3/2] w-full object-cover sm:aspect-[1920/900]"
          />
        </Reveal>
      </div>
    </section>
  );
}
