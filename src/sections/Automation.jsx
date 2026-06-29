import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import LiveCard from "@/components/LiveCard";
import CinematicSection from "@/components/CinematicSection";

/**
 * Automation 3-card grid (Raycast "Don't repeat yourself" layout):
 *  - Wide Snippets card on top (text left, chat-mock right with gradient artwork)
 *  - Bottom-left: Quicklinks card (search-result mock)
 *  - Bottom-right: Hotkeys card (keycap visual)
 */
export default function Automation() {
  return (
    <CinematicSection className="section-pad relative overflow-hidden">
      <div className="container-x">
        <SectionTitle
          eyebrow="Automation"
          eyebrowTone="amber"
          title="Don't repeat yourself."
          sub="Automate the things you do all the time — with first-class building blocks."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {/* WIDE Snippets card */}
          <Reveal data-stage="media" className="lg:col-span-2">
            <LiveCard tone="cyan" idleDelay={0} tiltMax={5} radius={20} className="block">
            <article className="relative grid grid-cols-1 overflow-hidden rounded-[inherit] md:grid-cols-[1fr_1fr]">
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">
                  Snippets
                </p>
                <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-[28px]">
                  Type once. Reuse forever.
                </h3>
                <p className="mt-3 max-w-[42ch] text-[14px] leading-relaxed text-fg-3">
                  Save the strings you keep typing — addresses, kubectl one-liners,
                  email replies — and insert them anywhere by typing their keyword.
                </p>
              </div>
              {/* gradient artwork + snippet expansion mock */}
              <div className="relative min-h-[260px] overflow-hidden md:rounded-r-2xl">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(178 92% 28% / 0.6), hsl(262 90% 30% / 0.6) 60%, hsl(348 92% 32% / 0.55))",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
                {/* diagonal speed lines (Raycast-style) */}
                <svg
                  aria-hidden
                  className="absolute inset-0 h-full w-full opacity-25 mix-blend-screen"
                  viewBox="0 0 600 400"
                  preserveAspectRatio="none"
                >
                  {Array.from({ length: 14 }).map((_, i) => (
                    <line
                      key={i}
                      x1={-200 + i * 90}
                      y1={500}
                      x2={i * 90 + 200}
                      y2={-100}
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="20"
                    />
                  ))}
                </svg>
                {/* the expansion bubble */}
                <div
                  className="absolute right-5 top-5 max-w-[320px] rounded-xl border border-line bg-bg-2/85 p-4 backdrop-blur-xl"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 60px -20px rgba(0,0,0,0.5)",
                  }}
                >
                  <p className="text-[13px] text-fg">
                    Sure, here you go:
                  </p>
                  <p className="mt-1 text-[13px] text-fg-2">
                    3rd Floor 1 Ashley Road,
                    <br />
                    WA14 2DT Altrincham, Cheshire
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      className="keycap size-7"
                      aria-label="Replay"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3 7a4 4 0 117 2.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path d="M3 4v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </button>
                    <span className="btn-key h-7 px-2.5 text-[12px]">Send</span>
                  </div>
                </div>
              </div>
            </article>
            </LiveCard>
          </Reveal>

          {/* Quicklinks card */}
          <Reveal delay={120} data-stage="body">
            <LiveCard tone="violet" idleDelay={900} tiltMax={6} radius={20} className="block h-full">
            <article className="relative h-full overflow-hidden p-7 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">
                Quicklinks
              </p>
              <h3 className="mt-3 text-balance text-xl font-semibold leading-tight tracking-tight text-fg sm:text-2xl">
                Launch anything, from anywhere.
              </h3>
              <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-fg-3">
                Bookmark commands, URLs and pages — call them up by typing a few letters.
              </p>
              {/* search-result mock */}
              <div className="mt-6 overflow-hidden rounded-xl border border-line bg-bg/70">
                <div className="flex items-center gap-2 border-b border-line/80 px-3 py-2 text-[12px] text-fg-3">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  scratch
                  <span className="inline-block w-px h-3 align-middle bg-fg-3 ml-0.5 animate-[blink_1.1s_steps(2,jump-none)_infinite]" />
                </div>
                <div className="px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">Results</p>
                  <ul className="mt-1.5 space-y-0.5 text-[13px]">
                    <li className="flex items-center justify-between rounded-md bg-surface px-2 py-1.5">
                      <span className="flex items-center gap-2 text-fg">
                        <span className="inline-flex size-4 items-center justify-center rounded bg-violet text-bg text-[10px] font-bold">F</span>
                        Figma Scratchpad
                      </span>
                      <span className="font-mono text-[11px] text-fg-4">figma.com</span>
                    </li>
                    <li className="flex items-center justify-between rounded-md px-2 py-1.5">
                      <span className="flex items-center gap-2 text-fg-2">
                        <span className="inline-flex size-4 items-center justify-center rounded bg-amber text-bg text-[10px] font-bold">F</span>
                        Framer Scratchpad
                      </span>
                      <span className="font-mono text-[11px] text-fg-4">framer.com</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
            </LiveCard>
          </Reveal>

          {/* Hotkeys card */}
          <Reveal delay={200} data-stage="body">
            <LiveCard tone="amber" idleDelay={1800} tiltMax={6} radius={20} className="block h-full">
            <article className="relative h-full overflow-hidden p-7 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">
                Hotkeys & Aliases
              </p>
              <h3 className="mt-3 text-balance text-xl font-semibold leading-tight tracking-tight text-fg sm:text-2xl">
                One keystroke. Anything you want.
              </h3>
              <p className="mt-2 max-w-[36ch] text-[14px] leading-relaxed text-fg-3">
                Bind any command, app, or graph to a global hotkey or two-letter alias.
              </p>
              {/* keycap visual */}
              <div className="mt-6 flex items-center justify-center gap-3 py-6">
                <Keycap label="⇧" big />
                <span className="text-fg-4">+</span>
                <Keycap label="⌘" sub="command" big />
                <span className="text-fg-4">+</span>
                <Keycap label="U" big />
              </div>
            </article>
            </LiveCard>
          </Reveal>
        </div>
      </div>
    </CinematicSection>
  );
}

function Keycap({ label, sub, big = false }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={
          "inline-flex flex-col items-center justify-center rounded-lg border border-line bg-bg-2 " +
          (big ? "size-16 text-2xl" : "size-12 text-base")
        }
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.08), 0 4px 10px rgba(0,0,0,0.5)",
        }}
      >
        <span className="font-mono text-fg">{label}</span>
        {sub ? <span className="mt-0.5 font-mono text-[9px] text-fg-4">{sub}</span> : null}
      </div>
    </div>
  );
}
