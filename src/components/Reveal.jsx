"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

export default function Reveal({
  as: Tag = "div",
  className,
  stagger = false,
  split = false,
  threshold = 0.18,
  once = true,
  delay = 0,
  children,
  ...rest
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay) {
              setTimeout(() => node.classList.add("is-visible"), delay);
            } else {
              node.classList.add("is-visible");
            }
            if (once) io.unobserve(node);
          } else if (!once) {
            node.classList.remove("is-visible");
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, once, delay]);

  const cls = cn(
    split ? "split-line" : stagger ? "reveal-stagger" : "reveal",
    className
  );

  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}
