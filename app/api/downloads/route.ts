import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, serializeTimestamps } from "@/lib/firebase/admin";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { loadVisibleGame } from "@/lib/game-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const body = await request.json();
    const gameId = body.gameId;
    if (!gameId || typeof gameId !== "string") {
      return NextResponse.json(
        { error: "gameId é obrigatório" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    // Só registra download de jogos visíveis ao ator.
    const loaded = await loadVisibleGame(db, gameId, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    // Novos documentos sempre salvam UID + identificador legado (e-mail).
    const docRef = await db.collection("downloads").add({
      gameId,
      userId: user!.uid,
      userEmail: user!.email ?? "",
      downloadedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, download: { id: docRef.id, gameId, userId: user!.uid } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar download:", error);
    return NextResponse.json(
      { error: "Erro ao registrar download" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    // userId do cliente é IGNORADO — sempre usamos o UID do token.
    // Downloads legados identificados por e-mail só são recuperados quando o
    // e-mail do token está verificado.
    const db = getAdminDb();
    const downloadsRef = db.collection("downloads");
    const queries = [downloadsRef.where("userId", "==", user!.uid).get()];
    if (user!.emailVerified && user!.email) {
      queries.push(downloadsRef.where("userId", "==", user!.email).get());
    }

    const snaps = await Promise.all(queries);
    const map = new Map<string, Record<string, unknown>>();
    snaps.forEach((snap) =>
      snap.docs.forEach((d) => {
        if (!map.has(d.id)) {
          map.set(d.id, {
            id: d.id,
            ...serializeTimestamps(d.data() as Record<string, unknown>),
          });
        }
      })
    );
    return NextResponse.json(Array.from(map.values()));
  } catch (error) {
    console.error("Erro ao buscar downloads:", error);
    return NextResponse.json(
      { error: "Erro ao buscar downloads" },
      { status: 500 }
    );
  }
}