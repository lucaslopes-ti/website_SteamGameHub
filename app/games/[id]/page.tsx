"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/lib/games";
import { Star, Play, Download, User, Calendar, Tag, Code, HardDrive, Eye, ChevronDown, HelpCircle, Image as ImageIcon, X, FileArchive, FolderOpen, ExternalLink } from "lucide-react";
import RatingSection from "@/components/RatingSection";
import CommentsSection from "@/components/CommentsSection";
import FavoriteButton from "@/components/FavoriteButton";
import VideoPlayer from "@/components/VideoPlayer";
import ShareButton from "@/components/ShareButton";
import { GameDetailSkeleton } from "@/components/SkeletonLoader";
import { useAuth } from "@/components/AuthProvider";
import { authedFetch } from "@/lib/client-auth";

export default function GameDetailPage() {
  const params = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [views, setViews] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Aguarda a hidratação da sessão para que authedFetch anexe o token.
    if (authLoading) return;
    loadGame();
    registerView();
  }, [params.id, authLoading]);

  const registerView = async () => {
    try {
      const res = await authedFetch(`/api/games/${params.id}/views`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.views === "number") setViews(data.views);
      }
      // Fazer GET para garantir consistência com a origem de dados
      loadViews();
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
      // authedFetch permite que autor/staff vejam jogos pendentes.
      const response = await authedFetch(`/api/games/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data);
        setImageError(false); // Reset erro ao carregar novo jogo
        console.log("Jogo carregado:", { id: data.id, title: data.title, image: data.image || "N/A" });
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
        <div className="relative h-64 md:h-96 bg-senai-blue rounded-lg overflow-hidden mb-6">
          {game.image && game.image.trim() !== "" && (game.image.startsWith("http") || game.image.startsWith("/")) && !imageError ? (
            <Image
              src={game.image}
              alt={`Capa do jogo ${game.title}`}
              fill
              className="object-cover"
              unoptimized={game.image.startsWith("http")}
              loading="lazy"
              quality={90}
              onError={() => {
                console.error("Erro ao carregar imagem:", game.image);
                setImageError(true);
              }}
            />
          ) : game.image && game.image.trim() !== "" && (game.image.startsWith("http") || game.image.startsWith("/")) && imageError ? (
            // Fallback: usar img tag normal se Next.js Image falhar
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
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
                  className="flex items-center gap-2 bg-senai-orange hover:bg-senai-blue text-slate-950 hover:text-white px-6 py-3 rounded font-semibold transition"
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
                        await authedFetch("/api/downloads", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            gameId: game.id,
                          }),
                        });
                      } catch (error) {
                        console.error("Erro ao registrar download:", error);
                      }
                    }
                  }}
                  className="flex items-center gap-2 bg-senai-blueLight hover:bg-green-600 text-slate-950 hover:text-slate-950 px-6 py-3 rounded font-semibold transition"
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
                  className="flex items-center gap-2 bg-senai-blueLight hover:bg-green-600 text-slate-950 hover:text-slate-950 px-6 py-3 rounded font-semibold transition"
                >
                  <Download className="w-5 h-5" />
                  Download
                </Link>
              )}
            </div>

            {/* Tutorial de download */}
            {(game.downloadLink || game.executableFile) && (
              <div className="mb-6 border border-senai-blue/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowGuide((v: boolean) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-senai-blueDark/60 hover:bg-senai-blueDark text-senai-orange font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Como baixar e executar este jogo?
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showGuide ? "rotate-180" : ""}`}
                  />
                </button>

                {showGuide && (
                  <div className="px-5 py-4 bg-senai-dark space-y-3 text-sm">
                    {game.executableFile ? (
                      // Guia para download direto
                      <ol className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senai-blueLight/20 border border-senai-blueLight/40 flex items-center justify-center text-slate-100 font-bold text-xs">1</span>
                          <span>Clique no botão <strong className="text-white">Baixar Jogo</strong> acima — o arquivo será baixado direto para o seu computador.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senai-blueLight/20 border border-senai-blueLight/40 flex items-center justify-center text-slate-100 font-bold text-xs">2</span>
                          <span>Aguarde o download terminar e abra o arquivo baixado (normalmente em <strong className="text-white">Downloads</strong>).</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-senai-blueLight/20 border border-senai-blueLight/40 flex items-center justify-center text-slate-100 font-bold text-xs">3</span>
                          <span>Se o Windows exibir um aviso de segurança, clique em <strong className="text-white">Mais informações</strong> e depois em <strong className="text-white">Executar mesmo assim</strong>.</span>
                        </li>
                      </ol>
                    ) : (
                      // Guia para Google Drive / link externo
                      <ol className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">1</span>
                          <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Clique em <strong className="text-white">Download</strong> para abrir o Google Drive.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">2</span>
                          <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> No Google Drive, clique no ícone de <strong className="text-white">download</strong> para salvar o arquivo ZIP.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">3</span>
                          <span className="flex items-center gap-1.5"><FileArchive className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Localize o arquivo ZIP baixado e <strong className="text-white">extraia</strong> todo o conteúdo para uma pasta.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">4</span>
                          <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Abra a pasta extraída e procure pelo arquivo <strong className="text-white">.exe</strong>.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">5</span>
                          <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> Dê um duplo clique no <strong className="text-white">.exe</strong> para iniciar o jogo. Se o Windows bloquear, clique em <strong className="text-white">Mais informações → Executar mesmo assim</strong>.</span>
                        </li>
                      </ol>
                    )}

                    <div className="mt-3 pt-3 border-t border-senai-blue/20 text-gray-400 text-xs space-y-1">
                      <p>Certifique-se de ter espaço suficiente em disco antes de baixar.</p>
                      <p>Mantenha todos os arquivos na mesma pasta para o jogo funcionar corretamente.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {game.trailerUrl && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-senai-orange">
                  Trailer
                </h2>
                <VideoPlayer url={game.trailerUrl} title={game.title} />
              </div>
            )}

            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-senai-orange flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Screenshots
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedScreenshot(screenshot)}
                      className="relative aspect-video bg-senai-blueDark rounded-lg overflow-hidden hover:ring-2 ring-senai-orange transition-all group shadow-lg"
                      aria-label={`Ver screenshot ${index + 1} em tamanho maior`}
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1} do jogo ${game.title}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition transform scale-0 group-hover:scale-100" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedScreenshot && (
              <div
                className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={() => setSelectedScreenshot(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Visualização ampliada do screenshot"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSelectedScreenshot(null);
                  }
                }}
                tabIndex={-1}
              >
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition transform hover:scale-110 shadow-lg z-10"
                  aria-label="Fechar visualização ampliada"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={selectedScreenshot}
                  alt={`Screenshot ampliado do jogo ${game.title}`}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  loading="eager"
                />
              </div>
            )}

            <RatingSection gameId={game.id} currentRating={game.rating} />

            <div className="mt-8">
              <CommentsSection gameId={game.id} />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-senai-blueDark rounded-lg p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-senai-orange">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{game.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {game.totalRatings} avaliação{game.totalRatings !== 1 ? "ões" : ""}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-senai-orange">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Autor</span>
                </div>
                <p className="text-white">{game.author}</p>
                <p className="text-gray-400 text-sm">{game.authorEmail}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-senai-orange">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Data de Lançamento</span>
                </div>
                <p className="text-white">
                  {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-senai-orange">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">Visualizações</span>
                </div>
                <p className="text-white">
                  {views.toLocaleString("pt-BR")}
                </p>
              </div>

              {game.executableFile && (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-senai-orange">
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
                <div className="flex items-center gap-2 mb-4 text-senai-orange">
                  <Tag className="w-5 h-5" />
                  <span className="font-semibold">Gêneros</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-senai-blueDark/40 text-senai-orange border border-senai-orange/30 text-sm px-3 py-1 rounded font-semibold"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-senai-orange">
                  <Code className="w-5 h-5" />
                  <span className="font-semibold">Tecnologias</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {game.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-senai-blue/20 text-slate-100 border border-senai-blueLight/30 text-sm px-3 py-1 rounded font-semibold"
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
