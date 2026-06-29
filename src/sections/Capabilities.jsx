import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

const ICONS = {
  orchestrate: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="19" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 8v3M12 11l-6 5M12 11l6 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  edge: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  observe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 12c2-5 6-7 9-7s7 2 9 7c-2 5-6 7-9 7s-7-2-9-7z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  vault: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 6V4a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="13" r="1.6" fill="currentColor" />
    </svg>
  ),
};

function CardChrome({ children, tone, className = "" }) {
  const shadow = {
    cyan: "rgba(255,255,255,0.1) 0 1px 0 0 inset, rgba(13,79,79,0.18) 0 0 22px 4px, rgba(13,79,79,0.18) 0 0 44px 22px, rgba(255,255,255,0.06) 0 0 0 1px inset",
    violet: "rgba(255,255,255,0.1) 0 1px 0 0 inset, rgba(45,18,79,0.22) 0 0 22px 4px, rgba(85,0,98,0.18) 0 0 44px 22px, rgba(255,255,255,0.06) 0 0 0 1px inset",
    amber: "rgba(255,255,255,0.1) 0 1px 0 0 inset, rgba(86,55,5,0.25) 0 0 22px 4px, rgba(86,55,5,0.18) 0 0 44px 22px, rgba(255,255,255,0.06) 0 0 0 1px inset",
    rose: "rgba(255,255,255,0.1) 0 1px 0 0 inset, rgba(70,8,30,0.25) 0 0 22px 4px, rgba(70,8,30,0.18) 0 0 44px 22px, rgba(255,255,255,0.06) 0 0 0 1px inset",
  }[tone];
  return (
    <article
      className={
        "group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-bg-2/70 " +
        className
      }
      style={{ boxShadow: shadow }}
    >
      {children}
    </article>
  );
}

function CardHeader({ icon, eyebrow, tone }) {
  const tint = {
    cyan: "bg-cyan-soft text-cyan",
    violet: "bg-violet-soft text-violet",
    amber: "bg-amber-soft text-amber",
    rose: "bg-rose-soft text-rose",
  }[tone];
  return (
    <div className="flex items-center gap-3 px-7 pt-7 sm:px-8 sm:pt-8">
      <span className={"inline-flex size-9 items-center justify-center rounded-md " + tint}>
        {icon}
      </span>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">{eyebrow}</p>
    </div>
  );
}

