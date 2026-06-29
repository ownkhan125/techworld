"use client";

import { useRef } from "react";
import { cn } from "@/utils/cn";

export default function MagneticButton({
  children,
  className,
  strength = 18,
  as = "button",
  ...rest
}) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${(x / r.width) * strength}px, ${
      (y / r.height) * strength
    }px, 0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
  };

  const Tag = as;
  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("transition-transform duration-300 ease-out will-change-transform", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
