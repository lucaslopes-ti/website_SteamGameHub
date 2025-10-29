import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Favorite } from "@/lib/favorites";

const FAVORITES_FILE = path.join(process.cwd(), "data", "favorites.json");

async function getFavoritesFromFile(): Promise<Favorite[]> {
  if (!existsSync(FAVORITES_FILE)) {
    return [];
  }
  const content = await readFile(FAVORITES_FILE, "utf-8");
  return JSON.parse(content);
}

async function saveFavoritesToFile(favorites: Favorite[]) {
  await writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    const favorites = await getFavoritesFromFile();
    const userFavorites = favorites.filter((f) => f.userId === userId);
    const gameIds = userFavorites.map((f) => f.gameId);

    return NextResponse.json({ gameIds });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar favoritos" }, { status: 500 });
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
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar favorito" }, { status: 500 });
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

    const favorites = await getFavoritesFromFile();
    const filtered = favorites.filter(
      (f) => !(f.gameId === gameId && f.userId === userId)
    );

    await saveFavoritesToFile(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover favorito" }, { status: 500 });
  }
}

