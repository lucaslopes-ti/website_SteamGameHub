import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync, unlink } from "fs";
import { promisify } from "util";
import path from "path";
import { Game } from "@/lib/games";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const games = await getGamesFromFile();
    const game = games.find((g) => g.id === params.id);
    
    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const games = await getGamesFromFile();
    const index = games.findIndex((g) => g.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    
    games[index] = { ...games[index], ...body };
    await saveGamesToFile(games);
    
    return NextResponse.json({ success: true, game: games[index] });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const games = await getGamesFromFile();
    const game = games.find((g) => g.id === params.id);
    
    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    // Deletar arquivo executável se existir
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

    // Deletar imagem se existir
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
    return NextResponse.json({ error: "Erro ao deletar jogo" }, { status: 500 });
  }
}
