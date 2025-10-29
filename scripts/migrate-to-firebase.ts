/**
 * Script para migrar dados do sistema local (JSON) para Firebase
 * Execute com: npx tsx scripts/migrate-to-firebase.ts
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

interface Game {
  id: string;
  [key: string]: any;
}

interface Comment {
  id: string;
  [key: string]: any;
}

interface Favorite {
  id: string;
  [key: string]: any;
}

interface Download {
  id: string;
  [key: string]: any;
}

interface Views {
  [gameId: string]: number;
}

async function migrateGames() {
  console.log("📦 Migrando jogos...");
  const gamesFile = path.join(process.cwd(), "data", "games.json");
  
  if (!existsSync(gamesFile)) {
    console.log("⚠️  Arquivo games.json não encontrado, pulando...");
    return;
  }

  const content = await readFile(gamesFile, "utf-8");
  const games: Game[] = JSON.parse(content);

  const batch = writeBatch(db);
  let count = 0;

  for (const game of games) {
    const { id, ...gameData } = game;
    const gameRef = doc(db, "games", id);
    batch.set(gameRef, gameData);
    count++;

    // Firebase tem limite de 500 operações por batch
    if (count === 500) {
      await batch.commit();
      console.log(`✅ Migrados ${count} jogos...`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Total de ${games.length} jogos migrados!`);
}

async function migrateComments() {
  console.log("💬 Migrando comentários...");
  const commentsFile = path.join(process.cwd(), "data", "comments.json");
  
  if (!existsSync(commentsFile)) {
    console.log("⚠️  Arquivo comments.json não encontrado, pulando...");
    return;
  }

  const content = await readFile(commentsFile, "utf-8");
  const comments: { [gameId: string]: Comment[] } = JSON.parse(content);

  const batch = writeBatch(db);
  let count = 0;
  let total = 0;

  for (const [gameId, gameComments] of Object.entries(comments)) {
    for (const comment of gameComments) {
      const { id, ...commentData } = comment;
      const commentRef = doc(db, "comments", id);
      batch.set(commentRef, commentData);
      count++;
      total++;

      if (count === 500) {
        await batch.commit();
        console.log(`✅ Migrados ${total} comentários...`);
        count = 0;
      }
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Total de ${total} comentários migrados!`);
}

async function migrateFavorites() {
  console.log("❤️  Migrando favoritos...");
  const favoritesFile = path.join(process.cwd(), "data", "favorites.json");
  
  if (!existsSync(favoritesFile)) {
    console.log("⚠️  Arquivo favorites.json não encontrado, pulando...");
    return;
  }

  const content = await readFile(favoritesFile, "utf-8");
  const favorites: Favorite[] = JSON.parse(content);

  const batch = writeBatch(db);
  let count = 0;

  for (const favorite of favorites) {
    const { id, ...favoriteData } = favorite;
    const favoriteRef = doc(db, "favorites", id);
    batch.set(favoriteRef, favoriteData);
    count++;

    if (count === 500) {
      await batch.commit();
      console.log(`✅ Migrados ${count} favoritos...`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Total de ${favorites.length} favoritos migrados!`);
}

async function migrateDownloads() {
  console.log("⬇️  Migrando histórico de downloads...");
  const downloadsFile = path.join(process.cwd(), "data", "downloads.json");
  
  if (!existsSync(downloadsFile)) {
    console.log("⚠️  Arquivo downloads.json não encontrado, pulando...");
    return;
  }

  const content = await readFile(downloadsFile, "utf-8");
  const downloads: Download[] = JSON.parse(content);

  const batch = writeBatch(db);
  let count = 0;

  for (const download of downloads) {
    const { id, ...downloadData } = download;
    const downloadRef = doc(db, "downloads", id);
    batch.set(downloadRef, downloadData);
    count++;

    if (count === 500) {
      await batch.commit();
      console.log(`✅ Migrados ${count} downloads...`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Total de ${downloads.length} downloads migrados!`);
}

async function migrateViews() {
  console.log("👁️  Migrando visualizações...");
  const viewsFile = path.join(process.cwd(), "data", "views.json");
  
  if (!existsSync(viewsFile)) {
    console.log("⚠️  Arquivo views.json não encontrado, pulando...");
    return;
  }

  const content = await readFile(viewsFile, "utf-8");
  const views: Views = JSON.parse(content);

  const batch = writeBatch(db);
  let count = 0;

  for (const [gameId, viewCount] of Object.entries(views)) {
    const viewRef = doc(db, "views", gameId);
    batch.set(viewRef, { count: viewCount });
    count++;

    if (count === 500) {
      await batch.commit();
      console.log(`✅ Migradas ${count} visualizações...`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`✅ Total de ${Object.keys(views).length} visualizações migradas!`);
}

async function main() {
  console.log("🚀 Iniciando migração para Firebase...\n");

  try {
    await migrateGames();
    await migrateComments();
    await migrateFavorites();
    await migrateDownloads();
    await migrateViews();

    console.log("\n✅ Migração concluída com sucesso!");
    console.log("\n⚠️  ATENÇÃO: Arquivos (executáveis e imagens) precisam ser migrados manualmente para Firebase Storage.");
  } catch (error) {
    console.error("❌ Erro durante migração:", error);
    process.exit(1);
  }
}

main();

