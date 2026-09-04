"use client";

import Link from "next/link";
import Image from "next/image";
import CinematicSection from "@/components/CinematicSection";
import SectionTitle from "@/components/SectionTitle";
import SectionFrame from "@/components/SectionFrame";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ScrollTextReveal from "@/components/ScrollTextReveal";
import LiveCard, { LiveLayer } from "@/components/LiveCard";

/**
 * Customers page — expansion of the home's Testimonials coverflow. Unique
 * structure:
 *   1. Hero band with a "trusted-by" logo strip.
 *   2. Featured case-study grid — 3 large cards with hero visual, metric
 *      bar and pull-quote.
 *   3. Quote wall — every home-page testimonial in a 3-col grid, plus new
 *      voices, each card a proper testimonial card (no coverflow).
 *   4. Numbers strip — the metrics that matter, called out.
 *   5. Closing CTA to /contact.
 */

const CASE_STUDIES = [
  {
    slug: "helion",
    company: "Helion Robotics",
    tone: "cyan",
    hero: "https://images.unsplash.com/photo-1581091012184-7ce2b6b0a37e?w=1600&q=80&auto=format&fit=crop",
    role: "Head of Platform",
    quoteShort: "We collapsed a 14-service inference pipeline into one graph.",
    quoteLong:
      "Fourteen services became one plan. Latency dropped 6×. The team we needed to keep it alive shrank from eight to two.",
    metrics: [
      { k: "Latency", v: "−83%" },
      { k: "Fleet size", v: "212 nodes" },
      { k: "Ops team", v: "8 → 2" },
    ],
    person: "Mira Okafor",
  },
  {
    slug: "lattice",
    company: "Lattice AI",
    tone: "violet",
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop",
    role: "CTO",
    quoteShort: "Felt like Vercel for autonomous agents.",
    quoteLong:
      "Deterministic replay changed how we think about incidents. We can walk through a bad decision token by token and ship a fix in the same afternoon.",
    metrics: [
      { k: "MTTR", v: "3h 12m → 22m" },
      { k: "Agent SKUs", v: "47" },
      { k: "Regions", v: "12" },
    ],
    person: "Daniel Rhee",
  },
  {
    slug: "raycast-ops",
    company: "Sentry Vision",
    tone: "amber",
    hero: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1600&q=80&auto=format&fit=crop",
    role: "Founding Engineer",
    quoteShort: "Every span, every token, always queryable.",
    quoteLong:
      "We stopped sampling. Retention costs went down because we stopped keeping the wrong things. Techworld's trace store is the first one my team actually opens.",
    metrics: [
      { k: "Trace vol.", v: "1.2B / day" },
      { k: "Sample rate", v: "1:1" },
      { k: "Retention $", v: "−41%" },
    ],
    person: "Sam Ito",
  },
];

const QUOTES = [
  {
    name: "Adam Whitcroft",
    handle: "@AdamWhitcroft",
    role: "Designer, Owner",
    tone: "violet",
    quote: "It feels like the operating system I always wanted but never had.",
  },
  {
    name: "Guillermo Rauch",
    handle: "@rauchg",
    role: "CEO, Vercel",
    tone: "rose",
    quote: "Turning my Mac into an AI-native operating system, and I'm so here for it.",
  },
  {
    name: "Marques Brownlee",
    handle: "@MKBHD",
    role: "Creator",
    tone: "cyan",
    quote: "The one piece of software that has genuinely changed how I work day to day.",
  },
  {
    name: "Sara Menker",
    handle: "@saramenker",
    role: "Head of Data, Gro",
    tone: "amber",
    quote: "We wired every internal tool into Techworld in a week. The team never looked back.",
  },
  {
    name: "Nikita Ponomarev",
    handle: "@nikitap",
    role: "Staff SRE, Cortex",
    tone: "cyan",
    quote: "The fleet dashboard is the first observability page my on-call actually leaves open.",
  },
  {
    name: "Yuki Tanaka",
    handle: "@yukitk",
    role: "ML Lead, Rin AI",
    tone: "violet",
    quote: "Replaying a bad decision token by token is the debugger my team dreamed of.",
  },
];

const LOGOS = [
  "Helion", "Lattice", "Sentry Vision", "Cortex", "Rin AI", "Gro",
  "Northrise", "Petal", "Fable", "Kinship", "Meridian",
];

const NUMBERS = [
  { k: "Fleets managed", v: "8,600+" },
  { k: "Traces per day", v: "42B" },
  { k: "Agents in prod", v: "12,400" },
  { k: "Uptime, rolling 30d", v: "99.993%" },
];

const TONE_BORDER = {
  cyan: "rgba(94,240,230,0.36)",
  violet: "rgba(167,139,250,0.36)",
  amber: "rgba(251,191,36,0.36)",
  rose: "rgba(252,108,140,0.36)",
};
const TONE_DOT = { cyan: "bg-cyan", violet: "bg-violet", amber: "bg-amber", rose: "bg-rose" };
const TONE_TEXT = { cyan: "text-cyan", violet: "text-violet", amber: "text-amber", rose: "text-rose" };

