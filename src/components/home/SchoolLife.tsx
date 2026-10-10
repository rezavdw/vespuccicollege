import Image from "next/image";
import Parallax from "./Parallax";
import Reveal from "./Reveal";
import { ArrowLink, container } from "./ui";

export default function SchoolLife() {
  return (
    <section aria-labelledby="leven-op-school" className="overflow-hidden py-20 lg:py-32">
      <div className={container}>
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2
              id="leven-op-school"
              className="text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            >
              Leven op school.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <p className="max-w-[56ch] text-lg leading-relaxed text-slate">
              School is meer dan lessen. In mentorlessen, projectweken en buitenschoolse activiteiten leer je jezelf en
              elkaar kennen, en via de leerlingenraad praat je mee over de school.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-8">
              <ArrowLink href="/begeleiding/school-en-studiereizen">School- en studiereizen</ArrowLink>
              <ArrowLink href="/begeleiding/leerlingenraad">Leerlingenraad</ArrowLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-6 items-start gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <Parallax distance={14} className="col-span-3 lg:col-span-3">
            <Image
              src="/images/links.webp"
              alt="Leerling met een stapel boeken en een koptelefoon om haar nek"
              width={600}
              height={1100}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="h-auto w-full"
            />
          </Parallax>

          <Parallax distance={-18} className="order-3 col-span-6 lg:order-none lg:col-span-5 lg:mt-32">
            <figure>
              <Image
                src="/images/vwo.webp"
                alt="Een groep leerlingen zwaait naar de camera voor het schoolgebouw"
                width={640}
                height={480}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="chart-note mt-3 text-slate">Voor het schoolgebouw in Julianadorp</figcaption>
            </figure>
          </Parallax>

          <Parallax distance={26} className="col-span-3 mt-10 lg:col-span-2 lg:mt-12">
            <Image
              src="/images/rechtsboven.webp"
              alt="Juichende leerling met beide armen in de lucht"
              width={600}
              height={1100}
              sizes="(min-width: 1024px) 17vw, 50vw"
              className="h-auto w-full"
            />
          </Parallax>

          <Parallax distance={-10} className="order-4 col-span-3 col-start-4 lg:order-none lg:col-span-2 lg:col-start-auto lg:mt-56">
            <Image
              src="/images/rechtsonder.webp"
              alt="Lachende leerling met zijn handen boven zijn hoofd"
              width={600}
              height={1100}
              sizes="(min-width: 1024px) 17vw, 50vw"
              className="h-auto w-full"
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
