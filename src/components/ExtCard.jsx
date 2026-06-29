import Image from "next/image";
import { cn } from "@/utils/cn";

const TONE = {
  cyan: {
    shadow:
      "rgba(255,255,255,0.12) 0 1px 0 0 inset, rgba(94,240,230,0.32) 0 0 0 1px inset, 0 30px 60px -28px rgba(0,0,0,0.7)",
    iconBg: "linear-gradient(135deg, hsl(178 92% 70%), hsl(195 90% 55%))",
  },
  violet: {
    shadow:
      "rgba(255,255,255,0.12) 0 1px 0 0 inset, rgba(167,139,250,0.32) 0 0 0 1px inset, 0 30px 60px -28px rgba(0,0,0,0.7)",
    iconBg: "linear-gradient(135deg, hsl(262 90% 75%), hsl(280 75% 55%))",
  },
  amber: {
    shadow:
      "rgba(255,255,255,0.12) 0 1px 0 0 inset, rgba(251,191,36,0.30) 0 0 0 1px inset, 0 30px 60px -28px rgba(0,0,0,0.7)",
    iconBg: "linear-gradient(135deg, hsl(38 95% 64%), hsl(20 90% 55%))",
  },
  rose: {
    shadow:
      "rgba(255,255,255,0.12) 0 1px 0 0 inset, rgba(252,108,140,0.30) 0 0 0 1px inset, 0 30px 60px -28px rgba(0,0,0,0.7)",
    iconBg: "linear-gradient(135deg, hsl(348 92% 70%), hsl(330 70% 50%))",
  },
  emerald: {
    shadow:
      "rgba(255,255,255,0.12) 0 1px 0 0 inset, rgba(94,234,212,0.30) 0 0 0 1px inset, 0 30px 60px -28px rgba(0,0,0,0.7)",
    iconBg: "linear-gradient(135deg, hsl(160 75% 55%), hsl(180 70% 45%))",
  },
};

/**
 * ExtCard — 360x536 card.
 * Layout: header (176 tall: icon + title + add-button + description + divider) over an image (360 tall).
 */
export default function ExtCard({
  title,
  description,
  iconLetter,
  image,
  imageAlt,
  tone = "cyan",
  href = "#",
  className,
}) {
  const t = TONE[tone] || TONE.cyan;
  return (
    <a
      href={href}
      className={cn(
        "ext-card group relative flex h-[480px] w-[300px] flex-col overflow-hidden rounded-[20px] bg-bg-2/92 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:h-[520px] sm:w-[340px]",
        className
      )}
      style={{ boxShadow: t.shadow }}
    >
      {/* header */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-[12px] text-bg"
              style={{
                background: t.iconBg,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.35)",
              }}
            >
              <span className="font-semibold text-[18px] tracking-tight">{iconLetter}</span>
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-fg">{title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
                Extension
              </p>
            </div>
          </div>
          <span
            className="keycap size-9 shrink-0"
            aria-label="Add"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <p className="mt-4 line-clamp-2 text-[13px] leading-[1.5] text-fg-3">
          {description}
        </p>
        <div className="mt-5 h-px bg-line" />
      </div>

      {/* image area — fills remaining space */}
      <div className="relative mt-4 flex-1 overflow-hidden rounded-b-[20px]">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          sizes="340px"
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-2/85 via-transparent to-transparent" />
      </div>
    </a>
  );
}
