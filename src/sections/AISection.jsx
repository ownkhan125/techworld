import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import RaycastWindow, { ListWithDetails } from "@/components/RaycastWindow";
import LiveCard, { LiveLayer } from "@/components/LiveCard";
import CinematicSection from "@/components/CinematicSection";

const FEATURES = [
  {
    name: "Ask anything, anywhere.",
    body: "Combine frontier models with your own data, fleet logs and runbooks — answers in milliseconds.",
    tone: "cyan",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 11h4M11 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Always on, never in the way.",
    body: "A single keystroke surfaces context-aware help while you code, debug, or deploy — then disappears.",
    tone: "violet",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 10h2M11 10h2M15 10h2M7 14h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Your automation assistant.",
    body: "Define agent commands once, run them across every region. Repetitive ops becomes a keystroke.",
    tone: "amber",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v3M12 19v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

const CHATS = [
  { label: "Diff this graph", meta: "now" },
  { label: "What broke us-west yesterday?", meta: "12m" },
  { label: "Draft postmortem for incident #4f81", meta: "1h" },
  { label: "Convert this RTSP to MJPEG", meta: "3h" },
  { label: "Explain agent.plan span", meta: "yest" },
];

export default function AISection() {
  return (
    <CinematicSection id="ai" className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="Built-in intelligence"
          eyebrowTone="violet"
          title="The fabric, now with its own intelligence."
          sub="Techworld AI lives one keystroke away — grounded in your runbooks, your code, and your live fleet state."
        />

        {/* big AI product window */}
        <Reveal data-stage="media" className="relative mt-14">
          <div className="relative">
            {/* tinted background glow that matches Raycast's red-gradient hero feel */}
            <div
              aria-hidden
              className="absolute inset-x-0 -top-10 -bottom-10 -z-10 mx-auto h-[120%] max-w-[1120px]"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 50%, hsla(178,92%,66%,0.18), transparent 70%), radial-gradient(40% 40% at 80% 30%, hsla(262,90%,72%,0.20), transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <RaycastWindow
              label="Techworld AI"
              search="What broke us-west yesterday?"
              actions={[
                { key: "↵", text: "Ask" },
                { key: "⌘N", text: "New chat" },
              ]}
              className="max-w-[1080px]"
            >
              <ListWithDetails
                items={CHATS}
                activeIndex={1}
                detail={
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                      Answer
                    </p>
                    <div className="mt-3 space-y-3 text-[13.5px] leading-[1.65] text-fg-2">
                      <p>
                        At <span className="font-mono text-fg">17:42 UTC</span>, a misrouted
                        rollout caused <span className="text-violet">vision-detector</span> to
                        cold-start on 4 of the 12 us-west PoPs. p99 climbed to{" "}
                        <span className="text-amber">412ms</span> for 3 minutes.
                      </p>
                      <p>
                        Root cause: a stale region tag in the canary plan. I've drafted a
                        fix and a <span className="text-cyan underline-offset-2">5-line patch</span>.
                      </p>
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-fg-3">
                        <span className="size-1.5 rounded-full bg-cyan" />
                        sources · 4
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-fg-3">
                        runbook
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-fg-3">
                        deploy log
                      </span>
                    </div>
                  </div>
                }
              />
            </RaycastWindow>
          </div>
        </Reveal>

        {/* 3-column feature grid (interactive LiveCards) */}
        <Reveal stagger data-stage="body" className="mt-16 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <LiveCard key={f.name} tone={f.tone} idleDelay={i * 800} tiltMax={9}>
              <div className="relative flex h-full min-h-[210px] flex-col p-6 sm:p-7">
                <LiveLayer depth={36} className={"inline-flex size-10 items-center justify-center rounded-xl text-" + f.tone} style={{ "--depth": "36px", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
                  {f.icon}
                </LiveLayer>
                <LiveLayer depth={22} as="h3" className="mt-5 text-[16px] font-semibold tracking-tight text-fg">
                  {f.name}
                </LiveLayer>
                <LiveLayer depth={10} as="p" className="mt-2 text-[13.5px] leading-[1.6] text-fg-3">
                  {f.body}
                </LiveLayer>
              </div>
            </LiveCard>
          ))}
        </Reveal>

        <Reveal data-stage="cta" className="mt-10 text-center">
          <Link
            href="#ai"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-fg-2 transition-colors duration-300 hover:text-fg"
          >
            More about AI
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </CinematicSection>
  );
}
