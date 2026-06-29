"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CardConstructProvider — per-card "construction" reveal across the site.
 *
 * Targets opt-in card selectors. Each card, on entering the viewport, plays a
 * layered reveal: tilt-from-back perspective lift + clip-path corners spreading
 * outward + subtle Y settle. Cards in the same row reveal together with
 * stagger, so a grid feels orchestrated rather than mechanical.
 *
 * Uses ScrollTrigger.batch so 50 cards on the page is still one observer per
 * card with shared callbacks — no per-card trigger overhead.
 *
 * Hover styling lives in each card's own CSS (.dev-fig:hover, .ext-card:hover)
 * and continues seamlessly once the entry timeline marks the card .card-built.
 */
const SELECTOR = ".dev-fig, .ext-card";

export default function CardConstructProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("card-built"));
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(SELECTOR);
      if (!cards.length) return;

      // Initial state: card sits slightly back, lifted forward, clipped from
      // its center outward — gives the "being constructed" feel.
      gsap.set(cards, {
        opacity: 0,
        y: 32,
        scale: 0.94,
        rotateX: 10,
        transformOrigin: "50% 100%",
        transformPerspective: 1400,
        clipPath: "inset(15% 15% 15% 15% round 14px)",
        willChange: "transform, opacity, clip-path",
      });

      const reveal = (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          clipPath: "inset(0% 0% 0% 0% round 14px)",
          duration: 1.05,
          ease: "expo.out",
          stagger: { each: 0.09, from: "start" },
          overwrite: "auto",
          onComplete: () => {
            els.forEach((el) => {
              el.classList.add("card-built");
              // hand transform back to CSS hover transitions
              el.style.willChange = "auto";
            });
          },
        });

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true, // only build, never deconstruct on scroll-past
        onEnter: reveal,
        onEnterBack: reveal,
      });

      // Refresh once fonts/layout settle so initial off-screen cards have
      // correct positions registered.
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
