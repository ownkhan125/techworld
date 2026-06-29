"use client";

import Link from "next/link";
import SplitText from "@/components/SplitText";
import Reveal from "@/components/Reveal";
import CinematicSection from "@/components/CinematicSection";

/**
 * Hero — backed by the global ParticleBackground canvas + a soft radial
 * vignette overlay so text stays legible without obscuring the particles.
 */
export default function Hero() {
  return (
    <CinematicSection
      id="top"
      mode="onload"
      className="relative isolate overflow-hidden pt-32 sm:pt-40 pb-24 sm:pb-32"
    >
      {/* radial focus vignette so text reads cleanly on the particle field */}
      <div
        aria-hidden
        data-stage="bg"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] sm:h-[940px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(6,7,10,0.55) 0%, rgba(6,7,10,0.25) 55%, transparent 100%)",
        }}
      />

      <div className="container-x relative flex flex-col items-center text-center">
        <Reveal data-stage="frame">
          <Link
            href="#features"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg-2/60 px-3 py-1.5 text-[12px] font-medium text-fg-2 backdrop-blur-md transition-colors duration-300 hover:bg-bg-2/85 hover:text-fg"
          >
            <span className="relative flex size-1.5 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan/70" />
              <span className="relative size-1.5 rounded-full bg-cyan" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
              v0.9
            </span>
            <span className="mx-1 h-3 w-px bg-line" />
            <span>Private beta open</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="text-fg-4 transition-transform duration-300 group-hover:translate-x-0.5">
              <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>

        <div data-stage="heading" className="mt-7">
          <SplitText
            text="Compute fabric for autonomous systems."
            as="h1"
            baseDelay={80}
            step={55}
            className="mx-auto max-w-[18ch] text-balance text-[44px] font-semibold leading-[1.04] tracking-[-0.025em] text-fg sm:text-6xl lg:text-[80px]"
          />
        </div>

        <Reveal as="p" delay={650} data-stage="body" className="mt-6">
          <span className="block max-w-[58ch] text-balance text-[15px] leading-[1.55] text-fg-2 sm:text-base">
            Orchestrate models, agents and devices on one programmable substrate.
            Cinematic developer tooling. Sub-millisecond execution. Production
            from day one.
          </span>
        </Reveal>

        <Reveal as="div" delay={820} data-stage="cta" className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="#cta" className="btn-key h-11 px-5 text-[14px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M10.6 9.5c-.1 1.3-1 2.3-2 2.3-.7 0-1-.3-1.7-.3s-1 .3-1.6.3c-1.2 0-2.2-1.5-2.2-3 0-1.6 1-2.5 2-2.5.7 0 1.2.3 1.7.3s1-.3 1.8-.3c.7 0 1.4.4 1.8 1-1.4.8-1.2 2.6-.3 3.2zM8.2 3a2.4 2.4 0 0 1-.8 1.7 2 2 0 0 1-1.6.8c-.1-.7.3-1.5.8-2A2.4 2.4 0 0 1 8.2 3z" />
            </svg>
            Download for Mac
          </Link>
          <Link href="#cta" className="btn-key h-11 px-5 text-[14px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
              <rect x="7.5" y="1" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
              <rect x="1" y="7.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
              <rect x="7.5" y="7.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Download for Windows
          </Link>
        </Reveal>

        <Reveal as="div" delay={1000} data-stage="cta" className="mt-7 flex items-center gap-4 text-[12px] text-fg-3">
          <span className="font-mono text-[11px] text-fg-4">v0.9.21 · macOS 13+</span>
          <span className="h-3 w-px bg-line" />
          <Link href="#" className="font-mono text-[11px] text-fg-3 underline-offset-4 transition-colors hover:text-fg hover:underline">
            Install via homebrew
          </Link>
        </Reveal>
      </div>
    </CinematicSection>
  );
}
