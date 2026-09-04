"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import RaycastWindow from "@/components/RaycastWindow";
import CinematicSection from "@/components/CinematicSection";

const PROMPTS = [
  {
    q: "convert 1.4M req/s to req/day",
    a: "121.0B req/day",
    sub: "from 1,400,000 req/s",
  },
  {
    q: "3pm PST in Tokyo",
    a: "Thu, 8:00 AM JST",
    sub: "16 hours ahead",
  },
  {
    q: "cost of 24h at 142 fps",
    a: "$0.34",
    sub: "rate · $0.014 / hr",
  },
  {
    q: "remind me to redeploy in 2 hours",
    a: "Reminder set",
    sub: "Today · 4:42 PM",
  },
];

const CAPABILITY_CHIPS = [
  { label: "Unit conversion", key: "1M req/s → req/day" },
  { label: "Time zones", key: "3pm PST in Tokyo" },
  { label: "Cost math", key: "$/hr × runtime" },
  { label: "Reminders", key: "in 2 hours" },
  { label: "Fleet queries", key: "status us-west" },
];

export default function CalcShowcase() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | showing | clearing

  useEffect(() => {
    const cur = PROMPTS[i % PROMPTS.length].q;
    if (phase === "typing") {
      if (typed.length < cur.length) {
        const t = setTimeout(() => setTyped(cur.slice(0, typed.length + 1)), 40);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("showing"), 1800);
      return () => clearTimeout(t);
    }
    if (phase === "showing") {
      const t = setTimeout(() => setPhase("clearing"), 2400);
      return () => clearTimeout(t);
    }
    if (phase === "clearing") {
      if (typed.length > 0) {
        const t = setTimeout(() => setTyped(typed.slice(0, -1)), 14);
        return () => clearTimeout(t);
      }
      setI((v) => v + 1);
      setPhase("typing");
    }
  }, [typed, phase, i]);

  const cur = PROMPTS[i % PROMPTS.length];

  return (
    <CinematicSection className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="One input. Any answer."
          eyebrowTone="amber"
          title="Just enough power, in plain language."
          sub="Run conversions, set reminders, ask your fleet anything — without leaving the command bar."
        />

        {/* Composed stage: command bar sits centered, flanked by dashed
            rail markers so the wide viewport doesn't feel empty on either
            side. Rails hide on narrow viewports to keep it clean. */}
        <Reveal data-stage="media" className="relative mt-16">
          {/* Left rail decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 left-0 hidden w-[calc((100%-880px)/2-24px)] items-center xl:flex"
          >
            <div className="flex w-full flex-col gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fg-5">
                Input
              </span>
              <span className="h-px w-full border-t border-dashed border-line" />
              <span className="font-mono text-[10px] leading-relaxed text-fg-4">
                Natural language,<br />any unit, any time.
              </span>
            </div>
          </div>
          {/* Right rail decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-6 right-0 hidden w-[calc((100%-880px)/2-24px)] items-center justify-end xl:flex"
          >
            <div className="flex w-full flex-col items-end gap-3 text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fg-5">
                Output
              </span>
              <span className="h-px w-full border-t border-dashed border-line" />
              <span className="font-mono text-[10px] leading-relaxed text-fg-4">
                Structured, copyable,<br />ready for the next step.
              </span>
            </div>
          </div>

          <RaycastWindow
            label="techworld"
            search={typed}
            status={phase === "showing" ? "computed" : "typing…"}
            className="max-w-[840px]"
          >
            <div className="relative p-5 sm:p-8">
              {phase === "showing" ? (
                <div
                  className="flex flex-col items-start gap-1"
                  style={{ animation: "pop-in 0.4s var(--ease-out-cinema)" }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                    Result
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
                    {cur.a}
                  </p>
                  <p className="mt-1 text-[13px] text-fg-3">{cur.sub}</p>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2 opacity-80">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PROMPTS.map((p, j) => (
                      <span
                        key={j}
                        className={
                          "inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] " +
                          (j === i ? "text-fg" : "text-fg-3")
                        }
                      >
                        {p.q}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </RaycastWindow>
        </Reveal>

        {/* Capability chip row — reuses existing prompts (no invented content)
            to visually anchor the section below the command bar. Dashed rule
            above ties the two elements together. */}
        <Reveal data-stage="body" className="mx-auto mt-12 max-w-[880px]">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 border-t border-dashed border-line" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-5">
              Also handles
            </span>
            <span className="h-px flex-1 border-t border-dashed border-line" />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CAPABILITY_CHIPS.map((c, j) => (
              <span
                key={c.label}
                className={
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-300 " +
                  (j === i % CAPABILITY_CHIPS.length
                    ? "border-line-strong bg-bg-2/80 text-fg"
                    : "border-line bg-bg-2/40 text-fg-3")
                }
              >
                <span className="font-medium">{c.label}</span>
                <span className="hidden font-mono text-[10.5px] text-fg-4 sm:inline">
                  {c.key}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </CinematicSection>
  );
}
