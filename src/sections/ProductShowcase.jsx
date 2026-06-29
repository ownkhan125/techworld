"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";

const SLIDES = [
  {
    key: "graph",
    label: "Visual graph",
    title: "Compose systems visually.",
    body: "Drag operations, branch on intent, and ship — every node compiles into a deterministic distributed plan.",
    accent: "cyan",
    render: GraphView,
  },
  {
    key: "trace",
    label: "Token traces",
    title: "Follow every token across the fleet.",
    body: "Open a trace and walk through every model call, agent step and device hop with sub-ms resolution.",
    accent: "violet",
    render: TraceView,
  },
  {
    key: "fleet",
    label: "Live fleet",
    title: "See the whole organism, live.",
    body: "Diff configs, pin versions, roll back without redeploying — across thousands of nodes.",
    accent: "amber",
    render: FleetView,
  },
];

const SLIDE_MS = 6000;

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(true); // start paused, auto-play when in view
  const sectionRef = useRef(null);

  // pause when out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setPaused(!e.isIntersecting);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <section id="showcase" ref={sectionRef} className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="Inside the workspace"
          eyebrowTone="cyan"
          title="A workspace that thinks in systems."
          sub="Built for the people who deploy intelligence into the world — engineers, scientists, ops."
        />

        <Reveal className="relative mt-14">
          <div
            className="relative mx-auto overflow-hidden rounded-2xl border border-line bg-bg-2"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04), 0 60px 100px -30px rgba(0,0,0,0.85)",
            }}
          >
            {/* window chrome */}
            <div className="flex items-center justify-between border-b border-line/80 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose/80" />
                <span className="size-2.5 rounded-full bg-amber/80" />
                <span className="size-2.5 rounded-full bg-cyan/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
                techworld · {SLIDES[active].label.toLowerCase()}
              </span>
              <span className="font-mono text-[10px] text-fg-5">⌘K</span>
            </div>

            {/* slide stage */}
            <div className="relative h-[360px] w-full sm:h-[440px] md:h-[520px]">
              {SLIDES.map((s, i) => {
                const Render = s.render;
                const isActive = i === active;
                return (
                  <div
                    key={s.key}
                    aria-hidden={!isActive}
                    className={
                      "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                      (isActive
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none opacity-0 translate-y-3")
                    }
                  >
                    <Render active={isActive} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* sequencer dots */}
          <div className="mx-auto mt-7 flex max-w-[920px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                Now showing
              </p>
              <p
                key={SLIDES[active].key + "-title"}
                className="text-balance text-lg font-semibold leading-snug tracking-tight text-fg sm:text-xl"
                style={{ animation: "pop-in 0.5s var(--ease-out-cinema)" }}
              >
                {SLIDES[active].title}
              </p>
              <p className="max-w-[52ch] text-[13px] leading-relaxed text-fg-3">
                {SLIDES[active].body}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-end">
              {SLIDES.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative inline-flex flex-col items-start gap-1.5 rounded-md px-3 py-2 text-left transition-colors duration-300 hover:bg-surface"
                  aria-current={i === active}
                >
                  <span
                    className={
                      "text-[12px] font-medium transition-colors duration-300 " +
                      (i === active ? "text-fg" : "text-fg-3 group-hover:text-fg-2")
                    }
                  >
                    {s.label}
                  </span>
                  <span className="relative block h-1 w-16 overflow-hidden rounded-full bg-surface">
                    <span
                      className="absolute left-0 top-0 h-full rounded-full bg-fg"
                      style={{
                        width: i === active ? "100%" : i < active ? "100%" : "0%",
                        transitionProperty: "width",
                        transitionDuration:
                          i === active && !paused ? `${SLIDE_MS}ms` : "300ms",
                        transitionTimingFunction: "linear",
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------- slides ----------------- */
function GraphView() {
  return (
    <svg viewBox="0 0 600 400" className="absolute inset-0 h-full w-full p-6" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="seq-edge" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(178 92% 66%)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="hsl(262 90% 72%)" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <g stroke="url(#seq-edge)" strokeWidth="1.5" fill="none">
        <path d="M70,80 Q220,80 300,160" />
        <path d="M70,240 Q220,240 300,160" />
        <path d="M300,160 Q420,160 510,90" />
        <path d="M300,160 Q420,160 510,230" />
        <path d="M300,160 Q420,260 510,320" />
      </g>
      {[
        { x: 70, y: 80, label: "ingest" },
        { x: 70, y: 240, label: "vision" },
        { x: 300, y: 160, label: "compose", main: true },
        { x: 510, y: 90, label: "rank" },
        { x: 510, y: 230, label: "verify" },
        { x: 510, y: 320, label: "deliver" },
      ].map((n, i) => (
        <g key={n.label} transform={`translate(${n.x},${n.y})`}>
          <circle
            r={n.main ? 22 : 16}
            fill="hsl(220 25% 12%)"
            stroke={n.main ? "hsl(178 92% 66%)" : "rgba(255,255,255,0.18)"}
            strokeWidth={n.main ? 1.8 : 1}
            style={{ animation: `pop-in 0.5s ${i * 80}ms var(--ease-out-cinema) both` }}
          />
          <circle r={n.main ? 6 : 4} fill={n.main ? "hsl(178 92% 66%)" : "rgba(255,255,255,0.6)"} />
          <text x={0} y={n.main ? 40 : 32} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="rgba(205,209,217,0.8)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TraceView() {
  const rows = [
    { name: "POST /infer", a: 0.04, w: 0.94, color: "hsl(178 92% 66%)" },
    { name: "model.load", a: 0.08, w: 0.12, color: "hsl(262 90% 72%)" },
    { name: "tokenize", a: 0.2, w: 0.08, color: "hsl(38 95% 64%)" },
    { name: "vision.forward", a: 0.28, w: 0.45, color: "hsl(178 92% 66%)" },
    { name: "agent.plan", a: 0.45, w: 0.3, color: "hsl(262 90% 72%)" },
    { name: "stream.out", a: 0.7, w: 0.25, color: "hsl(348 92% 70%)" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-2 px-6 py-7 sm:px-8">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
        <span>trace · req_4f81</span>
        <span>total 4.2ms</span>
      </div>
      <div className="mt-3 space-y-3">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center gap-3">
            <span className="w-[110px] font-mono text-[11px] text-fg-3">{r.name}</span>
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-surface">
              <div
                className="absolute h-full rounded-full"
                style={{
                  left: `${r.a * 100}%`,
                  width: `${r.w * 100}%`,
                  background: r.color,
                  boxShadow: `0 0 14px ${r.color}`,
                  animation: `pop-in 0.6s ${i * 90}ms var(--ease-out-cinema) both`,
                }}
              />
            </div>
            <span className="w-[44px] text-right font-mono text-[10px] text-fg-4">
              {(r.w * 4.2).toFixed(1)}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetView() {
  return (
    <div className="absolute inset-0 grid grid-cols-8 gap-2 p-6 sm:grid-cols-10">
      {Array.from({ length: 60 }).map((_, i) => {
        const ok = (i * 7) % 13 !== 0;
        return (
          <div
            key={i}
            className="aspect-square rounded-md border border-line bg-surface"
            style={{
              boxShadow: ok
                ? "inset 0 0 0 1px rgba(94,240,230,0.18)"
                : "inset 0 0 0 1px rgba(251,191,36,0.32)",
              animation: `pop-in 0.4s ${(i * 12) % 700}ms var(--ease-out-cinema) both`,
            }}
          >
            <div className="flex h-full items-end justify-end p-1">
              <span
                className="size-1.5 rounded-full"
                style={{
                  background: ok ? "hsl(178 92% 66%)" : "hsl(38 95% 64%)",
                  boxShadow: ok ? "0 0 8px hsl(178 92% 66%)" : "0 0 8px hsl(38 95% 64%)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
