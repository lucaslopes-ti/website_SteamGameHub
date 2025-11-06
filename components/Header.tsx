"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Gamepad2, LogOut, Heart, Info, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isTeacher } = useAuth();
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery)}`);
      // Limpar o campo de busca após navegar
      setSearchQuery("");
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-steam-darker/98 backdrop-blur-xl border-b border-steam-blue/60 shadow-xl shadow-black/20" 
          : "bg-steam-darker/90 backdrop-blur-lg border-b border-steam-blue/40 shadow-md"
      }`} 
      role="banner"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded-lg px-2 py-1 -ml-2"
            aria-label="Página inicial - SENAI Dr. Celso Charuri Game HUB"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-steam-blueLight/20 rounded-lg blur-lg group-hover:bg-steam-blueLight/30 transition-colors" />
              <Gamepad2 className="relative w-8 h-8 md:w-9 md:h-9 text-steam-blueLight group-hover:scale-110 transition-transform float-animation" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-white group-hover:text-steam-blueLight transition-colors leading-tight">
                <span className="hidden sm:inline">SENAI Game HUB</span>
                <span className="sm:hidden">Game HUB</span>
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:block leading-tight">Dr. Celso Charuri</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearch} 
            className="hidden lg:flex flex-1 max-w-md mx-8" 
            role="search" 
            aria-label="Buscar jogos"
          >
            <div className="relative w-full group">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-steam-blueLight transition-colors" 
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar jogos, autores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-steam-dark/80 backdrop-blur-sm border border-steam-blue/50 rounded-lg px-10 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight focus:bg-steam-dark focus:ring-2 focus:ring-steam-blueLight/50 transition-all"
                aria-label="Campo de busca de jogos"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">Digite o nome do jogo ou autor para buscar</span>
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav 
            id="navigation" 
            className="hidden lg:flex items-center gap-1" 
            role="navigation" 
            aria-label="Navegação principal"
          >
            {/* Botão Atividade de Hoje */}
            <Link
              href="/atividade-prototipo-csharp"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white font-bold hover:from-yellow-300 hover:via-orange-300 hover:to-red-400 transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse hover:animate-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 focus-visible:outline-offset-2 group"
              aria-label="Acessar atividade de hoje"
            >
              <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span>Atividade de Hoje</span>
            </Link>
            
            <Link
              href="/games"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 group"
              aria-label="Ver todos os jogos disponíveis"
            >
              <Gamepad2 className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="font-medium">Jogos</span>
            </Link>
            
            <Link
              href="/about"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 group"
              aria-label="Sobre o projeto Game HUB"
            >
              <Info className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="font-medium">Sobre</span>
            </Link>
            
            <Link
              href="/stats"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 group"
              aria-label="Ver estatísticas do site"
            >
              <span className="font-medium">Stats</span>
            </Link>
            
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 group"
                aria-label="Ver meus jogos favoritos"
              >
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform fill-current" aria-hidden="true" />
                <span className="font-medium">Favoritos</span>
              </Link>
            )}
            
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-steam-blueLight/10 hover:bg-steam-blueLight/20 text-steam-blueLight border border-steam-blueLight/30 hover:border-steam-blueLight/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 group font-medium"
              aria-label="Enviar um novo jogo"
            >
              <span className="group-hover:scale-105 transition-transform">Enviar</span>
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isTeacher && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-steam-green/10 hover:bg-steam-green/20 text-steam-green border border-steam-green/30 hover:border-steam-green/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-green focus-visible:outline-offset-2 font-medium"
                    aria-label="Painel administrativo"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 group"
                  aria-label={`Ver perfil de ${user?.name}`}
                >
                  <div className="w-8 h-8 rounded-full bg-steam-blueLight/20 flex items-center justify-center border border-steam-blueLight/30 group-hover:border-steam-blueLight/50 transition-colors">
                    <User className="w-4 h-4 text-steam-blueLight" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium hidden xl:block">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 hover:border-red-600/50 px-4 py-2 rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 font-medium hover-lift-modern"
                  aria-label="Fazer logout e sair da conta"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xl:inline">Sair</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-steam-blueLight hover:bg-steam-blue text-white px-5 py-2.5 rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 font-medium hover-lift-modern ripple-effect shadow-lg shadow-steam-blueLight/20"
                aria-label="Fazer login na plataforma"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Entrar</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-steam-dark/50 hover:bg-steam-dark border border-steam-blue/30 text-gray-300 hover:text-steam-blueLight transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2"
            aria-label="Abrir menu de navegação"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <form 
          onSubmit={handleSearch} 
          className="lg:hidden mt-4" 
          role="search" 
          aria-label="Buscar jogos"
        >
          <div className="relative group">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-steam-blueLight transition-colors" 
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Buscar jogos, autores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-steam-dark/80 backdrop-blur-sm border border-steam-blue/50 rounded-lg px-10 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight focus:bg-steam-dark focus:ring-2 focus:ring-steam-blueLight/50 transition-all"
              aria-label="Campo de busca de jogos"
            />
          </div>
        </form>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav 
            className="lg:hidden mt-4 pb-4 border-t border-steam-blue/30 pt-4 animate-fadeIn"
            role="navigation"
            aria-label="Menu de navegação mobile"
          >
            <div className="flex flex-col gap-2">
              {/* Botão Atividade de Hoje - Mobile */}
              <Link
                href="/atividade-prototipo-csharp"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white font-bold hover:from-yellow-300 hover:via-orange-300 hover:to-red-400 transition-all duration-200 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 focus-visible:outline-offset-2"
                aria-label="Acessar atividade de hoje"
              >
                <Trophy className="w-5 h-5" aria-hidden="true" />
                <span>Atividade de Hoje</span>
              </Link>
              
              <Link
                href="/games"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2"
                aria-label="Ver todos os jogos disponíveis"
              >
                <Gamepad2 className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Todos os Jogos</span>
              </Link>
              
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2"
                aria-label="Sobre o projeto Game HUB"
              >
                <Info className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Sobre o Projeto</span>
              </Link>
              
              <Link
                href="/stats"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2"
                aria-label="Ver estatísticas do site"
              >
                <span className="font-medium">Estatísticas</span>
              </Link>
              
              {isAuthenticated && (
                <Link
                  href="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
                  aria-label="Ver meus jogos favoritos"
                >
                  <Heart className="w-5 h-5 fill-current" aria-hidden="true" />
                  <span className="font-medium">Favoritos</span>
                </Link>
              )}
              
              <Link
                href="/upload"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-steam-blueLight/10 hover:bg-steam-blueLight/20 text-steam-blueLight border border-steam-blueLight/30 hover:border-steam-blueLight/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 font-medium"
                aria-label="Enviar um novo jogo"
              >
                <span>Enviar Jogo</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  {isTeacher && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-steam-green/10 hover:bg-steam-green/20 text-steam-green border border-steam-green/30 hover:border-steam-green/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-green focus-visible:outline-offset-2 font-medium"
                      aria-label="Painel administrativo"
                    >
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-steam-blueLight hover:bg-steam-dark/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2"
                    aria-label={`Ver perfil de ${user?.name}`}
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">Meu Perfil</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 hover:border-red-600/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 font-medium text-left"
                    aria-label="Fazer logout e sair da conta"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>Sair</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-steam-blueLight hover:bg-steam-blue text-white transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 font-medium ripple-effect"
                  aria-label="Fazer login na plataforma"
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