export default function Customers() {
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
            <Eyebrow tone="cyan">Customers</Eyebrow>
          </div>
          <SectionTitle
            title="Teams shipping intelligence."
            sub="Robotics fleets, agent platforms, live camera networks — the people running production on Techworld are the ones deciding how the fabric evolves."
          />
        </div>

        {/* Logo marquee */}
        <div data-stage="body" className="mt-10 sm:mt-14">
          <div className="container-x">
            <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
              Trusted in production
            </p>
          </div>
          <div className="marquee mt-5 overflow-hidden">
            <div className="marquee-track flex items-center gap-14 opacity-70">
              {[...LOGOS, ...LOGOS].map((l, i) => (
                <span
                  key={`${l}-${i}`}
                  className="whitespace-nowrap font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-fg-2"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CinematicSection>

      {/* FEATURED CASE STUDIES */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Featured"
            eyebrowTone="cyan"
            title="Three stories of the fabric at work."
            sub="Different industries, different scales — one shared substrate."
          />

          <div data-stage="body" className="mt-12 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {CASE_STUDIES.map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 100}>
                <CaseStudyCard cs={cs} />
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* NUMBERS STRIP */}
      <CinematicSection className="section-pad-tight relative overflow-hidden">
        <div className="container-x">
          <div className="relative">
            <SectionFrame radius={18} inset={-6} />
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-line bg-bg-2/60 p-6 backdrop-blur-md sm:grid-cols-4 sm:gap-2 sm:p-8">
              {NUMBERS.map((n, i) => (
                <Reveal key={n.k} delay={i * 60}>
                  <div className="border-line px-2 py-2 sm:border-r sm:last:border-r-0 sm:px-6">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                      {n.k}
                    </p>
                    <p className="mt-1 text-[26px] font-semibold tracking-tight text-fg sm:text-[32px]">
                      {n.v}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </CinematicSection>

      {/* QUOTE WALL */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="The wall"
            eyebrowTone="violet"
            title="What the people actually shipping say."
            sub="Every quote is unedited. Every metric is from the production account of the person who said it."
          />

          <div data-stage="body" className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <Reveal key={q.handle} delay={(i % 3) * 60}>
                <QuoteCard q={q} />
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* CTA */}
      <CinematicSection className="section-pad-tight relative overflow-hidden">
        <div className="container-x">
          <div className="mx-auto flex max-w-[820px] flex-col items-center gap-6 rounded-3xl border border-line-strong bg-bg-2/60 p-8 text-center backdrop-blur-xl sm:p-12">
            <SectionTitle
              eyebrow="Add your team"
              eyebrowTone="rose"
              title="Ship on the fabric your peers already run."
              sub="Book a pilot with the founding team — one call, one week, real data."
            />
            <div data-stage="cta" className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-key h-11 px-5 text-[14px]">
                Book a pilot
              </Link>
              <Link href="/platform" className="btn-ghost h-11 px-5 text-[13px]">
                See the platform
              </Link>
            </div>
          </div>
        </div>
      </CinematicSection>
    </>
  );
}

/* --------------- case study card --------------- */

function CaseStudyCard({ cs }) {
  return (
    <LiveCard tone={cs.tone} idleDelay={200} tiltMax={5} radius={22} className="block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[inherit]">
        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={cs.hero}
            alt={cs.company}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,7,10,0.05) 0%, rgba(6,7,10,0.55) 60%, rgba(6,7,10,0.92) 100%)",
            }}
          />
          <span
            className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border bg-bg/60 px-2.5 py-1 text-[11px] font-semibold text-fg backdrop-blur-md"
            style={{ borderColor: TONE_BORDER[cs.tone] }}
          >
            <span className={"size-1.5 rounded-full " + TONE_DOT[cs.tone]} />
            {cs.company}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
              {cs.role}
            </p>
            <LiveLayer depth={16} as="h3" className="mt-3 text-balance text-[20px] font-semibold leading-[1.25] tracking-tight text-fg sm:text-[22px]">
              {cs.quoteShort}
            </LiveLayer>
            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-2">
              {cs.quoteLong}
            </p>
          </div>

          {/* Metric bar */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-4">
            {cs.metrics.map((m) => (
              <div key={m.k}>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-fg-3">
                  {m.k}
                </p>
                <p className={"mt-1 text-[14px] font-semibold tabular-nums " + TONE_TEXT[cs.tone]}>
                  {m.v}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 font-mono text-[11px] text-fg-3">— {cs.person}</p>
        </div>
      </article>
    </LiveCard>
  );
}

/* --------------- quote wall card --------------- */

function QuoteCard({ q }) {
  return (
    <div
      className="group relative flex h-full flex-col justify-between rounded-2xl border bg-bg-2/60 p-5 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-bg-2/85 sm:p-6"
      style={{
        borderColor: TONE_BORDER[q.tone] || "rgba(255,255,255,0.14)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 40px -24px rgba(0,0,0,0.7)",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={"opacity-40 " + TONE_TEXT[q.tone]}
        aria-hidden
      >
        <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6H5.5c0-1.84 1.5-3.34 3.34-3.34V6h-1.67zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6H15.5c0-1.84 1.5-3.34 3.34-3.34V6h-1.67z" />
      </svg>
      <ScrollTextReveal as="p" className="mt-3 text-[15px] leading-[1.55] text-fg-2">
        {q.quote}
      </ScrollTextReveal>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-fg">{q.name}</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-fg-3">{q.role}</p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-fg-4">{q.handle}</p>
      </div>
    </div>
  );
}
