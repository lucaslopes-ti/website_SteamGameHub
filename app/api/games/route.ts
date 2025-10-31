import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Game } from "@/lib/games";
import { useLocalDatabase } from "@/lib/config";
import {
  isValidEmail,
  isValidDownloadUrl,
  isValidVideoUrl,
  validateGameTitle,
  validateGameDescription,
  validateAuthorName,
  validateGameArrays,
  sanitizeText,
} from "@/lib/validations";

// Garantir que esta rota não seja pré-renderizada/cachê estático
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

// Função helper para buscar jogos do Firestore
async function getGamesFromFirestore(approved?: boolean): Promise<Game[]> {
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

// Função para buscar jogos (Firestore ou Local)
async function getGames(approved?: boolean): Promise<Game[]> {
  // Em produção (Vercel), sempre usar Firestore (sistema de arquivos é read-only)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return await getGamesFromFirestore(approved);
  }

  // Desenvolvimento local
  if (!useLocalDatabase()) {
    try {
      return await getGamesFromFirestore(approved);
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

// Função helper para remover campos undefined e strings vazias (Firestore não aceita undefined)
function removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    // Manter valores válidos: não undefined, não null, não string vazia (exceto para alguns campos específicos)
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
    // Exceção: arrays vazios são permitidos, mas strings vazias não
    if (Array.isArray(value) && value.length === 0 && (key === "genres" || key === "technologies" || key === "screenshots")) {
      cleaned[key] = value; // Arrays vazios são permitidos
    }
  }
  return cleaned;
}

// Função helper para criar jogo no Firestore
async function createGameInFirestore(gameData: Omit<Game, "id">): Promise<Game> {
  const { db } = await import("@/lib/firebase/config");
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  // Remover campos undefined antes de salvar no Firestore
  const cleanedData = removeUndefinedFields(gameData);

  const gamesRef = collection(db, "games");
  const docRef = await addDoc(gamesRef, {
    ...cleanedData,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...gameData,
  } as Game;
}

// Função para criar jogo (Firestore ou Local)
async function createGame(gameData: Omit<Game, "id">): Promise<Game> {
  // Em produção (Vercel), sempre usar Firestore (sistema de arquivos é read-only)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return await createGameInFirestore(gameData);
  }

  // Desenvolvimento local
  if (!useLocalDatabase()) {
    try {
      return await createGameInFirestore(gameData);
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
    const search = request.nextUrl.searchParams;
    const approvedParam = search.has("approved")
      ? search.get("approved") === "true"
      : undefined; // quando não enviado, buscar TODOS
    const games = await getGames(approvedParam);
    return NextResponse.json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return NextResponse.json({ error: "Erro ao buscar jogos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos obrigatórios com validações detalhadas
    const titleValidation = validateGameTitle(body.title);
    if (!titleValidation.valid) {
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      );
    }

    const descriptionValidation = validateGameDescription(body.description);
    if (!descriptionValidation.valid) {
      return NextResponse.json(
        { error: descriptionValidation.error },
        { status: 400 }
      );
    }

    const authorValidation = validateAuthorName(body.author);
    if (!authorValidation.valid) {
      return NextResponse.json(
        { error: authorValidation.error },
        { status: 400 }
      );
    }

    if (!isValidEmail(body.authorEmail)) {
      return NextResponse.json(
        { error: "E-mail do autor inválido" },
        { status: 400 }
      );
    }

    // Validar arrays de gêneros e tecnologias
    const arraysValidation = validateGameArrays(body.genres, body.technologies);
    if (!arraysValidation.valid) {
      return NextResponse.json(
        { error: arraysValidation.error },
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

    // Validar URL de download se fornecida
    if (body.downloadLink && !isValidDownloadUrl(body.downloadLink)) {
      return NextResponse.json(
        { error: "Link de download inválido. Use Google Drive, OneDrive, Dropbox ou MEGA." },
        { status: 400 }
      );
    }

    // Validar URL de trailer se fornecida
    if (body.trailerUrl && !isValidVideoUrl(body.trailerUrl)) {
      return NextResponse.json(
        { error: "Link do trailer inválido. Use YouTube ou Vimeo." },
        { status: 400 }
      );
    }

    // Sanitizar e normalizar dados
    const sanitizedTitle = sanitizeText(body.title, 100);
    const sanitizedDescription = sanitizeText(body.description, 2000);
    const sanitizedAuthor = sanitizeText(body.author, 100);
    const sanitizedAuthorEmail = body.authorEmail.trim().toLowerCase();

    // Normalizar URLs de imagem: converter strings vazias para undefined
    const imageUrl = body.image && body.image.trim() !== "" ? body.image.trim() : undefined;
    const screenshots = body.screenshots && Array.isArray(body.screenshots) && body.screenshots.length > 0
      ? body.screenshots.filter((url: string) => url && url.trim() !== "")
      : undefined;

    // Sanitizar arrays
    const sanitizedGenres = (body.genres || [])
      .filter((g: string) => typeof g === 'string' && g.trim().length > 0)
      .map((g: string) => sanitizeText(g, 50));
    
    const sanitizedTechnologies = (body.technologies || [])
      .filter((t: string) => typeof t === 'string' && t.trim().length > 0)
      .map((t: string) => sanitizeText(t, 50));

    const newGameData: Omit<Game, "id"> = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      author: sanitizedAuthor,
      authorEmail: sanitizedAuthorEmail,
      genres: sanitizedGenres,
      technologies: sanitizedTechnologies,
      releaseDate: new Date().toISOString().split("T")[0],
      image: imageUrl, // URL normalizada (undefined se vazia)
      trailerUrl: body.trailerUrl && body.trailerUrl.trim() !== "" ? body.trailerUrl.trim() : undefined,
      playableLink: body.playableLink && body.playableLink.trim() !== "" ? body.playableLink.trim() : undefined,
      downloadLink: body.downloadLink && body.downloadLink.trim() !== "" ? body.downloadLink.trim() : undefined,
      executableFile: body.executableFile && body.executableFile.trim() !== "" ? body.executableFile.trim() : undefined,
      executableFileName: body.executableFileName && body.executableFileName.trim() !== "" ? body.executableFileName.trim() : undefined,
      executableFileSize: body.executableFileSize || undefined,
      screenshots: screenshots,
      rating: 0,
      totalRatings: 0,
      featured: false,
      approved: false,
      pending: true,
    };

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV !== "production") {
      console.log("Dados do jogo a serem salvos:", {
        title: newGameData.title,
        image: imageUrl || "N/A",
        hasImage: !!imageUrl,
        screenshotsCount: screenshots?.length || 0,
      });
    }

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
