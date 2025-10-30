import { NextRequest, NextResponse } from "next/server";
import { useLocalDatabase } from "@/lib/config";

// Garantir que esta rota não seja pré-renderizada/cachê estático
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Em produção (Vercel), usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || !useLocalDatabase()) {
      const { db } = await import("@/lib/firebase/config");
      const { collection, getDocs } = await import("firebase/firestore");

      // Buscar todas as views
      const viewsRef = collection(db, "views");
      const viewsSnapshot = await getDocs(viewsRef);
      
      const viewsByGame: Record<string, number> = {};
      let totalViews = 0;
      viewsSnapshot.docs.forEach((doc) => {
        const count = (doc.data()?.count as number) || 0;
        viewsByGame[doc.id] = count;
        totalViews += count;
      });

      // Buscar todos os downloads
      const downloadsRef = collection(db, "downloads");
      const downloadsSnapshot = await getDocs(downloadsRef);

      const downloadsByGame: Record<string, number> = {};
      let totalDownloads = 0;
      downloadsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const gameId = data.gameId as string;
        if (gameId) {
          downloadsByGame[gameId] = (downloadsByGame[gameId] || 0) + 1;
          totalDownloads++;
        }
      });

      return NextResponse.json({
        totalViews,
        totalDownloads,
        viewsByGame,
        downloadsByGame,
      });
    }

    // Modo local (desenvolvimento) - não implementado ainda
    return NextResponse.json({
      totalViews: 0,
      totalDownloads: 0,
      viewsByGame: {},
      downloadsByGame: {},
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

