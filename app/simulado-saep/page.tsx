"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getRanking, getUserAttempts } from "@/lib/firebase/simulado";
import type { RankingEntry, SAEPAttempt } from "@/lib/firebase/simulado";
import { useRouter } from "next/navigation";

// CSS Injection
const lumenStyles = `
/* ─── TOKENS ─── */
.lumen-theme {
	--bg: #060608;
	--bg2: #0d0d12;
	--bg3: #12121a;
	--border: rgba(255, 255, 255, 0.06);
	--text: #d4cfc8;
	--text-dim: #6b6870;
	--amber: #f5c97a;
	--amber-dim: #a8823a;
	--amber-glow: rgba(245, 201, 122, 0.15);
	--lavender: #b8a8d4;
	--warm: #f0e8d8;
	--radius: 4px;

	background: var(--bg);
	color: var(--text);
	font-family: "DM Mono", monospace;
	font-weight: 300;
	overflow-x: hidden;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.lumen-theme *,
.lumen-theme *::before,
.lumen-theme *::after {
	box-sizing: border-box;
}

/* ─── NOISE GRAIN ─── */
.lumen-theme::after {
	content: "";
	position: absolute;
	inset: 0;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
	pointer-events: none;
	z-index: 9999;
	opacity: 0.5;
}

/* ─── CUSTOM CURSOR ─── */
.lumen-theme {
	cursor: none;
}
.lumen-theme a, .lumen-theme button {
  cursor: none;
}
.lumen-theme .cur {
	position: fixed;
	width: 6px;
	height: 6px;
	background: var(--amber);
	border-radius: 50%;
	pointer-events: none;
	z-index: 10000;
	transform: translate(-50%, -50%);
	transition: width 0.15s, height 0.15s, background 0.15s;
}
.lumen-theme .cur-ring {
	position: fixed;
	width: 28px;
	height: 28px;
	border: 1px solid var(--amber);
	border-radius: 50%;
	pointer-events: none;
	z-index: 9999;
	transform: translate(-50%, -50%);
	transition: width 0.25s, height 0.25s, opacity 0.25s, border-color 0.25s;
	opacity: 0.35;
}
.lumen-theme:has(a:hover, button:hover) .cur {
	width: 10px;
	height: 10px;
	background: var(--amber);
}
.lumen-theme:has(a:hover, button:hover) .cur-ring {
	width: 44px;
	height: 44px;
	opacity: 0.6;
}

/* ─── HERO ─── */
.lumen-theme .hero {
	min-height: 90vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 120px 24px 80px;
	position: relative;
	overflow: hidden;
}

.lumen-theme .hero-glow {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -55%);
	width: 700px;
	height: 700px;
	background: radial-gradient(
		ellipse at center,
		rgba(245, 201, 122, 0.18) 0%,
		rgba(240, 180, 80, 0.06) 35%,
		transparent 70%
	);
	border-radius: 50%;
	pointer-events: none;
	z-index: 1;
	animation: pulse-glow 4s ease-in-out infinite alternate;
}
@keyframes pulse-glow {
	from { opacity: 0.7; transform: translate(-50%, -55%) scale(1); }
	to { opacity: 1; transform: translate(-50%, -55%) scale(1.08); }
}

.lumen-theme .hero-ring {
	position: absolute;
	top: 60%;
	left: 50%;
	width: 340px;
	height: 340px;
	border: 1px solid rgba(245, 201, 122, 0.1);
	border-radius: 50%;
	transform: translate(-50%, -50%);
	animation: rotate-ring 30s linear infinite;
	pointer-events: none;
	z-index: 1;
}
.lumen-theme .hero-ring::after {
	content: "";
	position: absolute;
	top: -4px;
	left: 50%;
	width: 8px;
	height: 8px;
	background: var(--amber);
	border-radius: 50%;
	transform: translateX(-50%);
}
.lumen-theme .hero-ring-2 {
	position: absolute;
	top: 60%;
	left: 50%;
	width: 520px;
	height: 520px;
	border: 1px dashed rgba(245, 201, 122, 0.05);
	border-radius: 50%;
	transform: translate(-50%, -50%);
	animation: rotate-ring 60s linear infinite reverse;
	pointer-events: none;
	z-index: 1;
}
@keyframes rotate-ring {
	to { transform: translate(-50%, -50%) rotate(360deg); }
}

.lumen-theme .particles {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
}
.lumen-theme .particle {
	position: absolute;
	width: 2px;
	height: 2px;
	background: var(--amber);
	border-radius: 50%;
	opacity: 0;
	animation: float-particle linear infinite;
}
@keyframes float-particle {
	0% { opacity: 0; transform: translateY(0) scale(0); }
	10% { opacity: 0.6; transform: translateY(-10px) scale(1); }
	90% { opacity: 0.3; }
	100% { opacity: 0; transform: translateY(-200px) scale(0.5); }
}

.lumen-theme .eyebrow {
	font-size: 11px;
	letter-spacing: 0.25em;
	text-transform: uppercase;
	color: var(--amber);
	margin-bottom: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14px;
	position: relative;
	z-index: 2;
	opacity: 0;
	animation: fade-up 0.8s 0.2s forwards;
}
.lumen-theme .eyebrow::before,
.lumen-theme .eyebrow::after {
	content: "";
	width: 28px;
	height: 1px;
	background: var(--amber-dim);
}

.lumen-theme h1 {
	font-family: "Cormorant Garamond", serif;
	font-size: clamp(56px, 8vw, 130px);
	font-weight: 300;
	line-height: 0.92;
	color: var(--warm);
	letter-spacing: -0.02em;
	margin-bottom: 28px;
	position: relative;
	z-index: 2;
	opacity: 0;
	animation: fade-up 0.9s 0.35s forwards;
}
.lumen-theme h1 em {
	font-style: italic;
	color: var(--amber);
}

.lumen-theme p.hero-p {
	max-width: 480px;
	font-size: 15px;
	line-height: 1.7;
	color: var(--text-dim);
	margin: 0 auto 48px;
	position: relative;
	z-index: 2;
	opacity: 0;
	animation: fade-up 0.9s 0.5s forwards;
}

.lumen-theme .signup {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	width: 100%;
	max-width: 440px;
	margin: 0 auto;
	position: relative;
	z-index: 2;
	opacity: 0;
	animation: fade-up 0.9s 0.65s forwards;
}

.lumen-theme .signup button {
	padding: 16px 40px;
	background: var(--amber);
	border: 1px solid var(--amber);
	color: var(--bg);
	font-family: "DM Mono", monospace;
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	cursor: none;
	border-radius: var(--radius);
	white-space: nowrap;
	transition: background 0.2s, opacity 0.2s;
  width: 100%;
}
.lumen-theme .signup button:hover {
	background: #ffd98a;
	border-color: #ffd98a;
}
.lumen-theme .email-note {
	font-size: 11px;
	color: var(--text-dim);
	letter-spacing: 0.06em;
}

.lumen-theme .scroll-hint {
	position: absolute;
	bottom: 36px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	color: var(--text-dim);
	font-size: 10px;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	opacity: 0;
	animation: fade-up 0.6s 1.2s forwards;
	z-index: 2;
}
.lumen-theme .scroll-line {
	width: 1px;
	height: 48px;
	background: linear-gradient(to bottom, var(--amber-dim), transparent);
	animation: scroll-line 2s ease-in-out infinite;
}
@keyframes scroll-line {
	0%, 100% { opacity: 0.4; transform: scaleY(1); }
	50% { opacity: 1; transform: scaleY(0.6); }
}

/* ─── MARQUEE STRIP ─── */
.lumen-theme .marquee-strip {
	overflow: hidden;
	border-top: 1px solid var(--border);
	border-bottom: 1px solid var(--border);
	padding: 14px 0;
	background: var(--bg2);
  position: relative;
  z-index: 2;
}
.lumen-theme .marquee-inner {
	display: flex;
	gap: 0;
	white-space: nowrap;
	animation: marquee 22s linear infinite;
}
.lumen-theme .marquee-inner span {
	font-size: 11px;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--text-dim);
	padding: 0 40px;
}
.lumen-theme .marquee-inner span.accent {
	color: var(--amber);
}
@keyframes marquee {
	to { transform: translateX(-50%); }
}

/* ─── SECTION COMMONS ─── */
.lumen-theme .lumen-section {
	padding: 120px 24px;
  position: relative;
  z-index: 2;
}
.lumen-theme .lumen-container {
	max-width: 1100px;
	margin: 0 auto;
}
.lumen-theme .section-label {
	font-size: 10px;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: var(--amber);
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	gap: 12px;
}
.lumen-theme .section-label::before {
	content: "";
	width: 20px;
	height: 1px;
	background: var(--amber-dim);
}
.lumen-theme .section-title {
	font-family: "Cormorant Garamond", serif;
	font-size: clamp(36px, 5vw, 68px);
	font-weight: 300;
	line-height: 1;
	letter-spacing: -0.01em;
	color: var(--warm);
	margin-bottom: 64px;
}
.lumen-theme .section-title em {
	font-style: italic;
	color: var(--amber);
}

/* ─── REVEAL ANIMATIONS ─── */
.lumen-theme .reveal {
	opacity: 0;
	transform: translateY(32px);
	transition: opacity 0.7s, transform 0.7s;
}
.lumen-theme .reveal.visible {
	opacity: 1;
	transform: translateY(0);
}
.lumen-theme .reveal-left {
	opacity: 0;
	transform: translateX(-32px);
	transition: opacity 0.7s, transform 0.7s;
}
.lumen-theme .reveal-left.visible {
	opacity: 1;
	transform: translateX(0);
}
@keyframes fade-up {
	from { opacity: 0; transform: translateY(20px); }
	to { opacity: 1; transform: translateY(0); }
}

/* ─── PREVIEW GRID (Atmosphere / Features) ─── */
.lumen-theme .preview-section {
	background: var(--bg2);
	overflow: hidden;
}
.lumen-theme .preview-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2px;
	border: 1px solid var(--border);
}
.lumen-theme .preview-card {
	padding: 48px;
	background: var(--bg3);
	border-right: 1px solid var(--border);
	position: relative;
	overflow: hidden;
}
.lumen-theme .preview-card:last-child {
	border-right: none;
}
.lumen-theme .preview-card::before {
	content: "";
	position: absolute;
	inset: 0;
	background: radial-gradient(ellipse at 20% 20%, var(--amber-glow), transparent 60%);
	opacity: 0;
	transition: opacity 0.4s;
}
.lumen-theme .preview-card:hover::before {
	opacity: 1;
}
.lumen-theme .preview-num {
	font-size: 10px;
	letter-spacing: 0.2em;
	color: var(--text-dim);
	margin-bottom: 32px;
	font-family: "DM Mono", monospace;
}
.lumen-theme .preview-card h3 {
	font-family: "Cormorant Garamond", serif;
	font-size: 28px;
	font-weight: 300;
	color: var(--warm);
	margin-bottom: 12px;
	letter-spacing: 0.02em;
}
.lumen-theme .preview-card p {
	font-size: 13px;
	line-height: 1.7;
	color: var(--text-dim);
}

/* ─── TIMELINE / HOW IT WORKS ─── */
.lumen-theme .how-section {
	background: var(--bg);
}
.lumen-theme .timeline {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0;
	border: 1px solid var(--border);
	margin-top: 0;
}
.lumen-theme .timeline-step {
	padding: 40px 32px;
	border-right: 1px solid var(--border);
	position: relative;
	transition: background 0.3s;
}
.lumen-theme .timeline-step:last-child {
	border-right: none;
}
.lumen-theme .timeline-step:hover {
	background: rgba(245, 201, 122, 0.02);
}
.lumen-theme .step-num {
	font-size: 10px;
	letter-spacing: 0.2em;
	color: var(--amber);
	margin-bottom: 20px;
	font-family: "DM Mono", monospace;
}
.lumen-theme .timeline-step h3 {
	font-family: "Cormorant Garamond", serif;
	font-size: 22px;
	font-weight: 300;
	color: var(--warm);
	margin-bottom: 10px;
}
.lumen-theme .timeline-step p {
	font-size: 12px;
	line-height: 1.7;
	color: var(--text-dim);
}
.lumen-theme .step-line {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 2px;
	background: transparent;
	overflow: hidden;
}
.lumen-theme .step-line::after {
	content: "";
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, var(--amber), transparent);
	animation: slide-line 3s linear infinite;
}
@keyframes slide-line { to { left: 100%; } }
.lumen-theme .timeline-step:nth-child(2) .step-line::after { animation-delay: -0.75s; }
.lumen-theme .timeline-step:nth-child(3) .step-line::after { animation-delay: -1.5s; }
.lumen-theme .timeline-step:nth-child(4) .step-line::after { animation-delay: -2.25s; }

/* ─── RANKING TABLE (Custom for SAEP) ─── */
.lumen-theme .ranking-section {
  background: var(--bg2);
}
.lumen-theme .ranking-container {
  border: 1px solid var(--border);
  background: var(--bg3);
  overflow: hidden;
}
.lumen-theme .ranking-row {
  display: flex;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid var(--border);
  transition: background 0.3s;
}
.lumen-theme .ranking-row:last-child {
  border-bottom: none;
}
.lumen-theme .ranking-row:hover {
  background: rgba(245, 201, 122, 0.03);
}
.lumen-theme .ranking-pos {
  width: 40px;
  font-family: "Cormorant Garamond", serif;
  font-size: 24px;
  color: var(--amber-dim);
}
.lumen-theme .ranking-row.pos-1 .ranking-pos { color: var(--amber); font-size: 32px; }
.lumen-theme .ranking-row.pos-2 .ranking-pos { color: #d4cfc8; }
.lumen-theme .ranking-row.pos-3 .ranking-pos { color: #b8860b; }

.lumen-theme .ranking-info {
  flex: 1;
}
.lumen-theme .ranking-name {
  font-family: "DM Mono", monospace;
  font-size: 15px;
  color: var(--warm);
  margin-bottom: 4px;
}
.lumen-theme .ranking-meta {
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.lumen-theme .ranking-score {
  font-family: "Cormorant Garamond", serif;
  font-size: 36px;
  color: var(--amber);
  text-align: right;
  line-height: 1;
}
.lumen-theme .ranking-score-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-align: right;
  margin-top: 4px;
}

/* ─── RESPONSIVE ─── */
@media (max-width: 900px) {
	.lumen-theme .lumen-section { padding: 80px 20px; }
	.lumen-theme .hero { padding: 140px 20px 80px; }
	.lumen-theme .hero-glow { width: 400px; height: 400px; }
	.lumen-theme .hero-ring { width: 280px; height: 280px; }
	.lumen-theme .hero-ring-2 { width: 420px; height: 420px; }
	.lumen-theme .preview-grid { grid-template-columns: 1fr; }
	.lumen-theme .preview-card { border-right: none; border-bottom: 1px solid var(--border); }
	.lumen-theme .preview-card:last-child { border-bottom: none; }
	.lumen-theme .timeline { grid-template-columns: 1fr 1fr; }
	.lumen-theme .timeline-step:nth-child(2n) { border-right: none; }
	.lumen-theme .timeline-step { border-bottom: 1px solid var(--border); }
}
@media (max-width: 560px) {
	.lumen-theme h1 { font-size: clamp(44px, 12vw, 72px); }
	.lumen-theme .timeline { grid-template-columns: 1fr; }
	.lumen-theme .timeline-step { border-right: none; }
	.lumen-theme .preview-card { padding: 32px 24px; }
  .lumen-theme .ranking-row { flex-direction: column; align-items: flex-start; gap: 16px; padding: 24px; }
  .lumen-theme .ranking-score-group { align-self: flex-start; }
  .lumen-theme .ranking-score { text-align: left; }
  .lumen-theme .ranking-score-label { text-align: left; }
}
`;

export default function SimuladoSAEPLumenPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  // Load Ranking
  useEffect(() => {
    async function loadRanking() {
      try {
        const data = await getRanking();
        setRanking(data);
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
      } finally {
        setLoadingRanking(false);
      }
    }
    loadRanking();
  }, []);

  // Cursor Animation & Parallax
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = cursorRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!cur || !ring) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";

      if (glow) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        glow.style.transform = `translate(calc(-50% + ${x}px), calc(-55% + ${y}px))`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Particles generator
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; dur: number; del: number }>>([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        top: 60 + Math.random() * 40,
        dur: 4 + Math.random() * 8,
        del: Math.random() * 6,
      });
    }
    setParticles(arr);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 60);
          }
        });
      },
      { threshold: 0.08 }
    );
    const elements = document.querySelectorAll(".reveal, .reveal-left");
    elements.forEach((el) => obs.observe(el));
    return () => elements.forEach((el) => obs.unobserve(el));
  }, [loadingRanking]); // Re-run when ranking loads

  const handleStart = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/simulado-saep/play");
    } else {
      router.push("/simulado-saep/play");
    }
  };

  return (
    <>
      {/* Import Google Fonts for this page only */}
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');` }} />
      <style dangerouslySetInnerHTML={{ __html: lumenStyles }} />

      <div className="lumen-theme">
        {/* Custom Cursor */}
        <div ref={cursorRef} className="cur" />
        <div ref={ringRef} className="cur-ring" />

        {/* ─── HERO ─── */}
        <main className="hero">
          <div className="particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.del}s`,
                }}
              />
            ))}
          </div>
          <div ref={glowRef} className="hero-glow" />
          <div className="hero-ring" />
          <div className="hero-ring-2" />

          <div className="eyebrow">Preparatório Oficial 2026</div>

          <h1>
            O Simulado que você<br />
            <em>Precisa</em>
          </h1>

          <p className="hero-p">
            Teste seus conhecimentos de forma inteligente. Um banco de questões dinâmico que avalia seu nível real, adaptado ao modelo do Sistema de Avaliação da Educação Profissional.
          </p>

          <div className="signup">
            <button onClick={handleStart}>
              {authLoading ? "Carregando..." : isAuthenticated ? "Iniciar Simulado Agora" : "Fazer Login para Iniciar"}
            </button>
            <p className="email-note">Suas notas acumulam no ranking geral a cada tentativa.</p>
          </div>

          <div className="scroll-hint">
            <div className="scroll-line" />
            <span>Scroll</span>
          </div>
        </main>

        {/* ─── MARQUEE ─── */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-inner">
            <span>Questões Aleatórias</span><span className="accent">◆</span>
            <span>Ranking Somatório</span><span className="accent">◆</span>
            <span>Sem Limite de Tempo</span><span className="accent">◆</span>
            <span>Avaliação Real</span><span className="accent">◆</span>
            <span>Feedback Imediato</span><span className="accent">◆</span>
            <span>Preparação SAEP</span><span className="accent">◆</span>
            {/* Duplicate for seamless loop */}
            <span>Questões Aleatórias</span><span className="accent">◆</span>
            <span>Ranking Somatório</span><span className="accent">◆</span>
            <span>Sem Limite de Tempo</span><span className="accent">◆</span>
            <span>Avaliação Real</span><span className="accent">◆</span>
            <span>Feedback Imediato</span><span className="accent">◆</span>
            <span>Preparação SAEP</span><span className="accent">◆</span>
          </div>
        </div>

        {/* ─── PRODUCT CARDS (Features) ─── */}
        <section className="lumen-section preview-section" id="features">
          <div className="lumen-container">
            <div className="section-label reveal">01 — O Sistema</div>
            <h2 className="section-title reveal">
              Feito para avaliar<br /><em>precisamente.</em>
            </h2>
            <div className="preview-grid">
              <div className="preview-card reveal">
                <div className="preview-num">01</div>
                <h3>Banco Dinâmico</h3>
                <p>
                  A cada nova tentativa, o sistema sorteia 20 questões exclusivas utilizando o algoritmo Fisher-Yates, garantindo que você nunca faça o mesmo simulado duas vezes.
                </p>
              </div>
              <div className="preview-card reveal" style={{ transitionDelay: ".15s" }}>
                <div className="preview-num">02</div>
                <h3>Ranking Acumulativo</h3>
                <p>
                  Sua dedicação é recompensada. Em vez de registrar apenas a sua maior nota, o sistema soma os seus acertos de todas as tentativas, valorizando o esforço contínuo.
                </p>
              </div>
              <div className="preview-card reveal" style={{ transitionDelay: ".3s" }}>
                <div className="preview-num">03</div>
                <h3>Ritmo Pessoal</h3>
                <p>
                  Sem limite de tempo forçado. O SAEP avalia o seu conhecimento, não a sua velocidade. Faça o simulado no seu ritmo, reflita sobre as questões e aprenda com o processo.
                </p>
              </div>
              <div className="preview-card reveal" style={{ transitionDelay: ".1s" }}>
                <div className="preview-num">04</div>
                <h3>Revisão Completa</h3>
                <p>
                  Ao finalizar, você recebe um relatório detalhado de desempenho, mostrando exatamente o que você acertou, o que errou e o gabarito oficial de cada questão.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="lumen-section how-section" id="how">
          <div className="lumen-container">
            <div className="section-label reveal">02 — O Processo</div>
            <h2 className="section-title reveal">
              Comece em <em>um minuto</em>,<br />
              domine em sete dias.
            </h2>

            <div className="timeline">
              <div className="timeline-step reveal" style={{ transitionDelay: ".0s" }}>
                <div className="step-line" />
                <div className="step-num">Passo 01</div>
                <h3>Identifique-se</h3>
                <p>
                  Faça login usando sua conta do SENAI. Seu progresso será salvo automaticamente de forma segura no banco de dados.
                </p>
              </div>
              <div className="timeline-step reveal" style={{ transitionDelay: ".1s" }}>
                <div className="step-line" />
                <div className="step-num">Passo 02</div>
                <h3>Inicie a Prova</h3>
                <p>
                  O motor de inteligência gera um caderno de provas exclusivo para você em milissegundos, extraindo do banco central.
                </p>
              </div>
              <div className="timeline-step reveal" style={{ transitionDelay: ".2s" }}>
                <div className="step-line" />
                <div className="step-num">Passo 03</div>
                <h3>Concentre-se</h3>
                <p>
                  Responda às 20 questões focadas nas áreas de Programação, Lógica e Desenvolvimento Web. Sem distrações.
                </p>
              </div>
              <div className="timeline-step reveal" style={{ transitionDelay: ".3s" }}>
                <div className="step-line" />
                <div className="step-num">Passo 04</div>
                <h3>Evolua</h3>
                <p>
                  Revise seus erros, analise sua pontuação e acompanhe sua subida no Ranking Geral em tempo real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RANKING ─── */}
        <section className="lumen-section ranking-section" id="ranking">
          <div className="lumen-container">
            <div className="section-label reveal">03 — Leaderboard</div>
            <h2 className="section-title reveal">
              Os melhores da<br /><em>temporada.</em>
            </h2>

            <div className="ranking-container reveal" style={{ transitionDelay: ".2s" }}>
              {loadingRanking ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400 font-mono text-sm uppercase tracking-widest animate-pulse">Carregando telemetria...</p>
                </div>
              ) : ranking.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">A tabela está vazia. Seja o primeiro a pontuar.</p>
                </div>
              ) : (
                ranking.map((entry, idx) => (
                  <div key={entry.userId} className={`ranking-row pos-${idx + 1}`}>
                    <div className="ranking-pos">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <div className="ranking-info">
                      <div className="ranking-name">
                        {entry.userName}
                        {user && entry.userId === user.id && (
                          <span style={{ color: "var(--amber)", marginLeft: "8px", fontSize: "11px", letterSpacing: "0.1em" }}>[ VOCÊ ]</span>
                        )}
                      </div>
                      <div className="ranking-meta">
                        {entry.totalAttempts} Tentativas · Média {entry.averagePercentage.toFixed(0)}%
                      </div>
                    </div>
                    <div className="ranking-score-group">
                      <div className="ranking-score">{entry.totalScore}</div>
                      <div className="ranking-score-label">Pontos Globais</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-12 text-center reveal" style={{ transitionDelay: ".3s" }}>
              <button 
                onClick={handleStart}
                style={{
                  padding: "16px 40px",
                  background: "transparent",
                  border: "1px solid var(--amber)",
                  color: "var(--amber)",
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  cursor: "none",
                  transition: "background 0.3s, color 0.3s"
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "var(--amber)"; e.currentTarget.style.color = "var(--bg)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--amber)"; }}
              >
                Entrar na Disputa
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
