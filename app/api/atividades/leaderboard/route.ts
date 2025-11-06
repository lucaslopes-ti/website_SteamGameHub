import { NextRequest, NextResponse } from "next/server";
import { useLocalDatabase } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getLeaderboardFromFirestore(activityId: string) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs, orderBy, limit } = await import("firebase/firestore");

  const progressRef = collection(db, "atividades_progresso");
  const q = query(
    progressRef,
    where("activityId", "==", activityId),
    orderBy("totalXP", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map((doc, index) => {
    const data = doc.data();
    return {
      userId: data.userId,
      userName: data.userId.split("@")[0], // Usar parte antes do @ como nome
      xp: data.totalXP || 0,
      position: index + 1,
    };
  });

  return entries;
}

export async function GET(request: NextRequest) {
  try {
    const activityId = request.nextUrl.searchParams.get("activityId") || "prototipo-csharp";

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const entries = await getLeaderboardFromFirestore(activityId);
      return NextResponse.json({ entries });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const entries = await getLeaderboardFromFirestore(activityId);
      return NextResponse.json({ entries });
    }

    // Modo local - retornar vazio
    return NextResponse.json({ entries: [] });
  } catch (error: any) {
    console.error("Erro ao buscar leaderboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leaderboard", details: error?.message },
      { status: 500 }
    );
  }
}

