import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import MagneticButton from "@/components/MagneticButton";

export default function CTA() {
  return (
    <section id="cta" className="relative px-4 pb-24 sm:pb-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[28px] border border-line bg-bg-2 p-8 sm:p-14 lg:p-20">
          {/* gradient mesh */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(120% 80% at 80% 0%, hsla(178,92%,66%,0.18), transparent 55%), radial-gradient(80% 60% at 0% 100%, hsla(262,90%,72%,0.22), transparent 60%), radial-gradient(60% 50% at 50% 100%, hsla(38,95%,64%,0.1), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent_80%)]"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <SplitText
                text="Ship the system you've been describing in meetings."
                as="h2"
                baseDelay={0}
                step={45}
                className="max-w-[20ch] text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg sm:text-5xl"
              />
              <Reveal as="p" delay={400} className="mt-5">
                <span className="block max-w-[52ch] text-[15px] leading-relaxed text-fg-3 sm:text-base">
                  Spin up a tenant in 90 seconds. Deploy a working graph in 5 minutes.
                  No procurement, no SDR call.
                </span>
              </Reveal>
              <Reveal as="div" delay={600} className="mt-9 flex flex-wrap items-center gap-3">
                <MagneticButton as="div" strength={14} className="inline-flex">
                  <Link href="#contact" className="btn-key h-11 px-5 text-[14px]">
                    Start building free
                  </Link>
                </MagneticButton>
                <Link href="#contact" className="btn-ghost h-11 px-5 text-[14px]">
                  Talk to engineering →
                </Link>
              </Reveal>
            </div>

            {/* status keypanel */}
            <Reveal delay={300}>
              <div
                className="card relative ml-auto w-full max-w-[400px] p-5"
                style={{
                  boxShadow: "var(--shadow-glow-cyan)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-4">
                    system status
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-cyan">
                    <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
                    all systems nominal
                  </span>
                </div>
                <div className="mt-4 space-y-2.5">
                  {[
                    { l: "Edge runtime", v: "12ms p50" },
                    { l: "Compiler", v: "0 deferred" },
                    { l: "Control plane", v: "stable" },
                    { l: "Auth", v: "OIDC · SAML" },
                  ].map((r) => (
                    <div
                      key={r.l}
                      className="flex items-center justify-between rounded-md border border-line bg-bg/40 px-3 py-2"
                    >
                      <span className="text-[12px] text-fg-2">{r.l}</span>
                      <span className="font-mono text-[11px] text-fg-3">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
