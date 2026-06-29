import { cn } from "@/utils/cn";

/**
 * RaycastWindow — generic shell mimicking Raycast's 750x475 product window:
 *  - navigationBar (search input look)
 *  - contentArea (list left + details right OR full-width)
 *  - actionBar (bottom keybinding strip)
 */
export default function RaycastWindow({
  label = "techworld",
  search = "",
  children,
  actions = [
    { key: "↵", text: "Open" },
    { key: "⌘K", text: "Actions" },
  ],
  className,
  bodyClassName,
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[760px] overflow-hidden rounded-2xl border border-line bg-bg-2/90 text-left backdrop-blur-xl",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04), 0 60px 100px -30px rgba(0,0,0,0.85)",
      }}
    >
      {/* navigation bar (search input) */}
      <div className="flex h-14 items-center gap-3 border-b border-line/80 px-4">
        <span
          className="inline-flex size-7 items-center justify-center rounded-md"
          style={{
            background:
              "linear-gradient(135deg, hsl(178 92% 66%) 0%, hsl(262 90% 72%) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 9.5l3-6 2.2 4L9 4.5l3 5"
              stroke="rgba(6,7,10,0.85)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="flex-1 truncate text-[14px] text-fg">
          {search ? (
            <>
              <span className="text-fg-4">{label} ›</span>{" "}
              <span className="text-fg">{search}</span>
              <span className="inline-block w-px h-[1em] align-[-2px] bg-fg ml-0.5 animate-[blink_1.1s_steps(2,jump-none)_infinite]" />
            </>
          ) : (
            <span className="text-fg-4">{label}</span>
          )}
        </div>
        <span className="hidden font-mono text-[10px] text-fg-4 sm:inline-flex">
          ⌘K
        </span>
      </div>

      {/* content area */}
      <div className={cn("min-h-[300px] sm:min-h-[340px]", bodyClassName)}>
        {children}
      </div>

      {/* action bar */}
      <div className="flex h-10 items-center justify-between border-t border-line/80 bg-bg/40 px-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-4">
          techworld
        </span>
        <div className="flex items-center gap-3 text-[11px] text-fg-3">
          {actions.map((a, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <kbd className="inline-flex h-[20px] min-w-[20px] items-center justify-center rounded border border-line bg-surface px-1 font-mono text-[10px] text-fg-2">
                {a.key}
              </kbd>
              <span>{a.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ListWithDetails — split content area (left list + right details panel)
 */
export function ListWithDetails({ items = [], detail, activeIndex = 0 }) {
  return (
    <div className="grid h-full grid-cols-1 sm:grid-cols-[260px_1fr]">
      <ul className="border-r border-line/80 p-2 sm:p-3">
        {items.map((it, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] transition-colors duration-200",
              i === activeIndex ? "bg-surface text-fg" : "text-fg-3 hover:text-fg"
            )}
          >
            {it.icon ? (
              <span className="inline-flex size-5 items-center justify-center rounded-[5px] bg-surface text-fg-2">
                {it.icon}
              </span>
            ) : null}
            <span className="truncate flex-1">{it.label}</span>
            {it.meta ? (
              <span className="font-mono text-[10px] text-fg-4">{it.meta}</span>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="hidden p-5 sm:block">{detail}</div>
    </div>
  );
}
