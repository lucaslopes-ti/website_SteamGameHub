import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Favorite } from "@/lib/favorites";
import { useLocalDatabase } from "@/lib/config";

// Garantir que esta rota não seja pré-renderizada/cachê estático
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FAVORITES_FILE = path.join(process.cwd(), "data", "favorites.json");

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    const { mkdir } = await import("fs/promises");
    await mkdir(dataDir, { recursive: true });
  }
}

async function getFavoritesFromFile(): Promise<Favorite[]> {
  await ensureDataDir();
  if (!existsSync(FAVORITES_FILE)) {
    return [];
  }
  const content = await readFile(FAVORITES_FILE, "utf-8");
  return JSON.parse(content);
}

async function saveFavoritesToFile(favorites: Favorite[]) {
  await ensureDataDir();
  await writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

// Função helper para buscar favoritos do Firestore
async function getFavoritesFromFirestore(userId: string): Promise<string[]> {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs } = await import("firebase/firestore");

  const favoritesRef = collection(db, "favorites");
  const q = query(favoritesRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data().gameId as string);
}

// Função helper para adicionar favorito no Firestore
async function addFavoriteToFirestore(gameId: string, userId: string): Promise<void> {
  const { db } = await import("@/lib/firebase/config");
  const { collection, addDoc, query, where, getDocs, serverTimestamp } = await import("firebase/firestore");

  const favoritesRef = collection(db, "favorites");
  
  // Verificar se já existe
  const q = query(favoritesRef, where("userId", "==", userId), where("gameId", "==", gameId));
  const existing = await getDocs(q);
  
  if (!existing.empty) {
    throw new Error("Jogo já está nos favoritos");
  }

  await addDoc(favoritesRef, {
    gameId,
    userId,
    createdAt: serverTimestamp(),
  });
}

// Função helper para remover favorito do Firestore
async function removeFavoriteFromFirestore(gameId: string, userId: string): Promise<void> {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs, deleteDoc } = await import("firebase/firestore");

  const favoritesRef = collection(db, "favorites");
  const q = query(favoritesRef, where("userId", "==", userId), where("gameId", "==", gameId));
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    // Em produção (Vercel), sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      try {
        const gameIds = await getFavoritesFromFirestore(userId);
        return NextResponse.json({ gameIds });
      } catch (error: any) {
        console.error("Erro ao buscar favoritos do Firestore:", error);
        return NextResponse.json(
          { error: "Erro ao buscar favoritos", details: error?.message },
          { status: 500 }
        );
      }
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      try {
        const gameIds = await getFavoritesFromFirestore(userId);
        return NextResponse.json({ gameIds });
      } catch (error: any) {
        console.error("Erro ao buscar favoritos do Firestore:", error);
        throw error;
      }
    }

    // Modo local apenas em desenvolvimento
    const favorites = await getFavoritesFromFile();
    const userFavorites = favorites.filter((f) => f.userId === userId);
    const gameIds = userFavorites.map((f) => f.gameId);

    return NextResponse.json({ gameIds });
  } catch (error: any) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar favoritos", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, userId } = body;

    if (!gameId || !userId) {
      return NextResponse.json(
        { error: "gameId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    // Em produção (Vercel), sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      try {
        await addFavoriteToFirestore(gameId, userId);
        return NextResponse.json(
          { success: true, favorite: { gameId, userId } },
          { status: 201 }
        );
      } catch (error: any) {
        console.error("Erro ao adicionar favorito no Firestore:", error);
        if (error.message === "Jogo já está nos favoritos") {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: "Erro ao adicionar favorito", details: error?.message },
          { status: 500 }
        );
      }
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      try {
        await addFavoriteToFirestore(gameId, userId);
        return NextResponse.json(
          { success: true, favorite: { gameId, userId } },
          { status: 201 }
        );
      } catch (error: any) {
        console.error("Erro ao adicionar favorito no Firestore:", error);
        if (error.message === "Jogo já está nos favoritos") {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        throw error;
      }
    }

    // Modo local apenas em desenvolvimento
    const favorites = await getFavoritesFromFile();
    
    // Verificar se já está favoritado
    const exists = favorites.some(
      (f) => f.gameId === gameId && f.userId === userId
    );

    if (exists) {
      return NextResponse.json({ error: "Jogo já está nos favoritos" }, { status: 400 });
    }

    const newFavorite: Favorite = {
      id: randomUUID(),
      gameId,
      userId,
      createdAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    await saveFavoritesToFile(favorites);

    return NextResponse.json({ success: true, favorite: newFavorite }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao adicionar favorito:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar favorito", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const userId = searchParams.get("userId");

    if (!gameId || !userId) {
      return NextResponse.json(
        { error: "gameId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    // Em produção (Vercel), sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      try {
        await removeFavoriteFromFirestore(gameId, userId);
        return NextResponse.json({ success: true });
      } catch (error: any) {
        console.error("Erro ao remover favorito do Firestore:", error);
        return NextResponse.json(
          { error: "Erro ao remover favorito", details: error?.message },
          { status: 500 }
        );
      }
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      try {
        await removeFavoriteFromFirestore(gameId, userId);
        return NextResponse.json({ success: true });
      } catch (error: any) {
        console.error("Erro ao remover favorito do Firestore:", error);
        throw error;
      }
    }

    // Modo local apenas em desenvolvimento
    const favorites = await getFavoritesFromFile();
    const filtered = favorites.filter(
      (f) => !(f.gameId === gameId && f.userId === userId)
    );

    await saveFavoritesToFile(filtered);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao remover favorito:", error);
    return NextResponse.json(
      { error: "Erro ao remover favorito", details: error?.message },
      { status: 500 }
    );
  }
}

