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

        <Reveal data-stage="media" className="mt-16">
          <RaycastWindow
            label="techworld"
            search={typed}
            actions={[
              { key: "↵", text: "Run" },
              { key: "⌘C", text: "Copy" },
            ]}
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
      </div>
    </CinematicSection>
  );
}
