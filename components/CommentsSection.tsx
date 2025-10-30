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
    <div className="bg-steam-dark rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-steam-blueLight flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Comentários ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        {!isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Seu nome (opcional)"
              className="bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
            />
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Seu e-mail (opcional)"
              className="bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
            />
          </div>
        )}
        <div className="flex gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            className="flex-1 bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="bg-steam-blueLight hover:bg-steam-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition flex items-center gap-2 h-fit"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar
              </>
            )}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-steam-blueLight" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-steam-darker rounded p-4 border border-steam-blue"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-steam-blueLight" />
                  <div>
                    <p className="text-white font-semibold">{comment.author}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {(isAuthenticated && (user?.email === comment.authorEmail || user?.role === "admin")) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

