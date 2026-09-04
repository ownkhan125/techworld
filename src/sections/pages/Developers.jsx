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
 * Developers page — expansion of the home's Developer ("Build the perfect
 * tools") section. Unique structure:
 *   1. Hero + install command chip.
 *   2. API surface — 4 primitive cards (commands / panels / hooks / runtime).
 *   3. Anatomy of an extension — annotated code sample side-by-side with
 *      a rendering of what it looks like inside Techworld.
 *   4. Publish flow — 3-step progress rail (write → sign → ship).
 *   5. Community + resources — links to docs, samples, discord.
 *   6. Closing CTA to /contact.
 */

const PRIMITIVES = [
  {
    key: "commands",
    tone: "cyan",
    number: "01",
    title: "Commands",
    body: "Register a command with a schema; users invoke it from the launcher, from a hotkey, or over the API — the runtime picks the fastest path.",
  },
  {
    key: "panels",
    tone: "violet",
    number: "02",
    title: "Panels",
    body: "Render live UI in the workspace: React components with a typed prop bag and access to fleet state, secrets and telemetry.",
  },
  {
    key: "hooks",
    tone: "amber",
    number: "03",
    title: "Hooks",
    body: "Subscribe to spans, deploys and rollouts. Trigger workflows the moment the fabric emits an event you care about.",
  },
  {
    key: "runtime",
    tone: "rose",
    number: "04",
    title: "Runtime",
    body: "Ship native TypeScript with zero glue. Techworld runs your extension close to the fabric — no build step, no cold start, no deploy target.",
  },
];

const PUBLISH_STEPS = [
  { n: "01", k: "Write", body: "Scaffold with `tw new`. Ship any React tree; the CLI streams your changes into the workspace with sub-second HMR." },
  { n: "02", k: "Sign", body: "Sign your bundle with your org key. The fabric verifies every hop from the launcher to the runtime — no unsigned code ever runs." },
  { n: "03", k: "Ship", body: "Push to the Store, to a private channel, or to a single tenant. Roll out region-by-region with the same rollout engine the platform uses." },
];

// Resources cards previously pointed at "#" placeholders. There's no
// separate /docs, /samples or /discord destination in this build, so all
// three route to /contact — the honest "reach the team" fallback.
const RESOURCES = [
  { k: "Docs", body: "Reference for every primitive, with runnable snippets.", href: "/contact" },
  { k: "Samples", body: "Open-source extensions to fork — from tiny to full-app.", href: "/contact" },
  { k: "Discord", body: "Real-time help from the team and other builders.", href: "/contact" },
];

const TONE_BORDER = {
  cyan: "rgba(94,240,230,0.36)",
  violet: "rgba(167,139,250,0.36)",
  amber: "rgba(251,191,36,0.36)",
  rose: "rgba(252,108,140,0.36)",
};
const TONE_DOT = { cyan: "bg-cyan", violet: "bg-violet", amber: "bg-amber", rose: "bg-rose" };
const TONE_TEXT = { cyan: "text-cyan", violet: "text-violet", amber: "text-amber", rose: "text-rose" };

