import Image from "next/image";
import { contact } from "@/lib/site";
import { BrushStroke, Button, CompassRose, Waypoint, container } from "./ui";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="chart-grid absolute inset-0 -z-10 text-navy" aria-hidden="true" />
      <CompassRose className="absolute -right-24 -top-28 -z-10 h-[26rem] w-[26rem] text-navy/10 lg:-right-16 lg:-top-24 lg:h-[34rem] lg:w-[34rem] lg:text-navy/15" />

      <div className={`${container} relative pb-12 pt-12 sm:pt-16 lg:pb-20 lg:pt-20`}>
        <h1 className="hero-rise text-[clamp(2.6rem,7.4vw,6rem)] font-semibold leading-[0.96] tracking-[-0.035em]">
          Ontdek jezelf,
          <br />
          <span className="relative isolate inline-block text-ember">
            <BrushStroke className="absolute -inset-x-[0.15em] bottom-[0.02em] -z-10 h-[0.42em] w-[calc(100%+0.3em)] text-peach" />
            creëer je toekomst.
          </span>
        </h1>

        <div className="mt-10 grid gap-x-10 gap-y-10 lg:mt-14 lg:grid-cols-12">
          <div className="relative lg:col-span-4 lg:pt-4">
            <Waypoint origin className="-left-7 top-9" />
            <p className="hero-rise max-w-md text-lg leading-relaxed text-slate [--i:1] sm:text-xl">
              <strong className="font-semibold text-navy">Een Nederlands diploma, een Caribische jeugd.</strong> Mavo,
              havo en vwo op Curaçao, in kleine klassen met veel persoonlijke aandacht.
            </p>
            <div className="hero-rise mt-8 flex flex-wrap gap-3 [--i:2]">
              <Button href="/aanmelding-info/inschrijven">Aanmelden</Button>
              <Button href="#opleidingen" variant="outline">
                Bekijk de opleidingen
              </Button>
            </div>
          </div>

          <figure className="lg:col-span-8">
            <div className="relative -mx-5 sm:-mx-8 lg:mx-0 lg:-mr-12">
              <Image
                src="/images/home-mobile-scaled.jpg"
                alt="Negen leerlingen van het Vespucci College poseren lachend voor de schoolmuur met het logo"
                width={2560}
                height={1673}
                preload
                sizes="(min-width: 1280px) 820px, (min-width: 1024px) 64vw, 100vw"
                className="aspect-[4/3] w-full object-cover sm:aspect-[3/2]"
              />
              {/* Jubileumbadge in een uitsnede van de foto */}
              <div className="absolute -bottom-px left-5 bg-chalk px-4 pt-4 sm:left-8 lg:left-0 lg:pl-0 lg:pr-6 lg:pt-5">
                <div className="relative h-[5.5rem] w-[6.25rem] overflow-hidden sm:h-28 sm:w-32">
                  <Image
                    src="/images/25jaar.webp"
                    alt="25 jaar Vespucci College, 1999–2024"
                    fill
                    sizes="128px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <figcaption className="chart-note mt-4 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-slate">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ember" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M8 1v14M1 8h14" />
                <circle cx="8" cy="8" r="3.25" />
              </svg>
              <span>
                {contact.locality}, {contact.country}
              </span>
              <span aria-hidden="true">{contact.coordinates}</span>
            </figcaption>
          </figure>
        </div>
        <Waypoint className="bottom-0 left-5" />
      </div>
    </section>
  );
}
