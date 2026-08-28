"use client";

import { useEffect } from "react";

/**
 * SnapScrollProvider — keyboard-only section navigation.
 *
 * Wheel and touch scroll are intentionally left untouched: Lenis (see
 * SmoothScrollProvider) already lerps native scroll into a fluid, premium
 * feel, so hijacking gestures with forced snap-per-tick jumps did more harm
 * than good (it fought the user's velocity and introduced a hard lockout).
 *
 * What this component still provides:
 *   - PageUp / PageDown / Space / Shift-Space / Home / End / ArrowUp+meta /
 *     ArrowDown+meta → jump to previous / next section using Lenis's smooth
 *     scrollTo, so section-to-section motion has the same cinematic ease as
 *     the rest of the page.
 *   - Anchor clicks (#platform etc.) are handled by Lenis's built-in
 *     `anchors` option in SmoothScrollProvider, so nav links share the
 *     same easing without any extra glue here.
 *
 * Respects prefers-reduced-motion (disables entirely — browser handles native
 * PageUp / PageDown).
 */

const NAV_OFFSET = 80;

function isSnapTarget(el) {
  if (!el) return false;
  if (el.hasAttribute("data-cinematic")) return true;
  if (el.tagName === "FOOTER") return true;
  return false;
}

function getSnapTargets() {
  return Array.from(document.querySelectorAll("[data-cinematic], footer"))
    .filter(isSnapTarget)
    .sort((a, b) => a.getBoundingClientRect().top + window.scrollY -
                    (b.getBoundingClientRect().top + window.scrollY));
}

function indexFromScroll(targets) {
  const probe = window.scrollY + NAV_OFFSET + 24;
  for (let i = targets.length - 1; i >= 0; i--) {
    if (targets[i].offsetTop <= probe) return i;
  }
  return 0;
}

export default function SnapScrollProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const scrollTo = (target) => {
      const y = Math.max(0, target.offsetTop - NAV_OFFSET);
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(y, { duration: 1.1 });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    const jump = (dir) => {
      const targets = getSnapTargets();
      if (!targets.length) return;
      const idx = indexFromScroll(targets);
      const next = Math.max(0, Math.min(targets.length - 1, idx + dir));
      if (targets[next]) scrollTo(targets[next]);
    };

    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) return;

      switch (e.key) {
        case "PageDown":
          e.preventDefault();
          jump(1);
          break;
        case "PageUp":
          e.preventDefault();
          jump(-1);
          break;
        case " ":
          // Space = next, Shift+Space = previous (canonical browser behaviour,
          // just piped through Lenis for consistent easing).
          e.preventDefault();
          jump(e.shiftKey ? -1 : 1);
          break;
        case "Home": {
          e.preventDefault();
          const first = getSnapTargets()[0];
          if (first) scrollTo(first);
          break;
        }
        case "End": {
          e.preventDefault();
          const targets = getSnapTargets();
          const last = targets[targets.length - 1];
          if (last) scrollTo(last);
          break;
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
