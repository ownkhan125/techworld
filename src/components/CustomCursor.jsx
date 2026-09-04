"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], [role="switch"], [role="slider"], ' +
  'input, select, textarea, summary, label[for], ' +
  '[data-cursor="hover"], .kbd-key, .keycap, .arrow-btn, .btn-key, .ext-card, .dev-fig, .live-card';

/**
 * CustomCursor — bespoke compass-rose cursor (desktop only).
 *
 * Three visible layers:
 *   1. Glyph — a thin SVG "compass" (hairline circle + fine cross) that
 *      snaps to the pointer with almost no lag and rotates slowly at idle
 *      so it reads as a precision instrument rather than a static ring.
 *   2. Halo  — a soft blurred cyan disc that trails the glyph with weight,
 *      giving quick swipes a subtle comet-tail.
 *   3. Pulse — a one-shot expanding ring layer created on mousedown for
 *      tactile click feedback; auto-removed after its animation ends.
 *
 * Deliberately avoids anything that reads as an AI-tactical reticle:
 * no dashed corner brackets, no dual-gradient stroke, no shift-key
 * keycap glyph. The mark is one shape, brand-cyan, ornamentally rotating.
 *
 * Touch / coarse-pointer devices: component returns null.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const glyphRef = useRef(null);
  const haloRef = useRef(null);
  const stateRef = useRef({
    targetX: 0, targetY: 0,
    glyphX: 0, glyphY: 0,
    haloX: 0, haloY: 0,
    visible: false,
    started: false,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const glyph = glyphRef.current;
    const halo = haloRef.current;
    if (!glyph || !halo) return;

    const s = stateRef.current;
    s.targetX = window.innerWidth / 2;
    s.targetY = window.innerHeight / 2;
    s.glyphX = s.haloX = s.targetX;
    s.glyphY = s.haloY = s.targetY;

    const setPress = (pressed) => {
      glyph.classList.toggle("cursor-glyph--pressed", pressed);
      halo.classList.toggle("cursor-halo--pressed", pressed);
    };
    const setHover = (hovering) => {
      glyph.classList.toggle("cursor-glyph--hover", hovering);
      halo.classList.toggle("cursor-halo--hover", hovering);
    };
    const setVisible = (vis) => {
      glyph.classList.toggle("cursor-glyph--visible", vis);
      halo.classList.toggle("cursor-halo--visible", vis);
      s.visible = vis;
    };

    const spawnPulse = (x, y) => {
      const pulse = document.createElement("div");
      pulse.className = "cursor-pulse";
      pulse.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      document.body.appendChild(pulse);
      pulse.addEventListener(
        "animationend",
        () => pulse.remove(),
        { once: true }
      );
    };

    const onMove = (e) => {
      s.targetX = e.clientX;
      s.targetY = e.clientY;
      if (!s.started) {
        s.glyphX = s.haloX = e.clientX;
        s.glyphY = s.haloY = e.clientY;
        s.started = true;
      }
      if (!s.visible) setVisible(true);
      const target = e.target;
      if (target && target.closest) {
        const hit = target.closest(INTERACTIVE_SELECTOR);
        setHover(!!hit);
      }
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = (e) => {
      setPress(true);
      spawnPulse(e.clientX, e.clientY);
    };
    const onUp = () => setPress(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onUp);

    // Glyph snaps almost instantly; halo trails with weight.
    const LERP_GLYPH = 0.5;
    const LERP_HALO = 0.16;
    const tick = () => {
      s.glyphX += (s.targetX - s.glyphX) * LERP_GLYPH;
      s.glyphY += (s.targetY - s.glyphY) * LERP_GLYPH;
      s.haloX += (s.targetX - s.haloX) * LERP_HALO;
      s.haloY += (s.targetY - s.haloY) * LERP_HALO;
      glyph.style.transform = `translate3d(${s.glyphX}px, ${s.glyphY}px, 0)`;
      halo.style.transform = `translate3d(${s.haloX}px, ${s.haloY}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      html.classList.remove("has-custom-cursor");
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={haloRef} className="cursor-halo" aria-hidden />
      <div ref={glyphRef} className="cursor-glyph" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          {/* Rotating compass rose — thin ring + fine cross + 4 tick marks. */}
          <g className="cursor-glyph__rose">
            <circle
              className="cursor-glyph__ring"
              cx="12"
              cy="12"
              r="10.4"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            {/* Fine cardinal ticks */}
            <path
              d="M12 1.3v3.2 M12 19.5v3.2 M1.3 12h3.2 M19.5 12h3.2"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.85"
            />
            {/* Inner cross — precision reticle */}
            <path
              d="M12 8.4v3.6 M12 12v3.6 M8.4 12h3.6 M12 12h3.6"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
          </g>
          {/* Center dot — sits above rotating rose so it stays still */}
          <circle
            className="cursor-glyph__dot"
            cx="12"
            cy="12"
            r="1.35"
            fill="currentColor"
          />
        </svg>
      </div>
    </>
  );
}
