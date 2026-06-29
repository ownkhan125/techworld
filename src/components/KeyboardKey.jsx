import { cn } from "@/utils/cn";

/**
 * KeyboardKey — icon-only 3D cube tile inside `.kbd-grid`.
 *  - Stays fixed in its grid cell; the cube spins/tilts inside.
 *  - Front and back faces; each may carry a different icon (props: icon, iconBack).
 *  - Idle: triggered by parent via `animating` prop (2–3 keys at a time).
 *  - Hover: cube flips 180° on Y + lifts + glows + shine sweep on front.
 *  - `tone` ("cyan"|"violet"|"amber"|"rose") tints the active variant.
 */

const TONE = {
  cyan: {
    top: "hsl(178 65% 16% / 0.95)",
    bottom: "hsl(195 55% 9% / 0.98)",
    border: "rgba(94,240,230,0.45)",
    borderHover: "rgba(94,240,230,0.7)",
    glow: "rgba(94,240,230,0.35)",
    icon: "hsl(178 92% 75%)",
  },
  violet: {
    top: "hsl(262 60% 18% / 0.95)",
    bottom: "hsl(265 50% 11% / 0.98)",
    border: "rgba(167,139,250,0.45)",
    borderHover: "rgba(167,139,250,0.7)",
    glow: "rgba(167,139,250,0.35)",
    icon: "hsl(262 90% 80%)",
  },
  amber: {
    top: "hsl(38 60% 18% / 0.95)",
    bottom: "hsl(20 55% 11% / 0.98)",
    border: "rgba(251,191,36,0.45)",
    borderHover: "rgba(251,191,36,0.7)",
    glow: "rgba(251,191,36,0.35)",
    icon: "hsl(38 95% 70%)",
  },
  rose: {
    top: "hsl(348 60% 18% / 0.95)",
    bottom: "hsl(348 55% 11% / 0.98)",
    border: "rgba(252,108,140,0.45)",
    borderHover: "rgba(252,108,140,0.7)",
    glow: "rgba(252,108,140,0.35)",
    icon: "hsl(348 92% 78%)",
  },
};

export default function KeyboardKey({
  icon,
  iconBack,
  tone,
  animating = false,
  className,
  style,
}) {
  const t = tone ? TONE[tone] : null;
  const vars = {
    ...(t
      ? {
          "--kbd-top": t.top,
          "--kbd-bottom": t.bottom,
          "--kbd-border": t.border,
          "--kbd-border-hover": t.borderHover,
          "--kbd-glow": t.glow,
          "--kbd-icon": t.icon,
        }
      : {}),
    ...(style || {}),
  };

  return (
    <div
      className={cn("kbd-key", t && "kbd-key--active", className)}
      data-animating={animating ? "1" : "0"}
      style={vars}
    >
      <div className="kbd-key__inner">
        <div className="kbd-key__face kbd-key__face--front">
          {icon ? <div className="kbd-key__icon">{icon}</div> : null}
        </div>
        <div className="kbd-key__face kbd-key__face--back">
          {iconBack ? (
            <div className="kbd-key__icon">{iconBack}</div>
          ) : icon ? (
            <div className="kbd-key__icon">{icon}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
