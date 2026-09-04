"use client";

import Link from "next/link";
import CinematicSection from "@/components/CinematicSection";
import SectionTitle from "@/components/SectionTitle";
import SectionFrame from "@/components/SectionFrame";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ScrollTextReveal from "@/components/ScrollTextReveal";
import LiveCard, { LiveLayer } from "@/components/LiveCard";

/**
 * Platform page — deep dive on the five capabilities shown as tabs on the
 * home page's FeaturesTabs. Unique structure (not a copy of the tabbed
 * teaser):
 *   1. Hero band — big statement + capability chips.
 *   2. Capability matrix — one full-bleed LiveCard per capability, each
 *      with a numeric anchor, feature list and metric strip. Alternates
 *      left/right so the eye tracks down a Z.
 *   3. Architecture schematic — a lightweight SVG diagram showing how the
 *      capabilities compose (Agents ← Vision + Traces → Fleet + Scripts).
 *   4. Before/after strip — 3 concise "old way / with Techworld" rows.
 *   5. Closing CTA that routes to /contact.
 */

const CAPABILITIES = [
  {
    key: "agents",
    tone: "cyan",
    number: "01",
    title: "Agents",
    tagline: "Deploy long-running agents that reason, act and record.",
    body:
      "Compose deterministic replay, tool-use and human-in-the-loop pauses into a single graph. Roll out to any region without rebuilding the plan.",
    features: [
      "Deterministic replay across model versions",
      "Tool-use with typed contracts",
      "Human-in-the-loop pauses & approvals",
      "Region-aware rollout with canaries",
    ],
    metric: { k: "P99", v: "12ms", sub: "cold-start" },
  },
  {
    key: "vision",
    tone: "violet",
    number: "02",
    title: "Vision",
    tagline: "Perceive scenes, streams and stills at production frame rates.",
    body:
      "One inference surface for every RTSP camera, every clip and every asset. Push events straight to your bus — no glue code, no bespoke pipelines.",
    features: [
      "142 fps on commodity GPU pools",
      "Detections streamed to any bus",
      "Zero-shot fine-tuning on ≤ 40 clips",
      "Region snapshots for compliance",
    ],
    metric: { k: "Throughput", v: "142 fps", sub: "per node" },
  },
  {
    key: "traces",
    tone: "amber",
    number: "03",
    title: "Traces",
    tagline: "Token-grain observability, not sampled telemetry.",
    body:
      "Every span, every branch, every token. Follow a request from the edge through your model graph without pre-instrumenting or paying for retention you don't need.",
    features: [
      "1:1 span sampling by default",
      "Query traces like a database",
      "Diff two runs side-by-side",
      "Attach eval scores to spans",
    ],
    metric: { k: "Retention", v: "90d", sub: "at 1:1 sampling" },
  },
  {
    key: "fleet",
    tone: "rose",
    number: "04",
    title: "Fleet",
    tagline: "Manage 8 or 8000 nodes with the same command.",
    body:
      "See every device in one grid, diff their configs, ship a signed rollout in one keystroke. Health, cost and latency are one shortcut away.",
    features: [
      "Signed rollouts with instant revert",
      "Config diff across 200+ nodes",
      "Cost-per-node per hour, live",
      "Zero-touch onboarding via QR",
    ],
    metric: { k: "Rollout", v: "3.2s", sub: "median" },
  },
  {
    key: "scripts",
    tone: "cyan",
    number: "05",
    title: "Scripts",
    tagline: "Automate anything, in the language you already speak.",
    body:
      "TypeScript-first scripts run inside the fabric with full access to tenants, keys and telemetry. Repeatable ops become a keystroke.",
    features: [
      "Native TypeScript runtime",
      "One-line region fan-out",
      "Secrets injected, never stored",
      "Compose scripts into workflows",
    ],
    metric: { k: "Fan-out", v: "42 regions", sub: "in one run" },
  },
];

const TONE_BORDER = {
  cyan: "rgba(94,240,230,0.36)",
  violet: "rgba(167,139,250,0.36)",
  amber: "rgba(251,191,36,0.36)",
  rose: "rgba(252,108,140,0.36)",
};
const TONE_FG = { cyan: "text-cyan", violet: "text-violet", amber: "text-amber", rose: "text-rose" };
const TONE_GLOW = {
  cyan: "radial-gradient(60% 60% at 50% 0%, hsla(178,92%,66%,0.24), transparent 70%)",
  violet: "radial-gradient(60% 60% at 50% 0%, hsla(262,90%,72%,0.22), transparent 70%)",
  amber: "radial-gradient(60% 60% at 50% 0%, hsla(38,95%,64%,0.22), transparent 70%)",
  rose: "radial-gradient(60% 60% at 50% 0%, hsla(348,92%,70%,0.22), transparent 70%)",
};

const COMPARE = [
  {
    old: "Six vendors: model API, GPU pool, tracer, feature store, secrets, ops.",
    now: "One substrate. One dashboard. One bill.",
  },
  {
    old: "Roll a canary, wait, pray, roll back manually.",
    now: "Signed rollouts. Instant revert. Verified in-fabric.",
  },
  {
    old: "Sample 1% of traces, hope the failing 1% shows up.",
    now: "Every span, every token, always queryable.",
  },
];

