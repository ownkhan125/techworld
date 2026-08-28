"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

/**
 * SnapScrollProvider — keyboard-only section navigation, driven by GSAP.
 *
 * Wheel and touch scroll are intentionally left to the browser: native
 * scrolling is already smooth and hardware-accelerated, and hijacking it
 * would only introduce fights with the user's velocity.
 *
 * What this component still provides:
 *   - PageUp / PageDown / Space / Shift-Space / Home / End → jump to the
 *     previous / next section using `gsap.to(window, { scrollTo })`. All
 *     jumps share one easing curve so the section-to-section motion has
 *     the same cinematic feel wherever the user is on the page.
 *   - Anchor clicks (#platform etc.) are handled by `scroll-behavior:
 *     smooth` in CSS, so nav links don't need any glue here.
 *
 * Respects prefers-reduced-motion (disables entirely — browser handles
 * native PageUp / PageDown).
 */

const NAV_OFFSET = 80; // floating navbar clearance
const JUMP_DURATION = 0.9; // seconds — long enough to read as intentional, short enough to stay responsive
const JUMP_EASE = "power3.inOut";

function isSnapTarget(el) {
  if (!el) return false;
  if (el.hasAttribute("data-cinematic")) return true;
  if (el.tagName === "FOOTER") return true;
  return false;
}

function getSnapTargets() {
  return Array.from(document.querySelectorAll("[data-cinematic], footer"))
    .filter(isSnapTarget)
    .sort((a, b) =>
      a.getBoundingClientRect().top + window.scrollY -
      (b.getBoundingClientRect().top + window.scrollY)
    );
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

    const scrollToTarget = (target) => {
      // Use ScrollToPlugin's offsetY so the section's top clears the navbar
      // without us doing pixel math per-viewport. autoKill is off because the
      // tween writes to window.scrollY every frame — with autoKill on, any
      // downstream ScrollTrigger update reads that write as "user scrolled"
      // and cuts the tween off after one frame.
      gsap.to(window, {
        duration: JUMP_DURATION,
        ease: JUMP_EASE,
        scrollTo: { y: target, offsetY: NAV_OFFSET, autoKill: false },
        overwrite: "auto",
      });
    };

    const jump = (dir) => {
      const targets = getSnapTargets();
      if (!targets.length) return;
      const idx = indexFromScroll(targets);
      const next = Math.max(0, Math.min(targets.length - 1, idx + dir));
      if (targets[next]) scrollToTarget(targets[next]);
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
          // piped through GSAP so easing matches the rest of the page).
          e.preventDefault();
          jump(e.shiftKey ? -1 : 1);
          break;
        case "Home": {
          e.preventDefault();
          const first = getSnapTargets()[0];
          if (first) scrollToTarget(first);
          break;
        }
        case "End": {
          e.preventDefault();
          const targets = getSnapTargets();
          const last = targets[targets.length - 1];
          if (last) scrollToTarget(last);
          break;
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
