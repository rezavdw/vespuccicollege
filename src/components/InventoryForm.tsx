"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { contact } from "@/lib/site";

const field =
  "mt-2 block w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy placeholder:text-slate/60 transition-colors hover:border-navy/40 focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-orange";
const label = "block font-display text-sm font-semibold text-navy";

type Plan = "blijft" | "vertrekt" | "onzeker";
type Reason = "examen" | "nederland" | "andere-school";

const plans: { value: Plan; label: string }[] = [
  { value: "blijft", label: "Ik verwacht dat mijn kind volgend schooljaar leerling is van het Vespucci College" },
  { value: "vertrekt", label: "Mijn kind gaat het Vespucci College aan het eind van dit schooljaar verlaten" },
  { value: "onzeker", label: "Ik kan nog niet aangeven of mijn kind ook volgend jaar leerling van het Vespucci College is" },
];

const reasons: { value: Reason; label: string }[] = [
  { value: "examen", label: "Examenjaar, bij diploma naar vervolgopleiding" },
  { value: "nederland", label: "Terugkeer naar Nederland" },
  { value: "andere-school", label: "Andere school op Curaçao" },
];

function Required() {
  return (
    <span className="text-ember" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

/** Keuze als aanklikbare regel; de gekozen regel krijgt een oranje rand. */
function Choice({
  name,
  value,
  checked,
  onChange,
  required,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-navy/20 bg-white px-4 py-3.5 transition-colors hover:border-navy/40 has-[:checked]:border-orange has-[:checked]:bg-sand/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        className="mt-1 h-4 w-4 shrink-0 accent-orange outline-none"
      />
      <span className="leading-snug text-navy">{children}</span>
    </label>
  );
}

/** Inventarisatieformulier. TODO: verzenden aansluiten; nu alleen het ontwerp. */
export default function InventoryForm() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div className="space-y-6">
        <fieldset>
          <legend className={label}>
            Naam leerling
            <Required />
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <input id="voornaam" name="voornaam" type="text" required className={field} />
              <label htmlFor="voornaam" className="mt-1.5 block text-sm text-slate">
                Voornaam
              </label>
            </div>
            <div>
              <input id="achternaam" name="achternaam" type="text" required className={field} />
              <label htmlFor="achternaam" className="mt-1.5 block text-sm text-slate">
                Achternaam
              </label>
            </div>
          </div>
        </fieldset>

        <div className="grid gap-x-4 gap-y-6 sm:grid-cols-[10rem_1fr]">
          <div>
            <label htmlFor="klas" className={label}>
              Klas
            </label>
            <input id="klas" name="klas" type="text" placeholder="Bijv. 3B" className={field} />
          </div>
          <div>
            <label htmlFor="email" className={label}>
              Uw e-mail
              <Required />
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className={field} />
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="font-display text-xl font-semibold tracking-[-0.01em] text-navy">
          Volgend schooljaar
          <Required />
        </legend>
        <div className="mt-4 space-y-3">
          {plans.map((option) => (
            <Choice
              key={option.value}
              name="keuze"
              value={option.value}
              checked={plan === option.value}
              onChange={() => setPlan(option.value)}
              required
            >
              {option.label}
            </Choice>
          ))}
        </div>
      </fieldset>

      {/* De vervolgvragen horen bij de gemaakte keuze en verschijnen pas dan. */}
      {plan === "vertrekt" && (
        <fieldset className="border-l-2 border-orange pl-5 sm:pl-6">
          <legend className={label}>Reden van vertrek</legend>
          <div className="mt-3 space-y-3">
            {reasons.map((option) => (
              <Choice
                key={option.value}
                name="reden"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
              >
                {option.label}
              </Choice>
            ))}
          </div>
          {reason === "andere-school" && (
            <div className="mt-5">
              <label htmlFor="namelijk" className={label}>
                Namelijk
              </label>
              <input
                id="namelijk"
                name="namelijk"
                type="text"
                placeholder="Naam van de school, omdat…"
                className={field}
              />
            </div>
          )}
        </fieldset>
      )}

      {plan === "onzeker" && (
        <div className="border-l-2 border-orange pl-5 sm:pl-6">
          <label htmlFor="toelichting" className={label}>
            Toelichting
          </label>
          <textarea id="toelichting" name="toelichting" rows={5} className={`${field} resize-y`} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center rounded-full bg-orange px-8 py-3 font-display text-[0.95rem] font-semibold text-navy transition-colors duration-200 hover:bg-navy hover:text-chalk"
        >
          Versturen
        </button>
        <p className="text-sm text-slate">
          Velden met <span className="text-ember">*</span> zijn verplicht.
        </p>
      </div>

      <p role="status" className={sent ? "border-l-2 border-orange bg-sand px-4 py-3 text-navy" : "sr-only"}>
        {sent && (
          <>
            Het formulier is nog niet aangesloten. Mail uw keuze tot die tijd naar{" "}
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
