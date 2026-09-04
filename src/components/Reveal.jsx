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
    // Snapshot the current viewport-intersection so a node that mounts
    // already in view (client-side navigation → new page's above-the-fold
    // Reveals land inside the viewport without any scroll event) still
    // gets .is-visible immediately. Without this, the IntersectionObserver
    // only fires on state *changes*, so a static-in-view Reveal would sit
    // at opacity:0 forever until the user scrolled.
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const alreadyVisible =
      rect.top < vh * (1 - Math.max(0, Math.min(0.5, threshold))) &&
      rect.bottom > 0;
    if (alreadyVisible) {
      if (delay) {
        setTimeout(() => node.classList.add("is-visible"), delay);
      } else {
        node.classList.add("is-visible");
      }
      if (once) return;
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
