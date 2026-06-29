"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Provider that registers GSAP/ScrollTrigger and keeps native scroll intact.
 * No wheel interception — the browser handles scroll at 60fps. Section build
 * animations are driven by ScrollTrigger `toggleActions` (one-shot), not
 * scrub, so they fire as the section enters/leaves and never tax the scroll
 * pipeline.
 */
export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // ScrollTrigger uses native scroll. Refresh on resize / fonts loaded so
    // section anchors recompute after layout settles.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    return () => {};
  }, []);

  return children;
}
