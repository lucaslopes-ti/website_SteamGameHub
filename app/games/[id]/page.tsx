"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/lib/games";
import { Star, Play, Download, User, Calendar, Tag, Code, HardDrive, Eye, ChevronDown, ChevronRight, HelpCircle, Image as ImageIcon, X, FileArchive, FolderOpen, ExternalLink, Gamepad2, Sparkles } from "lucide-react";
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
  const { loading: authLoading } = useAuth();
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

  // Registra o download (autenticado ou anônimo) para alimentar as métricas.
  const registerDownload = async (gameId: string) => {
    try {
      await authedFetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });
    } catch (error) {
      console.error("Erro ao registrar download:", error);
    }
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

  const renderClashCard = () => (
    <div className="relative rounded-[24px] border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/20 group w-full max-w-lg mx-auto lg:max-w-none">
      {/* Minimalist Top Edge Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

      {/* Top Card Image / Banner (clash-card__image style) */}
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden bg-gradient-to-br from-slate-950 via-[#0c1527] to-slate-900 flex items-center justify-center">
        {game.image && game.image.trim() !== "" && (game.image.startsWith("http") || game.image.startsWith("/")) && !imageError ? (
          <>
            <Image
              src={game.image}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized={game.image.startsWith("http")}
              loading="lazy"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shadow-xl group-hover:scale-110 group-hover:text-senai-orange transition-all duration-300">
              <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </div>
        )}

        {/* Top Badge: Level / Status Tag (Clash of Clans Level Style) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-slate-950/80 border border-white/15 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-senai-orange backdrop-blur-md shadow-md">
            <Sparkles className="w-3 h-3 fill-current" />
            {game.technologies[0] || "PROJETO SENAI"}
          </span>
        </div>

        {game.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full bg-senai-orange text-slate-950 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-glow-orange">
              Destaque
            </span>
          </div>
        )}
      </div>

      {/* Card Body: Level/Type, Unit Name, Metadata */}
      <div className="p-5 sm:p-6 pt-4 sm:pt-5 space-y-3.5">
        {/* Level / Subtitle */}
        <div className="text-center">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400">
            FICHA TÉCNICA
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight mt-1">
            {game.title}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-1">
            <User className="w-3.5 h-3.5 text-senai-orange shrink-0" />
            <span>por</span>
            <span className="text-slate-200 font-semibold">{game.author}</span>
          </div>
        </div>

        {/* Specs List */}
        <div className="border-t border-white/10 pt-3 space-y-2.5 text-xs">
          {/* Data de Lançamento */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-senai-orange shrink-0" />
              Lançamento
            </span>
            <span className="font-medium text-slate-200">
              {new Date(game.releaseDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Executable File */}
          {game.executableFile && (
            <div className="flex items-center justify-between text-slate-300 gap-2">
              <span className="flex items-center gap-2 text-slate-400 shrink-0">
                <HardDrive className="w-4 h-4 text-senai-orange shrink-0" />
                Arquivo
              </span>
              <span className="font-mono text-slate-200 text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                {game.executableFileName || game.executableFile}
              </span>
            </div>
          )}

          {/* Gêneros */}
          <div>
            <span className="flex items-center gap-2 text-slate-400 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-senai-orange shrink-0" />
              Gêneros
            </span>
            <div className="flex flex-wrap gap-1.5">
              {game.genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-senai-orange/10 border border-senai-orange/30 text-senai-orange-light text-[11px] px-2.5 py-0.5 rounded-lg font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Tecnologias */}
          <div>
            <span className="flex items-center gap-2 text-slate-400 mb-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Tecnologias
            </span>
            <div className="flex flex-wrap gap-1.5">
              {game.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] px-2.5 py-0.5 rounded-lg font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clash of Clans Iconic 3-Column Stats Footer (clash-card__unit-stats) */}
      <div className="grid grid-cols-3 text-center border-t border-white/10 bg-slate-950/70 backdrop-blur-md">
        {/* Stat 1: Rating */}
        <div className="py-3 sm:py-3.5 px-1 sm:px-2 border-r border-white/10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-base sm:text-lg lg:text-xl font-display font-black text-amber-400">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5 truncate max-w-full px-1">
            {game.totalRatings} avaliaç{game.totalRatings === 1 ? "ão" : "ões"}
          </span>
        </div>

        {/* Stat 2: Views */}
        <div className="py-3 sm:py-3.5 px-1 sm:px-2 border-r border-white/10 flex flex-col items-center justify-center">
          <div className="text-base sm:text-lg lg:text-xl font-display font-black text-cyan-400">
            {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5 truncate max-w-full px-1">
            Visualizações
          </span>
        </div>

        {/* Stat 3: Size or Engine */}
        <div className="py-3 sm:py-3.5 px-1 sm:px-2 flex flex-col items-center justify-center">
          <div className="text-base sm:text-lg lg:text-xl font-display font-black text-senai-orange truncate max-w-full px-1">
            {game.executableFileSize
              ? formatFileSize(game.executableFileSize)
              : game.technologies[0] || "PC"}
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5 truncate max-w-full px-1">
            {game.executableFileSize ? "Tamanho" : "Plataforma"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl 2xl:max-w-[1400px]">
      {/* Breadcrumb Trail */}
      <nav aria-label="Navegação estrutural" className="flex items-center gap-1.5 sm:gap-2 text-xs md:text-sm text-slate-400 mb-4 sm:mb-6 flex-wrap font-medium">
        <Link href="/" className="hover:text-senai-orange transition-colors">Início</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <Link href="/games" className="hover:text-senai-orange transition-colors">Jogos</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-slate-200 truncate max-w-[140px] xs:max-w-[200px] sm:max-w-md">{game.title}</span>
      </nav>

      {/* Hero Media Section */}
      <div className="relative mb-8 sm:mb-10 group">
        {/* Ambient Backlight Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-senai-orange/20 via-cyan-500/15 to-senai-blueLight/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

        {/* Media Frame */}
        <div className="relative h-56 sm:h-72 md:h-96 lg:h-[460px] xl:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl">
          {game.image && game.image.trim() !== "" && (game.image.startsWith("http") || game.image.startsWith("/")) && !imageError ? (
            <>
              <Image
                src={game.image}
                alt={`Capa do jogo ${game.title}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized={game.image.startsWith("http")}
                loading="eager"
                quality={95}
                onError={() => {
                  console.error("Erro ao carregar imagem:", game.image);
                  setImageError(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
            </>
          ) : game.image && game.image.trim() !== "" && (game.image.startsWith("http") || game.image.startsWith("/")) && imageError ? (
            <div className="w-full h-full relative">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-[#0a1120] to-slate-950">
              <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shadow-xl group-hover:scale-110 group-hover:text-senai-orange transition-all duration-300">
                  <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
                </div>
                <div>
                  <span className="font-display text-base sm:text-lg font-semibold text-slate-200">Vitrine SENAI Game Hub</span>
                  <p className="text-xs text-slate-400 mt-1">Capa oficial do jogo</p>
                </div>
              </div>
            </div>
          )}

          {/* Floating badges on top left */}
          <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 flex items-center gap-2 z-10">
            {game.featured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-senai-orange text-slate-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-glow-orange">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                Destaque
              </span>
            )}
            {game.genres && game.genres[0] && (
              <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full glass-strong text-[11px] sm:text-xs font-semibold text-slate-200 border border-white/15 backdrop-blur-md">
                {game.genres[0]}
              </span>
            )}
          </div>

          {/* Floating rating badge on top right */}
          <div className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 z-10">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full glass-strong border border-white/15 text-white shadow-lg backdrop-blur-md text-xs sm:text-sm font-bold">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-normal">({game.totalRatings})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Left Column (Content, Actions, Media, Reviews) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Game Title & Header Actions */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                {game.title}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start">
                <FavoriteButton gameId={game.id} size="lg" />
                <ShareButton gameId={game.id} gameTitle={game.title} />
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-normal">
              {game.description}
            </p>

            {/* Action Buttons */}
            {(game.downloadLink || game.executableFile) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {game.executableFile && (
                  <a
                    href={`/uploads/games/${game.executableFile}`}
                    download={game.executableFileName || game.executableFile}
                    onClick={() => registerDownload(game.id)}
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-senai-orange via-amber-500 to-senai-orange hover:brightness-110 text-slate-950 font-bold px-6 sm:px-7 py-3.5 rounded-xl shadow-glow-orange transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5 shrink-0" />
                    <span>Baixar Jogo</span>
                    {game.executableFileSize && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-950/20 text-slate-950 font-mono font-semibold shrink-0">
                        {formatFileSize(game.executableFileSize)}
                      </span>
                    )}
                  </a>
                )}
                {game.downloadLink && (
                  <Link
                    href={game.downloadLink}
                    target="_blank"
                    onClick={() => registerDownload(game.id)}
                    className={`inline-flex items-center justify-center gap-2.5 ${
                      game.executableFile
                        ? "bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 hover:text-white"
                        : "bg-gradient-to-r from-senai-orange via-amber-500 to-senai-orange hover:brightness-110 text-slate-950 font-bold shadow-glow-orange transform hover:-translate-y-0.5"
                    } px-6 py-3.5 rounded-xl transition-all text-sm md:text-base active:scale-95 w-full sm:w-auto`}
                  >
                    <Download className="w-5 h-5 shrink-0" />
                    <span>{game.executableFile ? "Link Alternativo" : "Download (Google Drive)"}</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile/Tablet Card: placed right after title, description and download buttons */}
          <div className="block lg:hidden pt-2">
            {renderClashCard()}
          </div>

          {/* Download & Run Tutorial Accordion */}
          {(game.downloadLink || game.executableFile) && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all shadow-lg">
              <button
                onClick={() => setShowGuide((v: boolean) => !v)}
                className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-slate-950/40 hover:bg-slate-950/70 text-slate-200 hover:text-white font-semibold transition-colors text-left"
                aria-expanded={showGuide}
              >
                <span className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-senai-orange shrink-0" />
                  Como baixar e executar este jogo?
                </span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 shrink-0 ${showGuide ? "rotate-180" : ""}`}
                />
              </button>

              {showGuide && (
                <div className="px-4 sm:px-6 py-4 sm:py-5 bg-slate-950/60 border-t border-white/5 space-y-4 text-xs sm:text-sm animate-fadeIn">
                  {game.executableFile ? (
                    <ol className="space-y-3 sm:space-y-3.5 text-slate-300">
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">1</span>
                        <span>Clique no botão <strong className="text-white">Baixar Jogo</strong> acima — o arquivo será baixado direto para o seu computador.</span>
                      </li>
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">2</span>
                        <span>Aguarde o download terminar e abra o arquivo baixado (normalmente em <strong className="text-white">Downloads</strong>).</span>
                      </li>
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">3</span>
                        <span>Se o Windows exibir o aviso do SmartScreen, clique em <strong className="text-white">Mais informações</strong> e depois em <strong className="text-white">Executar mesmo assim</strong>.</span>
                      </li>
                    </ol>
                  ) : (
                    <ol className="space-y-3 sm:space-y-3.5 text-slate-300">
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">1</span>
                        <span className="flex items-center gap-1.5 flex-wrap"><ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Clique em <strong className="text-white">Download (Google Drive)</strong> para abrir o link do arquivo.</span>
                      </li>
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">2</span>
                        <span className="flex items-center gap-1.5 flex-wrap"><Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> No Google Drive, clique no ícone de <strong className="text-white">download</strong> para salvar o arquivo ZIP.</span>
                      </li>
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">3</span>
                        <span className="flex items-center gap-1.5 flex-wrap"><FileArchive className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Localize o arquivo ZIP baixado e clique com o botão direito para <strong className="text-white">Extrair tudo</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">4</span>
                        <span className="flex items-center gap-1.5 flex-wrap"><FolderOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Abra a pasta extraída e procure pelo arquivo executável <strong className="text-white">.exe</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2.5 sm:gap-3">
                        <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-[11px] sm:text-xs">5</span>
                        <span className="flex items-center gap-1.5 flex-wrap"><Play className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Dê um duplo clique no <strong className="text-white">.exe</strong> para jogar!</span>
                      </li>
                    </ol>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/5 text-slate-400 text-xs space-y-1">
                    <p>• Certifique-se de ter espaço em disco antes do download.</p>
                    <p>• Mantenha todos os arquivos na mesma pasta para o jogo carregar os assets corretamente.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trailer */}
          {game.trailerUrl && (
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2 sm:gap-2.5">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-senai-orange fill-senai-orange" />
                Trailer Oficial
              </h2>
              <VideoPlayer url={game.trailerUrl} title={game.title} />
            </div>
          )}

          {/* Screenshots Gallery */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2 sm:gap-2.5">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-senai-orange" />
                Screenshots ({game.screenshots.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                {game.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedScreenshot(screenshot)}
                    className="relative aspect-video bg-slate-950/60 rounded-xl overflow-hidden border border-white/10 hover:border-senai-orange/60 transition-all duration-300 group shadow-lg hover:scale-105 active:scale-95"
                    aria-label={`Ver screenshot ${index + 1} em tamanho maior`}
                  >
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1} do jogo ${game.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screenshot Modal Viewer */}
          {selectedScreenshot && (
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
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
                className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full p-2 sm:p-2.5 transition transform hover:scale-110 border border-white/10 shadow-lg z-10"
                aria-label="Fechar visualização ampliada"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <img
                src={selectedScreenshot}
                alt={`Screenshot ampliado do jogo ${game.title}`}
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
                loading="eager"
              />
            </div>
          )}

          {/* Community Rating */}
          <RatingSection gameId={game.id} currentRating={game.rating} />

          {/* Comments */}
          <CommentsSection gameId={game.id} />
        </div>

        {/* Right Column (Clash of Clans Inspired Game Card - Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="lg:sticky lg:top-20 space-y-4">
            {renderClashCard()}
          </div>
        </div>
      </div>
    </div>
  );
}
