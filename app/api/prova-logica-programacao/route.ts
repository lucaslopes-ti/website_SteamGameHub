import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProvaSubmission {
  userId: string;
  studentId: string;
  userName: string;
  provaVersion: number;
  answers: Record<string, string>;
  violations: string[];
  startTime?: string;
  endTime?: string;
  lastSaved?: string;
  submitted?: boolean;
}

// Função helper para normalizar a chave privada do service account
function normalizeServiceAccount(serviceAccount: any): any {
  if (!serviceAccount.private_key) {
    return serviceAccount;
  }

  let privateKey = serviceAccount.private_key;
  privateKey = privateKey.replace(/\\n/g, "\n");

  if (!privateKey.includes("\n") && privateKey.includes("BEGIN PRIVATE KEY")) {
    privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, "-----BEGIN PRIVATE KEY-----\n");
    privateKey = privateKey.replace(/-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----");
  }

  if (!privateKey.includes("BEGIN") || !privateKey.includes("END")) {
    console.error("⚠️ Chave privada parece estar corrompida ou mal formatada");
    throw new Error("Chave privada do service account está mal formatada ou corrompida.");
  }

  if (privateKey.length < 1000) {
    console.error("⚠️ Chave privada parece estar truncada (muito curta)");
    throw new Error("Chave privada do service account parece estar truncada.");
  }

  return {
    ...serviceAccount,
    private_key: privateKey,
  };
}

