import Image from "next/image";

export type PdfDocument = { src: string; title: string };

export default function PdfBook({ src, title }: PdfDocument) {
  return (
    <div className="pdf-book">
      <a href={src} className="pdf-book-trigger" aria-label={`Open ${title} als PDF`}>
        <div className="pdf-cover">
          <span className="pdf-cover-brand">
            <Image src="/images/logo.webp" alt="Vespucci College" width={150} height={112} />
          </span>
        </div>
        <span className="pdf-book-title">{title}</span>
        <span className="pdf-book-hint">Open PDF &rarr;</span>
      </a>
      <a href={src} download className="pdf-book-download">Download PDF</a>
    </div>
  );
}