import { cn } from "@/utils/cn";

export default function Eyebrow({ children, className, tone = "cyan" }) {
  const dot = {
    cyan: "bg-cyan",
    violet: "bg-violet",
    amber: "bg-amber",
    rose: "bg-rose",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-3",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      {children}
    </span>
  );
}
