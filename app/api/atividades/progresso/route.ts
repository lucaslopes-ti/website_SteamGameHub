import { NextRequest, NextResponse } from "next/server";
import { useLocalDatabase } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Função helper para salvar progresso no Firestore
async function saveProgressToFirestore(
  userId: string,
  phases: any[],
  totalXP: number,
  currentPhase: number
) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } =
    await import("firebase/firestore");

  const progressRef = collection(db, "atividades_progresso");
  const q = query(progressRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const progressData = {
    userId,
    phases,
    totalXP,
    currentPhase,
    updatedAt: serverTimestamp(),
    activityId: "prototipo-csharp",
  };

  if (snapshot.empty) {
    await addDoc(progressRef, {
      ...progressData,
      createdAt: serverTimestamp(),
    });
  } else {
    const docRef = doc(db, "atividades_progresso", snapshot.docs[0].id);
    await updateDoc(docRef, progressData);
  }
}

// Função helper para buscar progresso do Firestore
async function getProgressFromFirestore(userId: string) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs } = await import("firebase/firestore");

  const progressRef = collection(db, "atividades_progresso");
  const q = query(progressRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const data = snapshot.docs[0].data();
  return {
    phases: data.phases || [],
    totalXP: data.totalXP || 0,
    currentPhase: data.currentPhase || 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const progress = await getProgressFromFirestore(userId);
      return NextResponse.json(progress || { phases: [], totalXP: 0, currentPhase: 0 });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const progress = await getProgressFromFirestore(userId);
      return NextResponse.json(progress || { phases: [], totalXP: 0, currentPhase: 0 });
    }

    // Modo local (desenvolvimento) - usar localStorage via cliente
    return NextResponse.json({ phases: [], totalXP: 0, currentPhase: 0 });
  } catch (error: any) {
    console.error("Erro ao buscar progresso:", error);
    return NextResponse.json(
      { error: "Erro ao buscar progresso", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phases, totalXP, currentPhase } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      await saveProgressToFirestore(userId, phases, totalXP, currentPhase);
      return NextResponse.json({ success: true });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      await saveProgressToFirestore(userId, phases, totalXP, currentPhase);
      return NextResponse.json({ success: true });
    }

    // Modo local - retornar sucesso (dados gerenciados no cliente)
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao salvar progresso:", error);
    return NextResponse.json(
      { error: "Erro ao salvar progresso", details: error?.message },
      { status: 500 }
    );
  }
}

