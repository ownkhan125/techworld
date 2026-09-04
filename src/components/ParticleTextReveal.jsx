"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/utils/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ParticleTextReveal — canvas-driven particle transition for headline text.
 *
 * Rasterizes the given text off-screen, samples opaque pixels as particle
 * target coordinates, and gives each particle a random dispersed origin.
 * A single scrub-tied ScrollTrigger drives progress 0 → 1 (dispersed →
 * formed) as the element scrolls through the trigger band. Scrolling back
 * up reverses the progress and the text dissolves into particles again.
 *
 * Only one rAF loop runs while the element is on screen (paused by the
 * IntersectionObserver) so background sections stay cheap.
 *
 * Sits alongside the existing GSAP pipeline — uses its own trigger, does
 * not touch any element outside its own canvas.
 *
 * Reduced-motion: renders formed text immediately, skips animation.
 */
export default function ParticleTextReveal({
  text,
  as: Tag = "div",
  className,
  fontSize,          // px. If omitted, auto from container width * ratio.
  fontSizeRatio = 0.11,
  minFontSize = 32,
  maxFontSize = 120,
  fontWeight = 600,
  lineHeight = 1.06,
  letterSpacing = -0.025,
  color = "#f5f7fb",
  density = 4,       // sample every N device px
  particleSize = 1.5,
  align = "center",
  start = "top 85%",
  end = "top 40%",
  scrub = 0.7,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const stateRef = useRef({ particles: null, width: 0, height: 0, dpr: 1, ctx: null });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    let onScreen = true;
    let st;

    const build = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      // Pick font size: explicit prop, else derive from width so hero-tier
      // text scales gracefully at every viewport.
      const fontPx = clamp(
        fontSize ?? Math.round(width * fontSizeRatio),
        minFontSize,
        maxFontSize
      );

      const fontFamily = '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif';
      const fontSpec = `${fontWeight} ${fontPx}px ${fontFamily}`;

      // Wrap text to fit width.
      const measure = document.createElement("canvas").getContext("2d");
      measure.font = fontSpec;
      measure.textBaseline = "top";
      const words = text.split(" ");
      const lines = [];
      let cur = "";
      for (const w of words) {
        const test = cur ? cur + " " + w : w;
        if (measure.measureText(test).width <= width) {
          cur = test;
        } else {
          if (cur) lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);

      const lineHeightPx = fontPx * lineHeight;
      // extra descender room so 'g','y','p' don't clip
      const pad = Math.ceil(fontPx * 0.25);
      const height = Math.ceil(lineHeightPx * lines.length + pad);

      // Off-screen sampling canvas at device pixel ratio. willReadFrequently
      // hints the browser to keep the backing store in CPU memory so the
      // single getImageData() below doesn't stall the GPU pipeline.
      const off = document.createElement("canvas");
      off.width = width * dpr;
      off.height = height * dpr;
      const octx = off.getContext("2d", { willReadFrequently: true });
      octx.scale(dpr, dpr);
      octx.font = fontSpec;
      octx.fillStyle = "#ffffff";
      octx.textBaseline = "top";
      octx.textAlign = align;

      const xAnchor = align === "center" ? width / 2 : align === "right" ? width : 0;
      lines.forEach((ln, i) => {
        // manual letter-spacing so all browsers render identically
        drawTextWithSpacing(octx, ln, xAnchor, i * lineHeightPx, fontPx * letterSpacing, align);
      });

      const img = octx.getImageData(0, 0, off.width, off.height).data;

      // Cap the particle count so mobile stays smooth. Compute an
      // effective step that keeps us near a target.
      const targetParticles = width < 480 ? 1400 : width < 900 ? 2400 : 3600;
      let step = Math.max(1, density) * dpr;
      const targets = [];
      // Two-pass: sample, then if too many, resample with wider step.
      const sample = (s) => {
        const out = [];
        for (let y = 0; y < off.height; y += s) {
          for (let x = 0; x < off.width; x += s) {
            const idx = (y * off.width + x) * 4;
            if (img[idx + 3] > 128) out.push({ tx: x / dpr, ty: y / dpr });
          }
        }
        return out;
      };
      let sampled = sample(step);
      while (sampled.length > targetParticles * 1.3 && step < 20) {
        step += dpr;
        sampled = sample(step);
      }
      targets.push(...sampled);

      // Canvas display size — match measured height
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particles = new Array(targets.length);
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        // Origins scattered up + out for a "particles descend into text" feel
        const side = Math.random() < 0.5 ? -1 : 1;
        const dx = (Math.random() - 0.5) * width * 1.4 + side * width * 0.15;
        const dy = -height * (0.8 + Math.random() * 1.8);
        particles[i] = {
          tx: t.tx,
          ty: t.ty,
          ox: t.tx + dx,
          oy: t.ty + dy,
          // slight per-particle timing offset so words don't all resolve at once
          bias: Math.random() * 0.35,
        };
      }

      stateRef.current = { particles, width, height, dpr, ctx };
    };

    const render = () => {
      const { particles, width, height, ctx } = stateRef.current;
      if (!ctx || !particles) return;
      const p = progressRef.current;
      ctx.clearRect(0, 0, width, height);
      const globalAlpha = clamp(p * 1.2, 0, 1);
      const rgb = hexToRgb(color);
      const size = particleSize;
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        // per-particle progress: starts at pt.bias, finishes by p=1
        const local = clamp((p - pt.bias) / (1 - pt.bias || 1), 0, 1);
        const e = easeOutCubic(local);
        const x = pt.ox + (pt.tx - pt.ox) * e;
        const y = pt.oy + (pt.ty - pt.oy) * e;
        const a = Math.min(1, e * 1.4) * globalAlpha;
        if (a <= 0.02) continue;
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    const scheduleRender = () => {
      if (!running) return;
      raf = requestAnimationFrame(() => {
        if (onScreen) render();
        scheduleRender();
      });
    };

    const setup = () => {
      build();
      render();
      ScrollTrigger.refresh();
    };

    // Wait for fonts so the raster matches the visible fallback text.
    if (document.fonts?.ready) {
      document.fonts.ready.then(setup).catch(setup);
    } else {
      setup();
    }

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setup();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    // Pause rAF when off-screen so background sections don't burn CPU.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { onScreen = e.isIntersecting; });
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(root);

    if (prefersReduced) {
      progressRef.current = 1;
      // Draw once formed and stop.
      requestAnimationFrame(() => render());
      return () => {
        running = false;
        window.removeEventListener("resize", onResize);
        io.disconnect();
      };
    }

    st = ScrollTrigger.create({
      trigger: root,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    scheduleRender();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      st?.kill();
    };
  }, [
    text, fontSize, fontSizeRatio, minFontSize, maxFontSize, fontWeight,
    lineHeight, letterSpacing, color, density, particleSize, align, start, end, scrub,
  ]);

  return (
    <Tag ref={rootRef} className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%" }}
      />
      {/* Screen-reader-only fallback so headings stay accessible. */}
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {text}
      </span>
    </Tag>
  );
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}
function easeOutCubic(t) {
  const x = clamp(t, 0, 1);
  return 1 - Math.pow(1 - x, 3);
}
function hexToRgb(hex) {
  if (typeof hex !== "string") return { r: 245, g: 247, b: 251 };
  const m = hex.replace("#", "");
  if (m.length === 3) {
    return { r: parseInt(m[0] + m[0], 16), g: parseInt(m[1] + m[1], 16), b: parseInt(m[2] + m[2], 16) };
  }
  if (m.length === 6) {
    return { r: parseInt(m.slice(0, 2), 16), g: parseInt(m.slice(2, 4), 16), b: parseInt(m.slice(4, 6), 16) };
  }
  return { r: 245, g: 247, b: 251 };
}

// draws a string with per-char x-advance for consistent letter-spacing
function drawTextWithSpacing(ctx, str, x, y, spacing, align) {
  if (!spacing) {
    ctx.fillText(str, x, y);
    return;
  }
  const widths = [];
  let total = 0;
  for (const ch of str) {
    const w = ctx.measureText(ch).width;
    widths.push(w);
    total += w;
  }
  const totalWithSpacing = total + spacing * Math.max(0, str.length - 1);
  let dx = align === "center" ? x - totalWithSpacing / 2
         : align === "right" ? x - totalWithSpacing
         : x;
  let i = 0;
  for (const ch of str) {
    // draw left-aligned per glyph
    const prev = ctx.textAlign;
    ctx.textAlign = "left";
    ctx.fillText(ch, dx, y);
    ctx.textAlign = prev;
    dx += widths[i] + spacing;
    i++;
  }
}
