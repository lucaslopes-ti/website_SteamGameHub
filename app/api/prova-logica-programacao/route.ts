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
    console.log("Variáveis de ambiente disponíveis:", {
      hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    });
    
    // Tentar usar Admin SDK primeiro (melhor para servidor)
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const admin = await import("firebase-admin");
        
        // Inicializar Admin SDK se necessário
        if (admin.apps.length === 0) {
          try {
            let serviceAccount;
            try {
              serviceAccount = JSON.parse(serviceAccountKey);
            } catch (parseError: any) {
              console.error("Erro ao fazer parse do service account:", parseError?.message);
              console.error("Primeiros 100 caracteres da chave:", serviceAccountKey.substring(0, 100));
              throw new Error(`Erro ao fazer parse do service account: ${parseError?.message || "Formato JSON inválido"}. Verifique se FIREBASE_SERVICE_ACCOUNT_KEY contém um JSON válido.`);
            }
            
            // Validar campos obrigatórios do service account
            if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
              throw new Error("Service account JSON inválido. Campos obrigatórios: project_id, private_key, client_email");
            }
            
            // Normalizar a chave privada (corrigir problemas de formatação)
            serviceAccount = normalizeServiceAccount(serviceAccount);
            
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
        console.log("Coleção:", "prova_logica_programacao");
        
        let existingDocs;
        try {
          existingDocs = await submissionsRef.where("studentId", "==", submission.studentId).get();
          console.log("Query executada com sucesso. Documentos encontrados:", existingDocs.size);
        } catch (queryError: any) {
          console.error("Erro ao executar query:", {
            message: queryError?.message,
            code: queryError?.code,
          });
          throw queryError;
        }
        
        const submissionData = {
          ...submission,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (existingDocs.empty) {
          // Primeira submissão
          console.log("Criando nova submissão...");
          console.log("Dados a serem salvos:", {
            studentId: submission.studentId,
            provaVersion: submission.provaVersion,
            answersCount: Object.keys(submission.answers).length,
            submitted: submission.submitted,
          });
          
          let docRef;
          try {
            docRef = await submissionsRef.add({
              ...submissionData,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log("✅ Submissão criada com sucesso! ID:", docRef.id);
            return { id: docRef.id, ...submission };
          } catch (addError: any) {
            console.error("❌ Erro ao criar documento:", {
              message: addError?.message,
              code: addError?.code,
              stack: addError?.stack,
            });
            throw addError;
          }
        } else {
          // Atualizar submissão existente
          console.log("Atualizando submissão existente...");
          const existingDoc = existingDocs.docs[0];
          console.log("Documento existente ID:", existingDoc.id);
          
          try {
            await existingDoc.ref.update(submissionData);
            console.log("✅ Submissão atualizada com sucesso! ID:", existingDoc.id);
            return { id: existingDoc.id, ...submission };
          } catch (updateError: any) {
            console.error("❌ Erro ao atualizar documento:", {
              message: updateError?.message,
              code: updateError?.code,
              stack: updateError?.stack,
            });
            throw updateError;
          }
        }
      } catch (adminError: any) {
        console.error("Admin SDK falhou:", {
          message: adminError?.message,
          code: adminError?.code,
          stack: adminError?.stack,
        });
        // Se não tiver service account, continuar para Client SDK
        if (!serviceAccountKey) {
          console.log("Service account não configurado, tentando Client SDK...");
        } else {
          // Se tiver service account mas falhou, relançar o erro
          throw new Error(`Erro no Admin SDK: ${adminError?.message || "Erro desconhecido"}`);
        }
      }
    }

    // Fallback: usar Client SDK (pode não funcionar bem em serverless)
    console.log("⚠️ Service account não configurado. Tentando usar Client SDK (não recomendado para produção)...");
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!projectId) {
      throw new Error(
        "Firebase não está configurado. Configure FIREBASE_SERVICE_ACCOUNT_KEY ou NEXT_PUBLIC_FIREBASE_PROJECT_ID"
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

    // Sempre tentar salvar no Firebase primeiro
    console.log("Tentando salvar no Firestore...");
    try {
      const savedSubmission = await saveSubmissionToFirestore(submission);
      console.log("✅ Submissão salva com sucesso no Firestore! ID:", savedSubmission.id);
      return NextResponse.json(
        { success: true, submission: savedSubmission },
        { status: 201 }
      );
    } catch (firebaseError: any) {
      console.error("❌ Erro ao salvar no Firestore:", firebaseError);
      console.error("Detalhes do erro:", {
        message: firebaseError?.message,
        code: firebaseError?.code,
        stack: firebaseError?.stack,
      });
      
      // Se o erro for de configuração, retornar erro para o usuário corrigir
      if (
        firebaseError?.message?.includes("não está configurado") ||
        firebaseError?.message?.includes("Service account") ||
        firebaseError?.message?.includes("FIREBASE_SERVICE_ACCOUNT_KEY")
      ) {
        return NextResponse.json(
          {
            error: "Firebase não configurado",
            details: firebaseError?.message || "Configure FIREBASE_SERVICE_ACCOUNT_KEY ou NEXT_PUBLIC_FIREBASE_*",
            suggestion: "Verifique a documentação em docs/CONFIGURACAO_FIREBASE.md",
          },
          { status: 500 }
        );
      }
      
      // Para outros erros, retornar erro também (não salvar "localmente" que não existe)
      return NextResponse.json(
        {
          error: "Erro ao salvar no Firebase",
          details: firebaseError?.message || "Erro desconhecido",
          suggestion: "Verifique os logs do servidor e a configuração do Firebase",
        },
        { status: 500 }
      );
    }
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

