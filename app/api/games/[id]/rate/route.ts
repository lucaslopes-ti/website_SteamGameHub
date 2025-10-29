import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Game } from "@/lib/games";

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
    
    const games = await getGamesFromFile();
    const index = games.findIndex((g) => g.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    const game = games[index];
    const totalRatings = game.totalRatings + 1;
    const newRating = (game.rating * game.totalRatings + rating) / totalRatings;
    
    games[index].rating = newRating;
    games[index].totalRatings = totalRatings;
    
    await saveGamesToFile(games);
    
    return NextResponse.json({
      success: true,
      rating: newRating,
      totalRatings,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao avaliar jogo" }, { status: 500 });
  }
}

