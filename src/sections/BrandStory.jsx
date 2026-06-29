import Image from "next/image";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import Eyebrow from "@/components/Eyebrow";

export default function BrandStory() {
  return (
    <section id="platform" className="section-pad relative">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* image collage with depth */}
        <div className="relative h-[460px] w-full sm:h-[560px]">
          <Reveal className="absolute left-0 top-0 h-[68%] w-[68%]">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-line">
              <Image
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop"
                alt="Abstract data stream visualization"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bg/80 via-transparent to-cyan/10" />
            </div>
          </Reveal>
          <Reveal
            delay={180}
            className="absolute bottom-0 right-0 h-[60%] w-[62%]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-line shadow-[0_50px_80px_-30px_rgba(167,139,250,0.35)]">
              <Image
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop"
                alt="Circuit board macro"
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-violet/15 via-transparent to-bg/80" />
            </div>
          </Reveal>

          {/* floating metric */}
          <Reveal
            delay={360}
            className="absolute left-[55%] top-[40%] z-10 w-[180px] -translate-x-1/2"
          >
            <div className="card p-4" style={{ boxShadow: "var(--shadow-glow-cyan)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
                Throughput
              </p>
              <p className="mt-1 text-2xl font-semibold text-fg">
                1.4M<span className="text-fg-3 text-sm"> req/s</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div className="h-full w-[78%] bg-gradient-to-r from-cyan to-violet" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* manifesto */}
        <div className="max-w-[560px]">
          <Reveal>
            <Eyebrow tone="violet">Why Techworld</Eyebrow>
          </Reveal>
          <SplitText
            text="Software has outgrown the desktop. The fabric must follow."
            as="h2"
            baseDelay={60}
            step={50}
            className="mt-6 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-fg sm:text-4xl lg:text-5xl"
          />
          <Reveal as="p" delay={500} className="mt-6">
            <span className="block text-pretty text-[15px] leading-[1.65] text-fg-3 sm:text-base">
              Today's systems are fleets — of models, agents, devices, sensors,
              and humans. They don't fit on a single machine, in a single region,
              or under a single mental model.{" "}
              <span className="text-fg">
                Techworld gives you one substrate to ship them on.
              </span>
            </span>
          </Reveal>

          <Reveal stagger className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {[
              { k: "120ms", v: "Median cold start" },
              { k: "42 edge", v: "PoPs worldwide" },
              { k: "99.99%", v: "Single-region SLA" },
              { k: "SOC 2", v: "Type II certified" },
            ].map((m) => (
              <div key={m.k} className="border-l border-line pl-4">
                <p className="text-2xl font-semibold tracking-tight text-fg">{m.k}</p>
                <p className="mt-1 text-[13px] text-fg-3">{m.v}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
