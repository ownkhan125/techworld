"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import CinematicSection from "@/components/CinematicSection";

/**
 * Coverflow-style testimonial carousel.
 *  - Avatar pill cards in a horizontal row, transform-translated so the active
 *    card sits at the visual center.
 *  - Side cards are dimmed and slightly scaled down; the active card scales up
 *    and gains a tone-tinted border + soft glow.
 *  - Click any visible card (or use arrow buttons / keyboard arrows) to switch.
 *  - Below: 2-col detail panel — Favorite Feature + Top Extension on the left,
 *    a big quote with inline bold highlights on the right.
 */

const PEOPLE = [
  {
    name: "Adam Whitcroft",
    handle: "@AdamWhitcroft",
    role: "Designer, Owner",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop",
    favName: "Snippets",
    favIcon: "S",
    favTone: "violet",
    favDesc: "80 of them. I'd genuinely be lost without them.",
    topExtName: "Color Picker",
    topExtIcon: "C",
    topExtTone: "cyan",
    topExtDesc: "Pulls any colour straight from screen into my clipboard.",
    quote: (
      <>
        It feels like{" "}
        <strong className="text-fg">
          the operating system I always wanted
        </strong>{" "}
        but never had.
      </>
    ),
  },
  {
    name: "Guillermo Rauch",
    handle: "@rauchg",
    role: "CEO, Vercel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop",
    favName: "AI Chat",
    favIcon: "A",
    favTone: "rose",
    favDesc: "Realtime knowledge, anywhere in your OS.",
    topExtName: "Notion Search",
    topExtIcon: "N",
    topExtTone: "amber",
    topExtDesc: "Forked it so I can paste tokenised doc links straight into Slack.",
    quote: (
      <>
        Techworld is incrementally{" "}
        <strong className="text-fg">
          turning my Mac into an AI-native operating system
        </strong>{" "}
        and I'm so here for it.
      </>
    ),
  },
  {
    name: "Marques Brownlee",
    handle: "@MKBHD",
    role: "Creator, MKBHD",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop",
    favName: "Window Mgmt",
    favIcon: "W",
    favTone: "cyan",
    favDesc: "I haven't touched the green window button in months.",
    topExtName: "Clipboard",
    topExtIcon: "C",
    topExtTone: "violet",
    topExtDesc: "Searchable history across every device I've signed into.",
    quote: (
      <>
        The one piece of software that has{" "}
        <strong className="text-fg">
          genuinely changed how I work day to day
        </strong>
        .
      </>
    ),
  },
  {
    name: "Mira Okafor",
    handle: "@miraokafor",
    role: "Head of Platform, Helion",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop",
    favName: "Fleet Inspector",
    favIcon: "F",
    favTone: "emerald",
    favDesc: "Diff configs across 200+ nodes in one glance.",
    topExtName: "Tracer",
    topExtIcon: "T",
    topExtTone: "violet",
    topExtDesc: "Token-grain visibility we've wanted for years.",
    quote: (
      <>
        We collapsed a 14-service inference pipeline into one graph.{" "}
        <strong className="text-fg">Latency dropped 6×.</strong>
      </>
    ),
  },
  {
    name: "Daniel Rhee",
    handle: "@danrhee",
    role: "CTO, Lattice AI",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80&auto=format&fit=crop",
    favName: "Hotkeys",
    favIcon: "H",
    favTone: "amber",
    favDesc: "Bound my entire deploy graph to ⌘⇧D.",
    topExtName: "Agent Studio",
    topExtIcon: "A",
    topExtTone: "rose",
    topExtDesc: "Compose long-running agents with deterministic replay.",
    quote: (
      <>
        Felt like{" "}
        <strong className="text-fg">
          Vercel for autonomous agents
        </strong>
        .
      </>
    ),
  },
];

const TONE_BG = {
  cyan: "linear-gradient(135deg, hsl(178 92% 70%), hsl(195 90% 55%))",
  violet: "linear-gradient(135deg, hsl(262 90% 75%), hsl(280 75% 55%))",
  amber: "linear-gradient(135deg, hsl(38 95% 64%), hsl(20 90% 55%))",
  rose: "linear-gradient(135deg, hsl(348 92% 70%), hsl(330 70% 50%))",
  emerald: "linear-gradient(135deg, hsl(160 75% 55%), hsl(180 70% 45%))",
};

const TONE_BORDER = {
  cyan: "rgba(94,240,230,0.50)",
  violet: "rgba(167,139,250,0.50)",
  amber: "rgba(251,191,36,0.50)",
  rose: "rgba(252,108,140,0.50)",
  emerald: "rgba(94,234,212,0.50)",
};

const CARD_WIDTH = 320; // px
const CARD_GAP = 16;    // px

