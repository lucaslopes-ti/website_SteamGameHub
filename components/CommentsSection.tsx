"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/lib/comments";
import { MessageSquare, Send, Trash2, User } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { Loader2 } from "lucide-react";

interface CommentsSectionProps {
  gameId: string;
}

export default function CommentsSection({ gameId }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    loadComments();
  }, [gameId]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}/comments`);
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

    setSubmitting(true);
    try {
      const response = await fetch(`/api/games/${gameId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: isAuthenticated && user ? user.name : guestName.trim() || "Anônimo",
          authorEmail:
            isAuthenticated && user
              ? user.email
              : guestEmail.trim() || `anon-${Date.now()}@example.com`,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        setNewComment("");
        if (!isAuthenticated) {
          setGuestName("");
          setGuestEmail("");
        }
        showToast("Comentário enviado com sucesso!", "success");
        loadComments();
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
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Comentário deletado com sucesso!", "success");
        loadComments();
      } else {
        showToast("Erro ao deletar comentário", "error");
      }
    } catch (error) {
      showToast("Erro ao deletar comentário", "error");
    }
  };

  return (
    <div className="bg-senai-blueDark rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-senai-orange flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Comentários ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6" aria-label="Formulário de comentários">
        {!isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="guest-name" className="sr-only">
                Seu nome (opcional)
              </label>
              <input
                id="guest-name"
                type="text"
                autoComplete="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
                aria-label="Seu nome para exibição no comentário (opcional)"
              />
            </div>
            <div>
              <label htmlFor="guest-email" className="sr-only">
                Seu e-mail (opcional)
              </label>
              <input
                id="guest-email"
                type="email"
                autoComplete="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Seu e-mail (opcional)"
                className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
                aria-label="Seu e-mail (opcional, não será exibido publicamente)"
              />
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="comment-text" className="sr-only">
              Escreva seu comentário
            </label>
            <textarea
              id="comment-text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              rows={3}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange resize-y"
              aria-label="Campo de texto para escrever seu comentário"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="bg-senai-orange hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition flex items-center gap-2 h-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label={submitting ? "Enviando comentário, aguarde" : "Enviar comentário"}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span className="sr-only">Enviando</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
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
        <div className="text-center py-8 text-gray-400" role="status">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
          <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-4" role="list" aria-label={`Lista de ${comments.length} comentário${comments.length > 1 ? "s" : ""}`}>
          {comments.map((comment, index) => (
            <article
              key={comment.id}
              className="bg-senai-dark rounded p-4 border border-senai-blue"
              role="listitem"
              aria-labelledby={`comment-author-${comment.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-senai-orange" aria-hidden="true" />
                  <div id={`comment-author-${comment.id}`}>
                    <p className="text-white font-semibold">{comment.author}</p>
                    <time 
                      className="text-gray-400 text-xs"
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
                {(isAuthenticated && (user?.email === comment.authorEmail || user?.role === "admin")) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-300 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 rounded p-1"
                    aria-label={`Excluir comentário de ${comment.author}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Excluir comentário</span>
                  </button>
                )}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

