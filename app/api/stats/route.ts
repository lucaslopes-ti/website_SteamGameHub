import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();

    // Estatísticas públicas agregam SOMENTE jogos aprovados.
    const approvedSnap = await db
      .collection("games")
      .where("approved", "==", true)
      .get();
    const approvedIds = new Set(approvedSnap.docs.map((doc) => doc.id));

    const viewsSnapshot = await db.collection("views").get();
    const viewsByGame: Record<string, number> = {};
    let totalViews = 0;
    viewsSnapshot.docs.forEach((doc) => {
      if (!approvedIds.has(doc.id)) return;
      const count = (doc.data()?.count as number) || 0;
      viewsByGame[doc.id] = count;
      totalViews += count;
    });

    const downloadsSnapshot = await db.collection("downloads").get();
    const downloadsByGame: Record<string, number> = {};
    let totalDownloads = 0;
    downloadsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const gameId = data.gameId as string;
      if (!gameId || !approvedIds.has(gameId)) return;
      downloadsByGame[gameId] = (downloadsByGame[gameId] || 0) + 1;
      totalDownloads++;
    });

    return NextResponse.json({
      totalViews,
      totalDownloads,
      viewsByGame,
      downloadsByGame,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}