"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/lib/comments";
import { MessageSquare, Send, Trash2, User } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { Loader2 } from "lucide-react";
import { authedFetch } from "@/lib/client-auth";
import Link from "next/link";

interface CommentsSectionProps {
  gameId: string;
}

export default function CommentsSection({ gameId }: CommentsSectionProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Aguarda a hidratação da sessão para que authedFetch anexe o token
    // (comentários de jogos pendentes dependem da visibilidade do ator).
    if (authLoading) return;
    loadComments();
  }, [gameId, authLoading]);

  const loadComments = async () => {
    try {
      const response = await authedFetch(`/api/games/${gameId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.sort((a: Comment, b: Comment) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      showToast("Faça login para comentar", "info");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authedFetch(`/api/games/${gameId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: user?.name || "",
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment("");
        showToast("Comentário enviado com sucesso!", "success");
        loadComments();
      } else if (response.status === 401 || response.status === 403) {
        showToast("Faça login para comentar", "info");
      } else {
        showToast("Erro ao enviar comentário", "error");
      }
    } catch (error) {
      showToast("Erro ao enviar comentário", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Tem certeza que deseja deletar este comentário?")) return;

    try {
      const response = await authedFetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Comentário deletado com sucesso!", "success");
        loadComments();
      } else if (response.status === 401 || response.status === 403) {
        showToast("Você não tem permissão para deletar este comentário", "error");
      } else {
        showToast("Erro ao deletar comentário", "error");
      }
    } catch (error) {
      showToast("Erro ao deletar comentário", "error");
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
            Comentários
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {comments.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">Participe da conversa e deixe seu feedback para os criadores</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6" aria-label="Formulário de comentários">
        {!isAuthenticated && (
          <div className="mb-4 bg-slate-950/60 border border-white/10 rounded-xl p-3.5 sm:p-4 text-slate-300 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs sm:text-sm text-slate-300">Faça login para deixar um comentário.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-senai-orange to-amber-500 hover:brightness-110 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-glow-orange active:scale-95"
            >
              Entrar
            </Link>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="comment-text" className="sr-only">
              Escreva seu comentário
            </label>
            <textarea
              id="comment-text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário sobre o jogo..."
              rows={3}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-senai-orange focus:ring-1 focus:ring-senai-orange/50 resize-y transition-colors text-sm"
              aria-label="Campo de texto para escrever seu comentário"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || submitting || !isAuthenticated}
            className="bg-gradient-to-r from-senai-orange to-amber-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-glow-orange flex items-center justify-center gap-2 h-fit active:scale-95 text-sm w-full sm:w-auto"
            aria-label={submitting ? "Enviando comentário, aguarde" : "Enviar comentário"}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span className="sr-only">Enviando</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Enviar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-8" role="status" aria-live="polite" aria-label="Carregando comentários">
          <Loader2 className="w-6 h-6 animate-spin text-senai-orange" aria-hidden="true" />
          <span className="sr-only">Carregando comentários</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-slate-400 bg-slate-950/30 rounded-xl border border-white/5" role="status">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" aria-hidden="true" />
          <p className="text-sm">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label={`Lista de ${comments.length} comentário${comments.length > 1 ? "s" : ""}`}>
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="bg-slate-950/50 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
              role="listitem"
              aria-labelledby={`comment-author-${comment.id}`}
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-senai-orange shrink-0">
                    <User className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div id={`comment-author-${comment.id}`}>
                    <p className="text-white text-sm font-semibold leading-tight">{comment.author}</p>
                    <time 
                      className="text-slate-400 text-xs"
                      dateTime={comment.createdAt}
                      aria-label={`Comentário publicado em ${new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                    >
                      {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
                {comment.canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="text-slate-400 hover:text-red-400 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 rounded-lg p-1.5 hover:bg-red-500/10"
                    aria-label={`Excluir comentário de ${comment.author}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Excluir comentário</span>
                  </button>
                )}
              </div>
              <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed pl-10">{comment.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

