"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import CinematicSection from "@/components/CinematicSection";

/**
 * Notes section — "What else can Techworld do?"
 *
 * Layout matches the Raycast reference:
 *   LEFT  — heading + one continuous paragraph of phrases, the active one
 *           highlighted; small contextual feature card below.
 *   RIGHT — a stable product window (chrome + search bar + 2-col body +
 *           footer timestamps) where ONLY the slot contents swap on tab change.
 *           No layout shift between tabs.
 */

const TABS = [
  {
    key: "notes",
    text: "It can take notes.",
    cardName: "Techworld Notes",
    cardDesc: "A quick way to capture a thought while working on something else.",
    iconBg: "linear-gradient(135deg, hsl(348 92% 70%), hsl(20 90% 55%))",
    iconLetter: "N",
    query: "q3 planning",
    listTitle: "Notes & Captures",
    count: 14,
    primary: {
      kind: "doc",
      title: "Q3 Planning",
      body: "Roll out fleet patch · Pair with Sam on traces · Draft postmortem for #4f81",
      time: "Today at 09:42",
    },
    secondary: {
      kind: "doc",
      title: "Onboarding scratch",
      body: "Move runbook into Notion · ping infra for SSO",
      time: "Today at 11:08",
    },
  },
  {
    key: "flights",
    text: "Track your flights.",
    cardName: "Flight Tracker",
    cardDesc: "Every itinerary, gate change, and delay — one keystroke away.",
    iconBg: "linear-gradient(135deg, hsl(195 90% 65%), hsl(220 80% 50%))",
    iconLetter: "F",
    query: "ba286",
    listTitle: "Itineraries",
    count: 3,
    primary: {
      kind: "route",
      title: "SFO → LHR",
      body: "BA286 · Gate A12 · Boarding 19:10",
      time: "Departs 19:50",
    },
    secondary: {
      kind: "route",
      title: "LHR → ZRH",
      body: "BA712 · Terminal 5 · transit 1h 50m",
      time: "Tomorrow 16:15",
    },
  },
  {
    key: "translate",
    text: "Translate into any language.",
    cardName: "Translate",
    cardDesc: "Translate selection or clipboard in 100+ languages instantly.",
    iconBg: "linear-gradient(135deg, hsl(160 75% 55%), hsl(180 70% 45%))",
    iconLetter: "T",
    query: "roll back the canary",
    listTitle: "Recent translations",
    count: 28,
    primary: {
      kind: "lang",
      title: "Japanese",
      body: "次のデプロイの前に、us-westのカナリアをロールバックする必要があります。",
      time: "EN → JA · just now",
    },
    secondary: {
      kind: "lang",
      title: "German",
      body: "Wir müssen den Canary in us-west zurückrollen, bevor das nächste Deploy startet.",
      time: "EN → DE · 1m",
    },
  },
  {
    key: "windows",
    text: "Manage your windows.",
    cardName: "Window Management",
    cardDesc: "Resize, reorganise and move your focused window without touching your mouse.",
    iconBg: "linear-gradient(135deg, hsl(220 80% 60%), hsl(240 80% 50%))",
    iconLetter: "W",
    query: "almost maximize",
    listTitle: "Window Actions",
    count: 24,
    primary: {
      kind: "key",
      title: "Almost Maximize",
      body: "Resize the focused window to 90% of the screen.",
      time: "Hotkey · ⌥⌘M",
    },
    secondary: {
      kind: "key",
      title: "Left Half",
      body: "Snap the focused window to the left half of the display.",
      time: "Hotkey · ⌥⌘←",
    },
  },
  {
    key: "scripts",
    text: "Run scripts on a schedule.",
    cardName: "Script Runner",
    cardDesc: "Trigger any TypeScript or Bash script from a hotkey or a cron.",
    iconBg: "linear-gradient(135deg, hsl(38 95% 64%), hsl(20 90% 55%))",
    iconLetter: "S",
    query: "every 5 minutes",
    listTitle: "Scheduled",
    count: 9,
    primary: {
      kind: "code",
      title: "fleet-healthcheck.ts",
      body: "schedule('every 5 minutes') · 288 runs today",
      time: "Last run · 2m ago",
    },
    secondary: {
      kind: "code",
      title: "rotate-keys.sh",
      body: "schedule('0 4 * * *') · 42 regions",
      time: "Last run · 6h ago",
    },
  },
];

const FILLER_BEFORE = "What else can Techworld do?";
const FILLER_AFTER = [
  "Convert anything.",
  "Search files.",
  "Plan your day.",
  "Remind you of stuff.",
  "Block distractions.",
  "And much, much more.",
];

const AUTO_MS = 3200;

