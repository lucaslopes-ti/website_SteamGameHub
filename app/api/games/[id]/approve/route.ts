import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Game } from "@/lib/games";
import { useLocalDatabase } from "@/lib/config";

const GAMES_FILE = path.join(process.cwd(), "data", "games.json");

async function getGamesFromFile(): Promise<Game[]> {
  if (!existsSync(GAMES_FILE)) {
    return [];
  }
  const content = await readFile(GAMES_FILE, "utf-8");
  return JSON.parse(content);
}

async function saveGamesToFile(games: Game[]) {
  await writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
}

// Função helper para aprovar jogo no Firestore
async function approveGameInFirestore(id: string): Promise<Game> {
  const { db } = await import("@/lib/firebase/config");
  const { doc, updateDoc, getDoc } = await import("firebase/firestore");
  
  const gameRef = doc(db, "games", id);
  await updateDoc(gameRef, { approved: true, pending: false });
  
  const updated = await getDoc(gameRef);
  return { id: updated.id, ...updated.data() } as Game;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const game = await approveGameInFirestore(params.id);
      return NextResponse.json({ success: true, game });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const game = await approveGameInFirestore(params.id);
      return NextResponse.json({ success: true, game });
    }

    // Modo local apenas em desenvolvimento
    const games = await getGamesFromFile();
    const index = games.findIndex((g) => g.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    games[index].approved = true;
    games[index].pending = false;
    
    await saveGamesToFile(games);
    
    return NextResponse.json({ success: true, game: games[index] });
  } catch (error) {
    console.error("Erro ao aprovar jogo:", error);
    return NextResponse.json({ error: "Erro ao aprovar jogo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const { db } = await import("@/lib/firebase/config");
      const { doc, updateDoc, getDoc } = await import("firebase/firestore");

      const gameRef = doc(db, "games", params.id);
      await updateDoc(gameRef, { approved: false, pending: true });
      const updated = await getDoc(gameRef);
      return NextResponse.json({ success: true, game: { id: updated.id, ...updated.data() } });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const { db } = await import("@/lib/firebase/config");
      const { doc, updateDoc, getDoc } = await import("firebase/firestore");

      const gameRef = doc(db, "games", params.id);
      await updateDoc(gameRef, { approved: false, pending: true });
      const updated = await getDoc(gameRef);
      return NextResponse.json({ success: true, game: { id: updated.id, ...updated.data() } });
    }

    // Modo local apenas em desenvolvimento
    const games = await getGamesFromFile();
    const index = games.findIndex((g) => g.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    games[index].approved = false;
    games[index].pending = true;
    await saveGamesToFile(games);
    return NextResponse.json({ success: true, game: games[index] });
  } catch (error) {
    console.error("Erro ao reverter aprovação:", error);
    return NextResponse.json({ error: "Erro ao reverter aprovação" }, { status: 500 });
  }
}

