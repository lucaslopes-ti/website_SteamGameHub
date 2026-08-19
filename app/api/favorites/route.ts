import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { loadVisibleGame } from "@/lib/game-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    // userId do cliente é IGNORADO — sempre usamos o UID do token.
    // Favoritos legados identificados por e-mail só são recuperados quando o
    // e-mail do token está verificado.
    const db = getAdminDb();
    const favoritesRef = db.collection("favorites");
    const queries = [favoritesRef.where("userId", "==", user!.uid).get()];
    if (user!.emailVerified && user!.email) {
      queries.push(favoritesRef.where("userId", "==", user!.email).get());
    }

    const snaps = await Promise.all(queries);
    const gameIds = new Set<string>();
    snaps.forEach((snap) =>
      snap.docs.forEach((d) => {
        const gameId = d.data().gameId as string;
        if (gameId) gameIds.add(gameId);
      })
    );
    return NextResponse.json({ gameIds: Array.from(gameIds) });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json({ error: "Erro ao buscar favoritos" }, { status: 500 });
  }
}

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
    // Só permite favoritar jogos visíveis ao ator.
    const loaded = await loadVisibleGame(db, gameId, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const favoritesRef = db.collection("favorites");

    const existing = await favoritesRef
      .where("userId", "==", user!.uid)
      .where("gameId", "==", gameId)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: "Jogo já está nos favoritos" },
        { status: 400 }
      );
    }

    // Novos documentos sempre salvam UID + identificador legado (e-mail).
    await favoritesRef.add({
      gameId,
      userId: user!.uid,
      userEmail: user!.email ?? "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, favorite: { gameId, userId: user!.uid } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar favorito" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const gameId = request.nextUrl.searchParams.get("gameId");
    if (!gameId) {
      return NextResponse.json(
        { error: "gameId é obrigatório" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const favoritesRef = db.collection("favorites");
    const queries = [
      favoritesRef
        .where("userId", "==", user!.uid)
        .where("gameId", "==", gameId)
        .get(),
    ];
    // Remove também favoritos legados por e-mail quando verificado.
    if (user!.emailVerified && user!.email) {
      queries.push(
        favoritesRef
          .where("userId", "==", user!.email)
          .where("gameId", "==", gameId)
          .get()
      );
    }

    const snaps = await Promise.all(queries);
    const deletes = snaps.flatMap((snap) => snap.docs.map((d) => d.ref.delete()));
    await Promise.all(deletes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return NextResponse.json(
      { error: "Erro ao remover favorito" },
      { status: 500 }
    );
  }
}