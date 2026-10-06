import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { LEGACY_URL, allPages } from "@/lib/site";

// Placeholder for pages that have not been migrated from the WordPress site yet.

export const dynamicParams = false;

export function generateStaticParams() {
  return allPages.map((p) => ({ slug: p.href.slice(1).split("/") }));
}

function findPage(slug: string[]) {
  return allPages.find((p) => p.href === `/${slug.join("/")}`);
}

export async function generateMetadata(props: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: findPage(slug)?.label };
}

export default async function Page(props: PageProps<"/[...slug]">) {
  const { slug } = await props.params;
  const page = findPage(slug);
  if (!page) notFound();

  return (
    <>
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Eyebrow light>Vespucci College</Eyebrow>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">{page.label}</h1>
        </div>
      </section>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Deze pagina wordt binnenkort vernieuwd</h2>
          <p className="mt-4 leading-relaxed text-muted">
            We zetten de inhoud van deze pagina op dit moment over naar de nieuwe website. Tot die tijd vind je alle
            informatie op onze huidige website.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`${LEGACY_URL}${page.href}/`}
              className="inline-flex items-center rounded-full bg-orange px-7 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:bg-navy"
            >
              Bekijk op de huidige website
            </a>
            <ButtonLink href="/" variant="navy">
              Terug naar home
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
