"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import RaycastWindow, { ListWithDetails } from "@/components/RaycastWindow";
import CinematicSection from "@/components/CinematicSection";

const TABS = [
  { key: "agents",  label: "Agents" },
  { key: "vision",  label: "Vision" },
  { key: "traces",  label: "Traces" },
  { key: "fleet",   label: "Fleet" },
  { key: "scripts", label: "Scripts" },
];

export default function FeaturesTabs() {
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabsRef = useRef([]);
  const trackRef = useRef(null);

  // measure active tab and place the indicator pill
  useEffect(() => {
    const node = tabsRef.current[active];
    if (!node) return;
    const r = node.getBoundingClientRect();
    const parent = node.parentElement.getBoundingClientRect();
    setIndicator({ left: r.left - parent.left, width: r.width });
  }, [active]);

  // re-measure on resize
  useEffect(() => {
    const onResize = () => {
      const node = tabsRef.current[active];
      if (!node) return;
      const r = node.getBoundingClientRect();
      const parent = node.parentElement.getBoundingClientRect();
      setIndicator({ left: r.left - parent.left, width: r.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  return (
    <CinematicSection id="features" className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="One platform"
          eyebrowTone="cyan"
          title="One application. Endless capabilities."
          sub="A unified workspace for the people who deploy intelligence — from a quick command to a full agent fleet."
        />

        {/* tab bar */}
        <Reveal data-stage="frame" className="mt-12 flex justify-center">
          <div className="relative inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-line bg-bg/60 p-1 backdrop-blur-md">
            {/* sliding indicator */}
            <span
              aria-hidden
              className="absolute top-1 h-[calc(100%-8px)] rounded-full bg-surface-3"
              style={{
                left: indicator.left,
                width: indicator.width,
                transition:
                  "left 0.6s cubic-bezier(0.22,1,0.36,1), width 0.6s cubic-bezier(0.22,1,0.36,1)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            />
            {TABS.map((t, i) => (
              <button
                key={t.key}
                ref={(el) => (tabsRef.current[i] = el)}
                onClick={() => setActive(i)}
                className={
                  "relative z-10 inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium tracking-tight transition-colors duration-300 " +
                  (active === i ? "text-fg" : "text-fg-3 hover:text-fg")
                }
                aria-current={active === i}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* slide stage */}
        <div
          ref={trackRef}
          data-stage="media"
          className="relative mt-14 flex h-[480px] items-center justify-center sm:h-[540px] md:h-[600px]"
        >
          {TABS.map((t, i) => (
            <div
              key={t.key}
              aria-hidden={i !== active}
              className={
                "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                (i === active
                  ? "opacity-100 translate-y-0 scale-100"
                  : "pointer-events-none opacity-0 translate-y-4 scale-[0.98]")
              }
            >
              {i === 0 && <AgentsSlide />}
              {i === 1 && <VisionSlide />}
              {i === 2 && <TracesSlide />}
              {i === 3 && <FleetSlide />}
              {i === 4 && <ScriptsSlide />}
            </div>
          ))}
        </div>

        {/* arrow controls */}
        <div data-stage="cta" className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActive((i) => (i - 1 + TABS.length) % TABS.length)}
            className="arrow-btn"
            aria-label="Previous feature"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="font-mono text-[11px] tabular-nums text-fg-4">
            {String(active + 1).padStart(2, "0")} / {String(TABS.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % TABS.length)}
            className="arrow-btn"
            aria-label="Next feature"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </CinematicSection>
  );
}

/* --------------- individual slide content --------------- */
function AgentsSlide() {
  const items = [
    { label: "vision-detector", meta: "running" },
    { label: "warehouse-router", meta: "running" },
    { label: "kyc-assistant", meta: "draft" },
    { label: "drone-orchestrator", meta: "running" },
    { label: "support-triage", meta: "paused" },
  ];
  return (
    <RaycastWindow
      label="Agents"
      search="deploy vision-detector"
      actions={[{ key: "↵", text: "Deploy" }, { key: "⌘", text: "Inspect" }]}
    >
      <ListWithDetails
        items={items}
        activeIndex={0}
        detail={
          <div>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex size-10 items-center justify-center rounded-xl text-bg"
                style={{ background: "linear-gradient(135deg, hsl(178 92% 70%), hsl(195 90% 55%))" }}
              >
                <span className="text-base font-semibold">V</span>
              </span>
              <div>
                <p className="text-[14px] font-semibold text-fg">vision-detector</p>
                <p className="font-mono text-[11px] text-fg-4">v0.4 · 3 regions</p>
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-fg-3">
              Detects people, vehicles and objects in any RTSP camera stream. Streams events to your bus.
            </p>
            <div className="mt-5 space-y-2 text-[11px]">
              <Row k="Latency" v="12ms" />
              <Row k="Throughput" v="142 fps" />
              <Row k="Cost" v="$0.014 / hr" />
            </div>
          </div>
        }
      />
    </RaycastWindow>
  );
}

function VisionSlide() {
  return (
    <RaycastWindow label="Vision · cam-04" actions={[{ key: "↵", text: "Snapshot" }, { key: "⌘D", text: "Detect" }]}>
      <div className="relative h-[300px] sm:h-[340px]">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&auto=format&fit=crop"
          alt="Office scene"
          fill
          sizes="760px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-bg-2/20 to-bg-2/60" />
        {/* detection boxes */}
        {[
          { x: 12, y: 32, w: 22, h: 36, l: "person · 0.98" },
          { x: 48, y: 36, w: 18, h: 30, l: "laptop · 0.92" },
          { x: 70, y: 24, w: 24, h: 26, l: "window · 0.88" },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-md border border-cyan/80"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              boxShadow: "0 0 14px hsla(178,92%,66%,0.45)",
              animation: `pop-in 0.5s ${i * 120}ms var(--ease-out-cinema) both`,
            }}
          >
            <span className="absolute -top-5 left-0 inline-flex items-center gap-1 rounded bg-cyan px-1.5 py-0.5 font-mono text-[10px] text-bg">
              {b.l}
            </span>
          </div>
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-fg-3">
          <span>cam-04 · 1920×1080 · 30fps</span>
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
            142 fps · 12ms
          </span>
        </div>
      </div>
    </RaycastWindow>
  );
}

function TracesSlide() {
  const rows = [
    { name: "POST /infer", a: 0.04, w: 0.94, color: "hsl(178 92% 66%)" },
    { name: "tokenize", a: 0.18, w: 0.08, color: "hsl(38 95% 64%)" },
    { name: "model.load", a: 0.28, w: 0.12, color: "hsl(262 90% 72%)" },
    { name: "vision.fwd", a: 0.42, w: 0.42, color: "hsl(178 92% 66%)" },
    { name: "agent.plan", a: 0.62, w: 0.22, color: "hsl(262 90% 72%)" },
    { name: "stream.out", a: 0.84, w: 0.12, color: "hsl(348 92% 70%)" },
  ];
  return (
    <RaycastWindow label="Traces" search="req_4f81a · follow" actions={[{ key: "↵", text: "Open span" }]}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
          <span>trace · req_4f81a</span>
          <span>total 4.2ms</span>
        </div>
        <div className="mt-4 space-y-2.5">
          {rows.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3">
              <span className="w-[100px] font-mono text-[11px] text-fg-3">{r.name}</span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${r.a * 100}%`,
                    width: `${r.w * 100}%`,
                    background: r.color,
                    boxShadow: `0 0 12px ${r.color}`,
                    animation: `pop-in 0.6s ${i * 80}ms var(--ease-out-cinema) both`,
                  }}
                />
              </div>
              <span className="w-[44px] text-right font-mono text-[10px] text-fg-4">{(r.w * 4.2).toFixed(1)}ms</span>
            </div>
          ))}
        </div>
      </div>
    </RaycastWindow>
  );
}

function FleetSlide() {
  return (
    <RaycastWindow label="Fleet" search="status all" actions={[{ key: "⌘R", text: "Refresh" }]}>
      <div className="grid h-[300px] grid-cols-10 gap-1.5 p-5 sm:h-[340px]">
        {Array.from({ length: 80 }).map((_, i) => {
          const ok = (i * 7) % 17 !== 0;
          return (
            <div
              key={i}
              className="aspect-square rounded-[5px] border border-line bg-surface"
              style={{
                boxShadow: ok
                  ? "inset 0 0 0 1px rgba(94,240,230,0.18)"
                  : "inset 0 0 0 1px rgba(251,191,36,0.32)",
                animation: `pop-in 0.4s ${(i * 8) % 700}ms var(--ease-out-cinema) both`,
              }}
            >
              <div className="flex h-full items-end justify-end p-0.5">
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
    </RaycastWindow>
  );
}

function ScriptsSlide() {
  return (
    <RaycastWindow label="Scripts" search="rotate-keys --region us-west" actions={[{ key: "↵", text: "Run" }]}>
      <div className="p-5 sm:p-6">
        <pre className="overflow-hidden rounded-lg border border-line bg-bg/70 p-4 font-mono text-[12px] leading-relaxed text-fg-2">
          <span className="text-fg-4">// rotate-keys.ts</span>{"\n"}
          <span className="text-cyan">async</span> <span className="text-violet">function</span> <span className="text-amber">rotate</span>(region) {"{"}{"\n"}
          {"  "}<span className="text-cyan">const</span> tenants = <span className="text-cyan">await</span> tw.tenants.list();{"\n"}
          {"  "}<span className="text-cyan">for</span> (<span className="text-cyan">const</span> t <span className="text-cyan">of</span> tenants) {"{"}{"\n"}
          {"    "}<span className="text-cyan">await</span> tw.keys.rotate(t.id, region);{"\n"}
          {"  "}{"}"}{"\n"}
          {"}"}{"\n"}
        </pre>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-[12px] text-fg-3">running on 42 regions</span>
          </div>
          <span className="font-mono text-[11px] text-fg-4">2.3s elapsed</span>
        </div>
      </div>
    </RaycastWindow>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 py-1 last:border-b-0">
      <span className="text-fg-3">{k}</span>
      <span className="font-mono text-fg-2">{v}</span>
    </div>
  );
}
