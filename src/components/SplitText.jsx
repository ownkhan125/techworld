"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/utils/cn";

/**
 * SplitText — word-by-word mask reveal with a subtle blur clear.
 *
 * Two playback modes:
 *   - `onLoad`: plays once on mount with a GSAP timeline. Reserved for
 *     above-the-fold hero headings that finish revealing before any scroll.
 *   - Default: word-by-word reveal driven by IntersectionObserver.
 *     Headings on screen at mount snap to visible; headings below the fold
 *     hide and play their reveal timeline when they enter the viewport.
 *     If the user then scrolls back above the heading (element passes off
 *     the top of the viewport), the reveal reverses so it plays again on
 *     the next scroll-in.
 *
 * IntersectionObserver instead of ScrollTrigger: on client-side navigation
 * and jump-scrolls, ScrollTrigger's onEnter is a transition event that
 * misses elements the user warps into. IO fires reliably on any change
 * of intersection, so return-to-Home and teleport-scroll both work.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  className,
  baseDelay = 0,   // ms — used only in onLoad mode
  step = 60,       // ms per-word stagger — used only in onLoad mode
  onLoad = false,
  duration = 0.75, // seconds per-word — used only in scroll mode
  wordStagger = 0.05,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;

    const inners = root.querySelectorAll(".split-inner");
    if (!inners.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(inners, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
      return;
    }

    const fromVars = { yPercent: 110, opacity: 0, filter: "blur(6px)" };
    const toVars = { yPercent: 0, opacity: 1, filter: "blur(0px)" };

    const ctx = gsap.context(() => {
      if (onLoad) {
        // Above-the-fold hero mode.
        gsap.set(inners, fromVars);
        gsap.to(inners, {
          ...toVars,
          ease: "power3.out",
          duration: 0.9,
          stagger: step / 1000,
          delay: baseDelay / 1000,
        });
        return;
      }

      // Scroll-reveal mode.
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rect = root.getBoundingClientRect();
      const onScreenAtMount = rect.top < vh * 0.94 && rect.bottom > 0;

      if (onScreenAtMount) {
        // Anything already in view at mount is snapped to visible so it
        // never flashes hidden after client-side nav.
        gsap.set(inners, toVars);
      } else {
        gsap.set(inners, fromVars);
      }

      // A single tween instance we control the direction of by calling
      // play()/reverse(). Paused initially so it doesn't fire until the
      // observer says so.
      const tween = gsap.to(inners, {
        ...toVars,
        ease: "power3.out",
        duration,
        stagger: wordStagger,
        paused: !onScreenAtMount, // if already visible we already set toVars — do NOT auto-play
      });
      if (onScreenAtMount) tween.progress(1, false);

      // Track how the heading is leaving the viewport so we only reverse
      // when the user scrolls *up* past it. Scrolling *down* below it
      // leaves the reveal complete — reversing then would look like the
      // words un-typed as you scrolled past, which is jarring.
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const r = entry.boundingClientRect;
            if (entry.isIntersecting) {
              tween.play();
            } else if (r.top >= (window.innerHeight || 0)) {
              // Element is now below the viewport — user scrolled UP past
              // the heading. Rewind so the next scroll-down reveal plays
              // fresh.
              tween.reverse();
            }
            // else: element is above viewport (user scrolled down past
            // it) — keep it fully revealed.
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
      );
      io.observe(root);

      // Register the observer with gsap.context so ctx.revert() (called
      // on unmount) tears it down. Prevents leaking one observer per
      // route change.
      return () => io.disconnect();
    }, root);

    return () => ctx.revert();
  }, [text, onLoad, baseDelay, step, duration, wordStagger]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("split", className)}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="split-word">
            <span className="split-inner">{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
