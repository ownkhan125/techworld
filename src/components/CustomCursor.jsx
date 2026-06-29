"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], [role="switch"], [role="slider"], ' +
  'input, select, textarea, summary, label[for], ' +
  '[data-cursor="hover"], .kbd-key, .keycap, .arrow-btn, .btn-key, .ext-card, .dev-fig, .live-card';

/**
 * CustomCursor — Shift-keycap cursor that follows the pointer on desktop.
 *
 * - Idle: white keycap with subtle 3D depth, smooth lerp follow.
 * - Click: cap darkens + scales down slightly (real keypress feel).
 * - Hover on interactive elements: cap scales up + border glow.
 * - Touch / coarse-pointer devices: component returns null, native cursor stays.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const stateRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    visible: false,
    started: false,
  });
  const rafRef = useRef(0);

  // Detect desktop on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Mount the cursor only when enabled
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    html.classList.add("has-custom-cursor");

    const el = dotRef.current;
    if (!el) return;

    // Initialise to current viewport center so the first move doesn't long-jump from 0,0
    stateRef.current.targetX = window.innerWidth / 2;
    stateRef.current.targetY = window.innerHeight / 2;
    stateRef.current.currentX = stateRef.current.targetX;
    stateRef.current.currentY = stateRef.current.targetY;

    const setPress = (pressed) => {
      el.classList.toggle("cursor-shift--pressed", pressed);
    };
    const setHover = (hovering) => {
      el.classList.toggle("cursor-shift--hover", hovering);
    };
    const setVisible = (vis) => {
      el.classList.toggle("cursor-shift--visible", vis);
      stateRef.current.visible = vis;
    };

    const onMove = (e) => {
      stateRef.current.targetX = e.clientX;
      stateRef.current.targetY = e.clientY;
      if (!stateRef.current.started) {
        // first real move — snap so we don't fly in from center
        stateRef.current.currentX = e.clientX;
        stateRef.current.currentY = e.clientY;
        stateRef.current.started = true;
      }
      if (!stateRef.current.visible) setVisible(true);
      // hover detection — check what's under the pointer
      const target = e.target;
      if (target && target.closest) {
        const hit = target.closest(INTERACTIVE_SELECTOR);
        setHover(!!hit);
      }
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPress(true);
    const onUp = () => setPress(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onUp);

    // Lerp follow loop — pure transform writes, GPU-accelerated.
    const LERP = 0.22; // higher = snappier, lower = floatier. 0.22 ≈ "buttery"
    const tick = () => {
      const s = stateRef.current;
      s.currentX += (s.targetX - s.currentX) * LERP;
      s.currentY += (s.targetY - s.currentY) * LERP;
      el.style.transform = `translate3d(${s.currentX}px, ${s.currentY}px, 0) translate(-50%, -50%)`;
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
    <div ref={dotRef} className="cursor-shift" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        {/* Shift glyph — same as Ergonomics Icon.shift */}
        <path
          d="M8 2L3 8h2.5v5h5V8H13L8 2z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
