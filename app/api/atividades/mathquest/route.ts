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
  try {
    console.log("Iniciando salvamento no Firestore...");
    
    // Tentar usar Admin SDK primeiro (melhor para servidor)
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const admin = await import("firebase-admin");
        
        // Inicializar Admin SDK se necessário
        if (admin.apps.length === 0) {
          try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
            });
            console.log("Admin SDK inicializado");
          } catch (parseError: any) {
            console.error("Erro ao fazer parse do service account:", parseError?.message);
            throw new Error(`Erro ao fazer parse do service account: ${parseError?.message || "Formato JSON inválido"}`);
          }
        }

        const db = admin.firestore();
        const submissionsRef = db.collection("atividades_mathquest");
        
        // Verificar se já existe uma submissão deste usuário
        console.log("Buscando submissões existentes para userId:", submission.userId);
        const existingDocs = await submissionsRef.where("userId", "==", submission.userId).get();
        
        const submissionData = {
          ...submission,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (existingDocs.empty) {
          // Primeira submissão
          console.log("Criando nova submissão...");
          const docRef = await submissionsRef.add({
            ...submissionData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log("Submissão criada com ID:", docRef.id);
          return { id: docRef.id, ...submission };
        } else {
          // Atualizar submissão existente
          console.log("Atualizando submissão existente...");
          const existingDoc = existingDocs.docs[0];
          await existingDoc.ref.update(submissionData);
          console.log("Submissão atualizada com ID:", existingDoc.id);
          return { id: existingDoc.id, ...submission };
        }
      } catch (adminError: any) {
        console.warn("Admin SDK falhou, tentando Client SDK:", adminError?.message);
        // Continuar para tentar Client SDK
      }
    }

    // Fallback: usar Client SDK
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID não está configurado");
    }
    console.log("Firebase Project ID:", projectId);

    const { db } = await import("@/lib/firebase/config");
    console.log("Firestore db obtido:", !!db);
    
    const { collection, addDoc, query, where, getDocs, serverTimestamp } =
      await import("firebase/firestore");

    const submissionsRef = collection(db, "atividades_mathquest");
    console.log("Collection reference criada");

    // Verificar se já existe uma submissão deste usuário
    console.log("Buscando submissões existentes para userId:", submission.userId);
    const q = query(submissionsRef, where("userId", "==", submission.userId));
    const snapshot = await getDocs(q);
    console.log("Snapshot obtido, empty:", snapshot.empty);

    const submissionData = {
      ...submission,
      updatedAt: serverTimestamp(),
    };

    if (snapshot.empty) {
      // Primeira submissão
      console.log("Criando nova submissão...");
      const docRef = await addDoc(submissionsRef, {
        ...submissionData,
        createdAt: serverTimestamp(),
      });
      console.log("Submissão criada com ID:", docRef.id);
      return { id: docRef.id, ...submission };
    } else {
      // Atualizar submissão existente
      console.log("Atualizando submissão existente...");
      const { doc, updateDoc } = await import("firebase/firestore");
      const existingDoc = snapshot.docs[0];
      const docRef = doc(db, "atividades_mathquest", existingDoc.id);
      await updateDoc(docRef, submissionData);
      console.log("Submissão atualizada com ID:", existingDoc.id);
      return { id: existingDoc.id, ...submission };
    }
  } catch (error: any) {
    console.error("Erro detalhado ao salvar no Firestore:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      submission: {
        userId: submission.userId,
        projectTitle: submission.projectTitle,
      },
    });
    throw new Error(`Erro ao salvar no Firestore: ${error?.message || "Erro desconhecido"}`);
  }
}

