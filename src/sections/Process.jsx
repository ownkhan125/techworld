import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

const STEPS = [
  {
    label: "Design",
    title: "Sketch the system, not the function.",
    body: "Open a new graph and compose ingest, models, agents and side-effects with typed sockets. The compiler validates as you draw.",
    code: "graph.compose(ingest, vision, decide)",
  },
  {
    label: "Deploy",
    title: "One command. Fleet-aware.",
    body: "`tw deploy` packages your graph, picks regions, warms accelerators, and rolls out atomically. Rollback is one keystroke.",
    code: "$ tw deploy --region auto",
  },
  {
    label: "Observe",
    title: "See the whole organism, live.",
    body: "Token-grain traces stitched across nodes. Hover any span to jump straight into the source, the model card, or the device log.",
    code: "tw trace req_4f81 --follow",
  },
  {
    label: "Evolve",
    title: "Iterate without breaking production.",
    body: "Shadow deploys, A/B canaries, and time-travel rollbacks let you ship daily — even against live revenue.",
    code: "tw canary 5% → 100%",
  },
];

export default function Process() {
  return (
    <section id="process" className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          align="left"
          eyebrow="How it works"
          eyebrowTone="cyan"
          title="From sketch to fleet in four moves."
          sub="A workflow designed by people who've shipped to production at 3am and never want to do it that way again."
          className="max-w-3xl"
        />

        <div className="relative mt-16 grid grid-cols-12 gap-6 lg:gap-10">
          {/* the connecting rail */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-[2.6rem] top-2 hidden h-[calc(100%-2rem)] lg:block"
            width="2"
            viewBox="0 0 2 1000"
            preserveAspectRatio="none"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="1000"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="1000"
              stroke="url(#rail-grad)"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{
                animation: "draw 2.5s var(--ease-out-cinema) forwards",
              }}
            />
            <defs>
              <linearGradient id="rail-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(178 92% 66%)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(262 90% 72%)" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>

          {STEPS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className="col-span-12 grid grid-cols-[auto_1fr] gap-5 lg:grid-cols-[5.6rem_1fr]"
            >
              {/* badge */}
              <div className="relative">
                <div
                  className="relative z-10 inline-flex size-12 items-center justify-center rounded-full border border-line bg-bg-2 font-mono text-[12px] text-fg-2"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 4px rgba(6,7,10,1)",
                  }}
                >
                  {s.label[0]}
                </div>
              </div>
              {/* content */}
              <div className="group max-w-[640px] pb-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">
                  {s.label}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-fg-3">{s.body}</p>
                <pre className="mt-4 inline-block rounded-md border border-line bg-bg-2 px-3 py-2 font-mono text-[12px] text-fg-2">
                  {s.code}
                </pre>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
