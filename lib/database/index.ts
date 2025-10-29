/**
 * Abstração de banco de dados para facilitar migração entre JSON e Firestore
 */

import { Game } from "@/lib/games";
import { Comment } from "@/lib/comments";
import { Favorite } from "@/lib/favorites";

const USE_LOCAL_DB = process.env.ENABLE_LOCAL_STORAGE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export interface DatabaseService {
  // Games
  getGames(approved?: boolean): Promise<Game[]>;
  getGameById(id: string): Promise<Game | null>;
  createGame(game: Omit<Game, "id">): Promise<Game>;
  updateGame(id: string, updates: Partial<Game>): Promise<Game>;
  deleteGame(id: string): Promise<void>;
  approveGame(id: string): Promise<void>;

  // Comments
  getComments(gameId: string): Promise<Comment[]>;
  addComment(gameId: string, comment: Omit<Comment, "id" | "gameId" | "createdAt">): Promise<Comment>;
  deleteComment(commentId: string): Promise<void>;

  // Favorites
  getFavorites(userEmail: string): Promise<Favorite[]>;
  addFavorite(userEmail: string, gameId: string): Promise<void>;
  removeFavorite(userEmail: string, gameId: string): Promise<void>;
  isFavorite(userEmail: string, gameId: string): Promise<boolean>;
}

// Database local (JSON files)
class LocalDatabaseService implements DatabaseService {
  async getGames(approved?: boolean): Promise<Game[]> {
    const response = await fetch(`/api/games${approved !== undefined ? `?approved=${approved}` : ""}`);
    if (!response.ok) throw new Error("Erro ao buscar jogos");
    return response.json();
  }

