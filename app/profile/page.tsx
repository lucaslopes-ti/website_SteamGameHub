"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useI18n } from "@/components/I18nProvider";
import { Game } from "@/lib/games";
import { User, Mail, Gamepad2, Calendar, Star, Eye, Edit, Trash2, Loader2, History } from "lucide-react";
import Link from "next/link";
import { authedFetch } from "@/lib/client-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { language, t } = useI18n();
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
  const locale = language === "pt" ? "pt-BR" : "en-US";

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadMyGames();
    loadDownloadHistory();
  }, [isAuthenticated, authLoading, user, router]);

  const loadMyGames = async () => {
    try {
      const response = await authedFetch("/api/games");
      if (response.ok) {
        const allGames: Game[] = await response.json();
        const filtered = allGames.filter(
          (g) => g.authorUid === user?.id || g.authorEmail === user?.email
        );
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
    if (!confirm(t("profile.deleteConfirm"))) return;

    try {
      const response = await authedFetch(`/api/games/${gameId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadMyGames();
      } else if (response.status === 401 || response.status === 403) {
        alert(t("profile.deleteError"));
      }
    } catch {
      alert(t("profile.deleteError"));
    }
  };

  const loadDownloadHistory = async () => {
    if (!user) return;
    
    try {
      const response = await authedFetch(`/api/downloads`);
      if (response.ok) {
        const downloads = await response.json();
        
        // Buscar detalhes dos jogos
        const gamesResponse = await authedFetch("/api/games");
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

  // Papel efetivo vem do servidor (custom claims + allowlists server-side).
  let roleLabel = t("profile.roleStudent");
  if (user.role === "admin") {
    roleLabel = t("profile.roleAdmin");
  } else if (user.role === "teacher") {
    roleLabel = t("profile.roleTeacher");
  }

  let myGamesContent: React.ReactNode;
  if (loading) {
    myGamesContent = (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-senai-orange" />
      </div>
    );
  } else if (myGames.length === 0) {
    myGamesContent = (
      <div className="bg-senai-blueDark rounded-lg p-12 text-center">
        <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
        <p className="text-gray-400 text-xl mb-4">{t("profile.noGamesUploaded")}</p>
        <Link
          href="/upload"
          className="inline-block bg-senai-orange hover:bg-senai-blue text-slate-950 hover:text-white px-6 py-3 rounded font-semibold transition"
        >
          {t("profile.uploadFirstGame")}
        </Link>
      </div>
    );
  } else {
    myGamesContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myGames.map((game) => (
          <div
            key={game.id}
            className="bg-senai-blueDark rounded-lg overflow-hidden border border-senai-blue"
          >
            {game.image && (
              <div className="relative h-48 bg-senai-blue">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                {!game.approved && game.pending && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-slate-950 px-2 py-1 rounded text-xs font-bold">
                    {t("profile.pendingBadge")}
                  </div>
                )}
                {game.approved && (
                  <div className="absolute top-2 right-2 bg-senai-blueLight text-slate-950 px-2 py-1 rounded text-xs font-bold">
                    {t("profile.approvedBadge")}
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
                  {new Date(game.releaseDate).toLocaleDateString(locale)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/games/${game.id}`}
                  className="flex-1 bg-senai-blue hover:bg-senai-orange text-white hover:text-slate-950 px-4 py-2 rounded text-center transition text-sm flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {t("profile.view")}
                </Link>
                {game.approved && (
                  <Link
                    href={`/games/${game.id}/edit`}
                    className="bg-senai-blueLight hover:bg-green-600 text-slate-950 hover:text-slate-950 px-4 py-2 rounded transition"
                    title={t("profile.edit")}
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                )}
                {!game.approved && (
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    title={t("profile.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-senai-orange">{t("profile.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-senai-blueDark rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-senai-orange rounded-full p-4">
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
          <div className="pt-4 border-t border-senai-blue">
            <p className="text-gray-400 text-sm mb-1">{t("profile.accountType")}</p>
            <p className="text-senai-orange font-semibold capitalize">
              {roleLabel}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-senai-blueDark rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <History className="w-5 h-5 text-senai-orange" />
            {t("header.stats")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-senai-dark rounded p-4 border border-senai-blue/30 hover:border-senai-orange transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="w-5 h-5 text-senai-orange" />
                <p className="text-gray-400 text-sm">{t("statsPage.totalGames")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalGames.toLocaleString(locale)}</p>
            </div>
            <div className="bg-senai-dark rounded p-4 border border-senai-blueLight/30 hover:border-senai-blueLight transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-senai-blueLight" />
                <p className="text-gray-400 text-sm">{t("profile.approved")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.approvedGames.toLocaleString(locale)}</p>
            </div>
            <div className="bg-senai-dark rounded p-4 border border-yellow-400/30 hover:border-yellow-400 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <p className="text-gray-400 text-sm">{t("statsPage.pending")}</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.pendingGames.toLocaleString(locale)}</p>
            </div>
            <div className="bg-senai-dark rounded p-4 border border-yellow-400/30 hover:border-yellow-400 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <p className="text-gray-400 text-sm">{t("statsPage.averageRating")}</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-senai-orange">{t("profile.myGames")}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDownloadHistory(!showDownloadHistory)}
            className="bg-senai-blue hover:bg-senai-orange text-white hover:text-slate-950 px-6 py-2 rounded font-semibold transition flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            {t("profile.downloadHistory")}
          </button>
          <Link
            href="/upload"
            className="bg-senai-orange hover:bg-senai-blue text-slate-950 hover:text-white px-6 py-2 rounded font-semibold transition flex items-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            {t("profile.uploadNewGame")}
          </Link>
        </div>
      </div>

      {showDownloadHistory && (
        <div className="mb-8 bg-senai-blueDark rounded-lg p-6 border border-senai-blue">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <History className="w-5 h-5" />
            {t("profile.downloadHistory")} ({downloadHistory.length.toLocaleString(locale)})
          </h3>
          {downloadHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              {t("profile.noDownloads")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downloadHistory.map((item) => (
                <Link
                  key={item.game.id}
                  href={`/games/${item.game.id}`}
                  className="bg-senai-dark rounded p-4 hover:bg-senai-blue transition group"
                >
                  <h4 className="text-white font-semibold mb-2 group-hover:text-senai-orange transition">
                    {item.game.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {t("profile.downloadedOn")}: {new Date(item.downloadedAt).toLocaleDateString(locale)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {myGamesContent}
    </div>
  );
}