export default function Developers() {
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
            <Eyebrow tone="violet">For builders</Eyebrow>
          </div>
          <SectionTitle
            title="Build with Techworld."
            sub="A minimal API for anyone with web skills. Ship commands, panels, hooks and native runtimes on the same fabric your production runs on."
          />

          {/* Install chip */}
          <Reveal data-stage="cta" className="mt-9">
            <div
              className="relative inline-flex items-center gap-3 rounded-2xl border border-line-strong bg-bg-2/70 px-4 py-2.5 font-mono text-[13px] text-fg-2 backdrop-blur-md"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 40px -24px rgba(0,0,0,0.7)",
              }}
            >
              <span className="text-fg-4">$</span>
              <span className="text-fg">npx create-techworld-ext</span>
              <span aria-hidden className="mx-1 h-4 w-px bg-line" />
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-fg-2 transition-colors hover:text-fg"
              >
                Copy
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M6 6h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </Reveal>

          <div data-stage="cta" className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-key h-11 px-5 text-[14px]">
              Talk to the team
            </Link>
            <Link href="/platform" className="btn-ghost h-11 px-5 text-[13px]">
              See the platform
            </Link>
          </div>
        </div>
      </CinematicSection>

      {/* API SURFACE — 4 primitives */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Surface"
            eyebrowTone="cyan"
            title="Four primitives. Nothing else to learn."
            sub="The API is intentionally small — you compose it, not memorise it."
          />

          <div data-stage="body" className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRIMITIVES.map((p, i) => (
              <Reveal key={p.key} delay={i * 80}>
                <LiveCard tone={p.tone} idleDelay={i * 400} tiltMax={7} radius={20} className="block h-full">
                  <div className="relative flex h-full min-h-[240px] flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className={"font-mono text-[11px] tracking-[0.22em] " + TONE_TEXT[p.tone]}>
                        {p.number}
                      </span>
                      <span className={"size-2 rounded-full " + TONE_DOT[p.tone]} />
                    </div>
                    <LiveLayer depth={22} as="h3" className="mt-5 text-[18px] font-semibold tracking-tight text-fg">
                      {p.title}
                    </LiveLayer>
                    <LiveLayer depth={10} as="p" className="mt-2 text-[13.5px] leading-[1.6] text-fg-2">
                      {p.body}
                    </LiveLayer>
                  </div>
                </LiveCard>
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* ANATOMY — code + render side by side */}
      <CinematicSection id="docs" className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Anatomy"
            eyebrowTone="amber"
            title="One file. Working extension."
            sub="Register a command, render a panel, ship it. The runtime does the rest."
          />

          <div className="relative mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
            <SectionFrame radius={20} inset={-6} />

            {/* Code block */}
            <Reveal data-stage="media">
              <div className="overflow-hidden rounded-2xl border border-line-strong bg-bg/85 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-fg-3">
                    <span className="inline-block size-2 rounded-full bg-cyan" />
                    src/rotate-keys.ts
                  </div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg-4">
                    TypeScript
                  </span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.7] text-fg-2">
{`import { command, panel, hooks, tw } from "@techworld/ext";

export default command({
  name: "rotate-keys",
  args: { region: "string" },

  async run({ region }, ctx) {
    const tenants = await tw.tenants.list({ region });
    for (const t of tenants) {
      await tw.keys.rotate(t.id, region);
      ctx.emit("rotated", { tenant: t.id });
    }
    return panel(Result, { count: tenants.length });
  },
});

function Result({ count }) {
  return (
    <panel.Card tone="cyan">
      <panel.Title>Rotated {count} tenants</panel.Title>
      <panel.Body>Region canary is green — safe to widen.</panel.Body>
    </panel.Card>
  );
}`}
                </pre>
                <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[11px] text-fg-3">
                  <span>tw run rotate-keys --region us-west</span>
                  <span className="inline-flex items-center gap-1.5 text-cyan">
                    <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
                    live
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Rendered panel preview */}
            <Reveal data-stage="body" delay={120}>
              <div
                className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-bg-2/70 p-6 backdrop-blur-md sm:p-8"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 0%, hsla(178,92%,66%,0.14), transparent 70%), linear-gradient(180deg, rgba(20,22,30,0.68) 0%, rgba(12,14,20,0.86) 100%)",
                }}
              >
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                    Rendered panel
                  </p>
                  <div className="mt-5 rounded-xl border border-line bg-bg-2/85 p-5">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-cyan animate-pulse" />
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cyan">
                        Result
                      </p>
                    </div>
                    <p className="mt-3 text-[18px] font-semibold text-fg">
                      Rotated <span className="tabular-nums text-cyan">42</span> tenants
                    </p>
                    <ScrollTextReveal as="p" className="mt-2 text-[13.5px] leading-relaxed text-fg-2">
                      Region canary is green — safe to widen.
                    </ScrollTextReveal>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="btn-ghost h-8 px-3 text-[12px]">Widen</span>
                      <span className="btn-ghost h-8 px-3 text-[12px]">Revert</span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 font-mono text-[11px] text-fg-3">
                  This panel was rendered from the code on the left. No build step. No deploy.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </CinematicSection>

      {/* PUBLISH FLOW */}
      <CinematicSection className="section-pad relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Publish"
            eyebrowTone="rose"
            title="Write. Sign. Ship."
            sub="Three steps and one CLI. Every hop from your keyboard to the Store is verified."
          />

          <div data-stage="body" className="mt-12">
            <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
              {/* Dashed rail connecting the steps on md+ */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-6 hidden h-px sm:block"
                style={{
                  background:
                    "repeating-linear-gradient(to right, rgba(255,255,255,0.22) 0 8px, transparent 8px 14px)",
                }}
              />
              {PUBLISH_STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 100}>
                  <li className="relative flex flex-col gap-3">
                    <span
                      className="relative inline-flex size-12 items-center justify-center rounded-full border border-line-strong bg-bg-2 font-mono text-[13px] font-semibold text-fg"
                      style={{
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 4px var(--bg), 0 20px 40px -24px rgba(0,0,0,0.7)",
                      }}
                    >
                      {s.n}
                    </span>
                    <h3 className="text-[20px] font-semibold tracking-tight text-fg">
                      {s.k}
                    </h3>
                    <p className="max-w-[38ch] text-[14px] leading-relaxed text-fg-2">
                      {s.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </CinematicSection>

      {/* RESOURCES */}
      <CinematicSection className="section-pad-tight relative overflow-hidden">
        <div className="container-x">
          <SectionTitle
            eyebrow="Resources"
            eyebrowTone="cyan"
            title="Ways in."
          />
          <div data-stage="body" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {RESOURCES.map((r, i) => (
              <Reveal key={r.k} delay={i * 80}>
                <Link
                  href={r.href}
                  className="group block rounded-2xl border border-line bg-bg-2/60 p-6 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-bg-2/85"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-fg-3">
                      {r.k}
                    </p>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-fg-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-4 text-[15px] font-semibold text-fg">{r.k}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-fg-2">
                    {r.body}
                  </p>
                </Link>
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
              eyebrow="Talk to a human"
              eyebrowTone="violet"
              title="Building something ambitious?"
              sub="We work with a small number of teams to co-design extensions. If you're pushing the fabric, we want to hear from you."
            />
            <div data-stage="cta" className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn-key h-11 px-5 text-[14px]">
                Reach the team
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
