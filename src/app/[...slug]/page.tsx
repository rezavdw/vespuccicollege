import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PdfBook, { type PdfDocument } from "@/components/PdfBook";
import importedPages from "@/data/legacy-pages.json";
import { allPages, navigation } from "@/lib/site";

type Embed = { src: string; title: string };
type LegacyPage = {
  title: string;
  sourceUrl: string;
  html: string;
  embeds: Embed[];
  forms: Embed[];
  documents: PdfDocument[];
};

// Static, sanitized source content: no WordPress scripts or inline event handlers.
const pages: Record<string, LegacyPage> = importedPages;
export const dynamicParams = false;

export function generateStaticParams() {
  return allPages.map((page) => ({ slug: page.href.slice(1).split("/") }));
}

export async function generateMetadata(props: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const page = pages[`/${slug.join("/")}`];
  return { title: page?.title };
}

export default async function Page(props: PageProps<"/[...slug]">) {
  const { slug } = await props.params;
  const href = `/${slug.join("/")}`;
  const page = pages[href];
  if (!page) notFound();
  const section = navigation.find((item) => item.children?.some((child) => child.href === href));

  return (
    <>
      <section className="border-b border-navy/10 bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate">
            <Link href="/" className="hover:text-ember hover:underline">Home</Link>
            <span aria-hidden="true">/</span>
            {section && <><span>{section.label}</span><span aria-hidden="true">/</span></>}
            <span aria-current="page" className="text-navy">{page.title}</span>
          </nav>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8 lg:py-16">
        <article className="min-w-0">
          <div className="legacy-content">
            {page.html.split(/<div data-pdf-book="(\d+)"><\/div>/g).map((part, index) => index % 2 === 0
              ? (part.trim() ? <div key={index} dangerouslySetInnerHTML={{ __html: part }} /> : null)
              : <PdfBook key={index} {...page.documents[Number(part)]} />)}
          </div>
          {page.embeds.map((embed) => (
            <iframe key={embed.src} src={embed.src} title={embed.title} loading="lazy" className="mt-8 h-[450px] w-full rounded-lg border border-navy/15" referrerPolicy="strict-origin-when-cross-origin" />
          ))}
          {page.forms.map((form) => (
            <section key={form.src} className="mt-8">
              <iframe src={form.src} title={form.title} loading="lazy" className="h-[1600px] w-full rounded-lg border border-navy/15 bg-white" />
              <a href={form.src} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-ember underline underline-offset-4">Open formulier in een nieuw venster</a>
            </section>
          ))}
        </article>
        <aside className="min-w-0 lg:border-l lg:border-navy/10 lg:pl-8">
          <nav aria-label={section?.label ?? "Pagina's"} className="sticky top-28">
            <p className="mb-4 font-display text-lg font-semibold">{section?.label ?? "Vespucci College"}</p>
            <ul className="space-y-1">
              {(section?.children ?? navigation.filter((item) => !item.children)).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={item.href === href ? "page" : undefined} className={`block border-l-2 px-4 py-3 text-sm transition-colors ${item.href === href ? "border-orange bg-sand font-semibold text-navy" : "border-transparent text-slate hover:border-orange hover:bg-sand"}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}