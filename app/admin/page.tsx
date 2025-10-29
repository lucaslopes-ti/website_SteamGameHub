"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Game } from "@/lib/games";
import { CheckCircle, XCircle, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isTeacher, user } = useAuth();
  const { showToast } = useToast();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) {
      router.push("/login");
      return;
    }
    loadGames();
  }, [isAuthenticated, isTeacher, router]);

  const loadGames = async () => {
    try {
      const response = await fetch("/api/games");
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
      const response = await fetch(`/api/games/${gameId}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        showToast("Jogo aprovado com sucesso!", "success");
        loadGames();
        // Forçar atualização nas outras páginas também
        window.dispatchEvent(new Event("gamesUpdated"));
      } else {
        showToast("Erro ao aprovar jogo", "error");
      }
    } catch (error) {
      showToast("Erro ao aprovar jogo", "error");
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm("Tem certeza que deseja deletar este jogo?")) return;

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showToast("Jogo deletado com sucesso!", "success");
        loadGames();
      } else {
        showToast("Erro ao deletar jogo", "error");
      }
    } catch (error) {
      showToast("Erro ao deletar jogo", "error");
    }
  };

  const filteredGames =
    filter === "all"
      ? games
      : filter === "pending"
      ? games.filter((g) => g.pending && !g.approved)
      : games.filter((g) => g.approved);

  if (!isAuthenticated || !isTeacher) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-steam-blueLight">
          Painel Administrativo
        </h1>
        <div className="text-gray-400">
          Logado como: <span className="text-white">{user?.name}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded transition ${
            filter === "pending"
              ? "bg-steam-blueLight text-white"
              : "bg-steam-dark text-gray-300 hover:bg-steam-blue"
          }`}
        >
          Aguardando Aprovação ({games.filter((g) => g.pending && !g.approved).length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded transition ${
            filter === "approved"
              ? "bg-steam-green text-white"
              : "bg-steam-dark text-gray-300 hover:bg-steam-blue"
          }`}
        >
          Aprovados ({games.filter((g) => g.approved).length})
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded transition ${
            filter === "all"
              ? "bg-steam-blue text-white"
              : "bg-steam-dark text-gray-300 hover:bg-steam-blue"
          }`}
        >
          Todos ({games.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-steam-blueLight" />
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="bg-steam-dark rounded-lg p-12 text-center">
          <p className="text-gray-400 text-xl">
            Nenhum jogo encontrado nesta categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-steam-dark rounded-lg p-6 border border-steam-blue"
            >
              <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
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
                    className="bg-steam-blue text-steam-blueLight text-xs px-2 py-1 rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/games/${game.id}`}
                  className="flex-1 bg-steam-blue hover:bg-steam-blueLight text-white px-4 py-2 rounded text-center transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </Link>
                {!game.approved && (
                  <button
                    onClick={() => handleApprove(game.id)}
                    className="bg-steam-green hover:bg-green-600 text-white px-4 py-2 rounded transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprovar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(game.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
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

