"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/utils/cn";

/**
 * ScrollTextReveal — word-by-word reveal driven by IntersectionObserver.
 *
 * Words start hidden below a mask + blurred + transparent. When the
 * element enters the viewport the reveal timeline plays. When the user
 * scrolls back *above* the element (it leaves off the top of the
 * viewport), the timeline reverses so the next scroll-down reveal plays
 * fresh. Scrolling *past* the element downward leaves it in the fully
 * revealed state — reversing then would look like the copy un-typed as
 * you scrolled past.
 *
 * IntersectionObserver instead of ScrollTrigger: ScrollTrigger's onEnter
 * is a transition event that misses elements the user warps into (client-
 * side navigation, teleport-scroll). IO fires reliably on any change of
 * intersection, so return-to-Home and jump-scrolls both work.
 */
export default function ScrollTextReveal({
  children,
  as: Tag = "span",
  className,
  wordClassName,
  stagger = 0.05,
  yPercent = 105,
  duration = 0.7,
  blur = 5,
  ease = "power3.out",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    const words = Array.from(root.querySelectorAll("[data-str-inner]"));
    if (!words.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(words, { yPercent: 0, opacity: 1, filter: "blur(0px)" });
      return;
    }

    const fromVars = { yPercent, opacity: 0, filter: `blur(${blur}px)` };
    const toVars = { yPercent: 0, opacity: 1, filter: "blur(0px)" };

    const ctx = gsap.context(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rect = root.getBoundingClientRect();
      const onScreenAtMount = rect.top < vh * 0.94 && rect.bottom > 0;

      // Snap in-viewport copy to revealed; hide below-fold copy so the
      // IO can play it in.
      if (onScreenAtMount) {
        gsap.set(words, toVars);
      } else {
        gsap.set(words, fromVars);
      }

      const tween = gsap.to(words, {
        ...toVars,
        ease,
        duration,
        stagger,
        paused: !onScreenAtMount,
      });
      if (onScreenAtMount) tween.progress(1, false);

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const r = entry.boundingClientRect;
            if (entry.isIntersecting) {
              tween.play();
            } else if (r.top >= (window.innerHeight || 0)) {
              // Scrolled UP past the paragraph — rewind so the next
              // scroll-down reveal replays.
              tween.reverse();
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      io.observe(root);

      return () => io.disconnect();
    }, root);

    return () => ctx.revert();
  }, [stagger, yPercent, duration, blur, ease]);

  const nodes = flattenChildren(children);

  return (
    <Tag ref={ref} className={cn("str-reveal", className)}>
      {nodes.map((node, idx) => {
        if (typeof node !== "string") {
          // Non-string node (e.g. <strong>, <span>): render inline but
          // still animate as a single "word".
          return (
            <Word key={`node-${idx}`} className={wordClassName}>
              {node}
            </Word>
          );
        }
        const words = node.split(/(\s+)/);
        return (
          <Fragment key={`str-${idx}`}>
            {words.map((w, i) => {
              if (/^\s+$/.test(w)) return <Fragment key={`sp-${idx}-${i}`}>{w}</Fragment>;
              if (!w) return null;
              return (
                <Word key={`w-${idx}-${i}`} className={wordClassName}>
                  {w}
                </Word>
              );
            })}
          </Fragment>
        );
      })}
    </Tag>
  );
}

// Word wrapper — mask (overflow hidden) with inner block that GSAP animates.
// Padding + negative margin cover descenders so 'g','y','p' aren't clipped.
//
// IMPORTANT: The inner span deliberately has NO initial `transform` style.
// Earlier revisions primed it to `translate3d(0, 105%, 0)` so the FROM
// state was pre-committed by the SSR/first paint — but React re-applies
// inline styles on every render, which would silently overwrite whatever
// GSAP had set in the useEffect. On client-side navigation that meant
// `gsap.set(words, toVars)` succeeded once, then the next React commit
// pushed the inline `translate3d(0, 105%, 0)` back onto the DOM, hiding
// the words again. Owning the hidden state exclusively through GSAP
// avoids the tug-of-war: the effect either snaps to revealed (visible in
// natural DOM state) or applies fromVars from JS.
function Word({ children, className }) {
  return (
    <span
      className={cn("str-word", className)}
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom",
        padding: "0.08em 0 0.22em 0",
        margin: "-0.08em 0 -0.22em 0",
      }}
    >
      <span
        data-str-inner=""
        style={{
          display: "inline-block",
          willChange: "transform, opacity, filter",
        }}
      >
        {children}
      </span>
    </span>
  );
}

function flattenChildren(children) {
  if (children == null || children === false) return [];
  if (Array.isArray(children)) return children.flatMap(flattenChildren);
  return [children];
}
