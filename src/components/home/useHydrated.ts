"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` op de server en tijdens hydratie, daarna `true`. Voor begintoestanden die
 * alleen met JavaScript mogen gelden, zodat de inhoud er zonder script gewoon staat.
 */
export default function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
