"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Laat de inhoud rustig binnenkomen zodra die in beeld scrolt. Animeert alleen
 * opacity en transform; bij `prefers-reduced-motion` staat de inhoud er gewoon.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Vertraging in seconden, voor een gestaggerde reeks. */
  delay?: number;
  className?: string;
}) {
  const still = usePrefersReducedMotion();
  if (still) return <div className={className}>{children}</div>;

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.65, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