export default function Capabilities() {
  return (
    <section id="capabilities" className="section-pad relative">
      <div className="container-x">
        <SectionTitle
          eyebrow="Capabilities"
          eyebrowTone="amber"
          title="One substrate. Every kind of intelligence."
          sub="From real-time inference at the edge to long-running multi-agent jobs — one mental model, one bill."
        />

        <div className="mt-16 grid grid-cols-12 gap-5">
          {/* Big feature — orchestration (cols 7) — split layout: text top, image bottom */}
          <Reveal className="col-span-12 lg:col-span-7">
            <CardChrome tone="cyan" className="min-h-[460px]">
              <CardHeader icon={ICONS.orchestrate} eyebrow="Orchestration" tone="cyan" />
              <div className="px-7 pt-5 sm:px-8">
                <h3 className="max-w-[20ch] text-balance text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-[28px]">
                  Schedule fleets like single functions.
                </h3>
                <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-fg-3">
                  Declarative graphs compile into distributed plans across nodes,
                  regions and physical devices. Retries, backpressure and state
                  are handled — you write the logic.
                </p>
              </div>
              <div className="relative mt-6 flex-1 overflow-hidden">
                <div className="absolute inset-0 px-7 sm:px-8">
                  <pre className="h-full overflow-hidden rounded-tl-xl rounded-tr-xl border-t border-x border-line bg-bg/80 p-4 font-mono text-[12px] leading-relaxed text-fg-2">
                    <span className="text-fg-4">// schedule.ts</span>{"\n"}
                    <span className="text-cyan">graph</span>(<span className="text-amber">&apos;vision&apos;</span>){"\n"}
                    {"  "}.<span className="text-violet">map</span>(camera){"\n"}
                    {"  "}.<span className="text-violet">infer</span>(yolo){"\n"}
                    {"  "}.<span className="text-violet">if</span>(<span className="text-amber">&apos;person&apos;</span>){"\n"}
                    {"  "}.<span className="text-violet">notify</span>(team)
                  </pre>
                </div>
                <div
                  aria-hidden
                  className="absolute -right-20 -bottom-20 size-64 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, hsla(178,92%,66%,0.28), transparent 60%)",
                    filter: "blur(20px)",
                  }}
                />
              </div>
            </CardChrome>
          </Reveal>

          {/* Edge runtime — image-heavy */}
          <Reveal delay={80} className="col-span-12 lg:col-span-5">
            <CardChrome tone="violet" className="min-h-[460px]">
              <CardHeader icon={ICONS.edge} eyebrow="Edge runtime" tone="violet" />
              <div className="px-7 pt-5 sm:px-8">
                <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-fg sm:text-[28px]">
                  Sub-frame inference, anywhere.
                </h3>
                <p className="mt-3 max-w-[38ch] text-[14px] leading-relaxed text-fg-3">
                  42 edge regions. Cold starts under 20ms. Your model lands where
                  your users — and your sensors — already are.
                </p>
              </div>
              <div className="relative mt-6 flex-1 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop"
                  alt="Earth from space"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-2 via-bg-2/30 to-transparent" />
                <div className="absolute bottom-5 left-7 right-7 flex items-center justify-between rounded-lg border border-line bg-bg/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-3">
                  <span>42 PoPs · 6 continents</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
                    live
                  </span>
                </div>
              </div>
            </CardChrome>
          </Reveal>

          {/* Observability — wider, image-left */}
          <Reveal delay={140} className="col-span-12 md:col-span-7">
            <CardChrome tone="amber" className="min-h-[360px]">
              <div className="grid h-full grid-cols-1 sm:grid-cols-[1fr_1fr]">
                <div>
                  <CardHeader icon={ICONS.observe} eyebrow="Observability" tone="amber" />
                  <div className="px-7 pt-5 pb-7 sm:px-8 sm:pb-8">
                    <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-fg">
                      See every hop, every token.
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-fg-3">
                      Distributed traces stitched across model calls, agents and
                      hardware events. One timeline. One truth.
                    </p>
                  </div>
                </div>
                <div className="relative min-h-[200px] overflow-hidden sm:rounded-r-[20px]">
                  <div className="absolute inset-0 flex flex-col gap-2 p-5">
                    {[
                      { name: "POST /infer", a: 0.05, w: 0.95, color: "hsl(178 92% 66%)" },
                      { name: "tokenize", a: 0.2, w: 0.12, color: "hsl(38 95% 64%)" },
                      { name: "vision.fwd", a: 0.28, w: 0.45, color: "hsl(262 90% 72%)" },
                      { name: "agent.plan", a: 0.5, w: 0.3, color: "hsl(178 92% 66%)" },
                      { name: "stream.out", a: 0.72, w: 0.25, color: "hsl(348 92% 70%)" },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center gap-2">
                        <span className="w-[70px] font-mono text-[10px] text-fg-3">{r.name}</span>
                        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-surface">
                          <div
                            className="absolute h-full rounded-full"
                            style={{
                              left: `${r.a * 100}%`,
                              width: `${r.w * 100}%`,
                              background: r.color,
                              boxShadow: `0 0 12px ${r.color}`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardChrome>
          </Reveal>

          {/* Security — tall narrow card */}
          <Reveal delay={200} className="col-span-12 md:col-span-5">
            <CardChrome tone="rose" className="min-h-[360px]">
              <CardHeader icon={ICONS.vault} eyebrow="Trust" tone="rose" />
              <div className="px-7 pt-5 sm:px-8">
                <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-fg">
                  Production-grade trust, built in.
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-fg-3">
                  SOC 2 Type II, granular IAM, hardware-attested enclaves and
                  per-tenant key vaults — without a 90-day rollout.
                </p>
              </div>
              <div className="relative mt-6 flex flex-1 flex-wrap items-end gap-2 px-7 pb-7 sm:px-8 sm:pb-8">
                {["SOC 2", "ISO 27001", "HIPAA", "GDPR", "PCI", "FedRAMP"].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-3"
                  >
                    <span className="size-1 rounded-full bg-rose" />
                    {b}
                  </span>
                ))}
              </div>
            </CardChrome>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
