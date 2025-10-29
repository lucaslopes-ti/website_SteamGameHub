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
    <header className="bg-steam-darker border-b border-steam-blue sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-steam-blueLight hover:text-white transition">
            <Gamepad2 className="w-8 h-8" />
            <span className="text-xl font-bold hidden sm:inline">SENAI Dr. Celso Charuri Game HUB</span>
            <span className="text-xl font-bold sm:hidden">Game HUB</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar jogos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-steam-dark border border-steam-blue rounded px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
              />
            </div>
          </form>

          <nav className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            <Link
              href="/games"
              className="text-gray-300 hover:text-steam-blueLight transition"
            >
              Todos os Jogos
            </Link>
            <Link
              href="/stats"
              className="text-gray-300 hover:text-steam-blueLight transition"
            >
              Estatísticas
            </Link>
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="text-gray-300 hover:text-red-400 transition flex items-center gap-1"
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>
            )}
            <Link
              href="/upload"
              className="text-gray-300 hover:text-steam-blueLight transition"
            >
              Enviar Jogo
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isTeacher && (
                  <Link
                    href="/admin"
                    className="text-steam-green hover:text-green-400 transition"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-steam-blueLight transition"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-steam-blue hover:bg-steam-blueLight text-white px-4 py-2 rounded transition"
              >
                <User className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
