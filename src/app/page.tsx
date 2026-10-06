import Image from "next/image";
import Link from "next/link";
import { Arrow, ButtonLink, Eyebrow } from "@/components/ui";
import { opleidingen, reviews } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy">
        <Image
          src="/images/Home-bg.jpg"
          alt="Leerlingen van het Vespucci College voor het schoolgebouw"
          fill
          priority
          sizes="100vw"
          className="-z-10 hidden object-cover object-top sm:block"
        />
        <Image
          src="/images/home-mobile-scaled.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover sm:hidden"
        />
        <div className="absolute inset-0 -z-10 bg-navy/70 sm:bg-transparent sm:bg-gradient-to-r sm:from-navy/90 sm:via-navy/60 sm:to-navy/10" aria-hidden="true" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <Eyebrow light>Ontdek je mogelijkheden</Eyebrow>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Ontdek jezelf, <span className="text-orange">creëer</span> je toekomst.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Nederlands onderwijs op mavo, havo en vwo niveau op Curaçao — in kleine klassen, met veel persoonlijke
              aandacht.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/aanmelding-info/inschrijven">Inschrijven</ButtonLink>
              <ButtonLink href="#opleidingen" variant="white">
                Bekijk de opleidingen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Motto */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <Eyebrow>&ldquo;Ontdek je mogelijkheden&rdquo;</Eyebrow>
            <h2 className="text-3xl font-bold sm:text-4xl">Ontdek jezelf, creëer je toekomst.</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted">
              <p>
                &ldquo;Ontdek jezelf, creëer je toekomst&rdquo; is het motto van het Vespucci College. Dat betekent dat
                wij het belangrijk vinden dat je jezelf goed leert kennen en dat je gemotiveerde keuzes kunt maken. Daar
                besteden wij veel aandacht aan.
              </p>
              <p>
                In werkweken, projectweken, stages, mentorlessen en buitenschoolse activiteiten krijg je bij ons alle
                kansen om te ontdekken waar je passie ligt, waar je goed in bent, maar ook waar je extra aandacht nodig
                hebt.
              </p>
              <p>
                Dankzij de kleine klassen kunnen docenten de vorderingen van alle leerlingen goed in het oog houden. Gaat
                het met een bepaald vak toch niet lekker? Dan hebben we keuzewerktijd en begeleidingslessen om je bij te
                spijkeren. Je kan je ook inschrijven voor{" "}
                <Link href="/begeleiding/huiswerkbegeleiding" className="font-semibold text-orange underline-offset-4 hover:underline">
                  huiswerkbegeleiding
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: "/images/links.webp", bg: "bg-orange", offset: "" },
              { src: "/images/rechtsboven.webp", bg: "bg-sun", offset: "translate-y-8" },
              { src: "/images/rechtsonder.webp", bg: "bg-blue", offset: "" },
            ].map((img) => (
              <div key={img.src} className={`relative aspect-[559/1024] overflow-hidden rounded-3xl ${img.bg} ${img.offset}`}>
                <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 20vw, 33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welkom */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/vwo.webp"
                alt="Enthousiaste leerlingen van het Vespucci College"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 rounded-3xl bg-white p-4 shadow-xl sm:-right-8">
              <Image src="/images/25jaar.webp" alt="25 jaar Vespucci College" width={160} height={160} className="h-28 w-auto sm:h-32" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow>Welkom op het</Eyebrow>
            <h2 className="text-3xl font-bold sm:text-5xl">
              Vespucci <span className="text-orange">College</span>
            </h2>
            <p className="mt-6 text-xl font-semibold text-navy">Welkom bij het Vespucci College!</p>
            <p className="mt-4 leading-relaxed text-muted">
              Bij ons staat jouw ontwikkeling centraal. We bieden hoogwaardig onderwijs op mavo, havo en vwo niveaus, waar
              iedere leerling een passend diploma behaalt. Samen ontdekken we jouw talenten en bereiden we je voor op de
              toekomst in een dynamische en veilige leeromgeving.
            </p>
            <p className="mt-6 font-display text-lg font-semibold text-orange">Sluit je aan en creëer je eigen toekomst!</p>
            <div className="mt-8">
              <ButtonLink href="/aanmelding-info/inschrijven" variant="navy">
                Aanmelden
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Visie & missie */}
      <section className="relative overflow-hidden bg-navy text-white">
        <Image
          src="/images/A-2.png"
          alt=""
          width={900}
          height={900}
          className="pointer-events-none absolute -right-24 -top-16 w-80 opacity-30 lg:w-[28rem]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <Eyebrow light>Leidende principes</Eyebrow>
            <h2 className="text-3xl font-bold sm:text-4xl">Onze Visie &amp; Missie</h2>
            <p className="mt-6 leading-relaxed text-white/80">
              Het Vespucci College valt onder de Stichting Nederlands Middelbaar Onderwijs Curaçao. Deze stichting is in
              1999 op verzoek van het ministerie van Defensie opgericht.
            </p>
            <p className="mt-4 leading-relaxed text-white/80">
              Het Vespucci College richt haar onderwijs in conform de Nederlandse onderwijswetgeving en staat open voor
              alle leerlingen. De school streeft naar een mix van leerlingen die hier tijdelijk zijn en leerlingen die op
              Curaçao zijn geboren en/of hier permanent wonen.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <span className="inline-block rounded-full bg-orange px-4 py-1 font-display text-sm font-semibold">Visie</span>
              <p className="mt-5 leading-relaxed text-white/85">
                Het Vespucci College biedt kwalitatief hoogwaardig onderwijs op mavo, havo en vwo niveaus, gericht op
                optimale ontwikkeling van elke leerling, zodat zij een passend diploma behalen en goed voorbereid zijn op
                vervolgonderwijs en de maatschappij.
              </p>
            </article>
            <article className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
              <span className="inline-block rounded-full bg-blue px-4 py-1 font-display text-sm font-semibold">Missie</span>
              <p className="mt-5 leading-relaxed text-white/85">
                Het Vespucci College streeft naar een dynamische leeromgeving waarin leerlingen zichzelf leren kennen,
                verantwoordelijkheid nemen voor hun keuzes en toekomst, en voorbereid worden op een snel veranderende
                maatschappij met 21e-eeuwse vaardigheden.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Opleidingen */}
      <section id="opleidingen" className="scroll-mt-20 bg-ice">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center">
            <Eyebrow>De opleidingen</Eyebrow>
            <h2 className="text-3xl font-bold sm:text-4xl">Op het Vespucci krijg je altijd les, digitaal of op school!</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {opleidingen.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`${o.color} px-7 py-8 text-white`}>
                  <h3 className="text-2xl font-bold">{o.title}</h3>
                </div>
                <div className="flex flex-1 flex-col px-7 py-6">
                  <p className="flex-1 leading-relaxed text-muted">{o.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-navy group-hover:text-orange">
                    Lees verder <Arrow className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Even voorstellen */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-5 lg:px-8 lg:py-28">
          <div className="lg:col-span-2">
            <Eyebrow>Even voorstellen</Eyebrow>
            <h2 className="text-3xl font-bold sm:text-4xl">Maak kennis met ons team</h2>
            <p className="mt-6 leading-relaxed text-muted">
              Maak kennis met ons enthousiaste en professionele team! Bezoek onze organisatie pagina om te zien wie er
              voor je klaarstaan op het Vespucci College.
            </p>
            <div className="mt-8">
              <ButtonLink href="/onze-school/onze-organisatie">Onze Organisatie</ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl lg:col-span-3">
            <Image
              src="/images/Groepsfoto-personeel-2026.webp"
              alt="Groepsfoto personeel Vespucci College 2026"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center">
            <Eyebrow>Reviews</Eyebrow>
            <h2 className="text-3xl font-bold sm:text-4xl">Wat leerlingen en ouders zeggen</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm">
                <svg viewBox="0 0 32 32" className="h-10 w-10 text-orange" fill="currentColor" aria-hidden="true">
                  <path d="M9.3 25.3c-2 0-3.6-.7-4.8-2C3.2 22 2.7 20.3 2.7 18.2c0-2.4.7-4.7 2.2-6.9 1.5-2.2 3.6-4 6.4-5.4l1.1 1.8c-1.7 1-3 2.1-4 3.4-.9 1.3-1.4 2.6-1.4 3.9.3-.1.7-.1 1.2-.1 1.5 0 2.7.5 3.6 1.4.9.9 1.4 2.1 1.4 3.5s-.5 2.6-1.5 3.6c-1 .7-2.1 1.9-2.4 1.9zm14.7 0c-2 0-3.6-.7-4.8-2-1.3-1.3-1.8-3-1.8-5.1 0-2.4.7-4.7 2.2-6.9 1.5-2.2 3.6-4 6.4-5.4l1.1 1.8c-1.7 1-3 2.1-4 3.4-.9 1.3-1.4 2.6-1.4 3.9.3-.1.7-.1 1.2-.1 1.5 0 2.7.5 3.6 1.4.9.9 1.4 2.1 1.4 3.5s-.5 2.6-1.5 3.6c-1 .7-2.1 1.9-2.4 1.9z" />
                </svg>
                <blockquote className="mt-5 flex-1 leading-relaxed text-muted">{r.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-navy/10 pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-display font-semibold text-white">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-navy">{r.name}</span>
                    <span className="block text-sm text-orange">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
