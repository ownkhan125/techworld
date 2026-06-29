"use client";

import { useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * LiveCard — interactive content card with continuous idle 3D float
 * and mouse-tracked hover tilt + shine sweep + accent glow.
 *
 * Composition:
 *   <LiveCard tone="cyan" idleDelay={120}>
 *     <LiveCard.Layer depth={40}><Icon /></LiveCard.Layer>
 *     <LiveCard.Layer depth={20}><h3>Title</h3></LiveCard.Layer>
 *     <LiveCard.Layer depth={10}><p>Body</p></LiveCard.Layer>
 *   </LiveCard>
 *
 * Tone tints the accent glow + border without changing the dark base bg —
 * cards remain visually consistent but each carries a brand-color signature.
 */

const TONE = {
  cyan: {
    glow: "radial-gradient(70% 80% at 50% 0%, hsla(178,92%,66%,0.40), transparent 75%)",
    border: "rgba(94,240,230,0.32)",
    borderHover: "rgba(94,240,230,0.60)",
  },
  violet: {
    glow: "radial-gradient(70% 80% at 50% 0%, hsla(262,90%,72%,0.38), transparent 75%)",
    border: "rgba(167,139,250,0.32)",
    borderHover: "rgba(167,139,250,0.60)",
  },
  amber: {
    glow: "radial-gradient(70% 80% at 50% 0%, hsla(38,95%,64%,0.36), transparent 75%)",
    border: "rgba(251,191,36,0.30)",
    borderHover: "rgba(251,191,36,0.58)",
  },
  rose: {
    glow: "radial-gradient(70% 80% at 50% 0%, hsla(348,92%,70%,0.36), transparent 75%)",
    border: "rgba(252,108,140,0.30)",
    borderHover: "rgba(252,108,140,0.58)",
  },
  neutral: {
    glow: "radial-gradient(70% 80% at 50% 0%, rgba(255,255,255,0.14), transparent 75%)",
    border: "rgba(255,255,255,0.20)",
    borderHover: "rgba(255,255,255,0.36)",
  },
};

export default function LiveCard({
  as: Tag = "div",
  href,
  children,
  tone = "neutral",
  idleDelay = 0,
  tiltMax = 8,
  radius = 18,
  className,
  contentClassName,
  bg,
  ...rest
}) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const shineRef = useRef(null);
  const rafRef = useRef(0);
  const t = TONE[tone] || TONE.neutral;

  const onMove = (e) => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -2 * tiltMax;
    const ry = (px - 0.5) * 2 * tiltMax;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      inner.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      inner.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      inner.style.setProperty("--lift", "6px");
      if (shineRef.current) {
        shineRef.current.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        shineRef.current.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(rafRef.current);
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.setProperty("--rx", "0deg");
    inner.style.setProperty("--ry", "0deg");
    inner.style.setProperty("--lift", "0px");
  };

  const ElementTag = href ? "a" : Tag;
  const elementProps = href ? { href } : {};

  return (
    <ElementTag
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("live-card group block", className)}
      style={{ "--lc-radius": `${radius}px` }}
      {...elementProps}
      {...rest}
    >
      <div
        ref={innerRef}
        className="live-card__inner"
        style={{
          "--idle-delay": `${idleDelay}ms`,
          "--lc-border": t.border,
          "--lc-border-hover": t.borderHover,
          "--lc-bg": bg,
        }}
      >
        <div
          className="live-card__glow"
          style={{ "--lc-glow": t.glow }}
        />
        <div ref={shineRef} className="live-card__shine" />
        <div className={cn("live-card__content", contentClassName)}>
          {children}
        </div>
      </div>
    </ElementTag>
  );
}

export function LiveLayer({ depth = 0, as: Tag = "div", className, style, children, ...rest }) {
  return (
    <Tag
      className={cn("live-card__layer", className)}
      style={{ "--depth": `${depth}px`, ...(style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
