"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import ExtCard from "@/components/ExtCard";
import CinematicSection from "@/components/CinematicSection";

const ITEMS = [
  {
    title: "Vision Pipeline",
    description: "Stream from any camera through your detection graph at sub-frame latency.",
    iconLetter: "V",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80&auto=format&fit=crop",
    tone: "cyan",
  },
  {
    title: "Agent Studio",
    description: "Compose long-running multi-step agents with deterministic replay and rollback.",
    iconLetter: "A",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80&auto=format&fit=crop",
    tone: "violet",
  },
  {
    title: "Edge Runtime",
    description: "Ship a 30MB binary to ARM, x86, or NVIDIA Jetson — and watch it join your fleet.",
    iconLetter: "E",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop",
    tone: "amber",
  },
  {
    title: "Live Tracer",
    description: "Token-grain traces stitched across model calls, agents, and device events.",
    iconLetter: "T",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
    tone: "rose",
  },
  {
    title: "Fleet Inspector",
    description: "Pin versions, diff configs, roll back without redeploys — across thousands of nodes.",
    iconLetter: "F",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop",
    tone: "emerald",
  },
  {
    title: "Policy Vault",
    description: "Per-tenant key vaults, hardware-attested enclaves, fine-grained IAM out of the box.",
    iconLetter: "P",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=80&auto=format&fit=crop",
    tone: "cyan",
  },
  {
    title: "Realtime Bus",
    description: "A wire-fast pub/sub for sensor streams, agent chatter, and operator overrides.",
    iconLetter: "R",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop",
    tone: "violet",
  },
  {
    title: "Compiler",
    description: "Hardware-aware graph compiler. We pick the cheapest path your silicon allows.",
    iconLetter: "C",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop",
    tone: "amber",
  },
];

export default function IntegrationsReel() {
  const reelRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const checkBounds = () => {
    const el = reelRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 2;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max);
  };

  useEffect(() => {
    const el = reelRef.current;
    if (!el) return;
    checkBounds();
    el.addEventListener("scroll", checkBounds, { passive: true });
    window.addEventListener("resize", checkBounds);
    return () => {
      el.removeEventListener("scroll", checkBounds);
      window.removeEventListener("resize", checkBounds);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = reelRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.66;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <CinematicSection className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="The library"
          eyebrowTone="cyan"
          title="A growing library of building blocks."
          sub="Drop-in modules for vision, agents, edge devices, observability and security — composable in any graph."
        />
        <div data-stage="cta" className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className="arrow-btn"
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className="arrow-btn"
            aria-label="Next"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={reelRef}
        data-stage="media"
        className="reel mt-8 -mx-[max(20px,4vw)] sm:mt-10"
        style={{ paddingInline: "max(20px, 4vw)" }}
      >
        {ITEMS.map((it, i) => (
          <ExtCard key={it.title} {...it} />
        ))}
      </div>

      <div data-stage="cta" className="container-x mt-8">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-fg-3 transition-colors duration-300 hover:text-fg"
          >
            Browse the full library
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span aria-hidden className="h-px flex-1 border-t border-dashed border-line" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-5">
            The library · {String(ITEMS.length).padStart(2, "0")} shown
          </span>
        </div>
      </div>
    </CinematicSection>
  );
}