export default function Notes() {
  const [active, setActive] = useState(0);
  const interactedRef = useRef(false);

  useEffect(() => {
    if (interactedRef.current) return;
    const t = setTimeout(() => {
      if (!interactedRef.current) setActive((v) => (v + 1) % TABS.length);
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [active]);

  const onPick = (i) => {
    interactedRef.current = true;
    setActive(i);
  };

  const a = TABS[active];

  return (
    <CinematicSection className="section-pad relative overflow-hidden">
      <div className="container-x grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT */}
        <Reveal data-stage="heading">
          <h2 className="text-balance text-2xl font-semibold leading-[1.45] tracking-tight sm:text-3xl">
            <span className="text-fg">{FILLER_BEFORE}</span>{" "}
            {TABS.map((t, i) => (
              <button
                key={t.key}
                type="button"
                onClick={() => onPick(i)}
                className={
                  "inline rounded-[6px] px-[3px] py-[1px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60 " +
                  (i === active
                    ? "font-semibold text-fg bg-cyan-soft"
                    : "font-normal text-fg-4 hover:text-fg-2")
                }
                aria-current={i === active}
              >
                {t.text}
              </button>
            )).reduce((acc, el, i) => {
              acc.push(el);
              acc.push(<span key={`s-${i}`}>{" "}</span>);
              return acc;
            }, [])}
            {FILLER_AFTER.map((s, i) => (
              <span key={i} className="text-fg-4 font-normal">
                {s}{" "}
              </span>
            ))}
          </h2>

          {/* active feature card */}
          <div
            key={`card-${a.key}`}
            className="mt-10 inline-flex items-center gap-3 rounded-xl border border-line-strong bg-bg-2/95 p-3.5 pr-6 backdrop-blur-md"
            style={{
              animation: "pop-in 0.45s var(--ease-out-cinema)",
              boxShadow:
                "0 20px 40px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="inline-flex size-9 items-center justify-center rounded-lg text-bg font-semibold"
              style={{
                background: a.iconBg,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              {a.iconLetter}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-fg">{a.cardName}</p>
              <p className="mt-0.5 text-[12px] text-fg-3">
                {a.cardDesc}{" "}
                <a href="#" className="text-fg-2 underline-offset-2 hover:underline">
                  Learn more
                </a>
              </p>
            </div>
          </div>
        </Reveal>

        {/* RIGHT — outer "device" frame with brand accent wash; inside, a
            floating search pill above a 2-card result grid. Only the content
            slots swap on tab change. */}
        <Reveal delay={120} data-stage="media">
          <div
            className="notes-frame relative overflow-hidden rounded-2xl border border-line bg-bg-2/80 p-5 sm:p-7"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.03), 0 60px 110px -36px rgba(0,0,0,0.85)",
            }}
          >
            {/* branded accent wash — diagonal cyan→violet glow, top-left */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-12 -top-12 h-[260px] w-[280px] opacity-[0.55]"
              style={{
                background:
                  "conic-gradient(from 200deg at 30% 30%, hsla(178,92%,66%,0.45), hsla(262,90%,72%,0.30) 35%, transparent 60%)",
                filter: "blur(18px)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-6 top-0 h-full w-[160px]"
              style={{
                background:
                  "repeating-linear-gradient(-25deg, hsla(178,92%,66%,0.10) 0 14px, transparent 14px 56px)",
                maskImage:
                  "linear-gradient(120deg, rgba(0,0,0,0.95), rgba(0,0,0,0) 60%)",
                WebkitMaskImage:
                  "linear-gradient(120deg, rgba(0,0,0,0.95), rgba(0,0,0,0) 60%)",
              }}
            />

            {/* floating search pill */}
            <div
              className="relative z-10 flex items-center gap-2.5 rounded-xl border border-line-strong bg-bg/90 px-3 py-2.5 backdrop-blur-md"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 36px -18px rgba(0,0,0,0.7)",
              }}
            >
              <button
                type="button"
                aria-label="Back"
                className="inline-flex size-6 items-center justify-center rounded-md bg-surface text-fg-3 transition-colors hover:text-fg"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M9 2L4 7l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span
                key={`q-${a.key}`}
                className="flex-1 truncate text-[13.5px] text-fg"
                style={{ animation: "pop-in 0.35s var(--ease-out-cinema)" }}
              >
                {a.query}
              </span>
              <span className="inline-block h-3.5 w-px animate-[blink_1.1s_steps(2,jump-none)_infinite] bg-fg align-middle" />
            </div>

            {/* title row */}
            <div className="relative z-10 mt-5 flex items-end justify-between">
              <span
                key={`t-${a.key}`}
                className="text-[13.5px] font-semibold tracking-tight text-fg"
                style={{ animation: "pop-in 0.35s var(--ease-out-cinema)" }}
              >
                {a.listTitle}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-fg-4">
                {a.count}
              </span>
            </div>

            {/* 2-card result grid */}
            <div
              key={`grid-${a.key}`}
              className="relative z-10 mt-3 grid grid-cols-2 gap-3"
              style={{ animation: "pop-in 0.45s var(--ease-out-cinema)" }}
            >
              <ResultCard data={a.primary} tone={a} active />
              <ResultCard data={a.secondary} tone={a} />
            </div>
          </div>
        </Reveal>
      </div>
    </CinematicSection>
  );
}

function ResultCard({ data, tone, active = false }) {
  return (
    <article
      className={
        "group relative flex flex-col overflow-hidden rounded-xl border bg-bg/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (active
          ? "border-line-strong"
          : "border-line opacity-60 hover:opacity-90")
      }
      style={{
        boxShadow: active
          ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 36px -22px rgba(0,0,0,0.7)"
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* preview area */}
      <div
        className="relative h-[160px] sm:h-[180px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(0,0,0,0.25) 100%)",
        }}
      >
        <ResultPreview data={data} tone={tone} active={active} />
        {/* subtle hover lift on the preview */}
        <div className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />
      </div>
      {/* label + time */}
      <div className="px-3 py-2.5">
        <p className="truncate text-[12.5px] font-semibold text-fg">
          {data.title}
        </p>
        <p className="mt-0.5 font-mono text-[10.5px] tracking-wide text-fg-4">
          {data.time}
        </p>
      </div>
    </article>
  );
}

function ResultPreview({ data, tone, active }) {
  const accent = tone.iconBg;
  // each kind renders a different cinematic mini-preview, framed identically
  switch (data.kind) {
    case "doc":
      return (
        <div className="flex h-full flex-col justify-end p-3.5">
          <div
            aria-hidden
            className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-md text-bg font-bold"
            style={{
              background: accent,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            <span className="text-[11px]">{tone.iconLetter}</span>
          </div>
          <p className="line-clamp-3 text-[11.5px] leading-[1.55] text-fg-2">
            {data.body}
          </p>
        </div>
      );
    case "route":
      return (
        <div className="flex h-full flex-col justify-between p-3.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
            Route
          </div>
          <svg
            viewBox="0 0 200 80"
            className="w-full"
            preserveAspectRatio="none"
            height="60"
          >
            <defs>
              <linearGradient id={`route-${data.title}`} x1="0" x2="1">
                <stop offset="0%" stopColor="hsl(178 92% 66%)" />
                <stop offset="100%" stopColor="hsl(262 90% 72%)" />
              </linearGradient>
            </defs>
            <path
              d="M10,68 Q100,-10 190,68"
              fill="none"
              stroke={`url(#route-${data.title})`}
              strokeWidth="1.4"
              strokeDasharray="4 3"
            />
            <circle cx="10" cy="68" r="3.5" fill="hsl(178 92% 66%)" />
            <circle cx="190" cy="68" r="3.5" fill="hsl(262 90% 72%)" />
          </svg>
          <p className="text-[11.5px] text-fg-2 line-clamp-2">{data.body}</p>
        </div>
      );
    case "lang":
      return (
        <div className="flex h-full flex-col justify-between p-3.5">
          <div className="flex items-center gap-1.5">
            <span className="rounded-sm border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-fg-3">
              {data.title === "Japanese" ? "JA" : data.title === "German" ? "DE" : "??"}
            </span>
            <span className="font-mono text-[10px] text-fg-4">⌘{data.title === "Japanese" ? "2" : "3"}</span>
          </div>
          <p className="line-clamp-4 text-[12.5px] leading-[1.55] text-fg">
            {data.body}
          </p>
        </div>
      );
    case "key":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-3.5">
          <div className="flex items-center gap-1.5">
            {(data.time.match(/[⌥⌘⇧⌃←→↑↓A-Z]/g) || ["⌥", "⌘", "M"]).slice(0, 3).map((k, i) => (
              <span
                key={i}
                className="inline-flex size-7 items-center justify-center rounded-md border border-line bg-bg-2 font-mono text-[12px] text-fg"
                style={{
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.08), 0 3px 6px rgba(0,0,0,0.4)",
                }}
              >
                {k}
              </span>
            ))}
          </div>
          <p className="text-center text-[11.5px] leading-[1.5] text-fg-3 line-clamp-2">
            {data.body}
          </p>
        </div>
      );
    case "code":
      return (
        <div className="h-full p-3.5">
          <pre className="overflow-hidden rounded-md border border-line/80 bg-bg/70 p-2.5 font-mono text-[10.5px] leading-relaxed text-fg-2">
            <span className="text-fg-4">// {data.title}</span>
            {"\n"}
            <span className="text-cyan">{data.body.split(' · ')[0]}</span>
            {"\n"}
            <span className="text-fg-3">{data.body.split(' · ')[1] || ''}</span>
          </pre>
        </div>
      );
    default:
      return (
        <div className="flex h-full items-center justify-center text-[12px] text-fg-3">
          {data.title}
        </div>
      );
  }
}
