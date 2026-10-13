import Reveal from "./Reveal";
import { Button, CompassRose, Waypoint, container } from "./ui";

export default function ClosingCta() {
  return (
    <section aria-labelledby="kennismaken" className="relative isolate overflow-hidden bg-orange py-20 text-navy lg:py-32">
      <CompassRose className="absolute -bottom-56 -right-40 -z-10 h-[30rem] w-[30rem] text-navy/15 lg:-bottom-56 lg:-right-20 lg:h-[44rem] lg:w-[44rem] lg:text-navy/25" />
      <div className="absolute inset-x-0 top-0 mx-auto max-w-7xl">
        <Waypoint className="right-5 top-0" />
      </div>
      <Reveal className={container}>
        <h2
          id="kennismaken"
          className="text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.96] tracking-[-0.035em]"
        >
          Kom kennismaken.
        </h2>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed sm:text-xl">
          Benieuwd of het Vespucci College bij je past? Meld je aan of neem contact met ons op. We denken graag met je
          mee, ook als je nog niet op Curaçao woont.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/aanmelding-info/inschrijven" variant="ink">
            Aanmelden
          </Button>
          <Button href="/contact" variant="outlineOnAccent">
            Contact
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
