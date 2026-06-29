import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import LiveCard, { LiveLayer } from "@/components/LiveCard";
import CinematicSection from "@/components/CinematicSection";

const SOCIALS = [
  {
    title: "Discord",
    description: "12,000+ engineers, scientists and operators trading patterns daily.",
    cta: "Join the server",
    href: "#",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
    tone: "violet",
  },
  {
    title: "GitHub",
    description: "The Techworld CLI, runtime and SDKs — open source and welcoming PRs.",
    cta: "Star the repo",
    href: "#",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&q=80&auto=format&fit=crop",
    tone: "cyan",
  },
];

export default function Community() {
  return (
    <CinematicSection id="cta" className="relative pb-24 pt-8 sm:pb-32">
      <div className="container-x">
        {/* big closing line */}
        <div className="mx-auto max-w-[900px] text-center">
          <div data-stage="heading">
            <SplitText
              text="Ship the system you've been describing in meetings."
              as="h2"
              baseDelay={0}
              step={45}
              className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg sm:text-5xl lg:text-[64px]"
            />
          </div>
          <Reveal as="div" delay={500} data-stage="cta" className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="#" className="btn-key h-11 px-5 text-[14px]">
              Download for Mac
            </Link>
            <Link href="#" className="btn-key h-11 px-5 text-[14px]">
              Download for Windows
            </Link>
          </Reveal>
          <Reveal as="p" delay={650} data-stage="body" className="mt-5">
            <span className="font-mono text-[11px] text-fg-4">
              v0.9.21 · macOS 13+ · Free during private beta
            </span>
          </Reveal>
        </div>

        {/* socials cards (interactive LiveCards) */}
        <div className="mt-20 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} data-stage="media">
              <LiveCard
                href={s.href}
                tone={s.tone}
                idleDelay={i * 1100}
                tiltMax={6}
                radius={20}
                className="block h-[260px] sm:h-[320px]"
              >
                {/* image — deepest layer */}
                <LiveLayer depth={0} className="absolute inset-0 overflow-hidden rounded-[inherit]">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-[0.32] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-[0.45]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-2 via-bg-2/70 to-transparent" />
                </LiveLayer>
                {/* content layers — sit above image */}
                <div className="relative flex h-full flex-col justify-end p-6 sm:p-9">
                  <LiveLayer depth={26} as="h3" className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                    {s.title}
                  </LiveLayer>
                  <LiveLayer depth={16} as="p" className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-fg-2">
                    {s.description}
                  </LiveLayer>
                  <LiveLayer depth={32} as="span" className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-fg transition-colors duration-300">
                    {s.cta}
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
                      <path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </LiveLayer>
                </div>
              </LiveCard>
            </Reveal>
          ))}
        </div>
      </div>
    </CinematicSection>
  );
}
