"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/lib/site";

const field =
  "mt-2 block w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy placeholder:text-slate/60 transition-colors hover:border-navy/40 focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-orange";
const label = "block font-display text-sm font-semibold text-navy";

function Required() {
  return (
    <span className="text-ember" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

/** Contactformulier. TODO: verzenden aansluiten; nu alleen het ontwerp. */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className={label}>
          Naam
          <Required />
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input id="voornaam" name="voornaam" type="text" autoComplete="given-name" required className={field} />
            <label htmlFor="voornaam" className="mt-1.5 block text-sm text-slate">
              Voornaam
            </label>
          </div>
          <div>
            <input id="achternaam" name="achternaam" type="text" autoComplete="family-name" required className={field} />
            <label htmlFor="achternaam" className="mt-1.5 block text-sm text-slate">
              Achternaam
            </label>
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="email" className={label}>
          E-mail
          <Required />
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={field} />
      </div>

      <div>
        <label htmlFor="bericht" className={label}>
          Bericht
        </label>
        <textarea id="bericht" name="bericht" rows={7} className={`${field} resize-y`} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center rounded-full bg-orange px-8 py-3 font-display text-[0.95rem] font-semibold text-navy transition-colors duration-200 hover:bg-navy hover:text-chalk"
        >
          Verzend
        </button>
        <p className="text-sm text-slate">
          Velden met <span className="text-ember">*</span> zijn verplicht.
        </p>
      </div>

      <p role="status" className={sent ? "border-l-2 border-orange bg-sand px-4 py-3 text-navy" : "sr-only"}>
        {sent && (
          <>
            Het formulier is nog niet aangesloten. Mail ons tot die tijd via{" "}
            <a href={`mailto:${contact.email}`} className="font-semibold text-ember underline underline-offset-4">
              {contact.email}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
