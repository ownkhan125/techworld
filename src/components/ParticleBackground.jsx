"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleBackground — Three.js particle field, now rendered as small tech-logo
 * sprites instead of plain dots. All motion parameters from the original
 * implementation are preserved (count, density, xSpeed, ySpeed, wrap, fog,
 * camera, DPR cap, fade-in colour ramp).
 *
 * Each particle is a textured point sprite. The total particle count is
 * partitioned across N logo groups (one THREE.Points per logo, identical
 * animation loop). vertexColors carries the same cyan→violet Y-position
 * ramp so the logos inherit the brand gradient.
 *
 * Pauses when off-screen / tab hidden. Respects prefers-reduced-motion.
 */
export default function ParticleBackground({
  particleCount = 6000,
  className = "",
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const stateRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}

    let three;
    let renderer, scene, camera;
    let groups = []; // [{ points, geometry, material, velocities, count, texture }]
    let visible = true;
    let pageVisible = !document.hidden;

    // ---- same parameters as the original ----
    const xSpeed = 0.0006;
    const ySpeed = 0.0018;
    const DPR_CAP = 1.5;
    const SPRITE_SIZE = 14; // world units (small, particle-like, still readable)

    const setup = async () => {
      three = await import("three");
      if (cancelled) return;

      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      scene = new three.Scene();
      scene.fog = new three.FogExp2("#06070a", 0.0014);

      camera = new three.PerspectiveCamera(72, w / h, 1, 2000);
      camera.position.z = 520;

      renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // ---- build textures + partitioned Points groups ----
      const logos = LOGOS;
      const perGroup = Math.floor(particleCount / logos.length);
      const remainder = particleCount - perGroup * logos.length;

      const cyan = new three.Color("#5ef0e6");
      const violet = new three.Color("#a78bfa");

      for (let g = 0; g < logos.length; g++) {
        const count = perGroup + (g < remainder ? 1 : 0);
        if (count <= 0) continue;

        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          positions[i * 3] = Math.random() * 2000 - 1000;
          positions[i * 3 + 1] = Math.random() * 2000 - 1000;
          positions[i * 3 + 2] = Math.random() * 1600 - 800;

          velocities[i] = Math.random() * 1.5;

          const mix = (positions[i * 3 + 1] + 1000) / 2000;
          const c = cyan.clone().lerp(violet, mix);
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }

        const geometry = new three.BufferGeometry();
        geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new three.BufferAttribute(colors, 3));

        const texture = makeLogoTexture(three, logos[g].draw);
        const material = new three.PointsMaterial({
          size: SPRITE_SIZE,
          map: texture,
          vertexColors: true,
          transparent: true,
          opacity: 0.95,
          blending: three.AdditiveBlending,
          depthWrite: false,
          alphaTest: 0.02,
        });

        const points = new three.Points(geometry, material);
        scene.add(points);
        groups.push({ points, geometry, material, velocities, count, texture });
      }

      stateRef.current = { renderer, scene, groups };

      if (reducedMotion) {
        // single static frame
        for (const g of groups) g.points.rotation.y = 0;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      } else {
        loop();
      }
    };

    const loop = () => {
      if (cancelled) return;
      rafRef.current = requestAnimationFrame(loop);
      if (!visible || !pageVisible) return;

      for (const g of groups) {
        g.points.rotation.y += xSpeed;
        const posAttr = g.points.geometry.attributes.position;
        const vel = g.velocities;
        for (let i = 0; i < g.count; i++) {
          let y = posAttr.getY(i);
          vel[i] += Math.random() * ySpeed;
          y += vel[i];
          if (y > 1000) {
            y = -1000;
            vel[i] = Math.random() * 1.5;
          }
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    const onResize = () => {
      if (!renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const onVis = () => {
      pageVisible = !document.hidden;
    };

    let io;
    const armIO = () => {
      if (typeof IntersectionObserver === "undefined") return;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible = e.isIntersecting;
        },
        { threshold: 0 }
      );
      io.observe(container);
    };

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    setup().then(() => armIO());

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(rafRef.current);
      if (io) io.disconnect();
      const s = stateRef.current;
      if (s) {
        for (const g of s.groups) {
          try { g.geometry.dispose(); } catch {}
          try { g.material.dispose(); } catch {}
          try { g.texture.dispose(); } catch {}
        }
        try { s.renderer.dispose(); } catch {}
        try { container.removeChild(s.renderer.domElement); } catch {}
      }
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={"pointer-events-none fixed inset-0 -z-10 " + className}
    />
  );
}

/* =============================================================================
   makeLogoTexture: draw a logo on a small canvas and wrap it in a THREE texture.
   Each logo is drawn in WHITE so the per-vertex colour ramp (cyan→violet) can
   tint it through AdditiveBlending. A subtle outer glow keeps the sprite
   readable at the small SPRITE_SIZE.
============================================================================ */
function makeLogoTexture(three, drawFn) {
  const SIZE = 64;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, SIZE, SIZE);

  // soft outer glow so sprites read at distance
  ctx.shadowColor = "rgba(255,255,255,0.6)";
  ctx.shadowBlur = 4;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  drawFn(ctx, SIZE);

  const tex = new three.CanvasTexture(canvas);
  tex.colorSpace = three.SRGBColorSpace || three.LinearSRGBColorSpace || undefined;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/* =============================================================================
   LOGOS — small, white, recognizable marks drawn programmatically.
   Each draw(ctx, size) renders on a `size`×`size` canvas at the centre.
   Stroke widths and shapes are tuned to read at SPRITE_SIZE world units.
============================================================================ */
const LOGOS = [
  // Next.js — disc with diagonal N stroke
  {
    name: "next",
    draw: (ctx, s) => {
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2);
      ctx.fill();
      // Knock out N
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = s * 0.09;
      ctx.beginPath();
      ctx.moveTo(s * 0.34, s * 0.70);
      ctx.lineTo(s * 0.34, s * 0.30);
      ctx.lineTo(s * 0.66, s * 0.70);
      ctx.moveTo(s * 0.66, s * 0.30);
      ctx.lineTo(s * 0.66, s * 0.56);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    },
  },
  // React — atom (3 ellipses + center dot)
  {
    name: "react",
    draw: (ctx, s) => {
      ctx.lineWidth = s * 0.045;
      const cx = s / 2;
      const cy = s / 2;
      const rx = s * 0.42;
      const ry = s * 0.16;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  // Python — two overlapping rounded squares (snake silhouette)
  {
    name: "python",
    draw: (ctx, s) => {
      const r = s * 0.12;
      // top snake
      roundedRect(ctx, s * 0.22, s * 0.16, s * 0.38, s * 0.34, r);
      ctx.fill();
      // eye dot
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(s * 0.33, s * 0.27, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // bottom snake (offset)
      roundedRect(ctx, s * 0.40, s * 0.50, s * 0.38, s * 0.34, r);
      ctx.fill();
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(s * 0.67, s * 0.73, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
  },
  // JavaScript — rounded square with JS bottom-right
  {
    name: "js",
    draw: (ctx, s) => {
      roundedRect(ctx, s * 0.16, s * 0.16, s * 0.68, s * 0.68, s * 0.10);
      ctx.fill();
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = s * 0.06;
      // J
      ctx.beginPath();
      ctx.moveTo(s * 0.50, s * 0.42);
      ctx.lineTo(s * 0.50, s * 0.66);
      ctx.arc(s * 0.42, s * 0.66, s * 0.08, 0, Math.PI, false);
      ctx.stroke();
      // S
      ctx.beginPath();
      ctx.moveTo(s * 0.72, s * 0.46);
      ctx.bezierCurveTo(s * 0.58, s * 0.42, s * 0.58, s * 0.58, s * 0.72, s * 0.58);
      ctx.bezierCurveTo(s * 0.84, s * 0.58, s * 0.84, s * 0.72, s * 0.72, s * 0.72);
      ctx.stroke();
      ctx.restore();
    },
  },
  // Node.js — hexagon outline
  {
    name: "node",
    draw: (ctx, s) => {
      ctx.lineWidth = s * 0.06;
      const cx = s / 2;
      const cy = s / 2;
      const r = s * 0.40;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    },
  },
  // Tailwind — two overlapping wave curves
  {
    name: "tailwind",
    draw: (ctx, s) => {
      ctx.lineWidth = s * 0.08;
      drawWave(ctx, s, s * 0.12, s * 0.36);
      drawWave(ctx, s, s * 0.12, s * 0.62);
    },
  },
  // Docker — 3 small stacked containers + 1 on top
  {
    name: "docker",
    draw: (ctx, s) => {
      const w = s * 0.16;
      const h = s * 0.14;
      const gap = s * 0.04;
      const baseY = s * 0.60;
      for (let c = 0; c < 4; c++) {
        roundedRect(ctx, s * 0.18 + c * (w + gap * 0.5), baseY, w, h, 2);
        ctx.fill();
      }
      // top one
      roundedRect(ctx, s * 0.18 + (w + gap * 0.5), baseY - h - gap * 0.5, w, h, 2);
      ctx.fill();
    },
  },
  // Git — branching tree (3 dots connected by curves)
  {
    name: "git",
    draw: (ctx, s) => {
      ctx.lineWidth = s * 0.06;
      // trunk
      ctx.beginPath();
      ctx.moveTo(s * 0.30, s * 0.18);
      ctx.lineTo(s * 0.30, s * 0.82);
      ctx.stroke();
      // branch curve
      ctx.beginPath();
      ctx.moveTo(s * 0.30, s * 0.50);
      ctx.quadraticCurveTo(s * 0.55, s * 0.42, s * 0.70, s * 0.30);
      ctx.stroke();
      // dots
      for (const [x, y] of [[0.30, 0.20], [0.30, 0.82], [0.70, 0.28]]) {
        ctx.beginPath();
        ctx.arc(s * x, s * y, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  // MongoDB — leaf with vertical vein
  {
    name: "mongodb",
    draw: (ctx, s) => {
      const cx = s / 2;
      ctx.beginPath();
      ctx.moveTo(cx, s * 0.12);
      ctx.bezierCurveTo(s * 0.85, s * 0.40, s * 0.75, s * 0.78, cx, s * 0.88);
      ctx.bezierCurveTo(s * 0.25, s * 0.78, s * 0.15, s * 0.40, cx, s * 0.12);
      ctx.fill();
      // vein darker
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.moveTo(cx, s * 0.20);
      ctx.lineTo(cx, s * 0.86);
      ctx.stroke();
      ctx.restore();
    },
  },
  // PostgreSQL — elephant-ish "P" with cap
  {
    name: "postgres",
    draw: (ctx, s) => {
      ctx.lineWidth = s * 0.07;
      // P bowl
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.36, s * 0.20, Math.PI * 1.5, Math.PI * 0.5);
      ctx.stroke();
      // P stem
      ctx.beginPath();
      ctx.moveTo(s * 0.30, s * 0.20);
      ctx.lineTo(s * 0.30, s * 0.84);
      ctx.stroke();
      // trunk curve
      ctx.beginPath();
      ctx.moveTo(s * 0.50, s * 0.56);
      ctx.quadraticCurveTo(s * 0.72, s * 0.70, s * 0.66, s * 0.84);
      ctx.stroke();
    },
  },
  // Vercel — equilateral triangle
  {
    name: "vercel",
    draw: (ctx, s) => {
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.18);
      ctx.lineTo(s * 0.86, s * 0.80);
      ctx.lineTo(s * 0.14, s * 0.80);
      ctx.closePath();
      ctx.fill();
    },
  },
  // Bonus — small geometric "spark" for variety (keeps the field feeling like particles even when logos are dense)
  {
    name: "spark",
    draw: (ctx, s) => {
      const cx = s / 2;
      const cy = s / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = s * 0.04;
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 2);
        ctx.beginPath();
        ctx.moveTo(0, s * 0.16);
        ctx.lineTo(0, s * 0.32);
        ctx.stroke();
        ctx.restore();
      }
    },
  },
];

/* ---- canvas helpers ---- */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWave(ctx, s, amp, yCenter) {
  ctx.beginPath();
  const start = s * 0.12;
  const end = s * 0.88;
  ctx.moveTo(start, yCenter);
  ctx.bezierCurveTo(
    s * 0.30, yCenter - amp,
    s * 0.45, yCenter + amp,
    s * 0.55, yCenter
  );
  ctx.bezierCurveTo(
    s * 0.65, yCenter - amp,
    s * 0.80, yCenter + amp,
    end, yCenter
  );
  ctx.stroke();
}
