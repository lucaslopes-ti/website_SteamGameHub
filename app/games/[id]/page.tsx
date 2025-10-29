"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/lib/games";
import { Star, Play, Download, User, Calendar, Tag, Code, HardDrive, Eye } from "lucide-react";
import RatingSection from "@/components/RatingSection";
import CommentsSection from "@/components/CommentsSection";
import FavoriteButton from "@/components/FavoriteButton";
import VideoPlayer from "@/components/VideoPlayer";
import ShareButton from "@/components/ShareButton";
import { GameDetailSkeleton } from "@/components/SkeletonLoader";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, Image as ImageIcon, X } from "lucide-react";

export default function GameDetailPage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [views, setViews] = useState(0);

  useEffect(() => {
    loadGame();
    registerView();
    loadViews();
  }, [params.id]);

  const registerView = async () => {
    try {
      await fetch(`/api/games/${params.id}/views`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Erro ao registrar visualização:", error);
    }
  };

  const loadViews = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}/views`);
      if (response.ok) {
        const data = await response.json();
        setViews(data.views || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar visualizações:", error);
    }
  };

  const loadGame = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data);
      } else {
        setGame(null);
      }
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GameDetailSkeleton />
      </div>
    );
  }

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative h-64 md:h-96 bg-steam-blue rounded-lg overflow-hidden mb-6">
          {game.image ? (
            <Image
              src={game.image}
              alt={game.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
              Sem imagem disponível
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <h1 className="text-4xl font-bold text-white">{game.title}</h1>
              <div className="flex items-center gap-4">
                <FavoriteButton gameId={game.id} size="lg" />
                <ShareButton gameId={game.id} gameTitle={game.title} />
              </div>
            </div>
            <p className="text-gray-300 text-lg mb-6">{game.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              {game.playableLink && (
                <Link
                  href={game.playableLink}
                  target="_blank"
                  className="flex items-center gap-2 bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-3 rounded font-semibold transition"
                >
                  <Play className="w-5 h-5" />
                  Jogar Agora
                </Link>
              )}
              {game.executableFile && (
                <a
                  href={`/uploads/games/${game.executableFile}`}
                  download={game.executableFileName || game.executableFile}
                  onClick={async () => {
                    // Registrar download se usuário estiver logado
                    if (isAuthenticated && user) {
                      try {
                        await fetch("/api/downloads", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            gameId: game.id,
                            userId: user.email,
                          }),
                        });
                      } catch (error) {
                        console.error("Erro ao registrar download:", error);
                      }
                    }
                  }}
                  className="flex items-center gap-2 bg-steam-green hover:bg-green-600 text-white px-6 py-3 rounded font-semibold transition"
                >
                  <Download className="w-5 h-5" />
                  Baixar Jogo
                  {game.executableFileSize && (
                    <span className="text-sm opacity-90">
                      ({formatFileSize(game.executableFileSize)})
                    </span>
                  )}
                </a>
              )}
              {game.downloadLink && !game.executableFile && (
                <Link
                  href={game.downloadLink}
                  target="_blank"
                  className="flex items-center gap-2 bg-steam-green hover:bg-green-600 text-white px-6 py-3 rounded font-semibold transition"
                >
                  <Download className="w-5 h-5" />
                  Download
                </Link>
              )}
            </div>

            {game.trailerUrl && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-steam-blueLight">
                  Trailer
                </h2>
                <VideoPlayer url={game.trailerUrl} title={game.title} />
              </div>
            )}

            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-steam-blueLight flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Screenshots
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScreenshot(screenshot)}
                      className="relative aspect-video bg-steam-dark rounded overflow-hidden hover:ring-2 ring-steam-blueLight transition group"
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedScreenshot && (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedScreenshot(null)}
              >
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                >
                  <X className="w-8 h-8" />
                </button>
                <img
                  src={selectedScreenshot}
                  alt="Screenshot ampliada"
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <RatingSection gameId={game.id} currentRating={game.rating} />

            <div className="mt-8">
              <CommentsSection gameId={game.id} />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-steam-dark rounded-lg p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-steam-blueLight">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{game.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {game.totalRatings} avaliação{game.totalRatings !== 1 ? "ões" : ""}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-steam-blueLight">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Autor</span>
                </div>
                <p className="text-white">{game.author}</p>
                <p className="text-gray-400 text-sm">{game.authorEmail}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-steam-blueLight">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Data de Lançamento</span>
                </div>
                <p className="text-white">
                  {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-steam-blueLight">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">Visualizações</span>
                </div>
                <p className="text-white">
                  {views.toLocaleString("pt-BR")}
                </p>
              </div>

              {game.executableFile && (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-steam-blueLight">
                    <HardDrive className="w-5 h-5" />
                    <span className="font-semibold">Arquivo</span>
                  </div>
                  <p className="text-white text-sm break-all">
                    {game.executableFileName || game.executableFile}
                  </p>
                  {game.executableFileSize && (
                    <p className="text-gray-400 text-sm">
                      Tamanho: {formatFileSize(game.executableFileSize)}
                    </p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4 text-steam-blueLight">
                  <Tag className="w-5 h-5" />
                  <span className="font-semibold">Gêneros</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-steam-blue text-steam-blueLight text-sm px-3 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-steam-blueLight">
                  <Code className="w-5 h-5" />
                  <span className="font-semibold">Tecnologias</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {game.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-steam-green text-white text-sm px-3 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
