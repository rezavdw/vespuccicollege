"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import type { PageFlip, SizeType } from "page-flip";

export type PdfDocument = { src: string; title: string };

async function loadPdf(src: string) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
  return pdfjs.getDocument({ url: src, standardFontDataUrl: "/pdfjs/standard_fonts/", cMapUrl: "/pdfjs/cmaps/", cMapPacked: true, wasmUrl: "/pdfjs/wasm/" });
}

function Cover({ src, title }: PdfDocument) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let loading: PDFDocumentLoadingTask | undefined;
    let render: RenderTask | undefined;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        loading = await loadPdf(src);
        if (disposed) { await loading.destroy(); return; }
        const pdf = await loading.promise;
        const page = await pdf.getPage(1);
        if (disposed) return;
        const viewport = page.getViewport({ scale: 360 / page.getViewport({ scale: 1 }).width });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        render = page.render({ canvas, viewport });
        await render.promise;
        if (!disposed) setReady(true);
      } catch {
        // The document link remains available if a preview cannot be generated.
      } finally { await loading?.destroy(); }
    }, { rootMargin: "150px" });
    observer.observe(canvas);
    return () => { disposed = true; observer.disconnect(); render?.cancel(); void loading?.destroy(); };
  }, [src]);
  return <div className="pdf-cover"><span className="pdf-cover-fallback" aria-hidden="true">PDF</span><canvas ref={canvasRef} role="img" aria-label={`Omslag: ${title}`} className={ready ? "opacity-100" : "opacity-0"} /></div>;
}

function Reader({ src, title, onClose }: PdfDocument & { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const host = hostRef.current;
    if (!dialog || !host) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let disposed = false;
    let loading: PDFDocumentLoadingTask | undefined;
    let flip: PageFlip | undefined;
    const renders = new Set<RenderTask>();
    const book = document.createElement("div");
    host.appendChild(book);
    const init = async () => {
      try {
        const [{ PageFlip }, task] = await Promise.all([import("page-flip"), loadPdf(src)]);
        loading = task;
        if (disposed) { await loading.destroy(); return; }
        const pdf = await loading.promise;
        const first = await pdf.getPage(1);
        const base = first.getViewport({ scale: 1 });
        const elements = Array.from({ length: pdf.numPages }, (_, index) => {
          const element = document.createElement("div");
          element.className = "pdf-paper";
          element.setAttribute("aria-label", `Pagina ${index + 1}`);
          if (index === 0 || index === pdf.numPages - 1) element.dataset.density = "hard";
          const canvas = document.createElement("canvas");
          canvas.setAttribute("aria-hidden", "true");
          element.appendChild(canvas);
          book.appendChild(element);
          return element;
        });
        const rendered = new Set<number>();
        async function draw(index: number) {
          if (disposed || index < 0 || index >= pdf.numPages || rendered.has(index)) return;
          rendered.add(index);
          try {
            const page = await pdf.getPage(index + 1);
            if (disposed) return;
            const viewport = page.getViewport({ scale: 1100 / page.getViewport({ scale: 1 }).width });
            const canvas = elements[index].querySelector("canvas")!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const render = page.render({ canvas, viewport });
            renders.add(render);
            await render.promise;
            renders.delete(render);
          } catch { if (!disposed) setError(true); }
        }
        await Promise.all([draw(0), draw(1), draw(2)]);
        if (disposed) return;
        const height = Math.max(180, Math.min(660, window.innerHeight - 210));
        const width = height * base.width / base.height;
        flip = new PageFlip(book, {
          width, height,
          size: "stretch" as SizeType,
          minWidth: Math.min(280, width, host.clientWidth), maxWidth: width,
          minHeight: 180, maxHeight: height,
          showCover: true,
          usePortrait: true,
          autoSize: true,
          mobileScrollSupport: false,
          flippingTime: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 650,
          maxShadowOpacity: 0.25,
        });
        flip.on("flip", (event) => {
          const index = Number(event.data);
          setCurrent(index);
          for (let offset = -1; offset <= 3; offset++) void draw(index + offset);
        });
        flip.loadFromHTML(elements);
        flipRef.current = flip;
        setTotal(pdf.numPages);
        setReady(true);
      } catch { if (!disposed) setError(true); }
    };
    void init();
    return () => {
      disposed = true;
      flipRef.current = null;
      renders.forEach((render) => render.cancel());
      flip?.destroy();
      if (book.parentElement) book.remove();
      void loading?.destroy();
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [src]);

  const navigate = (direction: "previous" | "next") => {
    if (direction === "next") flipRef.current?.flipNext();
    else flipRef.current?.flipPrev();
  };
  return (
    <dialog ref={dialogRef} className="pdf-dialog" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); navigate(event.key === "ArrowRight" ? "next" : "previous"); }
    }}>
      <div className="pdf-dialog-panel">
        <div className="pdf-dialog-header"><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Boek sluiten" autoFocus>Sluiten <span aria-hidden="true">&times;</span></button></div>
        <div className="pdf-reader-stage">
          {!ready && !error && <p role="status">Boek laden...</p>}
          {error && <p role="alert">Het boek kon niet worden geladen. Je kunt de PDF hieronder openen.</p>}
          <div ref={hostRef} className="pdf-reader-host" />
        </div>
        <div className="pdf-reader-controls">
          <button type="button" onClick={() => navigate("previous")} disabled={!ready || current === 0} aria-label="Vorige pagina">&larr; Vorige</button>
          <p role="status" aria-live="polite">{total ? `Pagina ${current + 1} van ${total}` : "PDF"}</p>
          <button type="button" onClick={() => navigate("next")} disabled={!ready || current >= total - 1} aria-label="Volgende pagina">Volgende &rarr;</button>
        </div>
        <div className="pdf-reader-links"><a href={src} target="_blank" rel="noopener noreferrer">Open PDF</a><a href={src} download>Download PDF</a></div>
      </div>
    </dialog>
  );
}

export default function PdfBook({ src, title }: PdfDocument) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pdf-book">
      <button type="button" className="pdf-book-trigger" onClick={() => setOpen(true)} aria-label={`Lees ${title} als boek`}>
        <Cover src={src} title={title} />
        <span className="pdf-book-title">{title}</span>
        <span className="pdf-book-hint">Open boek &rarr;</span>
      </button>
      <a href={src} download className="pdf-book-download">Download PDF</a>
      {open && <Reader src={src} title={title} onClose={() => setOpen(false)} />}
    </div>
  );
}