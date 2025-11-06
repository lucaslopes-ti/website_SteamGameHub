import { NextRequest, NextResponse } from "next/server";
import { useLocalDatabase } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

async function saveMessageToFirestore(message: Omit<ChatMessage, "id" | "timestamp">) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  const chatRef = collection(db, "atividades_chat");
  await addDoc(chatRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
}

async function getMessagesFromFirestore(activityId: string) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs, orderBy, limit } = await import("firebase/firestore");

  const chatRef = collection(db, "atividades_chat");
  const q = query(
    chatRef,
    where("activityId", "==", activityId),
    orderBy("timestamp", "asc"),
    limit(100)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      userName: data.userName,
      message: data.message,
      timestamp: data.timestamp?.toDate() || new Date(),
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const activityId = request.nextUrl.searchParams.get("activityId") || "prototipo-csharp";

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const messages = await getMessagesFromFirestore(activityId);
      return NextResponse.json({ messages });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      const messages = await getMessagesFromFirestore(activityId);
      return NextResponse.json({ messages });
    }

    // Modo local - retornar vazio
    return NextResponse.json({ messages: [] });
  } catch (error: any) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mensagens", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, userId, userName, message } = body;

    if (!activityId || !userId || !userName || !message) {
      return NextResponse.json(
        { error: "Campos obrigatórios: activityId, userId, userName, message" },
        { status: 400 }
      );
    }

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      await saveMessageToFirestore({ activityId, userId, userName, message });
      return NextResponse.json({ success: true });
    }

    // Desenvolvimento local
    if (!useLocalDatabase()) {
      await saveMessageToFirestore({ activityId, userId, userName, message });
      return NextResponse.json({ success: true });
    }

    // Modo local - retornar sucesso
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao salvar mensagem:", error);
    return NextResponse.json(
      { error: "Erro ao salvar mensagem", details: error?.message },
      { status: 500 }
    );
  }
}

