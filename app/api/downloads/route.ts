import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { useLocalDatabase } from "@/lib/config";

const DOWNLOADS_FILE = path.join(process.cwd(), "data", "downloads.json");

interface Download {
  id: string;
  gameId: string;
  userId: string;
  downloadedAt: string;
}

async function getDownloadsFromFile(): Promise<Download[]> {
  if (!existsSync(DOWNLOADS_FILE)) {
    return [];
  }
  const content = await readFile(DOWNLOADS_FILE, "utf-8");
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveDownloadsToFile(downloads: Download[]) {
  await writeFile(DOWNLOADS_FILE, JSON.stringify(downloads, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, userId } = body;

    if (!gameId || !userId) {
      return NextResponse.json(
        { error: "gameId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    // Em produção (Vercel), usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || !useLocalDatabase()) {
      const { db } = await import("@/lib/firebase/config");
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

      const downloadsRef = collection(db, "downloads");
      const docRef = await addDoc(downloadsRef, {
        gameId,
        userId,
        downloadedAt: serverTimestamp(),
      });

      return NextResponse.json({ success: true, download: { id: docRef.id, gameId, userId } }, { status: 201 });
    }

    // Modo local (desenvolvimento)
    const downloads = await getDownloadsFromFile();
    const newDownload: Download = {
      id: randomUUID(),
      gameId,
      userId,
      downloadedAt: new Date().toISOString(),
    };
    downloads.push(newDownload);
    await saveDownloadsToFile(downloads);
    return NextResponse.json({ success: true, download: newDownload }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar download" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
    }

    // Em produção (Vercel), usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || !useLocalDatabase()) {
      const { db } = await import("@/lib/firebase/config");
      const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore");

      const downloadsRef = collection(db, "downloads");
      const q = query(downloadsRef, where("userId", "==", userId), orderBy("downloadedAt", "desc"));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(results);
    }

    // Modo local (desenvolvimento)
    const downloads = await getDownloadsFromFile();
    const userDownloads = downloads.filter((d) => d.userId === userId);
    return NextResponse.json(userDownloads);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar downloads" }, { status: 500 });
  }
}

