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

// Função helper para normalizar a chave privada do service account
// Corrige problemas comuns de formatação ao colar na Vercel
function normalizeServiceAccount(serviceAccount: any): any {
  if (!serviceAccount.private_key) {
    return serviceAccount;
  }

  let privateKey = serviceAccount.private_key;

  // Normalizar quebras de linha: substituir \\n por \n
  // Isso acontece quando o JSON é colado e as quebras são escapadas duplamente
  privateKey = privateKey.replace(/\\n/g, "\n");

  // Se ainda não tiver quebras de linha reais, tentar adicionar baseado no padrão
  if (!privateKey.includes("\n") && privateKey.includes("BEGIN PRIVATE KEY")) {
    // Tentar adicionar quebras de linha baseado no padrão PEM
    privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, "-----BEGIN PRIVATE KEY-----\n");
    privateKey = privateKey.replace(/-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----");
  }

  // Validar que a chave tem o formato básico correto
  if (!privateKey.includes("BEGIN") || !privateKey.includes("END")) {
    console.error("⚠️ Chave privada parece estar corrompida ou mal formatada");
    console.error("Tamanho da chave:", privateKey.length, "caracteres");
    console.error("Primeiros 100 caracteres:", privateKey.substring(0, 100));
    console.error("Últimos 100 caracteres:", privateKey.substring(Math.max(0, privateKey.length - 100)));
    throw new Error("Chave privada do service account está mal formatada ou corrompida. Verifique se FIREBASE_SERVICE_ACCOUNT_KEY contém o JSON completo. A chave privada deve começar com '-----BEGIN PRIVATE KEY-----' e terminar com '-----END PRIVATE KEY-----'.");
  }

  // Validar que a chave não está truncada (deve ter pelo menos 1000 caracteres)
  if (privateKey.length < 1000) {
    console.error("⚠️ Chave privada parece estar truncada (muito curta)");
    console.error("Tamanho da chave:", privateKey.length, "caracteres (esperado: ~2000+)");
    throw new Error("Chave privada do service account parece estar truncada. Verifique se o JSON completo foi copiado na variável FIREBASE_SERVICE_ACCOUNT_KEY na Vercel.");
  }

  return {
    ...serviceAccount,
    private_key: privateKey,
  };
}

async function saveSubmissionToFirestore(submission: MathQuestSubmission) {
  try {
    console.log("Iniciando salvamento no Firestore...");
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
            // A função normalizeServiceAccount já valida o formato
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
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID não está configurado. " +
        "Configure FIREBASE_SERVICE_ACCOUNT_KEY na Vercel para usar Admin SDK (recomendado). " +
        "Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md para mais detalhes."
      );
    }
    
    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_FIREBASE_API_KEY não está configurado. " +
        "Configure todas as variáveis NEXT_PUBLIC_FIREBASE_* na Vercel. " +
        "Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md para mais detalhes."
      );
    }
    
    console.log("Firebase Project ID:", projectId);

    try {
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
    } catch (clientError: any) {
      console.error("Client SDK também falhou:", {
        message: clientError?.message,
        code: clientError?.code,
        stack: clientError?.stack,
      });
      
      const errorMessage = clientError?.message || "Erro desconhecido";
      const errorCode = clientError?.code || "UNKNOWN_ERROR";
      
      // Mensagens mais específicas baseadas no código de erro
      let suggestion = "Configure FIREBASE_SERVICE_ACCOUNT_KEY na Vercel para usar Admin SDK (recomendado). Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md";
      
      if (errorCode === "permission-denied") {
        suggestion = "Verifique as regras de segurança do Firestore. A coleção 'atividades_mathquest' precisa ter permissão de escrita.";
      } else if (errorCode === "unavailable") {
        suggestion = "Firestore temporariamente indisponível. Tente novamente em alguns segundos.";
      } else if (errorCode === "failed-precondition") {
        suggestion = "Índice do Firestore não existe. Siga o link fornecido pelo Firebase para criar o índice necessário.";
      } else if (errorMessage.includes("auth") || errorMessage.includes("permission")) {
        suggestion = "Problema de autenticação ou permissão. Configure FIREBASE_SERVICE_ACCOUNT_KEY para usar Admin SDK.";
      }
      
      throw new Error(`Erro ao salvar no Firestore. Client SDK falhou: ${errorMessage}. ${suggestion}`);
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
          let serviceAccount = JSON.parse(serviceAccountKey);
          // Normalizar a chave privada (corrigir problemas de formatação)
          serviceAccount = normalizeServiceAccount(serviceAccount);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        const db = admin.firestore();
        const submissionsRef = db.collection("atividades_mathquest");
        
        let snapshot;
        if (userId) {
          snapshot = await submissionsRef.where("userId", "==", userId).get();
        } else {
          snapshot = await submissionsRef.get();
        }
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
        console.error("Admin SDK falhou ao buscar:", {
          message: adminError?.message,
          code: adminError?.code,
        });
        // Se não tiver service account, continuar para Client SDK
        if (!serviceAccountKey) {
          console.log("Service account não configurado, tentando Client SDK...");
        } else {
          throw adminError;
        }
      }
    }

    // Fallback: usar Client SDK
    try {
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
    } catch (clientError: any) {
      console.error("Client SDK também falhou ao buscar:", {
        message: clientError?.message,
        code: clientError?.code,
      });
      throw new Error(`Erro ao buscar submissões. Client SDK falhou: ${clientError?.message || "Erro desconhecido"}. Configure FIREBASE_SERVICE_ACCOUNT_KEY para usar Admin SDK.`);
    }
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
    
    // Verificar variáveis de ambiente para diagnóstico
    console.error("Diagnóstico de variáveis de ambiente:", {
      hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    });
    
    // Retornar mensagem de erro mais detalhada
    const errorMessage = error?.message || "Erro desconhecido ao salvar submissão";
    const errorCode = error?.code || "UNKNOWN_ERROR";
    
    // Sugestões baseadas no tipo de erro
    let suggestion = "Verifique os logs do servidor na Vercel para mais detalhes. Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md";
    
    if (errorMessage.includes("FIREBASE_SERVICE_ACCOUNT_KEY") || errorMessage.includes("Service account")) {
      suggestion = "Configure FIREBASE_SERVICE_ACCOUNT_KEY na Vercel. Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md para instruções.";
    } else if (errorMessage.includes("NEXT_PUBLIC_FIREBASE")) {
      suggestion = "Configure todas as variáveis NEXT_PUBLIC_FIREBASE_* na Vercel. Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md";
    } else if (errorCode === "permission-denied") {
      suggestion = "Verifique as regras de segurança do Firestore. A coleção 'atividades_mathquest' precisa ter permissão de escrita.";
    } else if (errorCode === "unavailable") {
      suggestion = "Firestore temporariamente indisponível. Tente novamente em alguns segundos.";
    } else if (errorCode === "failed-precondition") {
      suggestion = "Índice do Firestore não existe. Siga o link fornecido pelo Firebase para criar o índice necessário.";
    }
    
    return NextResponse.json(
      { 
        error: "Erro ao salvar submissão", 
        details: errorMessage,
        code: errorCode,
        suggestion,
        documentation: "Veja docs/CONFIGURACAO_VERCEL_FIREBASE.md para instruções de configuração"
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

