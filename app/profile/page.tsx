"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Game } from "@/lib/games";
import { User, Mail, Gamepad2, Calendar, Star, Download, Eye, Edit, Trash2, Loader2, History } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [myGames, setMyGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    approvedGames: 0,
    pendingGames: 0,
    totalRatings: 0,
    averageRating: 0,
  });
  const [downloadHistory, setDownloadHistory] = useState<{ game: Game; downloadedAt: string }[]>([]);
  const [showDownloadHistory, setShowDownloadHistory] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadMyGames();
    loadDownloadHistory();
  }, [isAuthenticated, user, router]);

  const loadMyGames = async () => {
    try {
      const response = await fetch("/api/games");
      if (response.ok) {
        const allGames: Game[] = await response.json();
        const filtered = allGames.filter((g) => g.authorEmail === user?.email);
        setMyGames(filtered);

        // Calcular estatísticas
        const approved = filtered.filter((g) => g.approved).length;
        const pending = filtered.filter((g) => g.pending && !g.approved).length;
        const totalRatings = filtered.reduce((sum, g) => sum + g.totalRatings, 0);
        const avgRating =
          filtered.length > 0
            ? filtered.reduce((sum, g) => sum + g.rating, 0) / filtered.length
            : 0;

        setStats({
          totalGames: filtered.length,
          approvedGames: approved,
          pendingGames: pending,
          totalRatings,
          averageRating: avgRating,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm("Tem certeza que deseja deletar este jogo?")) return;

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadMyGames();
      }
    } catch (error) {
      alert("Erro ao deletar jogo");
    }
  };

  const loadDownloadHistory = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/downloads?userId=${user.email}`);
      if (response.ok) {
        const downloads = await response.json();
        
        // Buscar detalhes dos jogos
        const gamesResponse = await fetch("/api/games");
        if (gamesResponse.ok) {
          const allGames: Game[] = await gamesResponse.json();
          const history = downloads
            .map((download: any) => {
              const game = allGames.find((g) => g.id === download.gameId);
              return game ? { game, downloadedAt: download.downloadedAt } : null;
            })
            .filter((item: any) => item !== null)
            .sort((a: any, b: any) => 
              new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
            );
          setDownloadHistory(history);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar histórico de downloads:", error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-steam-blueLight">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-steam-dark rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-steam-blueLight rounded-full p-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-steam-blue">
            <p className="text-gray-400 text-sm mb-1">Tipo de Conta</p>
            <p className="text-steam-blueLight font-semibold capitalize">
              {user.role === "student" ? "Aluno" : user.role === "teacher" ? "Professor" : "Administrador"}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-steam-dark rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <History className="w-5 h-5 text-steam-blueLight" />
            Estatísticas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-steam-darker rounded p-4 border border-steam-blue/30 hover:border-steam-blueLight transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="w-5 h-5 text-steam-blueLight" />
                <p className="text-gray-400 text-sm">Total de Jogos</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalGames}</p>
            </div>
            <div className="bg-steam-darker rounded p-4 border border-steam-green/30 hover:border-steam-green transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-steam-green" />
                <p className="text-gray-400 text-sm">Aprovados</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.approvedGames}</p>
            </div>
            <div className="bg-steam-darker rounded p-4 border border-yellow-400/30 hover:border-yellow-400 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <p className="text-gray-400 text-sm">Aguardando</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.pendingGames}</p>
            </div>
            <div className="bg-steam-darker rounded p-4 border border-yellow-400/30 hover:border-yellow-400 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <p className="text-gray-400 text-sm">Avaliação Média</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-steam-blueLight">Meus Jogos</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDownloadHistory(!showDownloadHistory)}
            className="bg-steam-blue hover:bg-steam-blueLight text-white px-6 py-2 rounded font-semibold transition flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            Histórico de Downloads
          </button>
          <Link
            href="/upload"
            className="bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-2 rounded font-semibold transition flex items-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            Enviar Novo Jogo
          </Link>
        </div>
      </div>

      {showDownloadHistory && (
        <div className="mb-8 bg-steam-dark rounded-lg p-6 border border-steam-blue">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <History className="w-5 h-5" />
            Histórico de Downloads ({downloadHistory.length})
          </h3>
          {downloadHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Você ainda não baixou nenhum jogo
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downloadHistory.map((item) => (
                <Link
                  key={item.game.id}
                  href={`/games/${item.game.id}`}
                  className="bg-steam-darker rounded p-4 hover:bg-steam-blue transition group"
                >
                  <h4 className="text-white font-semibold mb-2 group-hover:text-steam-blueLight transition">
                    {item.game.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Baixado em: {new Date(item.downloadedAt).toLocaleDateString("pt-BR")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-steam-blueLight" />
        </div>
      ) : myGames.length === 0 ? (
        <div className="bg-steam-dark rounded-lg p-12 text-center">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <p className="text-gray-400 text-xl mb-4">Você ainda não enviou nenhum jogo</p>
          <Link
            href="/upload"
            className="inline-block bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-3 rounded font-semibold transition"
          >
            Enviar Primeiro Jogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGames.map((game) => (
            <div
              key={game.id}
              className="bg-steam-dark rounded-lg overflow-hidden border border-steam-blue"
            >
              {game.image && (
                <div className="relative h-48 bg-steam-blue">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  {!game.approved && game.pending && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      AGUARDANDO
                    </div>
                  )}
                  {game.approved && (
                    <div className="absolute top-2 right-2 bg-steam-green text-white px-2 py-1 rounded text-xs font-bold">
                      APROVADO
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {game.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{game.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/games/${game.id}`}
                    className="flex-1 bg-steam-blue hover:bg-steam-blueLight text-white px-4 py-2 rounded text-center transition text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Link>
                  {game.approved && (
                    <Link
                      href={`/games/${game.id}/edit`}
                      className="bg-steam-green hover:bg-green-600 text-white px-4 py-2 rounded transition"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                  {!game.approved && (
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

