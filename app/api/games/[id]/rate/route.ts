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

// Função helper para atualizar rating no Firestore
async function updateRatingInFirestore(id: string, rating: number): Promise<{ rating: number; totalRatings: number }> {
  const { db } = await import("@/lib/firebase/config");
  const { doc, getDoc, updateDoc } = await import("firebase/firestore");
  
  const gameRef = doc(db, "games", id);
  const gameSnap = await getDoc(gameRef);
  
  if (!gameSnap.exists()) {
    throw new Error("Jogo não encontrado");
  }
  
  const game = gameSnap.data() as Game;
  const totalRatings = (game.totalRatings || 0) + 1;
  const newRating = ((game.rating || 0) * (game.totalRatings || 0) + rating) / totalRatings;
  
  await updateDoc(gameRef, {
    rating: newRating,
    totalRatings: totalRatings,
  });
  
  return { rating: newRating, totalRatings };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rating } = body;
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Avaliação deve ser entre 1 e 5" },
        { status: 400 }
      );
    }

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const result = await updateRatingInFirestore(params.id, rating);
      return NextResponse.json({
        success: true,
        rating: result.rating,
        totalRatings: result.totalRatings,
      });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const result = await updateRatingInFirestore(params.id, rating);
      return NextResponse.json({
        success: true,
        rating: result.rating,
        totalRatings: result.totalRatings,
      });
    }

    // Modo local apenas em desenvolvimento
    const games = await getGamesFromFile();
    const index = games.findIndex((g) => g.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    const game = games[index];
    const totalRatings = (game.totalRatings || 0) + 1;
    const newRating = ((game.rating || 0) * (game.totalRatings || 0) + rating) / totalRatings;
    
    games[index].rating = newRating;
    games[index].totalRatings = totalRatings;
    
    await saveGamesToFile(games);
    
    return NextResponse.json({
      success: true,
      rating: newRating,
      totalRatings,
    });
  } catch (error: any) {
    console.error("Erro ao avaliar jogo:", error);
    const errorMessage = error?.message || "Erro ao avaliar jogo";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

