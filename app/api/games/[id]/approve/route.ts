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
    return NextResponse.json({ error: "Erro ao aprovar jogo" }, { status: 500 });
  }
}

