"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/**
 * SmoothScrollProvider — GSAP-only scroll pipeline.
 *
 * Design:
 *  - Native browser scroll drives the page during wheel / touch / trackpad
 *    input. Modern desktops and phones do this at 60+fps with hardware-
 *    accelerated compositing — no third-party lerp library is needed to
 *    feel premium.
 *  - GSAP ScrollTrigger owns every scroll-driven animation (CinematicSection
 *    enter/exit stages, per-section parallax). It's registered here once so
 *    every consumer imports the same instance.
 *  - Anchor-link clicks (nav "Platform", "Capabilities" etc.) are captured
 *    globally and routed through GSAP's ScrollToPlugin so they share one
 *    cinematic easing curve with the keyboard navigation in
 *    SnapScrollProvider. This replaces `scroll-behavior: smooth`, which
 *    would fight GSAP's autoKill and cut tweens off after a single frame.
 *  - Respects prefers-reduced-motion: still registers ScrollTrigger (each
 *    consumer guards its own motion), but skips the anchor interception so
 *    hash jumps fall back to the browser's native instant scroll.
 */
const NAV_OFFSET = 80;

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Refresh ScrollTrigger after fonts settle so section anchors match the
    // final laid-out heights (font swap can shift titles by a few px).
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Intercept in-page anchor clicks and animate with GSAP so nav links,
    // "back to top" chrome, and inline #section jumps all share the same
    // easing as keyboard navigation.
    const onAnchorClick = (e) => {
      // Only handle plain left-clicks without modifier keys.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.length < 2 || !href.startsWith("#")) return;
      // #top is treated as scroll-to-page-top even if the anchor id doesn't exist.
      const id = href.slice(1);
      const target =
        id === "top" ? 0 : document.getElementById(id);
      if (target === null || target === undefined) return;

      e.preventDefault();
      gsap.to(window, {
        duration: 1.0,
        ease: "power3.inOut",
        scrollTo:
          typeof target === "number"
            ? { y: target, autoKill: false }
            : { y: target, offsetY: NAV_OFFSET, autoKill: false },
        overwrite: "auto",
      });
    };

    document.addEventListener("click", onAnchorClick);
    return () => document.removeEventListener("click", onAnchorClick);
  }, []);

  return children;
}
