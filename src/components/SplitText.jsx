"use client";

import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

/**
 * SplitText: each word is masked, slides up from below. The whole heading
 * uses one IntersectionObserver and natural text flow (no inline-flex),
 * so descenders and natural wrapping are preserved.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  className,
  baseDelay = 0,
  step = 60,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            node.classList.add("is-visible");
            io.unobserve(node);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("split", className)}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="split-word">
            <span
              className="split-inner"
              style={{ transitionDelay: `${baseDelay + i * step}ms` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
