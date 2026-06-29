"use client";

import { useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * GameCard — interactive game-object-style card.
 *  - Continuous idle 3D float (per-instance phase via idleDelay)
 *  - Mouse-tracked tilt on hover (rX/rY based on cursor offset)
 *  - Layered depth: bg + glow + icon + title + sub at different Z
 *  - GPU-only transforms; no layout thrash
 *  - Touch devices skip the mousemove handler (handled via CSS @media too)
 *
 * Props:
 *   icon: ReactNode shown at the top, positioned at the deepest forward layer
 *   title, sub: strings
 *   tone: "cyan" | "violet" | "amber" | "rose" — drives bg + glow tint
 *   idleDelay: ms offset for the floating animation (stagger neighbours)
 *   tiltMax: max degrees of tilt on hover (default 12)
 */
const TONE = {
  cyan: {
    bg:
      "linear-gradient(180deg, hsl(178 60% 14% / 0.92) 0%, hsl(195 50% 8% / 0.96) 100%)",
    border: "rgba(94,240,230,0.32)",
    glow: "radial-gradient(70% 70% at 50% 40%, hsla(178,92%,66%,0.45), transparent 70%)",
    text: "hsl(178 92% 75%)",
  },
  violet: {
    bg:
      "linear-gradient(180deg, hsl(262 60% 16% / 0.92) 0%, hsl(265 50% 10% / 0.96) 100%)",
    border: "rgba(167,139,250,0.32)",
    glow: "radial-gradient(70% 70% at 50% 40%, hsla(262,90%,72%,0.45), transparent 70%)",
    text: "hsl(262 90% 80%)",
  },
  amber: {
    bg:
      "linear-gradient(180deg, hsl(38 60% 16% / 0.92) 0%, hsl(20 50% 10% / 0.96) 100%)",
    border: "rgba(251,191,36,0.34)",
    glow: "radial-gradient(70% 70% at 50% 40%, hsla(38,95%,64%,0.42), transparent 70%)",
    text: "hsl(38 95% 70%)",
  },
  rose: {
    bg:
      "linear-gradient(180deg, hsl(348 60% 16% / 0.92) 0%, hsl(348 50% 10% / 0.96) 100%)",
    border: "rgba(252,108,140,0.32)",
    glow: "radial-gradient(70% 70% at 50% 40%, hsla(348,92%,70%,0.42), transparent 70%)",
    text: "hsl(348 92% 78%)",
  },
};

export default function GameCard({
  icon,
  title,
  sub,
  tone = "cyan",
  idleDelay = 0,
  tiltMax = 12,
  className,
  style,
}) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const shineRef = useRef(null);
  const rafRef = useRef(0);

  const t = TONE[tone] || TONE.cyan;

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
      inner.style.setProperty("--lift", "10px");
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

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("game-card", className)}
      style={style}
    >
      <div
        ref={innerRef}
        className="game-card__inner rounded-xl"
        style={{
          "--idle-delay": `${idleDelay}ms`,
          "--gc-bg": t.bg,
          "--gc-glow": t.glow,
          boxShadow: `inset 0 0 0 1px ${t.border}`,
          borderRadius: 14,
        }}
      >
        {/* deep layers */}
        <div className="game-card__layer game-card__glow" />
        <div className="game-card__layer game-card__bg" />
        <div ref={shineRef} className="game-card__shine" />

        {/* foreground content */}
        <div className="relative h-full w-full p-3 sm:p-3.5">
          <span className="game-card__icon inline-flex" style={{ color: t.text }}>
            {icon}
          </span>
          <p className="game-card__title mt-2 text-[13px] font-semibold leading-tight text-fg">
            {title}
          </p>
          {sub ? (
            <p className="game-card__sub mt-0.5 text-[11px] leading-snug text-fg-3">
              {sub}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
