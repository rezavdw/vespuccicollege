"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

// Platte kaart van 80°W–15°O en 5°N–60°N op 520×420 eenheden.
const x = (lon: number) => ((lon + 80) / 95) * 520;
const y = (lat: number) => ((60 - lat) / 55) * 420;

const NL = { x: x(5.3), y: y(52.1) };
const CUR = { x: x(-69), y: y(12.1) };
const CROSSING = `M${NL.x} ${NL.y}Q${x(-38)} ${y(50)} ${CUR.x} ${CUR.y}`;

const meridians = [-70, -60, -50, -40, -30, -20, -10, 0, 10];
const parallels = [10, 20, 30, 40, 50];

/**
 * Zeekaart met de oversteek van Nederland naar Curaçao; de route wordt getekend
 * terwijl je scrolt. Decoratief: de omtrek van het eiland is een vrije schets.
 */
export default function CrossingMap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const drawn = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const arrived = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
    <svg viewBox="0 0 520 420" fill="none" aria-hidden="true" className="h-auto w-full">
      <g stroke="currentColor" strokeOpacity="0.16" strokeWidth="1">
        {meridians.map((lon) => (
          <path key={lon} d={`M${x(lon)} 0V420`} />
        ))}
        {parallels.map((lat) => (
          <path key={lat} d={`M0 ${y(lat)}H520`} />
        ))}
      </g>
      <rect x="0.5" y="0.5" width="519" height="419" stroke="currentColor" strokeOpacity="0.3" />

      <g className="chart-note" fill="currentColor" fillOpacity="0.75" fontSize="10">
        {parallels.map((lat) => (
          <text key={lat} x="8" y={y(lat) - 6}>
            {lat}°N
          </text>
        ))}
        <text x={x(-20)} y={y(37)} textAnchor="middle" fillOpacity="0.45" letterSpacing="0.5em">
          Atlantische Oceaan
        </text>
      </g>

      {/* De oversteek */}
      <path d={CROSSING} stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 8" />
      {still ? (
        <path d={CROSSING} stroke="var(--color-orange)" strokeWidth="3.5" />
      ) : (
        <motion.path d={CROSSING} stroke="var(--color-orange)" strokeWidth="3.5" style={{ pathLength: drawn }} />
      )}

      {/* Nederland */}
      <circle cx={NL.x} cy={NL.y} r="6" fill="var(--color-navy)" stroke="var(--color-orange)" strokeWidth="2.5" />
      <text x={NL.x - 14} y={NL.y - 14} textAnchor="end" className="chart-note" fill="currentColor" fontSize="12">
        Nederland · 52°N
      </text>

      {/* Curaçao */}
      <motion.circle
        key={still ? "still" : "moving"}
        cx={CUR.x}
        cy={CUR.y}
        r="15"
        stroke="var(--color-orange)"
        strokeWidth="1.5"
        style={still ? undefined : { opacity: arrived }}
      />
      <circle cx={CUR.x} cy={CUR.y} r="7" fill="var(--color-orange)" />
      <text x={CUR.x + 24} y={CUR.y - 12} className="chart-note" fill="currentColor" fontSize="12">
        Curaçao · 12°N
      </text>

      {/* Uitvergroting van het eiland */}
      <path d={`M${CUR.x + 14} ${CUR.y + 6}L300 300`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <g transform="translate(300 262)">
        <rect width="204" height="142" fill="var(--color-navy)" stroke="currentColor" strokeOpacity="0.35" />
        <path
          d="M20 34C32 20 50 22 62 33 74 44 82 41 94 50 110 61 122 57 136 69 152 83 172 86 186 104 176 112 160 107 148 100 134 92 124 96 112 87 98 77 86 80 74 70 60 59 44 60 32 52 24 47 14 45 20 34Z"
          fill="currentColor"
          fillOpacity="0.14"
          stroke="currentColor"
          strokeOpacity="0.6"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <circle cx="124" cy="84" r="4.5" fill="var(--color-orange)" />
        <circle cx="124" cy="84" r="10" stroke="var(--color-orange)" strokeWidth="1.25" />
        <text x="14" y="126" className="chart-note" fill="currentColor" fontSize="10">
          Julianadorp
        </text>
      </g>
    </svg>
    </div>
  );
}
