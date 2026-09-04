"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CardConstructProvider — per-card "construction" reveal across the site.
 *
 * Every card matching `.dev-fig` or `.ext-card` starts hidden (via the
 * CSS in globals.css) and this component watches them with a shared
 * IntersectionObserver. Once a card enters the viewport it plays a
 * layered reveal: tilt-from-back perspective lift + clip-path corners
 * spreading outward + subtle Y settle. Cards in the same row reveal
 * together with stagger so a grid feels orchestrated rather than
 * mechanical. Once revealed, cards keep the `.card-built` class so
 * hover/idle behaviors take over from CSS.
 *
 * Why IntersectionObserver and not ScrollTrigger.batch: on client-side
 * navigation this component stays mounted (it lives in the root layout),
 * but the effect used to have `[]` deps and never rescanned the DOM. Any
 * cards mounted on the returned-to Home page were left at their CSS
 * `opacity: 0` forever. IO fires reliably on route change once we
 * re-observe the new set of cards, so we now key the effect on the
 * current pathname — old triggers unmount, new triggers scan the fresh
 * DOM.
 *
 * Fully respects prefers-reduced-motion: cards are marked `.card-built`
 * immediately so no animation runs.
 */
const SELECTOR = ".dev-fig, .ext-card";

export default function CardConstructProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("card-built"));
      return;
    }

    // Wait until after the route commit so the new page's cards are in
    // the DOM. Two rAFs get us reliably past React commit + first paint.
    let cleanup = () => {};
    let raf1 = 0, raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        cleanup = install();
      });
    });

    function install() {
      const cards = Array.from(document.querySelectorAll(SELECTOR));
      if (!cards.length) return () => {};

      const ctx = gsap.context(() => {
        // Filter out any cards that already ran (e.g. persistent cards
        // like Navbar chrome — none today, but future-proof) so we don't
        // reset their transforms.
        const pending = cards.filter((el) => !el.classList.contains("card-built"));
        if (!pending.length) return;

        // Initial state: card sits slightly back, lifted forward, clipped
        // from its center outward — gives the "being constructed" feel.
        gsap.set(pending, {
          opacity: 0,
          y: 32,
          scale: 0.94,
          rotateX: 10,
          transformOrigin: "50% 100%",
          transformPerspective: 1400,
          clipPath: "inset(15% 15% 15% 15% round 14px)",
          willChange: "transform, opacity, clip-path",
        });

        const played = new WeakSet();
        const revealRow = (rowEls) => {
          const fresh = rowEls.filter((el) => !played.has(el));
          if (!fresh.length) return;
          fresh.forEach((el) => played.add(el));
          gsap.to(fresh, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            duration: 0.95,
            ease: "expo.out",
            stagger: { each: 0.08, from: "start" },
            overwrite: "auto",
            onComplete: () => {
              fresh.forEach((el) => {
                el.classList.add("card-built");
                el.style.willChange = "auto";
              });
            },
          });
        };

        // Group cards by their vertical band so a row reveals together.
        // Uses IO so the reveal is triggered by actual viewport
        // intersection — reliable on jump-scroll and after route change.
        const pendingByEl = new Map(pending.map((el) => [el, el]));
        const batchTick = { queue: new Set(), flushId: 0 };
        const flush = () => {
          const queue = Array.from(batchTick.queue).map((el) => pendingByEl.get(el)).filter(Boolean);
          batchTick.queue.clear();
          batchTick.flushId = 0;
          if (queue.length) revealRow(queue);
        };

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting && pendingByEl.has(e.target)) {
                batchTick.queue.add(e.target);
                // Group any near-simultaneous enters into one stagger.
                if (!batchTick.flushId) {
                  batchTick.flushId = setTimeout(flush, 60);
                }
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
        );
        pending.forEach((el) => io.observe(el));

        // Any card that isn't BELOW the fold at install time — either
        // currently on screen, or already scrolled past the top — is
        // revealed immediately. The observer would never fire an enter
        // event for these on a jump-scroll return-to-Home: their
        // intersection state at install is "not intersecting", and
        // scrolling past them again doesn't change that. Revealing them
        // eagerly keeps them ready for a scroll-back-up.
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const notBelowFold = pending.filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top < vh; // in-view OR scrolled past (rect.top negative)
        });
        if (notBelowFold.length) {
          notBelowFold.forEach((el) => io.unobserve(el));
          revealRow(notBelowFold);
        }

        // Store the observer on the context so ctx.revert() disposes it.
        // (gsap.context.add lets us register arbitrary cleanup.)
        return () => io.disconnect();
      });

      return () => ctx.revert();
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cleanup();
    };
  }, [pathname]);

  return null;
}
