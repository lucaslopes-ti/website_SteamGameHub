import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync, unlink } from "fs";
import { promisify } from "util";
import path from "path";
import { Game } from "@/lib/games";
import { useLocalDatabase } from "@/lib/config";

const unlinkAsync = promisify(unlink);
const GAMES_FILE = path.join(process.cwd(), "data", "games.json");

async function getGamesFromFile(): Promise<Game[]> {
  if (!existsSync(GAMES_FILE)) {
    return [];
  }
  const content = await readFile(GAMES_FILE, "utf-8");
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveGamesToFile(games: Game[]) {
  await writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
}

// Função helper para buscar jogo do Firestore
async function getGameFromFirestore(id: string): Promise<Game | null> {
  const { db } = await import("@/lib/firebase/config");
  const { doc, getDoc } = await import("firebase/firestore");
  
  const gameRef = doc(db, "games", id);
  const gameSnap = await getDoc(gameRef);
  
  if (!gameSnap.exists()) return null;
  return { id: gameSnap.id, ...gameSnap.data() } as Game;
}

// Função helper para atualizar jogo no Firestore
async function updateGameInFirestore(id: string, updates: Partial<Game>): Promise<Game> {
  const { db } = await import("@/lib/firebase/config");
  const { doc, updateDoc, getDoc } = await import("firebase/firestore");
  
  const gameRef = doc(db, "games", id);
  await updateDoc(gameRef, updates);
  
  const updated = await getDoc(gameRef);
  return { id: updated.id, ...updated.data() } as Game;
}

// Função helper para deletar jogo do Firestore
async function deleteGameFromFirestore(id: string): Promise<void> {
  const { db } = await import("@/lib/firebase/config");
  const { doc, deleteDoc } = await import("firebase/firestore");
  
  const gameRef = doc(db, "games", id);
  await deleteDoc(gameRef);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const game = await getGameFromFirestore(params.id);
      if (!game) {
        return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
      }
      return NextResponse.json(game);
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const game = await getGameFromFirestore(params.id);
      if (!game) {
        return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
      }
      return NextResponse.json(game);
    }

    // Modo local apenas em desenvolvimento
    const games = await getGamesFromFile();
    const game = games.find((g) => g.id === params.id);
    
    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(game);
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const game = await updateGameInFirestore(params.id, body);
      return NextResponse.json({ success: true, game });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const game = await updateGameInFirestore(params.id, body);
      return NextResponse.json({ success: true, game });
    }

    // Modo local apenas em desenvolvimento
    const games = await getGamesFromFile();
    const index = games.findIndex((g) => g.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    games[index] = { ...games[index], ...body };
    await saveGamesToFile(games);
    
    return NextResponse.json({ success: true, game: games[index] });
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      // Buscar jogo antes de deletar para verificar se existe
      const game = await getGameFromFirestore(params.id);
      if (!game) {
        return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
      }
      await deleteGameFromFirestore(params.id);
      return NextResponse.json({ success: true });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const game = await getGameFromFirestore(params.id);
      if (!game) {
        return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
      }
      await deleteGameFromFirestore(params.id);
      return NextResponse.json({ success: true });
    }

    // Modo local apenas em desenvolvimento
    const games = await getGamesFromFile();
    const game = games.find((g) => g.id === params.id);
    
    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    // Deletar arquivo executável se existir (apenas em desenvolvimento local)
    if (game.executableFile) {
      const filePath = path.join(process.cwd(), "public", "uploads", "games", game.executableFile);
      if (existsSync(filePath)) {
        try {
          await unlinkAsync(filePath);
        } catch (error) {
          console.error("Erro ao deletar arquivo:", error);
        }
      }
    }

    // Deletar imagem se existir (apenas em desenvolvimento local)
    if (game.image && game.image.startsWith("/uploads/")) {
      const imagePath = path.join(process.cwd(), "public", game.image);
      if (existsSync(imagePath)) {
        try {
          await unlinkAsync(imagePath);
        } catch (error) {
          console.error("Erro ao deletar imagem:", error);
        }
      }
    }
    
    const filtered = games.filter((g) => g.id !== params.id);
    await saveGamesToFile(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    return NextResponse.json({ error: "Erro ao deletar jogo" }, { status: 500 });
  }
}
