import { NextRequest, NextResponse } from "next/server";
import { useLocalDatabase } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

// Função helper para salvar progresso no Firestore
async function saveProgressToFirestore(
  userId: string,
  phases: any[],
  totalXP: number,
  currentPhase: number
) {
  try {
    console.log("Iniciando salvamento de progresso no Firestore...");
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
        const progressRef = db.collection("atividades_progresso");
        
        // Verificar se já existe progresso deste usuário
        console.log("Buscando progresso existente para userId:", userId);
        const existingDocs = await progressRef.where("userId", "==", userId).get();
        
        const progressData = {
          userId,
          phases,
          totalXP,
          currentPhase,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          activityId: "prototipo-csharp",
        };

        if (existingDocs.empty) {
          // Primeiro progresso
          console.log("Criando novo progresso...");
          await progressRef.add({
            ...progressData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          console.log("Progresso criado com sucesso");
        } else {
          // Atualizar progresso existente
          console.log("Atualizando progresso existente...");
          const existingDoc = existingDocs.docs[0];
          await existingDoc.ref.update(progressData);
          console.log("Progresso atualizado com ID:", existingDoc.id);
        }
        return;
      } catch (adminError: any) {
        console.error("Admin SDK falhou:", {
          message: adminError?.message,
          code: adminError?.code,
          stack: adminError?.stack,
        });
        // Se tiver service account mas falhou, relançar o erro
        if (serviceAccountKey) {
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
      
      const { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } =
        await import("firebase/firestore");

      const progressRef = collection(db, "atividades_progresso");
      console.log("Collection reference criada");

      // Verificar se já existe progresso deste usuário
      console.log("Buscando progresso existente para userId:", userId);
      const q = query(progressRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      console.log("Snapshot obtido, empty:", snapshot.empty);

      const progressData = {
        userId,
        phases,
        totalXP,
        currentPhase,
        updatedAt: serverTimestamp(),
        activityId: "prototipo-csharp",
      };

      if (snapshot.empty) {
        // Primeiro progresso
        console.log("Criando novo progresso...");
        await addDoc(progressRef, {
          ...progressData,
          createdAt: serverTimestamp(),
        });
        console.log("Progresso criado com sucesso");
      } else {
        // Atualizar progresso existente
        console.log("Atualizando progresso existente...");
        const existingDoc = snapshot.docs[0];
        const docRef = doc(db, "atividades_progresso", existingDoc.id);
        await updateDoc(docRef, progressData);
        console.log("Progresso atualizado com ID:", existingDoc.id);
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
        suggestion = "Verifique as regras de segurança do Firestore. A coleção 'atividades_progresso' precisa ter permissão de escrita.";
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
    console.error("Erro detalhado ao salvar progresso no Firestore:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      userId,
    });
    throw new Error(`Erro ao salvar no Firestore: ${error?.message || "Erro desconhecido"}`);
  }
}

// Função helper para buscar progresso do Firestore
async function getProgressFromFirestore(userId: string) {
  try {
    console.log("Buscando progresso do Firestore para userId:", userId);
    
    // Tentar usar Admin SDK primeiro
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const admin = await import("firebase-admin");
        
        // Inicializar Admin SDK se necessário
        if (admin.apps.length === 0) {
          let serviceAccount = JSON.parse(serviceAccountKey);
          // Normalizar a chave privada (corrigir problemas de formatação)
          serviceAccount = normalizeServiceAccount(serviceAccount);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        const db = admin.firestore();
        const progressRef = db.collection("atividades_progresso");
        const snapshot = await progressRef.where("userId", "==", userId).get();

        if (snapshot.empty) {
          return null;
        }

        const data = snapshot.docs[0].data();
        return {
          phases: data.phases || [],
          totalXP: data.totalXP || 0,
          currentPhase: data.currentPhase || 0,
        };
      } catch (adminError: any) {
        console.error("Admin SDK falhou ao buscar:", adminError?.message);
        // Continuar para Client SDK
      }
    }

    // Fallback: usar Client SDK
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
  } catch (error: any) {
    console.error("Erro ao buscar progresso do Firestore:", error?.message);
    throw error;
  }
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