export default function Platform() {
  return (
    <>
      {/* HERO */}
      <CinematicSection
        id="top"
        mode="onload"
        className="relative isolate flex min-h-[clamp(560px,80svh,820px)] flex-col justify-center overflow-hidden pb-14 pt-28 sm:pt-32 lg:pt-36"
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
            <Eyebrow tone="cyan">The Platform</Eyebrow>
          </div>
          <SectionTitle
            title="Five capabilities. One substrate."
            sub="Every part of Techworld is designed to compose. Ship an agent, wire in vision, follow every token, spread across your fleet — without switching tools."
          />

          {/* Capability chip row — buttons (not anchors) so we don't leave
              #hash affordances in the link audit. onClick scrolls to the
              matching row within this page. */}
          <div data-stage="cta" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CAPABILITIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  const el = document.getElementById(c.key);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg-2/70 px-3 py-1.5 text-[12px] font-medium text-fg-2 backdrop-blur-md transition-colors duration-300 hover:border-line-strong hover:text-fg"
              >
                <span
                  className={"size-1.5 rounded-full " +
                    (c.tone === "cyan" ? "bg-cyan" :
                     c.tone === "violet" ? "bg-violet" :
                     c.tone === "amber" ? "bg-amber" : "bg-rose")}
                />
                <span>{c.title}</span>
                <span className="font-mono text-[10px] text-fg-4">{c.number}</span>
              </button>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* CAPABILITY MATRIX — one large row per capability, alternating side */}
      <section className="relative isolate section-pad">
        <div className="container-x space-y-16 sm:space-y-20">
          {CAPABILITIES.map((c, i) => (
            <CapabilityRow key={c.key} c={c} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ARCHITECTURE SCHEMATIC */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="How it composes"
            eyebrowTone="violet"
            title="Every capability is a first-class primitive."
            sub="They don't just share a login — they share a graph. An agent can call vision, emit traces, and roll out via fleet in one plan."
          />
          <Reveal data-stage="media" className="relative mt-12">
            <SectionFrame radius={20} inset={-6} />
            <ArchitectureSchematic />
          </Reveal>
        </div>
      </CinematicSection>

      {/* BEFORE / AFTER */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Before / after"
            eyebrowTone="amber"
            title="What Techworld replaces."
            sub="A short list of stacks and rituals that stop making sense the day you land."
          />

          <div data-stage="body" className="mt-10 grid grid-cols-1 gap-3 sm:mt-12">
            {COMPARE.map((row, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="grid grid-cols-1 items-stretch gap-0 overflow-hidden rounded-2xl border border-line md:grid-cols-2">
                  <div className="border-b border-line bg-bg-2/50 p-5 md:border-b-0 md:border-r sm:p-6">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-4">
                      The old way
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-fg-3">
                      {row.old}
                    </p>
                  </div>
                  <div className="relative overflow-hidden p-5 sm:p-6">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(60% 60% at 100% 0%, hsla(178,92%,66%,0.12), transparent 60%)",
                      }}
                    />
                    <p className="relative font-mono text-[10.5px] uppercase tracking-[0.22em] text-cyan">
                      With Techworld
                    </p>
                    <p className="relative mt-2 text-[15px] font-medium leading-relaxed text-fg">
                      {row.now}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* CLOSING CTA */}
      <CinematicSection className="section-pad-tight relative overflow-hidden">
        <div className="container-x">
          <div className="mx-auto flex max-w-[820px] flex-col items-center gap-6 rounded-3xl border border-line-strong bg-bg-2/60 p-8 text-center backdrop-blur-xl sm:p-12">
            <SectionTitle
              eyebrow="Ready when you are"
              eyebrowTone="cyan"
              title="See the platform on your workload."
              sub="A short call, a real fleet, real data. We stand up a pilot in the first week."
            />
            <div data-stage="cta" className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-key h-11 px-5 text-[14px]">
                Talk to the team
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/developers" className="btn-ghost h-11 px-5 text-[13px]">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </CinematicSection>
    </>
  );
}

/* --------------- capability row --------------- */

function CapabilityRow({ c, flip }) {
  return (
    <div
      id={c.key}
      className={
        "grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 " +
        (flip ? "lg:[&>*:first-child]:order-2" : "")
      }
    >
      {/* Text column */}
      <Reveal data-stage="body">
        <div className="flex items-center gap-3">
          <span className={"font-mono text-[11px] tracking-[0.22em] " + TONE_FG[c.tone]}>
            {c.number}
          </span>
          <span className="h-px flex-1 max-w-[80px] bg-line" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
            {c.title}
          </span>
        </div>
        <h3 className="mt-4 max-w-[22ch] text-balance text-[26px] font-semibold leading-[1.12] tracking-tight text-fg sm:text-[32px]">
          {c.tagline}
        </h3>
        <ScrollTextReveal as="p" className="mt-4 max-w-[48ch] text-[15px] leading-[1.6] text-fg-2">
          {c.body}
        </ScrollTextReveal>
        <ul className="mt-6 grid grid-cols-1 gap-2 text-[13.5px] text-fg-2 sm:grid-cols-2">
          {c.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className={"mt-1.5 inline-block size-1.5 shrink-0 rounded-full " +
                (c.tone === "cyan" ? "bg-cyan" :
                 c.tone === "violet" ? "bg-violet" :
                 c.tone === "amber" ? "bg-amber" : "bg-rose")} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Visual column — mini "card" summarising the capability */}
      <Reveal data-stage="media">
        <LiveCard tone={c.tone} idleDelay={200} tiltMax={6} radius={22} className="block">
          <div
            className="relative flex min-h-[280px] flex-col justify-between overflow-hidden p-7 sm:min-h-[320px] sm:p-9"
            style={{ background: TONE_GLOW[c.tone] }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-[11px] font-semibold text-fg"
                style={{ borderColor: TONE_BORDER[c.tone] || "rgba(255,255,255,0.14)" }}
              >
                <span className={"size-1.5 rounded-full " +
                  (c.tone === "cyan" ? "bg-cyan" :
                   c.tone === "violet" ? "bg-violet" :
                   c.tone === "amber" ? "bg-amber" : "bg-rose")} />
                {c.title}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-3">
                Live
              </span>
            </div>

            {/* Big metric */}
            <LiveLayer depth={22} className="my-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                {c.metric.k}
              </p>
              <p className="mt-1 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
                {c.metric.v}
              </p>
              <p className="mt-1 font-mono text-[11px] text-fg-3">{c.metric.sub}</p>
            </LiveLayer>

            {/* Faux telemetry sparkline */}
            <LiveLayer depth={12}>
              <svg viewBox="0 0 200 40" className="w-full">
                <path
                  d="M0 32 L15 30 L30 26 L45 28 L60 20 L75 22 L90 12 L105 16 L120 8 L135 14 L150 10 L165 6 L180 12 L200 4"
                  fill="none"
                  stroke={c.tone === "cyan" ? "hsl(178 92% 66%)" :
                          c.tone === "violet" ? "hsl(262 90% 72%)" :
                          c.tone === "amber" ? "hsl(38 95% 64%)" : "hsl(348 92% 70%)"}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              </svg>
            </LiveLayer>
          </div>
        </LiveCard>
      </Reveal>
    </div>
  );
}

/* --------------- architecture schematic --------------- */

function ArchitectureSchematic() {
  const cells = [
    { key: "agents",  x: 50,  y: 20,  w: 100, h: 44, tone: "cyan",   label: "Agents" },
    { key: "vision",  x: 200, y: 20,  w: 100, h: 44, tone: "violet", label: "Vision" },
    { key: "traces",  x: 350, y: 20,  w: 100, h: 44, tone: "amber",  label: "Traces" },
    { key: "fleet",   x: 125, y: 130, w: 100, h: 44, tone: "rose",   label: "Fleet" },
    { key: "scripts", x: 275, y: 130, w: 100, h: 44, tone: "cyan",   label: "Scripts" },
    { key: "fabric",  x: 175, y: 240, w: 150, h: 48, tone: "violet", label: "Techworld fabric" },
  ];
  const strokes = {
    cyan: "hsl(178 92% 66%)",
    violet: "hsl(262 90% 72%)",
    amber: "hsl(38 95% 64%)",
    rose: "hsl(348 92% 70%)",
  };
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-2/50 p-5 sm:p-8">
      <svg viewBox="0 0 500 320" className="mx-auto block w-full max-w-[900px]" role="img" aria-label="Techworld capabilities composing into one fabric">
        {/* Connection lines — top row down to bottom row */}
        {[
          { x1: 100, y1: 64,  x2: 175, y2: 130 },
          { x1: 250, y1: 64,  x2: 175, y2: 130 },
          { x1: 250, y1: 64,  x2: 325, y2: 130 },
          { x1: 400, y1: 64,  x2: 325, y2: 130 },
          { x1: 175, y1: 174, x2: 250, y2: 240 },
          { x1: 325, y1: 174, x2: 250, y2: 240 },
        ].map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {cells.map((c) => (
          <g key={c.key}>
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx="10"
              fill="rgba(10,12,18,0.9)"
              stroke={strokes[c.tone]}
              strokeOpacity="0.55"
            />
            <circle cx={c.x + 12} cy={c.y + c.h / 2} r="3.4" fill={strokes[c.tone]} />
            <text
              x={c.x + 24}
              y={c.y + c.h / 2 + 4}
              fill="#f5f7fb"
              fontFamily="var(--font-sans), system-ui"
              fontSize="12.5"
              fontWeight="600"
            >
              {c.label}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(0, 300)">
          <text x="0" y="0" fill="#9aa0ae" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1.8">
            SCHEMA · v0.9
          </text>
          <text x="500" y="0" textAnchor="end" fill="#9aa0ae" fontFamily="var(--font-mono), monospace" fontSize="9" letterSpacing="1.8">
            ONE PLANE · ONE GRAPH
          </text>
        </g>
      </svg>
    </div>
  );
}