async function getSubmissionsFromFirestore(userId?: string) {
  try {
    // Tentar usar Admin SDK primeiro
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const admin = await import("firebase-admin");
        
        if (admin.apps.length === 0) {
          const serviceAccount = JSON.parse(serviceAccountKey);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        const db = admin.firestore();
        let query = db.collection("atividades_mathquest");
        
        if (userId) {
          query = query.where("userId", "==", userId);
        }
        
        const snapshot = await query.get();
        const submissions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Ordenar manualmente
        if (submissions.length > 0) {
          submissions.sort((a: any, b: any) => {
            const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            return dateB - dateA; // Descendente
          });
        }

        return submissions;
      } catch (adminError: any) {
        console.warn("Admin SDK falhou, tentando Client SDK:", adminError?.message);
        // Continuar para tentar Client SDK
      }
    }

    // Fallback: usar Client SDK
    const { db } = await import("@/lib/firebase/config");
    const { collection, query, where, getDocs, orderBy } =
      await import("firebase/firestore");

    const submissionsRef = collection(db, "atividades_mathquest");
    let q;
    let useOrderBy = true;

    if (userId) {
      // Tentar criar query com orderBy
      q = query(
        submissionsRef,
        where("userId", "==", userId),
        orderBy("submittedAt", "desc")
      );
    } else {
      q = query(submissionsRef, orderBy("submittedAt", "desc"));
    }

    let snapshot;
    try {
      snapshot = await getDocs(q);
    } catch (queryError: any) {
      // Se a query falhar (provavelmente por falta de índice), tentar sem orderBy
      if (queryError?.code === "failed-precondition" || queryError?.message?.includes("index")) {
        console.warn("orderBy falhou (índice não existe), buscando sem ordenação:", queryError?.message);
        useOrderBy = false;
        if (userId) {
          q = query(submissionsRef, where("userId", "==", userId));
        } else {
          q = query(submissionsRef);
        }
        snapshot = await getDocs(q);
      } else {
        throw queryError;
      }
    }

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Ordenar manualmente se orderBy não foi usado ou falhou
    if (!useOrderBy && submissions.length > 0) {
      submissions.sort((a: any, b: any) => {
        const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return dateB - dateA; // Descendente
      });
    }

    return submissions;
  } catch (error: any) {
    console.error("Erro ao buscar submissões do Firestore:", {
      message: error?.message,
      code: error?.code,
      userId,
    });
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log("=== POST /api/atividades/mathquest ===");
  try {
    const body = await request.json();
    console.log("Body recebido:", {
      userId: body.userId,
      userName: body.userName,
      projectTitle: body.projectTitle,
      hasCharacterArtUrl: !!body.characterArtUrl,
      hasScenarioArtUrl: !!body.scenarioArtUrl,
      hasGddLink: !!body.gddLink,
      hasGddFileUrl: !!body.gddFileUrl,
    });
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
    // Permitir strings vazias como null
    const validGddLink = gddLink && gddLink.trim() !== "" ? gddLink.trim() : null;
    const validGddFileUrl = gddFileUrl && gddFileUrl.trim() !== "" ? gddFileUrl.trim() : null;
    
    if (!validGddLink && !validGddFileUrl) {
      return NextResponse.json(
        { error: "É necessário fornecer gddLink ou gddFileUrl" },
        { status: 400 }
      );
    }

    const submission: MathQuestSubmission = {
      userId: userId.trim(),
      userName: userName.trim(),
      projectTitle: projectTitle.trim(),
      description: description.trim(),
      characterArtUrl: characterArtUrl.trim(),
      scenarioArtUrl: scenarioArtUrl.trim(),
      prototypeLink: prototypeLink && prototypeLink.trim() !== "" ? prototypeLink.trim() : null,
      gddLink: validGddLink,
      gddFileUrl: validGddFileUrl,
      comments: comments && comments.trim() !== "" ? comments.trim() : null,
      submittedAt: submittedAt || new Date().toISOString(),
    };

    // Em produção, sempre usar Firestore
    const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;
    console.log("Ambiente:", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      isProduction,
    });

    if (isProduction) {
      console.log("Usando Firestore (produção)...");
      const savedSubmission = await saveSubmissionToFirestore(submission);
      console.log("Submissão salva com sucesso!");
      return NextResponse.json(
        { success: true, submission: savedSubmission },
        { status: 201 }
      );
    }

    // Desenvolvimento local
    const { useLocalDatabase } = await import("@/lib/config");
    const useLocal = useLocalDatabase();
    console.log("useLocalDatabase:", useLocal);
    
    if (!useLocal) {
      console.log("Usando Firestore (desenvolvimento)...");
      const savedSubmission = await saveSubmissionToFirestore(submission);
      console.log("Submissão salva com sucesso!");
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
    console.error("=== ERRO AO SALVAR SUBMISSÃO MATHQUEST ===");
    console.error("Tipo do erro:", error?.constructor?.name);
    console.error("Mensagem:", error?.message);
    console.error("Código:", error?.code);
    console.error("Nome:", error?.name);
    console.error("Stack:", error?.stack);
    
    // Log adicional para erros do Firebase
    if (error?.code) {
      console.error("Código de erro do Firebase:", error.code);
    }
    if (error?.serverResponse) {
      console.error("Resposta do servidor:", error.serverResponse);
    }
    
    // Retornar mensagem de erro mais detalhada
    const errorMessage = error?.message || "Erro desconhecido ao salvar submissão";
    const errorCode = error?.code || "UNKNOWN_ERROR";
    
    return NextResponse.json(
      { 
        error: "Erro ao salvar submissão", 
        details: errorMessage,
        code: errorCode,
        suggestion: errorCode === "permission-denied" 
          ? "Verifique as regras de segurança do Firestore"
          : errorCode === "unavailable"
          ? "Firestore temporariamente indisponível. Tente novamente."
          : errorCode === "failed-precondition"
          ? "Índice do Firestore não existe. Crie o índice necessário."
          : "Verifique os logs do servidor para mais detalhes"
      },
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

