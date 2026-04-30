"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Gamepad2, LogOut, Heart, Info, Menu, X, BookOpen } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-50 w-full" role="banner">
      <div className={`transition-all duration-300 ${scrolled ? "glass-strong border-b border-white/10 shadow-lg" : "bg-senai-dark/95 border-b border-border/50"}`}>
        <div className="container mx-auto px-4 flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange rounded-lg">
            <div className="relative">
              <div className="absolute inset-0 bg-senai-orange/30 blur-lg group-hover:bg-senai-orange/50 transition-all" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-orange flex items-center justify-center shadow-glow-orange">
                <Gamepad2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base tracking-tight text-white group-hover:text-senai-orange transition-colors">SENAI Game Hub</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Técnico em Prog. de Jogos</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-senai-orange transition-colors" />
              <input
                type="search"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-senai-orange/50 focus:border-senai-orange/50 transition-all"
              />
            </div>
          </form>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/games" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {t("header.games")}
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {t("header.about")}
            </Link>
            <Link href="/materiais" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Materiais
            </Link>
            <Link href="/stats" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {t("header.stats")}
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors">
                {t("header.favorites")}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <Link href="/upload" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-senai-orange bg-senai-orange/10 border border-senai-orange/30 hover:bg-senai-orange/20 rounded-lg transition-colors">
              {t("header.upload")}
            </Link>
            
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                {hasAdminAccess && (
                  <Link href="/admin" className="px-4 py-2 text-sm font-medium text-senai-blueLight bg-senai-blueLight/10 border border-senai-blueLight/30 hover:bg-senai-blueLight/20 rounded-lg transition-colors">
                    {t("header.admin")}
                  </Link>
                )}
                <Link href="/profile" className="w-9 h-9 rounded-full bg-senai-orange/20 flex items-center justify-center border border-senai-orange/30 hover:border-senai-orange/50 transition-colors" title={user?.name ?? ""}>
                  <User className="w-4 h-4 text-senai-orange" />
                </Link>
                <button onClick={() => { logout(); router.push("/"); }} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 transition-colors" title={t("header.logout")}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-senai-orange hover:bg-senai-orange/90 rounded-lg shadow-glow-orange transition-all">
                <User className="w-4 h-4" />
                {t("header.login")}
              </Link>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="bg-[#002776] border-b border-senai-blue/30 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2 text-xs font-mono uppercase tracking-widest text-senai-blueLight">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {[
                "🎮 A vitrine de jogos autorais",
                "✨ Novos jogos adicionados",
                "🚀 Acesse e dê sua avaliação",
                "🏆 99% recomendam jogos do hub",
                "👾 Curso Técnico em Programação de Jogos",
              ].map((text, j) => (
                <span key={j} className="px-8 flex items-center gap-3">
                  {text}
                  <span className="text-senai-orange">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-senai-dark border-b border-white/10">
          <form onSubmit={handleSearch} className="p-4 border-b border-white/10">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-senai-orange"
              />
            </div>
          </form>
          <nav className="flex flex-col p-4 gap-2">
            <Link href="/games" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">{t("header.games")}</span>
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
              <Info className="w-5 h-5" />
              <span className="font-medium">{t("header.about")}</span>
            </Link>
            <Link href="/materiais" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Materiais</span>
            </Link>
            <Link href="/stats" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
              <span className="font-medium">{t("header.stats")}</span>
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{t("header.favorites")}</span>
              </Link>
            )}
            
            <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg bg-senai-orange/10 text-senai-orange border border-senai-orange/30">
              <span className="font-medium">{t("header.upload")}</span>
            </Link>

            {isAuthenticated ? (
              <>
                {hasAdminAccess && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-senai-blueLight/10 text-senai-blueLight border border-senai-blueLight/30">
                    <span className="font-medium">{t("header.admin")}</span>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{t("header.myProfile")}</span>
                </Link>
                <button onClick={() => { logout(); router.push("/"); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 text-red-400 border border-red-600/30 text-left">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t("header.logout")}</span>
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 px-4 py-3 mt-2 rounded-lg bg-senai-orange text-white font-bold">
                <User className="w-5 h-5" />
                <span>{t("header.login")}</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
