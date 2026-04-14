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
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg shadow-md ${
        scrolled 
          ? "bg-[#002776]/95 border-b border-white/10 shadow-lg" 
          : "bg-[#002776]/85 border-b border-transparent"
      }`} 
      role="banner"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded-lg px-2 py-1 -ml-2"
            aria-label={t("header.home")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-senai-orange/20 rounded-lg blur-lg group-hover:bg-senai-orange/30 transition-colors" />
              <Gamepad2 className="relative w-8 h-8 md:w-9 md:h-9 text-senai-orange group-hover:scale-110 transition-transform float-animation" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-[#ffffff] group-hover:text-senai-orange transition-colors leading-tight">
                <span className="hidden sm:inline">SENAI Game HUB</span>
                <span className="sm:hidden">Game HUB</span>
              </span>
              <span className="text-[10px] text-[#cbd5e1] hidden sm:block leading-tight">Dr. Celso Charuri</span>
            </div>
          </Link>

          <form 
            onSubmit={handleSearch} 
            className="hidden lg:flex flex-1 max-w-md mx-8" 
            role="search" 
            aria-label={t("header.searchGames")}
          >
            <div className="relative w-full group">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#cbd5e1] w-5 h-5 pointer-events-none group-focus-within:text-senai-orange transition-colors" 
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-10 py-2.5 text-[#ffffff] placeholder-[#cbd5e1] focus:outline-none focus:border-senai-orange focus:bg-white/20 focus:ring-2 focus:ring-senai-orange/50 transition-all"
                aria-label={t("header.searchField")}
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">{t("header.searchHelp")}</span>
            </div>
          </form>

          <nav 
            id="navigation" 
            className="hidden lg:flex items-center gap-1" 
            role="navigation" 
            aria-label={t("header.mainNav")}
          >
            <Link
              href="/games"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 group"
              aria-label={t("header.navGamesAria")}
            >
              <Gamepad2 className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="font-medium">{t("header.games")}</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 group"
              aria-label={t("header.navAboutAria")}
            >
              <Info className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="font-medium">{t("header.about")}</span>
            </Link>

            <Link
              href="/materiais"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 group"
              aria-label="Acessar materiais do curso"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="font-medium">Materiais</span>
            </Link>
            
            <Link
              href="/stats"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 group"
              aria-label={t("header.navStatsAria")}
            >
              <span className="font-medium">{t("header.stats")}</span>
            </Link>
            
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#e2e8f0] hover:text-red-400 hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 group"
                aria-label={t("header.navFavoritesAria")}
              >
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform fill-current" aria-hidden="true" />
                <span className="font-medium">{t("header.favorites")}</span>
              </Link>
            )}
            
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-senai-orange/10 hover:bg-senai-orange/20 text-senai-orange border border-senai-orange/30 hover:border-senai-orange/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 group font-medium"
              aria-label={t("header.navUploadAria")}
            >
              <span className="group-hover:scale-105 transition-transform">{t("header.upload")}</span>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {hasAdminAccess && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-senai-blueLight/10 hover:bg-senai-blueLight/20 text-senai-blueLight border border-senai-blueLight/30 hover:border-senai-blueLight/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-blueLight focus-visible:outline-offset-2 font-medium"
                    aria-label={t("header.navAdminAria")}
                  >
                    {t("header.admin")}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 group"
                  aria-label={t("header.navProfileAria", { name: user?.name ?? "" })}
                >
                  <div className="w-8 h-8 rounded-full bg-senai-orange/20 flex items-center justify-center border border-senai-orange/30 group-hover:border-senai-orange/50 transition-colors">
                    <User className="w-4 h-4 text-senai-orange" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium hidden xl:block">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 hover:border-red-600/50 px-4 py-2 rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 font-medium hover-lift-modern"
                  aria-label={t("header.navLogoutAria")}
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">{t("header.logout")}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-senai-orange hover:bg-senai-blue text-white px-5 py-2.5 rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 font-medium hover-lift-modern ripple-effect shadow-lg shadow-senai-orange/20"
                aria-label={t("header.navLoginAria")}
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>{t("header.login")}</span>
              </Link>
            )}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-senai-blueDark/50 hover:bg-senai-blueDark border border-senai-blue/30 text-[#e2e8f0] hover:text-senai-orange transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
            aria-label={t("header.openMenu")}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <form 
          onSubmit={handleSearch} 
          className="lg:hidden mt-4" 
          role="search" 
          aria-label={t("header.searchGames")}
        >
          <div className="relative group">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#cbd5e1] w-5 h-5 pointer-events-none group-focus-within:text-senai-orange transition-colors" 
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder={t("header.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-10 py-2.5 text-[#ffffff] placeholder-[#cbd5e1] focus:outline-none focus:border-senai-orange focus:bg-white/20 focus:ring-2 focus:ring-senai-orange/50 transition-all"
              aria-label={t("header.searchField")}
            />
          </div>
        </form>

        {isMobileMenuOpen && (
          <nav 
            className="lg:hidden mt-4 pb-4 border-t border-senai-blue/30 pt-4 animate-fadeIn"
            role="navigation"
            aria-label={t("header.mobileNav")}
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/games"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
                aria-label={t("header.navGamesAria")}
              >
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{t("footer.allGames")}</span>
              </Link>
              
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
                aria-label={t("header.navAboutAria")}
              >
                <Info className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{t("footer.aboutProject")}</span>
              </Link>

              <Link
                href="/materiais"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
                aria-label="Acessar materiais do curso"
              >
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Materiais</span>
              </Link>
              
              <Link
                href="/stats"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
                aria-label={t("header.navStatsAria")}
              >
                <span className="font-medium">{t("header.stats")}</span>
              </Link>
              
              {isAuthenticated && (
                <Link
                  href="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e2e8f0] hover:text-red-400 hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
                  aria-label={t("header.navFavoritesAria")}
                >
                  <Heart className="w-5 h-5 fill-current" aria-hidden="true" />
                  <span className="font-medium">{t("header.favorites")}</span>
                </Link>
              )}
              
              <Link
                href="/upload"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-senai-orange/10 hover:bg-senai-orange/20 text-senai-orange border border-senai-orange/30 hover:border-senai-orange/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 font-medium"
                aria-label={t("header.navUploadAria")}
              >
                <span>{t("header.uploadGame")}</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  {hasAdminAccess && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-senai-blueLight/10 hover:bg-senai-blueLight/20 text-senai-blueLight border border-senai-blueLight/30 hover:border-senai-blueLight/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-blueLight focus-visible:outline-offset-2 font-medium"
                      aria-label={t("header.navAdminAria")}
                    >
                      <span>{t("header.admin")}</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e2e8f0] hover:text-senai-orange hover:bg-senai-blueDark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
                    aria-label={t("header.navProfileAria", { name: user?.name ?? "" })}
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">{t("header.myProfile")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 hover:border-red-600/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 font-medium text-left"
                    aria-label={t("header.navLogoutAria")}
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>{t("header.logout")}</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-senai-orange hover:bg-senai-blue text-white transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 font-medium ripple-effect"
                  aria-label={t("header.navLoginAria")}
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                  <span>{t("header.login")}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
