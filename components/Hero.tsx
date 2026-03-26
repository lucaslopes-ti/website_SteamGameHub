"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, ArrowRight, Gamepad2, Users, Award, ChevronDown, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "./I18nProvider";

function useAnimatedCounter(target: number, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target <= 0) return;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number.parseFloat((eased * target).toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return count;
}

function FloatingParticles({ isLight = false }: Readonly<{ isLight?: boolean }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const colors = isLight
      ? [
          "rgba(37, 99, 235,",
          "rgba(22, 163, 74,",
          "rgba(100, 116, 139,",
        ]
      : [
          "rgba(102, 192, 244,",
          "rgba(76, 175, 80,",
          "rgba(255, 255, 255,",
        ];

    const initParticles = () => {
      particles.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 25000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = isLight
              ? `rgba(37, 99, 235, ${0.08 * (1 - dist / 120)})`
              : `rgba(102, 192, 244, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    resize();
    initParticles();
    drawParticles();

    const handleResize = () => {
      resize();
      initParticles();
    };

    globalThis.window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      globalThis.window.removeEventListener("resize", handleResize);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function Hero() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const isLight = theme === "light";
  const [stats, setStats] = useState({
    totalGames: 0,
    totalAuthors: 0,
    avgRating: 0,
  });
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const animatedGames = useAnimatedCounter(stats.totalGames, 1800);
  const animatedAuthors = useAnimatedCounter(stats.totalAuthors, 2000);
  const animatedRating = useAnimatedCounter(stats.avgRating, 2200, 1);

  useEffect(() => {
    fetch("/api/games?approved=true")
      .then((res) => res.json())
      .then((games) => {
        const approved = games.filter((g: any) => g.approved);
        const uniqueAuthors = new Set(approved.map((g: any) => g.authorEmail));
        const avgRating =
          approved.length > 0
            ? approved.reduce((sum: number, g: any) => sum + (g.rating || 0), 0) /
              approved.length
            : 0;

        setStats({
          totalGames: approved.length,
          totalAuthors: uniqueAuthors.size,
          avgRating: avgRating,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / globalThis.window.innerWidth) * 100,
        y: (e.clientY / globalThis.window.innerHeight) * 100,
      });
    };

    globalThis.window.addEventListener("mousemove", handleMouseMove);
    return () => globalThis.window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = useCallback(() => {
    const nextSection = heroRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[95vh] flex items-center overflow-hidden"
      style={{
        background: isLight
          ? `
            radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(22, 163, 74, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #e0e7ff 0%, #dbeafe 40%, #eff6ff 100%)
          `
          : `
            radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(102, 192, 244, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(76, 175, 80, 0.06) 0%, transparent 50%),
            linear-gradient(135deg, #0a0f1a 0%, #1b2838 40%, #2a475e 100%)
          `,
      }}
    >
      <FloatingParticles isLight={isLight} />

      <div className={`absolute inset-0 ${isLight ? "opacity-[0.06]" : "opacity-[0.03]"}`} aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: isLight
            ? `
              linear-gradient(rgba(37, 99, 235, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.4) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(102, 192, 244, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 192, 244, 0.5) 1px, transparent 1px)
            `,
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div
        className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${isLight ? "opacity-[0.12]" : "opacity-[0.07]"}`}
        style={{
          background: isLight
            ? "radial-gradient(circle, #3b82f6, transparent 70%)"
            : "radial-gradient(circle, #66c0f4, transparent 70%)",
          top: "10%",
          right: "-5%",
        }}
        aria-hidden="true"
      />
      <div
        className={`absolute w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none ${isLight ? "opacity-[0.10]" : "opacity-[0.05]"}`}
        style={{
          background: isLight
            ? "radial-gradient(circle, #16a34a, transparent 70%)"
            : "radial-gradient(circle, #4caf50, transparent 70%)",
          bottom: "10%",
          left: "-5%",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div
            className={`mb-12 md:mb-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-steam-blueLight/10 border border-steam-blueLight/20">
              <Sparkles className="w-4 h-4 text-steam-blueLight" />
              <span className="text-steam-blueLight text-sm font-medium tracking-wider uppercase">
                SENAI Dr. Celso Charuri
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.05]">
              <span className="block mb-2">SENAI</span>
              <span className="block bg-gradient-to-r from-steam-blueLight via-steam-green to-steam-blueLight bg-clip-text text-transparent leading-none gradient-text-animated">
                Game HUB
              </span>
            </h1>

            <div className="max-w-2xl">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-3 font-light">
                {t("hero.description1")}
                <span className="text-steam-blueLight font-medium"> {t("hero.course")}</span>.
              </p>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                {t("hero.description2")}
              </p>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="group">
              <div className="glass-card border border-steam-blue/20 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-steam-blueLight/40 hover:bg-steam-blue/5 hover-lift-modern">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-steam-blueLight/10 rounded-lg group-hover:bg-steam-blueLight/20 transition-colors">
                    <Gamepad2 className="w-6 h-6 text-steam-blueLight" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                      {animatedGames}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{t("hero.statGames")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="glass-card border border-steam-blue/20 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-steam-green/40 hover:bg-steam-green/5 hover-lift-modern">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-steam-green/10 rounded-lg group-hover:bg-steam-green/20 transition-colors">
                    <Users className="w-6 h-6 text-steam-green" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                      {animatedAuthors}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{t("hero.statAuthors")}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="glass-card border border-steam-blue/20 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-yellow-400/40 hover:bg-yellow-400/5 hover-lift-modern">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                      {stats.avgRating > 0 ? animatedRating : "-"}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">{t("hero.statAvgRating")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/games"
              className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-steam-blueLight to-[#4a9cd4] hover:from-[#4a9cd4] hover:to-steam-blueLight text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 overflow-hidden shadow-lg shadow-steam-blueLight/20 hover:shadow-steam-blueLight/40 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="w-5 h-5" />
                {t("hero.ctaExplore")}
              </span>
              <ArrowRight className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>

            <Link
              href="/upload"
              className="group flex items-center justify-center gap-3 bg-transparent border-2 border-steam-green/40 hover:border-steam-green hover:bg-steam-green/10 text-steam-green px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-steam-green/10"
            >
              <span>{t("hero.ctaUpload")}</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToContent}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-steam-blueLight transition-all duration-500 cursor-pointer group ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "800ms" }}
        aria-label={t("hero.scrollAria")}
      >
        <span className="text-xs uppercase tracking-widest font-medium">{t("hero.scrollText")}</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>

      <div className={`absolute top-0 right-0 w-64 h-64 pointer-events-none ${isLight ? "opacity-[0.08]" : "opacity-[0.03]"}`} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="150" cy="50" r="80" stroke={isLight ? "#3b82f6" : "#66c0f4"} strokeWidth="0.5" fill="none" />
          <circle cx="150" cy="50" r="60" stroke={isLight ? "#16a34a" : "#4caf50"} strokeWidth="0.3" fill="none" />
          <circle cx="150" cy="50" r="40" stroke={isLight ? "#3b82f6" : "#66c0f4"} strokeWidth="0.2" fill="none" />
        </svg>
      </div>

      <div className={`absolute bottom-0 left-0 w-48 h-48 pointer-events-none ${isLight ? "opacity-[0.08]" : "opacity-[0.03]"}`} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="50" cy="150" r="70" stroke={isLight ? "#16a34a" : "#4caf50"} strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="150" r="50" stroke={isLight ? "#3b82f6" : "#66c0f4"} strokeWidth="0.3" fill="none" />
        </svg>
      </div>
    </section>
  );
}
