"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import KeyboardKey from "@/components/KeyboardKey";
import CinematicSection from "@/components/CinematicSection";

/**
 * Ergonomics — 5x4 keyboard grid. Every key is fixed in place; only an internal
 * inner element animates. At any moment only 2–3 keys carry data-animating="1"
 * (rotated by a coordinator effect every 2.2s) so the surface always feels
 * alive without all keys moving in sync.
 *
 * All keys are icon-only (no text labels). Mix of tech logos + keyboard glyphs.
 * 4 keys retain a tone tint as the original feature accents.
 */

/* ---- inline icon library — all 14–16px, current-color stroke/fill ---- */
const Icon = {
  arrowUp: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowDown: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowLeft: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shift: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L3 8h2.5v5h5V8H13L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  cmd: (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 3a1.5 1.5 0 1 0 0 3h1V5H5zm5 0a1.5 1.5 0 1 1 0 3H9V5h1zM5 11a1.5 1.5 0 1 1 0-3h1v1H5zm5 0a1.5 1.5 0 1 0 0-3H9v1h1z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  ),
  option: (
    <svg width="15" height="14" viewBox="0 0 16 14" fill="none">
      <path d="M1 2h3l5 10h5M9 2h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  enter: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 3v3a2 2 0 0 1-2 2H3M3 8l3-3M3 8l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  /* feature icons (tone-colored keys) */
  clock: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  apple: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <path d="M10.6 9.5c-.1 1.3-1 2.3-2 2.3-.7 0-1-.3-1.7-.3s-1 .3-1.6.3c-1.2 0-2.2-1.5-2.2-3 0-1.6 1-2.5 2-2.5.7 0 1.2.3 1.7.3s1-.3 1.8-.3c.7 0 1.4.4 1.8 1-1.4.8-1.2 2.6-.3 3.2zM8.2 3a2.4 2.4 0 0 1-.8 1.7 2 2 0 0 1-1.6.8c-.1-.7.3-1.5.8-2A2.4 2.4 0 0 1 8.2 3z" />
    </svg>
  ),
  shield: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5 1.5 4v3c0 3.2 2.3 5.3 5.5 5.5 3.2-.2 5.5-2.3 5.5-5.5V4L7 1.5z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  bolt: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8 1L3 8h3l-1 5 5-7H7l1-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),

  /* tech logos — simplified iconic marks (mostly stroke, current color) */
  react: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  ),
  next: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 7.5v9M8.5 7.5L15 16M15.5 7.5v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  typescript: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 11h6M10 11v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M19 12.5c-.4-.7-1.2-1.2-2.2-1.2-1.3 0-2.2.7-2.2 1.7 0 2.2 4.4 1.4 4.4 3.6 0 1.1-1 1.9-2.5 1.9-1.2 0-2.1-.5-2.6-1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  javascript: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 11v5.5c0 .8-.5 1.3-1.3 1.3-.7 0-1.2-.4-1.4-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 12c-.4-.7-1.2-1-2-1-1.2 0-2 .6-2 1.5 0 1.9 4 1.3 4 3.2 0 1-.9 1.6-2.2 1.6-1.1 0-1.9-.5-2.3-1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  tailwind: (
    <svg width="18" height="14" viewBox="0 0 24 16" fill="none">
      <path d="M6 6c1.5-3 3.5-3 6-1.5 1.5 1 2.5 1 3.5.5C16.5 4.5 17.5 3 19 3c-1.5 3-3.5 3-6 1.5-1.5-1-2.5-1-3.5-.5C8.5 4.5 7.5 6 6 6z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M3 12c1.5-3 3.5-3 6-1.5 1.5 1 2.5 1 3.5.5 1-.5 2-2 3.5-2-1.5 3-3.5 3-6 1.5-1.5-1-2.5-1-3.5-.5C5.5 10.5 4.5 12 3 12z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  python: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M9 4h4a3 3 0 0 1 3 3v3h-7a3 3 0 0 0-3 3v3a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h6V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M15 20h-4a3 3 0 0 1-3-3v-3h7a3 3 0 0 0 3-3v-3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-6v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="0.8" fill="currentColor" />
      <circle cx="15" cy="17" r="0.8" fill="currentColor" />
    </svg>
  ),
  node: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5L21 7v10l-9 4.5L3 17V7l9-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  docker: (
    <svg width="18" height="14" viewBox="0 0 24 16" fill="none">
      <rect x="2" y="9" width="3" height="3" rx="0.4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="6" y="9" width="3" height="3" rx="0.4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="10" y="9" width="3" height="3" rx="0.4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="14" y="9" width="3" height="3" rx="0.4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="6" y="5.5" width="3" height="3" rx="0.4" stroke="currentColor" strokeWidth="1.1" />
      <rect x="10" y="5.5" width="3" height="3" rx="0.4" stroke="currentColor" strokeWidth="1.1" />
      <path d="M19 8c1 0 2 .5 2 1.5C21 13 17 14 14 14H2c0-2 2-3 4-3" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  ),
  git: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 7v10M7 12c0-3 4-3 6-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  mongodb: (
    <svg width="14" height="18" viewBox="0 0 16 22" fill="none">
      <path d="M8 1c2 3 5 6 5 11 0 4-2 7-5 9-3-2-5-5-5-9 0-5 3-8 5-11z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
      <path d="M8 4v17" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
};

