"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Gamepad2, LogOut, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isTeacher } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery)}`);
      // Limpar o campo de busca após navegar
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-steam-darker/95 backdrop-blur-md border-b border-steam-blue/50 sticky top-0 z-50 shadow-lg" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-steam-blueLight hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2"
            aria-label="Página inicial - SENAI Dr. Celso Charuri Game HUB"
          >
            <Gamepad2 className="w-8 h-8" aria-hidden="true" />
            <span className="text-xl font-bold hidden sm:inline">SENAI Dr. Celso Charuri Game HUB</span>
            <span className="text-xl font-bold sm:hidden">Game HUB</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-2xl" role="search" aria-label="Buscar jogos">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" 
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar jogos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-steam-dark border border-steam-blue rounded px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight focus-visible:ring-2 focus-visible:ring-steam-blueLight"
                aria-label="Campo de busca de jogos"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">Digite o nome do jogo ou autor para buscar</span>
            </div>
          </form>

          <nav id="navigation" className="flex items-center gap-2 md:gap-4 flex-wrap justify-center" role="navigation" aria-label="Navegação principal">
            <Link
              href="/games"
              className="text-gray-300 hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-2 py-1"
              aria-label="Ver todos os jogos disponíveis"
            >
              Todos os Jogos
            </Link>
            <Link
              href="/stats"
              className="text-gray-300 hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-2 py-1"
              aria-label="Ver estatísticas do site"
            >
              Estatísticas
            </Link>
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="text-gray-300 hover:text-red-400 transition flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 rounded px-2 py-1"
                aria-label="Ver meus jogos favoritos"
              >
                <Heart className="w-4 h-4" aria-hidden="true" />
                <span>Favoritos</span>
              </Link>
            )}
            <Link
              href="/upload"
              className="text-gray-300 hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-2 py-1"
              aria-label="Enviar um novo jogo"
            >
              Enviar Jogo
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isTeacher && (
                  <Link
                    href="/admin"
                    className="text-steam-green hover:text-green-400 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-green focus-visible:outline-offset-2 rounded px-2 py-1"
                    aria-label="Painel administrativo"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-2 py-1"
                  aria-label={`Ver perfil de ${user?.name}`}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  aria-label="Fazer logout e sair da conta"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-steam-blue hover:bg-steam-blueLight text-white px-4 py-2 rounded transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                aria-label="Fazer login na plataforma"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Entrar</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
