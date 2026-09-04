"use client";

import { useEffect } from "react";

/**
 * BorderSweepProvider — one global IntersectionObserver that adds
 * `.is-swept` to any element declaring `.border-sweep`. Runs once per
 * element (unobserve after the first fire) so users only see the beam
 * of light draw the border the first time a card enters view. Cheap to
 * initialise: single observer, mutation observer only for late DOM
 * additions (route changes, etc.).
 */
export default function BorderSweepProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // honor reduced motion

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-swept");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    const SELECTOR = ".border-sweep:not(.is-swept), .card:not(.is-swept)";
    const observeAll = (root = document) => {
      root.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    };
    observeAll();

    // Any dynamically-added targets get picked up too (route changes, etc.).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (
            n.classList?.contains("border-sweep") ||
            n.classList?.contains("card")
          ) {
            io.observe(n);
          }
          n.querySelectorAll?.(SELECTOR).forEach((el) => io.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
