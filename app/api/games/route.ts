import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Game } from "@/lib/games";

const GAMES_FILE = path.join(process.cwd(), "data", "games.json");

// Garantir que o diretório existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    const { mkdir } = await import("fs/promises");
    await mkdir(dataDir, { recursive: true });
  }
}

async function getGamesFromFile(): Promise<Game[]> {
  await ensureDataDir();
  if (!existsSync(GAMES_FILE)) {
    return [];
  }
  const content = await readFile(GAMES_FILE, "utf-8");
  return JSON.parse(content);
}

async function saveGamesToFile(games: Game[]) {
  await ensureDataDir();
  await writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const games = await getGamesFromFile();
    const approved = request.nextUrl.searchParams.get("approved");
    
    if (approved === "true") {
      return NextResponse.json(games.filter((g) => g.approved));
    }
    
    return NextResponse.json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return NextResponse.json({ error: "Erro ao buscar jogos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const games = await getGamesFromFile();

    const newGame: Game = {
      id: randomUUID(),
      title: body.title,
      description: body.description,
      author: body.author,
      authorEmail: body.authorEmail,
      genres: body.genres || [],
      technologies: body.technologies || [],
      releaseDate: new Date().toISOString().split("T")[0],
      image: body.image,
      trailerUrl: body.trailerUrl,
      playableLink: body.playableLink,
      executableFile: body.executableFile,
      executableFileName: body.executableFileName,
      executableFileSize: body.executableFileSize,
      rating: 0,
      totalRatings: 0,
      featured: false,
      approved: false,
      pending: true,
    };

    games.push(newGame);
    await saveGamesToFile(games);

    return NextResponse.json({ success: true, game: newGame }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 });
  }
}

