"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  User,
  Gamepad2,
  LogOut,
  Heart,
  Info,
  Menu,
  X,
  BookOpen,
  Sparkles,
  Rocket,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useI18n } from "./I18nProvider";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, isTeacher } = useAuth();
  const hasAdminAccess =
    isTeacher ||
    ["lucas.lopes0@outlook.com.br", "lucaslopes0@outlook.com.br"].includes(
      (user?.email || "").trim().toLowerCase()
    );
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const marqueeItems = [
    { icon: Gamepad2, text: "A vitrine de jogos autorais" },
    { icon: Sparkles, text: "Novos jogos adicionados" },
    { icon: Rocket, text: "Acesse e de sua avaliacao" },
    { icon: Trophy, text: "99% recomendam jogos do hub" },
    { icon: GraduationCap, text: "Curso Tecnico em Programacao de Jogos" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  if (pathname.startsWith("/simulado-saep/play")) {
    return null;
  }

  return (
    <>
      {pathname.startsWith("/simulado-saep") && (
        <style dangerouslySetInnerHTML={{ __html: `
          .header-liquid {
            --surface-container-lowest: transparent !important;
            --surface-container-low: #0d0d12 !important;
            --primary: #f5c97a !important;
            --primary-container: #ffd98a !important;
            --on-surface-variant: #d4cfc8 !important;
            --outline-10: rgba(255, 255, 255, 0.06) !important;
            --secondary-container: #a8823a !important;
            --on-secondary-container: #060608 !important;
            --on-surface: #f0e8d8 !important;
            --outline: #6b6870 !important;
            --surface: #060608 !important;
            --on-primary: #060608 !important;
            --primary-fixed-dim: #a8823a !important;
            background-color: #060608 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
          }
          .header-liquid::before {
            display: none !important;
          }
          .header-liquid--scrolled {
            background: rgba(6, 6, 8, 0.92) !important;
            backdrop-filter: blur(12px) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
            box-shadow: none !important;
          }
          /* Custom hover states for nav links */
          .header-liquid nav a:hover {
            color: #f5c97a !important;
          }
        `}} />
      )}
    <header className="sticky top-0 z-50 w-full" role="banner">
      <div
        className={`header-liquid transition-all duration-300 ${
          scrolled ? "header-liquid--scrolled" : "header-liquid--top"
        }`}
      >
        <div className="container relative z-10 mx-auto px-4 flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange rounded-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--secondary-20)] blur-lg group-hover:bg-[var(--secondary-20)] transition-all" />
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] flex items-center justify-center shadow-sm">
                <Image
                  src="/uploads/images/logo_senaigamehub.png"
                  alt="SENAI Game Hub"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-sm sm:text-base tracking-tight text-[var(--primary)] group-hover:text-[var(--primary-container)] transition-colors">SENAI Game Hub</div>
              <div className="text-[9px] sm:text-[10px] text-[var(--on-surface-variant)] font-mono uppercase tracking-wider">Tecnico em Prog. de Jogos</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--outline)] group-focus-within:text-[var(--secondary-container)] transition-colors" />
              <input
                type="search"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-20)] focus:border-[var(--secondary-container)] transition-all"
              />
            </div>
          </form>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/games" className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              {t("header.games")}
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              {t("header.about")}
            </Link>
            <Link href="/materiais" className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              Materiais
            </Link>
            <Link href="/stats" className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              {t("header.stats")}
            </Link>
            <Link href="/simulado-saep" className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--secondary-container)] transition-colors flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              Simulado SAEP
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" className="px-3 py-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--error)] transition-colors">
                {t("header.favorites")}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <Link href="/upload" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[var(--secondary)] bg-[var(--secondary-10)] border border-[var(--secondary-20)] hover:bg-[var(--secondary-20)] rounded-lg transition-colors">
              {t("header.upload")}
            </Link>
            
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                {hasAdminAccess && (
                  <Link href="/admin" className="px-4 py-2 text-sm font-medium text-[var(--primary)] bg-[var(--primary-10)] border border-[var(--primary-20)] hover:bg-[var(--primary-20)] rounded-lg transition-colors">
                    {t("header.admin")}
                  </Link>
                )}
                <Link href="/profile" className="w-9 h-9 rounded-full bg-[var(--secondary-10)] flex items-center justify-center border border-[var(--secondary-20)] hover:border-[var(--secondary)] transition-colors" title={user?.name ?? ""}>
                  <User className="w-4 h-4 text-[var(--secondary)]" />
                </Link>
                <button onClick={() => { logout(); router.push("/"); }} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 transition-colors" title={t("header.logout")}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-[var(--on-secondary-container)] bg-[var(--secondary-container)] hover:opacity-90 rounded-lg shadow-sm transition-all">
                <User className="w-4 h-4" />
                {t("header.login")}
              </Link>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="bg-[var(--primary)] border-b border-[var(--primary-container)] overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2 text-xs font-mono uppercase tracking-widest text-[var(--on-primary)]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {marqueeItems.map(({ icon: Icon, text }, j) => (
                <span key={`${i}-${j}`} className="px-8 flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[var(--primary-fixed-dim)]" aria-hidden="true" />
                  <span>{text}</span>
                  <span className="text-[var(--secondary-container)]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--surface)] border-b border-[var(--outline-10)]">
          <form onSubmit={handleSearch} className="p-4 border-b border-[var(--outline-10)]">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--outline)]" />
              <input
                type="search"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:border-[var(--secondary-container)]"
              />
            </div>
          </form>
          <nav className="flex flex-col p-4 gap-2">
            <Link href="/games" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">{t("header.games")}</span>
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
              <Info className="w-5 h-5" />
              <span className="font-medium">{t("header.about")}</span>
            </Link>
            <Link href="/materiais" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Materiais</span>
            </Link>
            <Link href="/stats" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
              <span className="font-medium">{t("header.stats")}</span>
            </Link>
            <Link href="/simulado-saep" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Simulado SAEP</span>
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{t("header.favorites")}</span>
              </Link>
            )}
            
            <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg bg-[var(--secondary-10)] text-[var(--secondary)] border border-[var(--secondary-20)]">
              <span className="font-medium">{t("header.upload")}</span>
            </Link>

            {isAuthenticated ? (
              <>
                {hasAdminAccess && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--primary-10)] text-[var(--primary)] border border-[var(--primary-20)]">
                    <span className="font-medium">{t("header.admin")}</span>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{t("header.myProfile")}</span>
                </Link>
                <button onClick={() => { logout(); router.push("/"); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-600 border border-red-500/30 text-left">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t("header.logout")}</span>
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 px-4 py-3 mt-2 rounded-lg bg-[var(--secondary-container)] text-[var(--on-secondary-container)] font-bold">
                <User className="w-5 h-5" />
                <span>{t("header.login")}</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
