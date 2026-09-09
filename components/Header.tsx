"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  User,
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
  Gamepad2,
  Database,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Upload,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { useI18n } from "./I18nProvider";

type IconType = typeof Gamepad2;

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, isTeacher } = useAuth();
  // Papel efetivo vem do servidor (custom claims + allowlists server-side).
  const hasAdminAccess = isTeacher;
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const marqueeItems = [
    { icon: Gamepad2, text: "A vitrine de jogos autorais" },
    { icon: Sparkles, text: "Novos jogos adicionados" },
    { icon: Rocket, text: "Acesse e dê sua avaliação" },
    { icon: Trophy, text: "99% recomendam jogos do hub" },
    { icon: GraduationCap, text: "Curso Técnico em Programação de Jogos" },
  ];

  const mainItems: { href: string; label: string; icon: IconType }[] = [
    { href: "/games", label: t("header.games"), icon: Gamepad2 },
    { href: "/materiais", label: "Materiais", icon: BookOpen },
    { href: "/simulado-saep", label: "Simulado SAEP", icon: Trophy },
    { href: "/sql-quest", label: "SQL SenaiUdi", icon: Database },
  ];

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const closeMenus = useCallback(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    setUserMenuOpen(false);
  }, []);

  // Fecha tudo ao trocar de página.
  useEffect(() => {
    closeMenus();
  }, [pathname, closeMenus]);

  // Estado "scrolled" para a barra ficar mais sólida ao rolar.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha o painel mobile ao crescer para o breakpoint desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Escape fecha menus; "/" foca a busca (fora de campos de texto).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenus();
        return;
      }
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenus]);

  // Clique fora fecha dropdowns e o painel mobile.
  useEffect(() => {
    if (!mobileOpen && !moreOpen && !userMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        (moreOpen && moreRef.current?.contains(target)) ||
        (userMenuOpen && userRef.current?.contains(target)) ||
        (mobileOpen && panelRef.current?.contains(target))
      ) {
        return;
      }
      closeMenus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen, moreOpen, userMenuOpen, closeMenus]);

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

  const exploreItems = [
    { href: "/about", label: t("header.about"), icon: Info },
    { href: "/stats", label: t("header.stats"), icon: TrendingUp },
    ...(isAuthenticated
      ? [{ href: "/favorites", label: t("header.favorites"), icon: Heart }]
      : []),
  ];

  const navLinkClass = (href: string) =>
    `relative flex h-16 items-center px-2.5 xl:px-3 text-sm font-semibold tracking-[-0.01em] transition-colors duration-150 ease-out rounded-md ${
      isActive(href)
        ? "text-[var(--on-surface)]"
        : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
    }`;

  const navUnderlineClass = (href: string) =>
    `absolute inset-x-2.5 xl:inset-x-3 bottom-0 h-0.5 rounded-full origin-left transition-transform duration-200 ease-out ${
      isActive(href)
        ? "bg-[var(--secondary-container)] scale-x-100"
        : "bg-[var(--outline-variant)] scale-x-0 group-hover:scale-x-100"
    }`;

  const dropdownItemClass = (href: string) =>
    `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
      isActive(href)
        ? "bg-[var(--secondary-10)] text-[var(--on-surface)]"
        : "text-[var(--on-surface-variant)] hover:bg-[var(--primary-10)] hover:text-[var(--on-surface)]"
    }`;

  const mobileItemClass = (href: string) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 ease-out ${
      isActive(href)
        ? "bg-[var(--secondary-10)] font-semibold text-[var(--on-surface)]"
        : "font-medium text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]"
    }`;

  const buildSearchField = (inputRef?: React.Ref<HTMLInputElement>) => (
    <>
      <Search
        aria-hidden="true"
        className="hd-search-icon absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
      />
      <input
        ref={inputRef}
        type="search"
        name="search"
        autoComplete="off"
        aria-label={t("header.searchPlaceholder")}
        placeholder={t("header.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="hd-search-field pl-10 pr-9 outline-none"
      />
      {!searchQuery && (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 hidden h-5 min-w-5 -translate-y-1/2 select-none items-center justify-center rounded border border-[var(--outline-10)] bg-[var(--surface-container-low)] px-1 font-mono text-[10px] text-[var(--outline)] sm:flex"
        >
          /
        </kbd>
      )}
    </>
  );

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
          className={`header-liquid ${
            scrolled ? "header-liquid--scrolled" : "header-liquid--top"
          }`}
        >
          <div className="container relative z-10 mx-auto flex h-16 items-center gap-2 px-4 sm:gap-3 lg:gap-4 lg:px-6">
            {/* Logo (somente a imagem oficial, em tamanho legível) */}
            <Link
              href="/"
              aria-label="SENAI Game Hub"
              className="group flex shrink-0 items-center rounded-md focus-visible:outline-2"
            >
              <Image
                src="/uploads/images/logo_senaigamehub_correta.png"
                alt=""
                width={44}
                height={50}
                priority
                className="h-10 w-auto object-contain transition-transform duration-150 ease-out group-hover:scale-[1.04] group-active:scale-95 sm:h-11"
              />
            </Link>

            {/* Navegação principal (desktop) */}
            <nav
              id="navigation"
              aria-label="Navegação principal"
              className="ml-1 hidden shrink-0 items-stretch gap-0.5 lg:flex"
            >
              {mainItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`group ${navLinkClass(item.href)}`}
                >
                  {item.label}
                  <span aria-hidden="true" className={navUnderlineClass(item.href)} />
                </Link>
              ))}

              {/* Mais: páginas secundárias */}
              <div ref={moreRef} className="relative">
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    setMoreOpen((v) => !v);
                    setUserMenuOpen(false);
                  }}
                  className={`group flex h-16 items-center gap-1 px-2.5 text-sm font-semibold tracking-[-0.01em] transition-colors duration-150 ease-out xl:px-3 rounded-md ${
                    moreOpen
                      ? "text-[var(--on-surface)]"
                      : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
                  }`}
                >
                  Mais
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  data-open={moreOpen}
                  className="hd-menu absolute right-0 top-full z-50 mt-1.5 w-60 origin-top-right rounded-xl border border-[var(--outline-10)] bg-[var(--surface-container-high)] p-1.5 shadow-2xl shadow-black/40"
                  role="group"
                  aria-label="Mais páginas"
                >
                  {exploreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={dropdownItemClass(item.href)}
                    >
                      <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Busca */}
            <div className="hidden min-w-0 flex-1 justify-center px-1 md:flex lg:px-3">
              <form
                role="search"
                onSubmit={handleSearch}
                className="hd-search relative w-full max-w-md"
              >
                {buildSearchField(searchRef)}
              </form>
            </div>

            {/* Ações */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Link
                href="/upload"
                className="hidden h-10 items-center gap-2 rounded-lg border border-[var(--secondary-20)] bg-[var(--secondary-10)] px-4 text-sm font-semibold text-[var(--secondary)] transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--secondary-20)] active:scale-[0.97] sm:inline-flex"
              >
                <Upload aria-hidden="true" className="h-4 w-4" />
                {t("header.upload")}
              </Link>

              {isAuthenticated ? (
                <div ref={userRef} className="relative hidden md:block">
                  <button
                    type="button"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label={`Menu do usuário${user?.name ? `: ${user.name}` : ""}`}
                    onClick={() => {
                      setUserMenuOpen((v) => !v);
                      setMoreOpen(false);
                    }}
                    className="flex h-10 w-10 select-none items-center justify-center rounded-full border border-[var(--outline-10)] bg-[var(--surface-container-lowest)] text-sm font-bold text-[var(--secondary)] transition-[border-color,transform] duration-150 ease-out hover:border-[var(--secondary-container)] active:scale-95"
                  >
                    {user?.name?.trim().charAt(0).toUpperCase() ?? (
                      <User aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>

                  <div
                    data-open={userMenuOpen}
                    className="hd-menu absolute right-0 top-full z-50 mt-1.5 w-64 origin-top-right rounded-xl border border-[var(--outline-10)] bg-[var(--surface-container-high)] p-1.5 shadow-2xl shadow-black/40"
                    role="group"
                    aria-label="Menu do usuário"
                  >
                    {user?.name && (
                      <div className="mb-1.5 rounded-lg bg-[var(--surface-container-lowest)] px-3.5 py-3">
                        <p className="truncate text-sm font-semibold text-[var(--on-surface)]">
                          {user.name}
                        </p>
                        {user.email && (
                          <p className="truncate text-xs text-[var(--on-surface-variant)]">
                            {user.email}
                          </p>
                        )}
                      </div>
                    )}
                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className={dropdownItemClass("/profile")}
                    >
                      <User aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {t("header.myProfile")}
                    </Link>
                    {hasAdminAccess && (
                      <Link
                        href="/admin"
                        onClick={closeMenus}
                        className={dropdownItemClass("/admin")}
                      >
                        <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
                        {t("header.admin")}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--error)] transition-colors duration-150 ease-out hover:bg-red-500/10"
                    >
                      <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {t("header.logout")}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden h-10 items-center gap-2 rounded-lg bg-[var(--secondary-container)] px-5 text-sm font-bold text-[var(--on-secondary-container)] shadow-sm transition-[background-color,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.97] lg:inline-flex"
                >
                  <User aria-hidden="true" className="h-4 w-4" />
                  {t("header.login")}
                </Link>
              )}

              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => {
                  setMobileOpen((v) => !v);
                  setMoreOpen(false);
                  setUserMenuOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--outline-10)] bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] transition-[color,background-color,transform] duration-150 ease-out hover:text-[var(--primary)] active:scale-95 lg:hidden"
              >
                {mobileOpen ? (
                  <X aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <Menu aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Faixa de novidades */}
        <div className="bg-[var(--primary)] border-b border-[var(--primary-container)] overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-2 text-xs font-mono uppercase tracking-widest text-[var(--on-primary)]">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
                {marqueeItems.map(({ icon: Icon, text }, j) => (
                  <span key={`${i}-${j}`} className="px-8 flex items-center gap-3">
                    <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                    <span>{text}</span>
                    <span className="text-white/70" aria-hidden="true">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            ref={panelRef}
            className="hd-panel-in max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-[var(--outline-10)] bg-[var(--surface)] lg:hidden"
          >
            <form
              role="search"
              onSubmit={handleSearch}
              className="hd-search border-b border-[var(--outline-10)] p-4"
            >
              {buildSearchField()}
            </form>

            <nav aria-label="Navegação" className="p-3">
              <p className="px-3 pb-1.5 pt-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--outline)]">
                Navegação
              </p>
              <div className="flex flex-col gap-0.5">
                {mainItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={mobileItemClass(item.href)}
                  >
                    <item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <p className="px-3 pb-1.5 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--outline)]">
                Explorar
              </p>
              <div className="flex flex-col gap-0.5">
                {exploreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={mobileItemClass(item.href)}
                  >
                    <item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <p className="px-3 pb-1.5 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--outline)]">
                {isAuthenticated ? "Conta" : "Acesso"}
              </p>
              <div className="flex flex-col gap-0.5">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive("/profile") ? "page" : undefined}
                      className={mobileItemClass("/profile")}
                    >
                      <User aria-hidden="true" className="h-5 w-5 shrink-0" />
                      {t("header.myProfile")}
                    </Link>
                    {hasAdminAccess && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive("/admin") ? "page" : undefined}
                        className={mobileItemClass("/admin")}
                      >
                        <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0" />
                        {t("header.admin")}
                      </Link>
                    )}
                    <Link
                      href="/upload"
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-lg border border-[var(--secondary-20)] bg-[var(--secondary-10)] px-4 py-2.5 text-sm font-semibold text-[var(--secondary)]"
                    >
                      <Upload aria-hidden="true" className="h-5 w-5 shrink-0" />
                      {t("header.upload")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-[var(--error)] transition-colors duration-150 hover:bg-red-500/10"
                    >
                      <LogOut aria-hidden="true" className="h-5 w-5 shrink-0" />
                      {t("header.logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/upload"
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-lg border border-[var(--secondary-20)] bg-[var(--secondary-10)] px-4 py-2.5 text-sm font-semibold text-[var(--secondary)]"
                    >
                      <Upload aria-hidden="true" className="h-5 w-5 shrink-0" />
                      {t("header.upload")}
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--secondary-container)] px-4 py-3 text-sm font-bold text-[var(--on-secondary-container)]"
                    >
                      <User aria-hidden="true" className="h-4 w-4" />
                      {t("header.login")}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
