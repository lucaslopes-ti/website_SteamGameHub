"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Game } from "@/lib/games";
import { CheckCircle, XCircle, Eye, Trash2, Loader2, Search, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import { authedFetch } from "@/lib/client-auth";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isTeacher, isAdmin, loading: authLoading, user } = useAuth();
  // Papel efetivo vem do servidor (custom claims + allowlists server-side).
  const hasAdminAccess = isTeacher || isAdmin;
  const { showToast } = useToast();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !hasAdminAccess) {
      router.push("/login");
      return;
    }
    loadGames();
  }, [authLoading, isAuthenticated, hasAdminAccess, router]);

  const loadGames = async () => {
    try {
      const response = await authedFetch("/api/games");
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (gameId: string) => {
    try {
      const response = await authedFetch(`/api/games/${gameId}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        showToast("Jogo aprovado com sucesso!", "success");
        loadGames();
        window.dispatchEvent(new Event("gamesUpdated"));
      } else if (response.status === 401 || response.status === 403) {
        showToast("Você não tem permissão para aprovar jogos", "error");
      } else {
        showToast("Erro ao aprovar jogo", "error");
      }
    } catch (error) {
      showToast("Erro ao aprovar jogo", "error");
    }
  };

  const handleUnapprove = async (gameId: string) => {
    if (!confirm("Tem certeza que deseja reprovar este jogo? Ele voltará para 'Aguardando Aprovação'.")) return;

    try {
      const response = await authedFetch(`/api/games/${gameId}/approve`, {
        method: "DELETE",
      });
      if (response.ok) {
        showToast("Aprovação revertida! Jogo voltou para pendência.", "success");
        loadGames();
        window.dispatchEvent(new Event("gamesUpdated"));
      } else if (response.status === 401 || response.status === 403) {
        showToast("Você não tem permissão para reprovar jogos", "error");
      } else {
        showToast("Erro ao reprovar jogo", "error");
      }
    } catch (error) {
      showToast("Erro ao reprovar jogo", "error");
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm("Tem certeza que deseja deletar este jogo?")) return;

    try {
      const response = await authedFetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showToast("Jogo deletado com sucesso!", "success");
        loadGames();
      } else if (response.status === 401 || response.status === 403) {
        showToast("Você não tem permissão para deletar este jogo", "error");
      } else {
        showToast("Erro ao deletar jogo", "error");
      }
    } catch (error) {
      showToast("Erro ao deletar jogo", "error");
    }
  };

  // Filtrar jogos por status
  const statusFilteredGames = useMemo(() => {
    if (filter === "all") return games;
    if (filter === "pending") return games.filter((g) => g.pending && !g.approved);
    return games.filter((g) => g.approved);
  }, [games, filter]);

  // Filtrar por busca
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return statusFilteredGames;
    const query = searchQuery.toLowerCase().trim();
    return statusFilteredGames.filter(
      (game) =>
        game.title.toLowerCase().includes(query) ||
        game.author.toLowerCase().includes(query) ||
        game.authorEmail.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
    );
  }, [statusFilteredGames, searchQuery]);

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated || !hasAdminAccess) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-senai-orange">
          Painel Administrativo
        </h1>
        <div className="text-gray-400">
          Logado como: <span className="text-white">{user?.name}</span>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/saep"
          className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-senai-orange/10 to-senai-orange/5 border border-senai-orange/30 hover:border-senai-orange/60 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-senai-orange/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📝
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-senai-orange transition-colors">Gerenciar Questões SAEP</h3>
            <p className="text-sm text-gray-400">Adicionar, importar e remover questões do simulado</p>
          </div>
        </Link>
        <Link
          href="/admin/saep/seed"
          className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-senai-blueLight/10 to-senai-blueLight/5 border border-senai-blueLight/30 hover:border-senai-blueLight/60 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-senai-blueLight/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🌱
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-senai-blueLight transition-colors">Semear Banco SAEP</h3>
            <p className="text-sm text-gray-400">Popular banco com questões pré-definidas</p>
          </div>
        </Link>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título, autor, e-mail ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-senai-blueDark border border-senai-blue rounded px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-senai-orange"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded transition ${
            filter === "pending"
              ? "bg-senai-orange text-slate-950"
              : "bg-senai-blueDark text-gray-300 hover:bg-senai-blue"
          }`}
        >
          Aguardando Aprovação ({games.filter((g) => g.pending && !g.approved).length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded transition ${
            filter === "approved"
              ? "bg-senai-blueLight text-slate-950"
              : "bg-senai-blueDark text-gray-300 hover:bg-senai-blue"
          }`}
        >
          Aprovados ({games.filter((g) => g.approved).length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded transition ${
            filter === "all"
              ? "bg-senai-blue text-white"
              : "bg-senai-blueDark text-gray-300 hover:bg-senai-blue"
          }`}
        >
          Todos ({games.length})
        </button>
      </div>

      {/* Resultados da busca */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-400">
          {filteredGames.length === 0 ? (
            <p>Nenhum jogo encontrado com "{searchQuery}"</p>
          ) : (
            <p>
              {filteredGames.length} resultado{filteredGames.length !== 1 ? "s" : ""} encontrado{filteredGames.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-senai-orange" />
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="bg-senai-blueDark rounded-lg p-12 text-center">
          <p className="text-gray-400 text-xl">
            {searchQuery
              ? `Nenhum jogo encontrado com "${searchQuery}"`
              : "Nenhum jogo encontrado nesta categoria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-senai-blueDark rounded-lg p-6 border border-senai-blue hover:border-senai-orange transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-white flex-1">{game.title}</h3>
                {game.approved && (
                  <span className="bg-senai-blueLight text-slate-950 text-xs px-2 py-1 rounded ml-2">
                    Aprovado
                  </span>
                )}
                {game.pending && !game.approved && (
                  <span className="bg-yellow-600 text-slate-950 text-xs px-2 py-1 rounded ml-2">
                    Pendente
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {game.description}
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-gray-300 text-sm">
                  <strong>Autor:</strong> {game.author}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>E-mail:</strong> {game.authorEmail}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Data:</strong>{" "}
                  {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                </p>
                {game.downloadLink && (
                  <p className="text-gray-300 text-sm">
                    <strong>Link:</strong>{" "}
                    <a
                      href={game.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-senai-orange hover:underline break-all"
                    >
                      {game.downloadLink.substring(0, 40)}...
                    </a>
                  </p>
                )}
                {game.executableFileName && (
                  <p className="text-gray-300 text-sm">
                    <strong>Arquivo:</strong> {game.executableFileName}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {game.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-senai-blueDark text-slate-100 border border-senai-orange/40 text-xs px-2 py-1 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/games/${game.id}`}
                  className="flex-1 bg-senai-blue hover:bg-senai-orange text-white hover:text-slate-950 px-4 py-2 rounded text-center transition flex items-center justify-center gap-2 min-w-[100px]"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </Link>
                {!game.approved ? (
                  <button
                    onClick={() => handleApprove(game.id)}
                    className="bg-senai-blueLight hover:bg-green-600 text-slate-950 hover:text-slate-950 px-4 py-2 rounded transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprovar
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnapprove(game.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-slate-950 px-4 py-2 rounded transition flex items-center gap-2"
                    title="Desfazer aprovação"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reprovar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(game.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
                  title="Deletar jogo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
