import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { loadVisibleGame } from "@/lib/game-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const db = getAdminDb();
    // Só registra visualização em jogos visíveis ao ator.
    const loaded = await loadVisibleGame(db, params.id, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const viewRef = db.collection("views").doc(params.id);

    // Incremento atômico.
    await viewRef.set(
      { count: FieldValue.increment(1) },
      { merge: true }
    );

    const snap = await viewRef.get();
    const count = (snap.data()?.count as number) || 0;
    return NextResponse.json({ success: true, views: count });
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    return NextResponse.json(
      { error: "Erro ao registrar visualização" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getAdminDb();
    const user = await getAuthUser(request);
    // Contagem só é exposta para jogos visíveis ao ator.
    const loaded = await loadVisibleGame(db, params.id, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const viewRef = db.collection("views").doc(params.id);
    const snap = await viewRef.get();
    const count = (snap.exists ? (snap.data()?.count as number) : 0) || 0;
    return NextResponse.json({ views: count });
  } catch (error) {
    console.error("Erro ao buscar visualizações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar visualizações" },
      { status: 500 }
    );
  }
}