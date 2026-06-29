"use client";

import { useRef } from "react";
import { cn } from "@/utils/cn";

export default function TiltCard({ children, className, intensity = 6, glare = true }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);

  const onMove = (e) => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -intensity;
    const ry = (px - 0.5) * intensity;
    inner.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(400px circle at ${px * 100}% ${
        py * 100
      }%, rgba(255,255,255,0.12), transparent 50%)`;
    }
  };

  const onLeave = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    }
    if (glareRef.current) glareRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("group", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {children}
        {glare ? (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}
      </div>
    </div>
  );
}