export default function Testimonials() {
  const [active, setActive] = useState(Math.floor(PEOPLE.length / 2));
  const stripRef = useRef(null);
  const wrapRef = useRef(null);
  const [wrapWidth, setWrapWidth] = useState(0);

  // measure outer wrap width on mount + resize
  useEffect(() => {
    const onResize = () => setWrapWidth(wrapRef.current?.clientWidth || 0);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = useCallback(
    (delta) => setActive((i) => (i + delta + PEOPLE.length) % PEOPLE.length),
    []
  );

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    const node = wrapRef.current;
    if (!node) return;
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [go]);

  const a = PEOPLE[active];

  // calculate translateX so the active card is centered in the wrap
  const offset =
    wrapWidth / 2 -
    active * (CARD_WIDTH + CARD_GAP) -
    CARD_WIDTH / 2;

  return (
    <CinematicSection id="customers" className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="Built for professionals"
          eyebrowTone="cyan"
          title="Used by seriously productive people."
        />

        {/* COVERFLOW CAROUSEL */}
        <Reveal data-stage="media">
          <div
            ref={wrapRef}
            tabIndex={0}
            className="relative mt-14 outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
          >
            {/* edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[18%] bg-gradient-to-r from-bg via-bg/70 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[18%] bg-gradient-to-l from-bg via-bg/70 to-transparent" />

            {/* strip */}
            <div className="relative flex items-center overflow-hidden py-6">
              <div
                ref={stripRef}
                className="flex items-center"
                style={{
                  gap: `${CARD_GAP}px`,
                  transform: `translate3d(${offset}px, 0, 0)`,
                  transition:
                    "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                {PEOPLE.map((p, i) => {
                  const dist = Math.abs(i - active);
                  const isActive = i === active;
                  const scale = isActive ? 1 : Math.max(0.86, 1 - dist * 0.08);
                  const opacity = isActive ? 1 : Math.max(0.35, 1 - dist * 0.32);
                  return (
                    <button
                      key={p.handle}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive}
                      className="group flex shrink-0 items-center gap-3 rounded-2xl border bg-bg-2/85 px-4 py-3 text-left backdrop-blur-md"
                      style={{
                        width: `${CARD_WIDTH}px`,
                        borderColor: isActive
                          ? "rgba(255,255,255,0.22)"
                          : "rgba(255,255,255,0.08)",
                        transform: `scale(${scale})`,
                        opacity,
                        transition:
                          "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                        boxShadow: isActive
                          ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 60px -28px rgba(94,240,230,0.32), 0 0 22px rgba(94,240,230,0.16)"
                          : "inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 30px -20px rgba(0,0,0,0.7)",
                      }}
                    >
                      <span className="relative inline-block size-10 shrink-0 overflow-hidden rounded-full border border-line">
                        <Image
                          src={p.avatar}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-semibold text-fg">
                          {p.name}{" "}
                          <span className="font-mono text-[11px] font-normal text-fg-4">
                            {p.handle}
                          </span>
                        </span>
                        <span className="block truncate text-[11.5px] text-fg-3">
                          {p.role}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* arrow controls */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="arrow-btn"
                aria-label="Previous testimonial"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* dot indicators */}
              <div className="flex items-center gap-1.5">
                {PEOPLE.map((p, i) => (
                  <button
                    key={`dot-${p.handle}`}
                    type="button"
                    aria-label={`Show ${p.name}`}
                    onClick={() => setActive(i)}
                    className={
                      "h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                      (i === active
                        ? "w-6 bg-fg"
                        : "w-1.5 bg-fg-4 hover:bg-fg-3")
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                className="arrow-btn"
                aria-label="Next testimonial"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </Reveal>

        {/* DETAIL PANEL */}
        <div data-stage="body" className="relative mt-14 grid grid-cols-1 gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-16">
          <div
            key={`left-${a.handle}`}
            className="space-y-8"
            style={{ animation: "pop-in 0.5s var(--ease-out-cinema)" }}
          >
            <DetailRow
              label="Favorite Feature"
              pill={a.favName}
              icon={a.favIcon}
              tone={a.favTone}
              body={a.favDesc}
            />
            <DetailRow
              label="Top Extension"
              pill={a.topExtName}
              icon={a.topExtIcon}
              tone={a.topExtTone}
              body={a.topExtDesc}
            />
          </div>
          <div
            key={`right-${a.handle}`}
            className="relative"
            style={{ animation: "pop-in 0.5s 60ms var(--ease-out-cinema) both" }}
          >
            <span aria-hidden className="absolute -left-3 top-0 hidden h-full w-px bg-line lg:block" />
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              className="text-fg-5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6H5.5c0-1.84 1.5-3.34 3.34-3.34V6h-1.67zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6H15.5c0-1.84 1.5-3.34 3.34-3.34V6h-1.67z" />
            </svg>
            <p className="mt-3 text-balance text-xl font-medium leading-snug tracking-tight text-fg-2 sm:text-2xl">
              {a.quote}
            </p>
          </div>
        </div>
      </div>
    </CinematicSection>
  );
}

function DetailRow({ label, pill, icon, tone = "violet", body }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-4 sm:grid-cols-[170px_1fr] sm:gap-6">
      <p className="pt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-4">
        {label}:
      </p>
      <div>
        <span
          className="inline-flex items-center gap-2 rounded-md border bg-bg-2/80 px-2.5 py-1.5 text-[13px] font-semibold text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_14px_-8px_rgba(0,0,0,0.6)]"
          style={{ borderColor: TONE_BORDER[tone] || "rgba(255,255,255,0.18)" }}
        >
          <span
            className="inline-flex size-5 items-center justify-center rounded-[5px] text-bg"
            style={{
              background: TONE_BG[tone] || TONE_BG.violet,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            <span className="text-[10px] font-bold">{icon}</span>
          </span>
          {pill}
        </span>
        <p className="mt-3 max-w-[40ch] text-[14px] leading-relaxed text-fg-3">
          {body}
        </p>
      </div>
    </div>
  );
}
