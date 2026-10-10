import { container } from "./ui";

export type KeyFigure = {
  label: string;
  /** Laat leeg zolang het cijfer niet door de school is aangeleverd. */
  value?: string;
  note?: string;
};

export default function KeyFigures({ figures }: { figures: KeyFigure[] }) {
  return (
    <section aria-labelledby="kerncijfers" className="py-16 lg:py-24">
      <div className={container}>
        <h2 id="kerncijfers" className="text-2xl font-semibold tracking-[-0.02em] lg:text-3xl">
          Het Vespucci College in cijfers
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 lg:grid-cols-4 lg:gap-x-10">
          {figures.map((figure) => (
            <div key={figure.label} className="flex flex-col-reverse justify-end border-t border-navy/20 py-6">
              <dt className="mt-2 leading-snug text-slate">
                {figure.label}
                {figure.note && <span className="block text-sm">{figure.note}</span>}
              </dt>
              <dd className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                {figure.value ?? (
                  <>
                    <span aria-hidden="true" className="text-navy/30">
                      —
                    </span>
                    <span className="sr-only">Volgt nog</span>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
