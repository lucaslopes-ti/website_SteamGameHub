import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Game } from "@/lib/games";
import { useLocalDatabase } from "@/lib/config";

const GAMES_FILE = path.join(process.cwd(), "data", "games.json");

// Funções locais para backup/fallback
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

// Função para buscar jogos (Firestore ou Local)
async function getGames(approved?: boolean): Promise<Game[]> {
  // Em produção (Vercel), sempre usar Firestore (sistema de arquivos é read-only)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    const { db } = await import("@/lib/firebase/config");
    const { collection, query, where, getDocs } = await import("firebase/firestore");

    const gamesRef = collection(db, "games");
    let q = approved !== undefined 
      ? query(gamesRef, where("approved", "==", approved === true))
      : query(gamesRef);

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Game));
  }

  // Desenvolvimento local
  if (!useLocalDatabase()) {
    try {
      const { db } = await import("@/lib/firebase/config");
      const { collection, query, where, getDocs } = await import("firebase/firestore");

      const gamesRef = collection(db, "games");
      let q = approved !== undefined 
        ? query(gamesRef, where("approved", "==", approved === true))
        : query(gamesRef);

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Game));
    } catch (error) {
      console.error("Erro ao buscar do Firestore:", error);
      throw error; // Não fazer fallback em produção
    }
  }

  // Modo local apenas em desenvolvimento
  const games = await getGamesFromFile();
  if (approved === true) {
    return games.filter((g) => g.approved);
  }
  return games;
}

// Função para criar jogo (Firestore ou Local)
async function createGame(gameData: Omit<Game, "id">): Promise<Game> {
  // Em produção (Vercel), sempre usar Firestore (sistema de arquivos é read-only)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    const { db } = await import("@/lib/firebase/config");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    const gamesRef = collection(db, "games");
    const docRef = await addDoc(gamesRef, {
      ...gameData,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...gameData,
    } as Game;
  }

  // Desenvolvimento local
  if (!useLocalDatabase()) {
    try {
      const { db } = await import("@/lib/firebase/config");
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

      const gamesRef = collection(db, "games");
      const docRef = await addDoc(gamesRef, {
        ...gameData,
        createdAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...gameData,
      } as Game;
    } catch (error) {
      console.error("Erro ao criar no Firestore:", error);
      throw error; // Não fazer fallback em produção
    }
  }

  // Modo local apenas em desenvolvimento
  const games = await getGamesFromFile();
  const newGame: Game = {
    id: randomUUID(),
    ...gameData,
  };
  games.push(newGame);
  await saveGamesToFile(games);
  return newGame;
}

export async function GET(request: NextRequest) {
  try {
    const approved = request.nextUrl.searchParams.get("approved");
    const games = await getGames(approved === "true");
    return NextResponse.json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return NextResponse.json({ error: "Erro ao buscar jogos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.title || !body.description || !body.author || !body.authorEmail) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando: title, description, author, authorEmail" },
        { status: 400 }
      );
    }

    // Validar: deve ter OU executableFile OU downloadLink
    if (!body.executableFile && !body.downloadLink) {
      return NextResponse.json(
        { error: "É necessário fornecer um arquivo executável ou um link de download" },
        { status: 400 }
      );
    }

    const newGameData: Omit<Game, "id"> = {
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
      downloadLink: body.downloadLink, // Link do Google Drive ou outro serviço
      executableFile: body.executableFile,
      executableFileName: body.executableFileName,
      executableFileSize: body.executableFileSize,
      screenshots: body.screenshots || [],
      rating: 0,
      totalRatings: 0,
      featured: false,
      approved: false,
      pending: true,
    };

    const newGame = await createGame(newGameData);

    return NextResponse.json({ success: true, game: newGame }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar jogo:", error);
    const errorMessage = error?.message || "Erro ao criar jogo";
    return NextResponse.json(
      { error: errorMessage, details: error?.stack },
      { status: 500 }
    );
  }
}
