"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SectionFrame — absolutely-positioned SVG hairline that traces its parent's
 * rectangle when the parent enters the viewport, then settles as subtle
 * chrome. Uses IntersectionObserver + CSS transitions (no per-frame JS),
 * so it composes with the existing GSAP pipeline without competing for the
 * ScrollTrigger budget.
 *
 * Layout:
 *   Render inside a `position: relative` parent (typically inside container-x
 *   inside a CinematicSection). Pointer-events off; z-index 0 so heading /
 *   card content stays on top.
 *
 * How the trace works:
 *   A ResizeObserver measures the parent → we recompute the rect's pixel
 *   dimensions and the exact stroke perimeter, then write those values into
 *   attributes / a CSS variable. When the parent enters the viewport we add
 *   `.is-drawn`, which changes stroke-dashoffset from `--sf-len` to `0` via
 *   a CSS transition. Corner ticks fade in after the trace completes.
 *
 * Respects prefers-reduced-motion via CSS (frame is drawn immediately).
 */
export default function SectionFrame({
  radius = 20,
  inset = 8,
  tickSize = 16,
  ticks = true,
  className,
}) {
  const wrapRef = useRef(null);
  const rectRef = useRef(null);
  const tickRefs = useRef([]);
  const shownRef = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (typeof window === "undefined") return;
    const parent = wrap.parentElement;
    if (!parent) return;

    const measure = () => {
      const w = parent.clientWidth - inset * 2;
      const h = parent.clientHeight - inset * 2;
      if (w <= 0 || h <= 0) return;
      setSize({ w, h });
      // Perimeter of a rounded rect: 2(w+h) - 8r + 2πr
      const perim = 2 * (w + h) - 8 * radius + 2 * Math.PI * radius;
      wrap.style.setProperty("--sf-len", `${Math.ceil(perim + 8)}`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !shownRef.current) {
            shownRef.current = true;
            requestAnimationFrame(() => wrap.classList.add("is-drawn"));
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(parent);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [radius, inset]);

  const { w, h } = size;
  const t = tickSize;

  return (
    <svg
      ref={wrapRef}
      className={`sf ${className ?? ""}`}
      width={w}
      height={h}
      style={{
        position: "absolute",
        top: inset,
        left: inset,
        width: w,
        height: h,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 0,
      }}
      aria-hidden
    >
      {w > 0 && h > 0 ? (
        <>
          <rect
            ref={rectRef}
            className="sf__rect"
            x="0.5"
            y="0.5"
            width={Math.max(1, w - 1)}
            height={Math.max(1, h - 1)}
            rx={radius}
            ry={radius}
          />
          {ticks ? (
            <>
              {/* Top-left */}
              <path
                ref={(el) => (tickRefs.current[0] = el)}
                className="sf__tick"
                d={`M0.5,${t} L0.5,0.5 L${t},0.5`}
              />
              {/* Top-right */}
              <path
                ref={(el) => (tickRefs.current[1] = el)}
                className="sf__tick"
                d={`M${w - t},0.5 L${w - 0.5},0.5 L${w - 0.5},${t}`}
              />
              {/* Bottom-left */}
              <path
                ref={(el) => (tickRefs.current[2] = el)}
                className="sf__tick"
                d={`M0.5,${h - t} L0.5,${h - 0.5} L${t},${h - 0.5}`}
              />
              {/* Bottom-right */}
              <path
                ref={(el) => (tickRefs.current[3] = el)}
                className="sf__tick"
                d={`M${w - t},${h - 0.5} L${w - 0.5},${h - 0.5} L${w - 0.5},${h - t}`}
              />
            </>
          ) : null}
        </>
      ) : null}
    </svg>
  );
}