  async getGameById(id: string): Promise<Game | null> {
    const response = await fetch(`/api/games/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async createGame(game: Omit<Game, "id">): Promise<Game> {
    const response = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(game),
    });
    if (!response.ok) throw new Error("Erro ao criar jogo");
    return response.json();
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game> {
    const response = await fetch(`/api/games/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Erro ao atualizar jogo");
    return response.json();
  }

  async deleteGame(id: string): Promise<void> {
    const response = await fetch(`/api/games/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar jogo");
  }

  async approveGame(id: string): Promise<void> {
    const response = await fetch(`/api/games/${id}/approve`, { method: "POST" });
    if (!response.ok) throw new Error("Erro ao aprovar jogo");
  }

  async getComments(gameId: string): Promise<Comment[]> {
    const response = await fetch(`/api/comments/${gameId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async addComment(gameId: string, comment: Omit<Comment, "id" | "gameId" | "createdAt">): Promise<Comment> {
    const response = await fetch(`/api/comments/${gameId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error("Erro ao adicionar comentário");
    return response.json();
  }

  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar comentário");
  }

  async getFavorites(userEmail: string): Promise<Favorite[]> {
    const response = await fetch(`/api/favorites?userEmail=${encodeURIComponent(userEmail)}`);
    if (!response.ok) return [];
    return response.json();
  }

  async addFavorite(userEmail: string, gameId: string): Promise<void> {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, gameId }),
    });
    if (!response.ok) throw new Error("Erro ao adicionar favorito");
  }

  async removeFavorite(userEmail: string, gameId: string): Promise<void> {
    const response = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, gameId }),
    });
    if (!response.ok) throw new Error("Erro ao remover favorito");
  }

  async isFavorite(userEmail: string, gameId: string): Promise<boolean> {
    const favorites = await this.getFavorites(userEmail);
    return favorites.some((f) => f.gameId === gameId);
  }
}

// Database Firebase (produção)
class FirebaseDatabaseService implements DatabaseService {
  async getGames(approved?: boolean): Promise<Game[]> {
    const { db } = await import("./firebase");
    const { collection, query, where, getDocs } = await import("firebase/firestore");

    const gamesRef = collection(db, "games");
    let q = query(gamesRef);

    if (approved !== undefined) {
      q = query(gamesRef, where("approved", "==", approved));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Game));
  }

  async getGameById(id: string): Promise<Game | null> {
    const { db } = await import("./firebase");
    const { doc, getDoc } = await import("firebase/firestore");

    const gameRef = doc(db, "games", id);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) return null;
    return { id: gameSnap.id, ...gameSnap.data() } as Game;
  }

  async createGame(game: Omit<Game, "id">): Promise<Game> {
    const { db } = await import("./firebase");
    const { collection, addDoc } = await import("firebase/firestore");

    const gamesRef = collection(db, "games");
    const docRef = await addDoc(gamesRef, game);
    return { id: docRef.id, ...game } as Game;
  }

  async updateGame(id: string, updates: Partial<Game>): Promise<Game> {
    const { db } = await import("./firebase");
    const { doc, updateDoc, getDoc } = await import("firebase/firestore");

    const gameRef = doc(db, "games", id);
    await updateDoc(gameRef, updates);

    const updated = await getDoc(gameRef);
    return { id: updated.id, ...updated.data() } as Game;
  }

  async deleteGame(id: string): Promise<void> {
    const { db } = await import("./firebase");
    const { doc, deleteDoc } = await import("firebase/firestore");

    const gameRef = doc(db, "games", id);
    await deleteDoc(gameRef);
  }

  async approveGame(id: string): Promise<void> {
    await this.updateGame(id, { approved: true, pending: false });
  }

  async getComments(gameId: string): Promise<Comment[]> {
    const { db } = await import("./firebase");
    const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore");

    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, where("gameId", "==", gameId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Comment));
  }

  async addComment(gameId: string, comment: Omit<Comment, "id" | "gameId" | "createdAt">): Promise<Comment> {
    const { db } = await import("./firebase");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    const commentsRef = collection(db, "comments");
    const docRef = await addDoc(commentsRef, {
      ...comment,
      gameId,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      gameId,
      ...comment,
      createdAt: new Date().toISOString(),
    } as Comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    const { db } = await import("./firebase");
    const { doc, deleteDoc } = await import("firebase/firestore");

    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);
  }

  async getFavorites(userEmail: string): Promise<Favorite[]> {
    const { db } = await import("./firebase");
    const { collection, query, where, getDocs } = await import("firebase/firestore");

    const favoritesRef = collection(db, "favorites");
    const q = query(favoritesRef, where("userEmail", "==", userEmail));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Favorite));
  }

  async addFavorite(userEmail: string, gameId: string): Promise<void> {
    const { db } = await import("./firebase");
    const { collection, addDoc, query, where, getDocs } = await import("firebase/firestore");

    // Verificar se já existe
    const favoritesRef = collection(db, "favorites");
    const q = query(favoritesRef, where("userEmail", "==", userEmail), where("gameId", "==", gameId));
    const existing = await getDocs(q);

    if (existing.empty) {
      await addDoc(favoritesRef, { userEmail, gameId, createdAt: new Date().toISOString() });
    }
  }

  async removeFavorite(userEmail: string, gameId: string): Promise<void> {
    const { db } = await import("./firebase");
    const { collection, query, where, getDocs, doc, deleteDoc } = await import("firebase/firestore");

    const favoritesRef = collection(db, "favorites");
    const q = query(favoritesRef, where("userEmail", "==", userEmail), where("gameId", "==", gameId));
    const snapshot = await getDocs(q);

    snapshot.docs.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "favorites", docSnapshot.id));
    });
  }

  async isFavorite(userEmail: string, gameId: string): Promise<boolean> {
    const favorites = await this.getFavorites(userEmail);
    return favorites.some((f) => f.gameId === gameId);
  }
}

// Exportar service baseado na configuração
export const databaseService: DatabaseService = USE_LOCAL_DB
  ? new LocalDatabaseService()
  : new FirebaseDatabaseService();

