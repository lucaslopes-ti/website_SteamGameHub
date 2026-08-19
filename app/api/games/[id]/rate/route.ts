import { NextRequest, NextResponse } from "next/server";
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

    const body = await request.json();
    const rating = Number(body.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Avaliação deve ser um inteiro entre 1 e 5" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    // Só permite avaliar jogos visíveis ao ator (aprovados ou próprios/staff).
    const loaded = await loadVisibleGame(db, params.id, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const gameRef = db.collection("games").doc(params.id);
    // Uma nota por UID + jogo.
    const ratingRef = db.collection("ratings").doc(`${params.id}_${user!.uid}`);

    const result = await db.runTransaction(async (tx) => {
      const gameSnap = await tx.get(gameRef);
      if (!gameSnap.exists) {
        throw new Error("NOT_FOUND");
      }

      const game = gameSnap.data() as {
        rating?: number;
        totalRatings?: number;
      };
      const currentTotal = game.totalRatings || 0;
      const currentAvg = game.rating || 0;

      const ratingSnap = await tx.get(ratingRef);
      const existing = ratingSnap.exists
        ? (ratingSnap.data()?.rating as number)
        : null;

      let newTotal: number;
      let newAvg: number;

      if (existing !== null) {
        // Ajuste correto quando a nota muda.
        newTotal = currentTotal;
        const sum = currentAvg * currentTotal - existing + rating;
        newAvg = newTotal > 0 ? sum / newTotal : rating;
      } else {
        newTotal = currentTotal + 1;
        newAvg = (currentAvg * currentTotal + rating) / newTotal;
      }

      tx.update(gameRef, { rating: newAvg, totalRatings: newTotal });
      tx.set(ratingRef, {
        gameId: params.id,
        uid: user!.uid,
        rating,
        updatedAt: new Date().toISOString(),
      });

      return { rating: newAvg, totalRatings: newTotal };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    if (error?.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }
    console.error("Erro ao avaliar jogo:", error);
    return NextResponse.json({ error: "Erro ao avaliar jogo" }, { status: 500 });
  }
}
