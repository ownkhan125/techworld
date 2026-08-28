"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScrollProvider — buttery, low-latency page scroll via Lenis.
 *
 * Design goals:
 *  - The user's wheel / trackpad / touch input drives scroll 1:1; Lenis just
 *    lerps the target position so motion feels premium instead of stepped.
 *  - Touch scroll on mobile stays native (no syncTouch) so momentum and
 *    overscroll bounce feel like the OS.
 *  - GSAP ScrollTrigger is driven off Lenis's RAF loop, so scrubbed / one-shot
 *    triggers stay perfectly in sync with the smoothed scroll position.
 *  - Respects prefers-reduced-motion: falls back to native scroll.
 *  - Skips activation for coarse pointers (touch phones) — native inertia is
 *    already smooth there and syncTouch tends to feel laggy.
 */
export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      // Lerp intensity — 0.1 is the sweet spot: fast enough to stay responsive,
      // slow enough to feel liquid. Lower = smoother but laggier.
      lerp: 0.1,
      // Only smooth wheel / trackpad. Touch stays native so mobile momentum
      // behaves like the OS scroll expects.
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // Programmatic anchor scroll ("#platform" etc.) handled by Lenis for a
      // consistent easing curve — otherwise the browser competes with it.
      anchors: {
        offset: -80, // navbar height
        duration: 1.2,
      },
      // Nice smooth ease for both anchors and inertial wheel.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Expose for debugging / other components that may want to scrollTo.
    window.__lenis = lenis;

    // ---- GSAP ScrollTrigger integration ----
    // Drive ScrollTrigger update on Lenis scroll events, and use gsap.ticker
    // (single global RAF) to advance Lenis so both animation systems share
    // one frame budget instead of dueling for it.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recompute anchors after fonts / layout settle.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
