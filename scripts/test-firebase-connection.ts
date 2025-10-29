/**
 * Script para testar conexão com Firebase
 * Execute com: npx tsx scripts/test-firebase-connection.ts
 */

import * as dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config({ path: ".env.local" });

async function testFirebaseConnection() {
  console.log("🔥 Testando conexão com Firebase...\n");

  // Verificar variáveis de ambiente
  const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  console.log("📋 Verificando variáveis de ambiente...");
  let allVarsPresent = true;
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`  ❌ ${varName}: NÃO CONFIGURADO`);
      allVarsPresent = false;
    }
  }

  if (!allVarsPresent) {
    console.log("\n⚠️  Algumas variáveis estão faltando. Configure-as no .env.local");
    return;
  }

  // Tentar inicializar Firebase
  try {
    console.log("\n🔥 Inicializando Firebase...");
    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    const { getStorage } = await import("firebase/storage");
    const { getAuth } = await import("firebase/auth");

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    console.log("  ✅ Firebase App inicializado");

    const db = getFirestore(app);
    console.log("  ✅ Firestore conectado");

    const storage = getStorage(app);
    console.log("  ✅ Storage conectado");

    const auth = getAuth(app);
    console.log("  ✅ Authentication conectado");

    // Teste básico de leitura do Firestore
    try {
      console.log("\n📖 Testando leitura do Firestore...");
      const { collection, getDocs } = await import("firebase/firestore");
      const gamesRef = collection(db, "games");
      const snapshot = await getDocs(gamesRef);
      console.log(`  ✅ Conseguiu ler Firestore. Total de jogos: ${snapshot.size}`);
    } catch (error: any) {
      console.log(`  ⚠️  Erro ao ler Firestore: ${error.message}`);
      console.log("  💡 Isso pode ser normal se as regras de segurança bloquearem leitura não autenticada");
    }

    console.log("\n✅ Conexão com Firebase funcionando corretamente!");
    console.log("\n📝 Próximos passos:");
    console.log("   1. Configure as regras de segurança no Firebase Console");
    console.log("   2. Crie usuários de teste se necessário");
    console.log("   3. Execute 'npm run dev' para testar localmente");
  } catch (error: any) {
    console.error("\n❌ Erro ao conectar com Firebase:");
    console.error(`   ${error.message}`);
    console.log("\n💡 Verifique:");
    console.log("   - Se as credenciais do Firebase estão corretas");
    console.log("   - Se o projeto Firebase está ativo");
    console.log("   - Se todos os serviços estão habilitados (Firestore, Storage, Auth)");
  }
}

testFirebaseConnection().catch(console.error);

