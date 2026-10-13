"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/**
 * Verschuift de inhoud een paar pixels ten opzichte van de scroll. Alleen transform,
 * dus geen layout shift; bij `prefers-reduced-motion` staat de inhoud stil.
 */
export default function Parallax({
  children,
  distance = 24,
  className,
}: {
  children: ReactNode;
  /** Totale verschuiving in pixels; negatief beweegt tegen de scroll in. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className}>
      {still ? children : <motion.div style={{ y }}>{children}</motion.div>}
    </div>
  );
}
