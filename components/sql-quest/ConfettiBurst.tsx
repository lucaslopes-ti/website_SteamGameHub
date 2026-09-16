"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle";
}

const COLORS = [
  "#34d399", // emerald
  "#60a5fa",
  "#f472b6",
  "#fbbf24",
  "#a78bfa",
  "#f87171",
  "#4ade80",
];

const GRAVITY = 0.12;
const DRAG = 0.99;
const DURATION_MS = 2600;

/**
 * Rajada de confete em comemoração a um acerto. Canvas fixo sobre a página
 * (pointer-events-none, não interfere no layout nem na interação). Dispara a
 * partir dos cantos inferiores, respeita `prefers-reduced-motion` e remove a
 * si mesmo do DOM ao terminar.
 */
export default function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const spawn = (originX: number, originY: number, angleBase: number) => {
      for (let i = 0; i < 70; i++) {
        const angle = angleBase + (Math.random() - 0.5) * (Math.PI / 2.5);
        const speed = 9 + Math.random() * 9;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          shape: Math.random() < 0.7 ? "rect" : "circle",
        });
      }
    };
    // Dois canhões nos cantos inferiores, apontando para o centro/topo.
    spawn(0, window.innerHeight, -Math.PI / 3.2);
    spawn(window.innerWidth, window.innerHeight, -Math.PI + Math.PI / 3.2);

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          // Escala vertical oscilando simula o "flip" do papel no ar.
          ctx.fillRect(-p.size / 2, (-p.size / 2) * Math.sin(now / 120 + p.rotation), p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < DURATION_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
    />
  );
}
