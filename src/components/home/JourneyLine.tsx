"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Point = { x: number; y: number };
/** Een stuk lijn: getekend tussen scrollpositie t0 en t1, van lengte l0 tot l1. */
type Segment = { t0: number; t1: number; l0: number; l1: number };
type Geometry = { width: number; height: number; d: string; origin: Point | null };

/** Hoogte in het venster (0–1) waar de punt van de lijn meeloopt. */
const TIP = 0.6;

const round = (n: number) => Math.round(n * 10) / 10;

function controls(a: Point, b: Point, curve: string): [Point, Point] {
  if (Math.abs(a.x - b.x) < 2) return [a, b];
  if (curve === "vh" || curve === "hv") {
    const corner = curve === "vh" ? { x: a.x, y: b.y } : { x: b.x, y: a.y };
    const toward = (p: Point) => ({ x: p.x + (2 / 3) * (corner.x - p.x), y: p.y + (2 / 3) * (corner.y - p.y) });
    return [toward(a), toward(b)];
  }
  const mid = (a.y + b.y) / 2;
  return [
    { x: a.x, y: mid },
    { x: b.x, y: mid },
  ];
}

function cubicLength(a: Point, c1: Point, c2: Point, b: Point) {
  let length = 0;
  let prev = a;
  for (let i = 1; i <= 32; i++) {
    const t = i / 32;
    const u = 1 - t;
    const p = {
      x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
      y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
    };
    length += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return length;
}

/**
 * Eén doorlopende routelijn over de hele homepage. De lijn volgt de `Waypoint`s in de
 * secties en wordt getekend terwijl je scrolt; bij `prefers-reduced-motion` staat hij er
 * meteen. Alleen zichtbaar vanaf `xl`, waar de marges er ruimte voor laten.
 */
export default function JourneyLine({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const route = useRef<{ top: number; total: number; segments: Segment[] }>({ top: 0, total: 0, segments: [] });
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const still = usePrefersReducedMotion();

  const update = useCallback(() => {
    const { top, total, segments } = route.current;
    if (!total) return;
    const tip = window.scrollY + window.innerHeight * TIP - top;
    let length = tip < segments[0].t0 ? 0 : total;
    for (const s of segments) {
      if (tip >= s.t0 && tip <= s.t1) {
        length = s.l0 + (s.l1 - s.l0) * (s.t1 > s.t0 ? (tip - s.t0) / (s.t1 - s.t0) : 1);
        break;
      }
    }
    progress.set(length / total);
  }, [progress]);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const points = [...el.querySelectorAll<HTMLElement>("[data-waypoint]")]
        .filter((node) => node.offsetParent !== null)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const y = rect.top - box.top;
          const anchor = node.dataset.triggerEl ? document.getElementById(node.dataset.triggerEl) : null;
          const anchorRect = anchor?.getBoundingClientRect();
          return {
            x: round(rect.left - box.left),
            y: round(y),
            trigger: anchorRect
              ? anchorRect.top - box.top + anchorRect.height * Number(node.dataset.triggerAt ?? 0)
              : y,
            curve: node.dataset.curve ?? "s",
            gap: node.dataset.gap !== undefined,
            origin: node.dataset.origin !== undefined,
          };
        });

      if (points.length < 2) {
        route.current = { top: 0, total: 0, segments: [] };
        setGeometry(null);
        return;
      }

      let d = `M${points[0].x} ${points[0].y}`;
      let length = 0;
      let trigger = points[0].trigger;
      const segments: Segment[] = [];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const t0 = trigger;
        trigger = Math.max(trigger, b.trigger);
        if (b.gap) {
          d += `M${b.x} ${b.y}`;
          segments.push({ t0, t1: trigger, l0: length, l1: length });
          continue;
        }
        const [c1, c2] = controls(a, b, b.curve);
        d += `C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${b.x} ${b.y}`;
        const next = length + cubicLength(a, c1, c2, b);
        segments.push({ t0, t1: trigger, l0: length, l1: next });
        length = next;
      }

      route.current = { top: box.top + window.scrollY, total: length, segments };
      setGeometry({
        width: Math.round(box.width),
        height: Math.round(box.height),
        d,
        origin: points.find((p) => p.origin) ?? null,
      });
      update();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  useMotionValueEvent(scrollY, "change", update);

  return (
    <div ref={wrapper} className="relative">
      {children}
      {geometry && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          fill="none"
          className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full xl:block"
        >
          <path d={geometry.d} stroke="#9aa0bd" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9" />
          {still ? (
            <path d={geometry.d} stroke="var(--color-orange)" strokeWidth="3" />
          ) : (
            <motion.path d={geometry.d} stroke="var(--color-orange)" strokeWidth="3" style={{ pathLength: progress }} />
          )}
          {geometry.origin && (
            <>
              <circle cx={geometry.origin.x} cy={geometry.origin.y} r="6" fill="var(--color-orange)" />
              <circle cx={geometry.origin.x} cy={geometry.origin.y} r="12" stroke="var(--color-orange)" strokeWidth="1.5" />
            </>
          )}
        </svg>
      )}
    </div>
  );
}