/* ---- 5×4 grid composition (20 keys); each cube has a 2nd face icon ---- */
const KEYS = [
  // row 0
  { icon: Icon.shift,      iconBack: Icon.enter },
  { icon: Icon.arrowUp,    iconBack: Icon.arrowDown },
  { icon: Icon.clock,      iconBack: Icon.bolt,   tone: "cyan"   },
  { icon: Icon.cmd,        iconBack: Icon.option, tone: "violet" },
  { icon: Icon.arrowDown,  iconBack: Icon.arrowUp },
  // row 1
  { icon: Icon.arrowLeft,  iconBack: Icon.arrowRight },
  { icon: Icon.apple,      iconBack: Icon.bolt,   tone: "amber" },
  { icon: Icon.shield,     iconBack: Icon.clock,  tone: "rose"  },
  { icon: Icon.arrowRight, iconBack: Icon.arrowLeft },
  { icon: Icon.option,     iconBack: Icon.cmd },
  // row 2 — tech logos
  { icon: Icon.react,       iconBack: Icon.next },
  { icon: Icon.next,        iconBack: Icon.react },
  { icon: Icon.typescript,  iconBack: Icon.javascript },
  { icon: Icon.javascript,  iconBack: Icon.typescript },
  { icon: Icon.tailwind,    iconBack: Icon.react },
  // row 3 — tech logos
  { icon: Icon.python,    iconBack: Icon.node },
  { icon: Icon.node,      iconBack: Icon.docker },
  { icon: Icon.docker,    iconBack: Icon.git },
  { icon: Icon.git,       iconBack: Icon.node },
  { icon: Icon.mongodb,   iconBack: Icon.python },
];

const KEY_COUNT = KEYS.length;
const PICKS_MIN = 2;
const PICKS_MAX = 3;
const ROTATE_MS = 2200;

export default function Ergonomics() {
  const [activeSet, setActiveSet] = useState(() => new Set());

  // randomized idle: every ROTATE_MS, pick 2–3 indices to animate, distinct from
  // the previous pick so the eye sees fresh keys each cycle.
  useEffect(() => {
    let prev = new Set();
    const pick = () => {
      const n = PICKS_MIN + Math.floor(Math.random() * (PICKS_MAX - PICKS_MIN + 1));
      const next = new Set();
      let safety = 0;
      while (next.size < n && safety++ < 50) {
        const idx = Math.floor(Math.random() * KEY_COUNT);
        if (!prev.has(idx)) next.add(idx);
      }
      prev = next;
      setActiveSet(next);
    };
    pick();
    const id = setInterval(pick, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <CinematicSection className="section-pad relative overflow-hidden">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* LEFT: text + Download */}
        <Reveal data-stage="heading">
          <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-4xl">
            It's not about saving time.{" "}
            <span className="text-fg-3">
              It's about feeling like you're never wasting it.
            </span>
          </h2>
          <div className="mt-10">
            <Link href="#cta" className="btn-key h-11 px-5 text-[14px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M10.6 9.5c-.1 1.3-1 2.3-2 2.3-.7 0-1-.3-1.7-.3s-1 .3-1.6.3c-1.2 0-2.2-1.5-2.2-3 0-1.6 1-2.5 2-2.5.7 0 1.2.3 1.7.3s1-.3 1.8-.3c.7 0 1.4.4 1.8 1-1.4.8-1.2 2.6-.3 3.2zM8.2 3a2.4 2.4 0 0 1-.8 1.7 2 2 0 0 1-1.6.8c-.1-.7.3-1.5.8-2A2.4 2.4 0 0 1 8.2 3z" />
              </svg>
              Download
            </Link>
          </div>
        </Reveal>

        {/* RIGHT: living keyboard grid */}
        <Reveal delay={120} data-stage="media">
          <div className="kbd-grid">
            {KEYS.map((k, i) => (
              <KeyboardKey
                key={i}
                icon={k.icon}
                iconBack={k.iconBack}
                tone={k.tone}
                animating={activeSet.has(i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </CinematicSection>
  );
}
