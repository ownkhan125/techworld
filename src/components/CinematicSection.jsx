"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CinematicSection — orchestrates a layered build animation as a section
 * enters the viewport, and a deconstruction as it leaves. Uses one-shot
 * ScrollTrigger callbacks (no scrub) so native scroll stays buttery.
 *
 * Stages (each tagged with data-stage="<key>"):
 *   bg      — environment: subtle scale + blur clearance
 *   frame   — structural lines/borders: mask-sweep from left to right
 *   media   — visuals/figures: diagonal clip-path wipe + slight depth lift
 *   heading — title: wrapper reveals; SplitText handles per-word reveal
 *   body    — paragraphs: left-to-right gradient mask sweep
 *   cta     — buttons/links: scale-pop with back overshoot
 *
 * Exit: reverse-stagger collapse with blur + skew + opacity for a
 * "carefully dismantled" feel rather than a flat fade.
 *
 * mode="onload" plays on mount (Hero / above-the-fold).
 * mode="scroll" (default) ties to ScrollTrigger callbacks.
 */
export default function CinematicSection({
  as: Tag = "section",
  className,
  children,
  mode = "scroll",
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      root.querySelectorAll("[data-stage]").forEach((el) => el.classList.add("cs-in"));
      return;
    }

    const stageOrder = ["bg", "frame", "media", "heading", "body", "cta"];
    const stages = stageOrder.map((key) => ({
      key,
      els: Array.from(root.querySelectorAll(`[data-stage="${key}"]`)),
    }));

    const ctx = gsap.context(() => {
      // ===== Initial states (override any CSS) =====
      stages.forEach(({ key, els }) => {
        if (!els.length) return;
        switch (key) {
          case "bg":
            gsap.set(els, { opacity: 0, scale: 1.04, filter: "blur(6px)" });
            break;
          case "frame":
            // mask-sweep wipe-in from left (also accepts clip-path elements)
            gsap.set(els, {
              opacity: 0,
              clipPath: "inset(0% 100% 0% 0%)",
            });
            break;
          case "media":
            // diagonal corner wipe + depth lift
            gsap.set(els, {
              opacity: 0,
              y: 32,
              scale: 0.96,
              rotateX: 6,
              transformOrigin: "50% 100%",
              clipPath: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
            });
            break;
          case "heading":
            gsap.set(els, { opacity: 0, y: 24, filter: "blur(4px)" });
            break;
          case "body":
            // left→right clip-path wipe
            gsap.set(els, {
              opacity: 0,
              y: 12,
              clipPath: "inset(0% 100% 0% 0%)",
            });
            break;
          case "cta":
            gsap.set(els, { opacity: 0, y: 12, scale: 0.85 });
            break;
        }
      });

      // ===== ENTER timeline (one-shot, always paused until triggered) =====
      const enterTl = gsap.timeline({
        defaults: { ease: "power3.out", overwrite: "auto" },
        paused: true,
      });

      const stageDur = {
        bg: 1.1, frame: 0.9, media: 1.0, heading: 0.75, body: 0.8, cta: 0.55,
      };
      const stageOverlap = {
        bg: 0, frame: -0.65, media: -0.55, heading: -0.55, body: -0.5, cta: -0.35,
      };

      let pos = 0;
      stages.forEach(({ key, els }) => {
        if (!els.length) return;
        const dur = stageDur[key];
        const overlap = stageOverlap[key];

        if (key === "bg") {
          enterTl.to(
            els,
            {
              opacity: 1, scale: 1, filter: "blur(0px)",
              duration: dur, ease: "power2.out",
            },
            pos + overlap
          );
        } else if (key === "frame") {
          enterTl.to(
            els,
            {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: dur,
              ease: "power4.out",
              stagger: 0.12,
            },
            pos + overlap
          );
        } else if (key === "media") {
          enterTl.to(
            els,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: dur,
              ease: "expo.out",
              stagger: 0.15,
            },
            pos + overlap
          );
        } else if (key === "heading") {
          // Reveal the heading wrapper with blur clear-through; SplitText handles word-by-word inside
          enterTl.to(
            els,
            {
              opacity: 1, y: 0, filter: "blur(0px)",
              duration: dur, ease: "expo.out", stagger: 0.12,
            },
            pos + overlap
          );
        } else if (key === "body") {
          enterTl.to(
            els,
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: dur,
              ease: "power3.out",
              stagger: 0.1,
            },
            pos + overlap
          );
        } else if (key === "cta") {
          enterTl.to(
            els,
            {
              opacity: 1, y: 0, scale: 1,
              duration: dur, ease: "back.out(1.6)", stagger: 0.08,
            },
            pos + overlap
          );
        }
        pos = enterTl.duration();
      });

      // ===== EXIT (deconstruction) timeline =====
      const allStageEls = stages.flatMap((s) => s.els);
      const exitTl = gsap.timeline({
        defaults: { ease: "power3.inOut", overwrite: "auto" },
        paused: true,
      });
      if (allStageEls.length) {
        exitTl.to(allStageEls, {
          opacity: 0,
          y: -14,
          scale: 0.985,
          skewY: 1.2,
          filter: "blur(4px)",
          duration: 0.7,
          stagger: { each: 0.035, from: "end" },
        });
      }

      // ===== Trigger =====
      if (mode === "onload") {
        requestAnimationFrame(() => enterTl.play(0));
      } else {
        ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => {
            exitTl.pause(0);
            enterTl.play();
          },
          onEnterBack: () => {
            exitTl.reverse();
            enterTl.play();
          },
          onLeave: () => {
            exitTl.play();
          },
          onLeaveBack: () => {
            enterTl.reverse();
          },
        });
      }

      // ===== SCROLL-TIED PARALLAX (lightweight depth) =====
      // 2 scrubbed ScrollTriggers per section, transforms only. Each one
      // updates a single `y` value as scroll progresses through the section.
      // Cheap (no recompute, GPU-only) and gives the "scene responds to
      // scroll" feel without rebuilding the reveal pipeline. Opt-out per
      // element with data-parallax="off".
      if (mode !== "onload") {
        const bgEls = stages
          .find((s) => s.key === "bg")?.els
          .filter((el) => el.dataset.parallax !== "off") || [];
        const mediaEls = stages
          .find((s) => s.key === "media")?.els
          .filter((el) => el.dataset.parallax !== "off") || [];

        if (bgEls.length) {
          gsap.fromTo(
            bgEls,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        }
        if (mediaEls.length) {
          // yPercent (not y) so it composes with the enter timeline's `y` tween
          // — GSAP keeps the two on separate transform channels.
          gsap.fromTo(
            mediaEls,
            { yPercent: 4 },
            {
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            }
          );
        }
      }
    }, root);

    return () => ctx.revert();
  }, [mode]);

  return (
    <Tag ref={ref} className={className} data-cinematic="" {...rest}>
      {children}
    </Tag>
  );
}