async function saveSubmissionToFirestore(submission: ProvaSubmission) {
  try {
    console.log("Iniciando salvamento da prova no Firestore...");
    
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const admin = await import("firebase-admin");
        
        if (admin.apps.length === 0) {
          try {
            let serviceAccount = JSON.parse(serviceAccountKey);
            serviceAccount = normalizeServiceAccount(serviceAccount);
            
            if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
              throw new Error("Service account JSON inválido.");
            }
            
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
            });
            console.log("Admin SDK inicializado com sucesso");
          } catch (parseError: any) {
            console.error("Erro ao inicializar Admin SDK:", parseError?.message);
            throw parseError;
          }
        }

        const db = admin.firestore();
        const submissionsRef = db.collection("prova_logica_programacao");
        
        // Verificar se já existe uma submissão deste aluno
        console.log("Buscando submissões existentes para studentId:", submission.studentId);
        const existingDocs = await submissionsRef.where("studentId", "==", submission.studentId).get();
        
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
        console.error("Admin SDK falhou:", {
          message: adminError?.message,
          code: adminError?.code,
        });
        if (serviceAccountKey) {
          throw new Error(`Erro no Admin SDK: ${adminError?.message || "Erro desconhecido"}`);
        }
      }
    }

    // Fallback: usar Client SDK
    console.log("⚠️ Tentando usar Client SDK...");
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!projectId || !apiKey) {
      throw new Error(
        "Firebase não está configurado. Configure FIREBASE_SERVICE_ACCOUNT_KEY ou NEXT_PUBLIC_FIREBASE_*"
      );
    }

    try {
      const { db } = await import("@/lib/firebase/config");
      const { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp } =
        await import("firebase/firestore");

      const submissionsRef = collection(db, "prova_logica_programacao");
      
      // Verificar se já existe uma submissão deste aluno
      const q = query(submissionsRef, where("studentId", "==", submission.studentId));
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
        const existingDoc = snapshot.docs[0];
        const docRef = doc(db, "prova_logica_programacao", existingDoc.id);
        await updateDoc(docRef, submissionData);
        return { id: existingDoc.id, ...submission };
      }
    } catch (clientError: any) {
      console.error("Client SDK também falhou:", {
        message: clientError?.message,
        code: clientError?.code,
      });
      throw new Error(`Erro ao salvar no Firestore: ${clientError?.message || "Erro desconhecido"}`);
    }
  } catch (error: any) {
    console.error("Erro detalhado ao salvar no Firestore:", {
      message: error?.message,
      code: error?.code,
      submission: {
        studentId: submission.studentId,
        provaVersion: submission.provaVersion,
      },
    });
    throw new Error(`Erro ao salvar no Firestore: ${error?.message || "Erro desconhecido"}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      studentId,
      userName,
      provaVersion,
      answers,
      violations,
      startTime,
      endTime,
      lastSaved,
      submitted,
    } = body;

    // Validações
    if (!studentId || !studentId.trim()) {
      return NextResponse.json(
        { error: "studentId é obrigatório" },
        { status: 400 }
      );
    }

    if (!provaVersion || ![1, 2, 3].includes(provaVersion)) {
      return NextResponse.json(
        { error: "provaVersion deve ser 1, 2 ou 3" },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "answers é obrigatório e deve ser um objeto" },
        { status: 400 }
      );
    }

    const submission: ProvaSubmission = {
      userId: userId || "anonymous",
      studentId: studentId.trim(),
      userName: userName || studentId.trim(),
      provaVersion,
      answers,
      violations: violations || [],
      startTime,
      endTime,
      lastSaved,
      submitted: submitted || false,
    };

    // Em produção, sempre usar Firestore
    const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;
    
    if (isProduction) {
      console.log("Usando Firestore (produção)...");
      try {
        const savedSubmission = await saveSubmissionToFirestore(submission);
        console.log("Submissão salva com sucesso!");
        return NextResponse.json(
          { success: true, submission: savedSubmission },
          { status: 201 }
        );
      } catch (firebaseError: any) {
        console.error("Erro ao salvar no Firestore (produção):", firebaseError);
        // Em produção, se Firebase falhar, ainda retornar sucesso mas com aviso
        return NextResponse.json(
          { 
            success: true, 
            submission,
            warning: "Prova salva localmente. Firebase não disponível.",
            firebaseError: firebaseError?.message
          },
          { status: 201 }
        );
      }
    }

    // Desenvolvimento local
    const { useLocalDatabase } = await import("@/lib/config");
    const useLocal = useLocalDatabase();
    
    if (!useLocal) {
      console.log("Usando Firestore (desenvolvimento)...");
      try {
        const savedSubmission = await saveSubmissionToFirestore(submission);
        console.log("Submissão salva com sucesso!");
        return NextResponse.json(
          { success: true, submission: savedSubmission },
          { status: 201 }
        );
      } catch (firebaseError: any) {
        console.error("Erro ao salvar no Firestore (desenvolvimento):", firebaseError);
        // Em desenvolvimento, se Firebase falhar, retornar sucesso mas com aviso
        return NextResponse.json(
          { 
            success: true, 
            submission,
            warning: "Prova salva localmente. Firebase não disponível.",
            firebaseError: firebaseError?.message
          },
          { status: 201 }
        );
      }
    }

    // Modo local - retornar sucesso (dados gerenciados no cliente)
    return NextResponse.json(
      { success: true, submission },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("=== ERRO AO SALVAR PROVA ===");
    console.error("Erro:", error);
    console.error("Stack:", error?.stack);
    
    return NextResponse.json(
      {
        error: "Erro ao salvar prova",
        details: error?.message || "Erro desconhecido",
        suggestion: error?.message?.includes("Firebase") 
          ? "Verifique a configuração do Firebase. Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md"
          : "Tente novamente em alguns instantes",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // Em produção, sempre usar Firestore
    const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;
    const { useLocalDatabase } = await import("@/lib/config");
    const useLocal = useLocalDatabase();
    
    if (isProduction || !useLocal) {
      // Buscar do Firestore
      try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
          const admin = await import("firebase-admin");
          
          if (admin.apps.length === 0) {
            let serviceAccount = JSON.parse(serviceAccountKey);
            serviceAccount = normalizeServiceAccount(serviceAccount);
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
            });
          }

          const db = admin.firestore();
          const submissionsRef = db.collection("prova_logica_programacao");
          
          let snapshot;
          if (studentId) {
            snapshot = await submissionsRef.where("studentId", "==", studentId).get();
          } else {
            snapshot = await submissionsRef.get();
          }
          
          const submissions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return NextResponse.json({ success: true, submissions });
        }
      } catch (error: any) {
        console.error("Erro ao buscar do Firestore:", error);
        return NextResponse.json(
          { error: "Erro ao buscar provas", details: error?.message },
          { status: 500 }
        );
      }
    }

    // Modo local - retornar vazio
    return NextResponse.json({ success: true, submissions: [] });
  } catch (error: any) {
    console.error("Erro ao buscar provas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar provas", details: error?.message },
      { status: 500 }
    );
  }
}

