"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const STATS = [
  { value: 42, suffix: "+", label: "Edge regions" },
  { value: 1.4, suffix: "M", label: "Inferences / sec" },
  { value: 99.99, suffix: "%", label: "Single-region SLA" },
  { value: 12, suffix: "ms", label: "Median cold start" },
];

function CountUp({ to, suffix, decimals = 0 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            const dur = 1400;
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - start) / dur);
              const eased = 1 - Math.pow(1 - t, 4);
              setV(to * eased);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [to]);

  const formatted =
    decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString();
  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix ? <span className="text-fg-3">{suffix}</span> : null}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative">
      <div className="container-x">
        <Reveal className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-bg-2/60 p-6 sm:p-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 border-l border-line pl-5 first:border-l-0 first:pl-0 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <p className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                <CountUp
                  to={s.value}
                  suffix={s.suffix}
                  decimals={s.value % 1 !== 0 ? 2 : 0}
                />
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
