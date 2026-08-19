import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, serializeTimestamps, stripUndefined } from "@/lib/firebase/admin";
import type { QuerySnapshot } from "firebase-admin/firestore";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { Game } from "@/lib/games";
import {
  isValidUrl,
  isValidDownloadUrl,
  isValidImageUrl,
  isValidVideoUrl,
  validateGameTitle,
  validateGameDescription,
  validateAuthorName,
  validateGameArrays,
  validateScreenshots,
  sanitizeText,
  sanitizeStringArray,
} from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toGame(id: string, data: Record<string, unknown>): Game {
  return { id, ...serializeTimestamps(data) } as unknown as Game;
}

export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();
    const user = await getAuthUser(request);
    const approvedOnly = request.nextUrl.searchParams.get("approved") === "true";

    const gamesRef = db.collection("games");

    if (approvedOnly) {
      // Catálogo público: apenas aprovados.
      const snap = await gamesRef.where("approved", "==", true).get();
      const games = snap.docs.map((d) => toGame(d.id, d.data()));
      return NextResponse.json(games);
    }

    if (user?.isStaff) {
      // Staff vê todos.
      const snap = await gamesRef.get();
      const games = snap.docs.map((d) => toGame(d.id, d.data()));
      return NextResponse.json(games);
    }

    if (user) {
      // Autenticado vê aprovados + próprios (por UID e, quando o e-mail do
      // token está verificado, também por e-mail legado).
      const queries: Promise<QuerySnapshot>[] = [
        gamesRef.where("approved", "==", true).get(),
        gamesRef.where("authorUid", "==", user.uid).get(),
      ];
      if (user.emailVerified && user.email) {
        queries.push(gamesRef.where("authorEmail", "==", user.email).get());
      }
      const snaps = await Promise.all(queries);
      const map = new Map<string, Game>();
      snaps.forEach((snap) =>
        snap.docs.forEach((d) => {
          if (!map.has(d.id)) map.set(d.id, toGame(d.id, d.data()));
        })
      );
      return NextResponse.json(Array.from(map.values()));
    }

    // Público vê apenas aprovados.
    const snap = await gamesRef.where("approved", "==", true).get();
    const games = snap.docs.map((d) => toGame(d.id, d.data()));
    return NextResponse.json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return NextResponse.json({ error: "Erro ao buscar jogos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const body = await request.json();

    const titleValidation = validateGameTitle(body.title);
    if (!titleValidation.valid) {
      return NextResponse.json({ error: titleValidation.error }, { status: 400 });
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
      return NextResponse.json({ error: authorValidation.error }, { status: 400 });
    }

    const arraysValidation = validateGameArrays(body.genres, body.technologies);
    if (!arraysValidation.valid) {
      return NextResponse.json({ error: arraysValidation.error }, { status: 400 });
    }

    if (!body.downloadLink && !body.executableFile) {
      return NextResponse.json(
        { error: "É necessário fornecer um arquivo executável ou um link de download" },
        { status: 400 }
      );
    }

    if (body.downloadLink && !isValidDownloadUrl(body.downloadLink)) {
      return NextResponse.json(
        { error: "Link de download inválido. Use Google Drive, OneDrive, Dropbox ou MEGA." },
        { status: 400 }
      );
    }

    if (body.trailerUrl && !isValidVideoUrl(body.trailerUrl)) {
      return NextResponse.json(
        { error: "Link do trailer inválido. Use YouTube ou Vimeo." },
        { status: 400 }
      );
    }

    if (body.playableLink && !isValidUrl(body.playableLink)) {
      return NextResponse.json(
        { error: "Link jogável inválido. Use uma URL http(s)." },
        { status: 400 }
      );
    }

    if (body.image && !isValidImageUrl(body.image)) {
      return NextResponse.json(
        { error: "URL da imagem de capa inválida." },
        { status: 400 }
      );
    }

    const screenshotsValidation = validateScreenshots(body.screenshots);
    if (!screenshotsValidation.valid) {
      return NextResponse.json(
        { error: screenshotsValidation.error },
        { status: 400 }
      );
    }

    const sanitizedTitle = sanitizeText(body.title, 100);
    const sanitizedDescription = sanitizeText(body.description, 2000);
    const sanitizedAuthor = sanitizeText(body.author, 100);

    // Identidade do autor é DERIVADA do token — nunca do corpo da requisição.
    const authorUid = user!.uid;
    const authorEmail = user!.email ?? "";

    const imageUrl =
      body.image && body.image.trim() !== "" ? body.image.trim() : undefined;
    const screenshots =
      body.screenshots && Array.isArray(body.screenshots) && body.screenshots.length > 0
        ? body.screenshots.filter((url: string) => url && url.trim() !== "")
        : undefined;

    const sanitizedGenres = sanitizeStringArray(body.genres, 10, 50);
    const sanitizedTechnologies = sanitizeStringArray(body.technologies, 10, 50);

    const newGameData = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      author: sanitizedAuthor,
      authorEmail,
      authorUid,
      genres: sanitizedGenres,
      technologies: sanitizedTechnologies,
      releaseDate: new Date().toISOString().split("T")[0],
      image: imageUrl,
      trailerUrl:
        body.trailerUrl && body.trailerUrl.trim() !== ""
          ? body.trailerUrl.trim()
          : undefined,
      playableLink:
        body.playableLink && body.playableLink.trim() !== ""
          ? body.playableLink.trim()
          : undefined,
      downloadLink:
        body.downloadLink && body.downloadLink.trim() !== ""
          ? body.downloadLink.trim()
          : undefined,
      executableFile:
        body.executableFile && body.executableFile.trim() !== ""
          ? body.executableFile.trim()
          : undefined,
      executableFileName:
        body.executableFileName && body.executableFileName.trim() !== ""
          ? body.executableFileName.trim()
          : undefined,
      executableFileSize: body.executableFileSize || undefined,
      screenshots,
      // Valores fixados no servidor — nunca aceitos do cliente.
      rating: 0,
      totalRatings: 0,
      featured: false,
      approved: false,
      pending: true,
      createdAt: new Date().toISOString(),
    };

    const db = getAdminDb();
    // Firestore rejeita `undefined` — grava apenas campos definidos.
    const docRef = await db.collection("games").add(stripUndefined(newGameData));

    return NextResponse.json(
      { success: true, game: toGame(docRef.id, stripUndefined(newGameData)) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 });
  }
}
