import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MathQuestSubmission {
  userId: string;
  userName: string;
  projectTitle: string;
  description: string;
  characterArtUrl: string;
  scenarioArtUrl: string;
  prototypeLink: string | null;
  gddLink: string | null;
  gddFileUrl: string | null;
  comments: string | null;
  submittedAt: string;
}

async function saveSubmissionToFirestore(submission: MathQuestSubmission) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, addDoc, query, where, getDocs, serverTimestamp } =
    await import("firebase/firestore");

  const submissionsRef = collection(db, "atividades_mathquest");

  // Verificar se já existe uma submissão deste usuário
  const q = query(submissionsRef, where("userId", "==", submission.userId));
  const snapshot = await getDocs(q);

  const submissionData = {
    ...submission,
    updatedAt: serverTimestamp(),
  };

  if (snapshot.empty) {
    // Primeira submissão
    const docRef = await addDoc(submissionsRef, {
      ...submissionData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...submission };
  } else {
    // Atualizar submissão existente
    const { doc, updateDoc } = await import("firebase/firestore");
    const existingDoc = snapshot.docs[0];
    const docRef = doc(db, "atividades_mathquest", existingDoc.id);
    await updateDoc(docRef, submissionData);
    return { id: existingDoc.id, ...submission };
  }
}

async function getSubmissionsFromFirestore(userId?: string) {
  const { db } = await import("@/lib/firebase/config");
  const { collection, query, where, getDocs, orderBy } =
    await import("firebase/firestore");

  const submissionsRef = collection(db, "atividades_mathquest");
  let q;

  if (userId) {
    q = query(
      submissionsRef,
      where("userId", "==", userId),
      orderBy("submittedAt", "desc")
    );
  } else {
    q = query(submissionsRef, orderBy("submittedAt", "desc"));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      projectTitle,
      description,
      characterArtUrl,
      scenarioArtUrl,
      prototypeLink,
      gddLink,
      gddFileUrl,
      comments,
      submittedAt,
    } = body;

    // Validações
    if (!userId || !userName) {
      return NextResponse.json(
        { error: "userId e userName são obrigatórios" },
        { status: 400 }
      );
    }

    if (!projectTitle || !description) {
      return NextResponse.json(
        { error: "projectTitle e description são obrigatórios" },
        { status: 400 }
      );
    }

    if (!characterArtUrl || !scenarioArtUrl) {
      return NextResponse.json(
        { error: "characterArtUrl e scenarioArtUrl são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar que pelo menos um método de GDD foi fornecido
    if (!gddLink && !gddFileUrl) {
      return NextResponse.json(
        { error: "É necessário fornecer gddLink ou gddFileUrl" },
        { status: 400 }
      );
    }

    const submission: MathQuestSubmission = {
      userId,
      userName,
      projectTitle,
      description,
      characterArtUrl,
      scenarioArtUrl,
      prototypeLink: prototypeLink || null,
      gddLink: gddLink || null,
      gddFileUrl: gddFileUrl || null,
      comments: comments || null,
      submittedAt: submittedAt || new Date().toISOString(),
    };

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const savedSubmission = await saveSubmissionToFirestore(submission);
      return NextResponse.json(
        { success: true, submission: savedSubmission },
        { status: 201 }
      );
    }

    // Desenvolvimento local
    const { useLocalDatabase } = await import("@/lib/config");
    if (!useLocalDatabase()) {
      const savedSubmission = await saveSubmissionToFirestore(submission);
      return NextResponse.json(
        { success: true, submission: savedSubmission },
        { status: 201 }
      );
    }

    // Modo local - retornar sucesso (dados gerenciados no cliente)
    return NextResponse.json(
      { success: true, submission },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao salvar submissão MathQuest:", error);
    return NextResponse.json(
      { error: "Erro ao salvar submissão", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Em produção, sempre usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      const submissions = await getSubmissionsFromFirestore(userId || undefined);
      return NextResponse.json({ success: true, submissions }, { status: 200 });
    }

    // Desenvolvimento local
    const { useLocalDatabase } = await import("@/lib/config");
    if (!useLocalDatabase()) {
      const submissions = await getSubmissionsFromFirestore(userId || undefined);
      return NextResponse.json({ success: true, submissions }, { status: 200 });
    }

    // Modo local - retornar array vazio
    return NextResponse.json({ success: true, submissions: [] }, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar submissões MathQuest:", error);
    return NextResponse.json(
      { error: "Erro ao buscar submissões", details: error?.message },
      { status: 500 }
    );
  }
}

