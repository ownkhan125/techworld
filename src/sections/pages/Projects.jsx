"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CinematicSection from "@/components/CinematicSection";
import SectionTitle from "@/components/SectionTitle";
import SectionFrame from "@/components/SectionFrame";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import LiveCard, { LiveLayer } from "@/components/LiveCard";
import { PROJECTS, CATEGORIES } from "@/data/projects";

/**
 * Projects — a portfolio library. Data-driven from src/data/projects.js so
 * new work can be added by editing a single file.
 *
 * Structure (unique to this page — not a home-page copy):
 *   1. Hero band with an "N works" counter and category chip filter.
 *   2. Featured spotlight — the first PROJECTS entry gets a full-bleed
 *      hero card treatment (image + metrics + long body).
 *   3. Filterable grid — all remaining projects rendered as consistent
 *      cards; a client-side chip filter narrows by category.
 *   4. Empty state — thoughtful copy if a filter produces no matches.
 *   5. Closing CTA that routes to /contact.
 *
 * Filter state is React-only (no URL param) so the interaction stays
 * snappy and no full navigation is triggered on chip clicks.
 */

const TONE_BORDER = {
  cyan: "rgba(94,240,230,0.36)",
  violet: "rgba(167,139,250,0.36)",
  amber: "rgba(251,191,36,0.36)",
  rose: "rgba(252,108,140,0.36)",
  emerald: "rgba(94,234,212,0.36)",
};
const TONE_DOT = {
  cyan: "bg-cyan", violet: "bg-violet", amber: "bg-amber",
  rose: "bg-rose", emerald: "bg-[hsl(160_75%_55%)]",
};
const TONE_TEXT = {
  cyan: "text-cyan", violet: "text-violet", amber: "text-amber",
  rose: "text-rose", emerald: "text-[hsl(160_75%_55%)]",
};

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const [featured, ...rest] = PROJECTS;
  const visible = useMemo(() => {
    if (filter === "all") return rest;
    return rest.filter((p) => p.category === filter);
  }, [rest, filter]);

  const chipItems = useMemo(() => {
    // Count once per render so the chip label reads honestly.
    const counts = new Map();
    counts.set("all", PROJECTS.length);
    for (const p of PROJECTS) {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    }
    return CATEGORIES.map((c) => ({ ...c, count: counts.get(c.value) || 0 }));
  }, []);

  return (
    <>
      {/* HERO */}
      <CinematicSection
        id="top"
        mode="onload"
        className="relative isolate flex min-h-[clamp(520px,72svh,760px)] flex-col justify-center overflow-hidden pb-14 pt-28 sm:pt-32 lg:pt-36"
      >
        <div
          aria-hidden
          data-stage="bg"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px]"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 40%, rgba(6,7,10,0.55) 0%, rgba(6,7,10,0.25) 55%, transparent 100%)",
          }}
        />
        <div className="container-x flex flex-col items-center text-center">
          <div data-stage="frame">
            <Eyebrow tone="cyan">Projects</Eyebrow>
          </div>
          <SectionTitle
            title="Work shipped on the fabric."
            sub="A library of production systems built with Techworld — autonomous fleets, vision networks, agent platforms and quiet internal tools that just save hours."
          />

          {/* Meta row — total + latest ship date */}
          <div data-stage="body" className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-2/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3">
              <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
              {PROJECTS.length} works · latest {PROJECTS[0]?.year ?? "2026"}
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-2/60 px-3 py-1.5 text-[12px] font-medium text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
            >
              Propose a project
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </CinematicSection>

      {/* FEATURED SPOTLIGHT */}
      {featured ? (
        <CinematicSection className="section-pad-tight relative overflow-hidden">
          <div className="container-x">
            <div className="relative">
              <SectionFrame radius={22} inset={-6} />
              <FeaturedCard project={featured} />
            </div>
          </div>
        </CinematicSection>
      ) : null}

      {/* FILTERABLE GRID */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Library"
            eyebrowTone="violet"
            title="Every ship, sorted."
            sub="Filter by domain — the same set of primitives (agents, vision, traces, fleet, scripts) shows up across every category."
          />

          {/* Filter chips */}
          <div data-stage="cta" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {chipItems.map((c) => {
              const active = filter === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setFilter(c.value)}
                  aria-pressed={active}
                  className={
                    "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-300 " +
                    (active
                      ? "border-line-strong bg-surface-2 text-fg"
                      : "border-line bg-bg-2/60 text-fg-2 hover:border-line-strong hover:text-fg")
                  }
                >
                  <span
                    className={
                      "size-1.5 rounded-full transition-colors " +
                      (active
                        ? (TONE_DOT[c.tone] || "bg-cyan")
                        : "bg-fg-4 group-hover:bg-fg-3")
                    }
                  />
                  <span>{c.label}</span>
                  <span className="font-mono text-[10px] text-fg-4">{c.count}</span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {visible.length ? (
            <div data-stage="body" className="mt-12 grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 80}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div data-stage="body" className="mx-auto mt-16 max-w-[520px] rounded-2xl border border-dashed border-line bg-bg-2/40 p-8 text-center">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                Empty shelf
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-2">
                Nothing shipped under this filter yet — but we're always building.
                Talk to us about your own domain.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-fg transition-colors hover:text-cyan"
              >
                Start a conversation
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </CinematicSection>

      {/* CTA */}
      <CinematicSection className="section-pad-tight relative overflow-hidden">
        <div className="container-x">
          <div className="mx-auto flex max-w-[820px] flex-col items-center gap-6 rounded-3xl border border-line-strong bg-bg-2/60 p-8 text-center backdrop-blur-xl sm:p-12">
            <SectionTitle
              eyebrow="Your work next"
              eyebrowTone="rose"
              title="Ship a project with the founding team."
              sub="We take on a small number of new builds each quarter. Send a short brief; we'll reply the same day for anything ambitious."
            />
            <div data-stage="cta" className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-key h-11 px-5 text-[14px]">
                Send a brief
              </Link>
              <Link href="/customers" className="btn-ghost h-11 px-5 text-[13px]">
                See customer stories
              </Link>
            </div>
          </div>
        </div>
      </CinematicSection>
    </>
  );
}

/* --------------- featured spotlight card --------------- */

function FeaturedCard({ project }) {
  return (
    <Reveal data-stage="media">
      <LiveCard tone={project.tone} idleDelay={200} tiltMax={4} radius={22} className="block">
        <article className="relative grid grid-cols-1 overflow-hidden rounded-[inherit] lg:grid-cols-[1.05fr_1fr]">
          {/* Image side */}
          <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              priority
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(6,7,10,0.35) 0%, rgba(6,7,10,0.7) 55%, rgba(6,7,10,0.92) 100%)",
              }}
            />
            <span
              className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border bg-bg/70 px-2.5 py-1 text-[11px] font-semibold text-fg backdrop-blur-md"
              style={{ borderColor: TONE_BORDER[project.tone] }}
            >
              <span className={"size-1.5 rounded-full " + (TONE_DOT[project.tone] || "bg-cyan")} />
              FEATURED
            </span>
          </div>

          {/* Text side */}
          <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                {project.client} · {project.year}
              </p>
              <LiveLayer depth={18} as="h3" className="mt-3 max-w-[26ch] text-balance text-[26px] font-semibold leading-[1.12] tracking-tight text-fg sm:text-[32px]">
                {project.title}
              </LiveLayer>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-fg-2">
                {project.body}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-md border border-line bg-bg-2/70 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.15em] text-fg-3"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Metric bar */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-4">
              {project.metrics.map((m) => (
                <div key={m.k}>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-fg-3">
                    {m.k}
                  </p>
                  <p className={"mt-1 text-[15px] font-semibold tabular-nums " + (TONE_TEXT[project.tone] || "text-cyan")}>
                    {m.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </LiveCard>
    </Reveal>
  );
}

/* --------------- standard project card --------------- */

function ProjectCard({ project }) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-bg-2/60 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-bg-2/85"
      style={{
        borderColor: TONE_BORDER[project.tone] || "rgba(255,255,255,0.14)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 44px -24px rgba(0,0,0,0.7)",
      }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,7,10,0) 0%, rgba(6,7,10,0.55) 60%, rgba(6,7,10,0.92) 100%)",
          }}
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-line/80 bg-bg/60 px-2.5 py-1 text-[10.5px] font-semibold text-fg backdrop-blur-md">
          <span className={"size-1.5 rounded-full " + (TONE_DOT[project.tone] || "bg-cyan")} />
          {project.categoryLabel}
        </span>
        <span className="absolute right-4 top-4 rounded-md border border-line/80 bg-bg/60 px-2 py-0.5 font-mono text-[10px] tracking-wide text-fg-2 backdrop-blur-md">
          {project.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
            {project.client}
          </p>
          <h3 className="mt-2 text-balance text-[17px] font-semibold leading-[1.25] tracking-tight text-fg">
            {project.title}
          </h3>
          <p className="mt-2 text-[13.5px] leading-[1.55] text-fg-2 line-clamp-3">
            {project.body}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded border border-line/70 bg-bg-2/60 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.15em] text-fg-3"
              >
                {t}
              </span>
            ))}
          </div>
          <span className={"font-mono text-[12px] font-semibold tabular-nums " + (TONE_TEXT[project.tone] || "text-cyan")}>
            {project.metrics[0]?.v}
          </span>
        </div>
      </div>
    </article>
  );
}
