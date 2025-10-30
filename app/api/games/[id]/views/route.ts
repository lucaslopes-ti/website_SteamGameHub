import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { useLocalDatabase } from "@/lib/config";

const VIEWS_FILE = path.join(process.cwd(), "data", "views.json");

interface GameViews {
  [gameId: string]: number;
}

async function getViewsFromFile(): Promise<GameViews> {
  if (!existsSync(VIEWS_FILE)) {
    return {};
  }
  const content = await readFile(VIEWS_FILE, "utf-8");
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function saveViewsToFile(views: GameViews) {
  await writeFile(VIEWS_FILE, JSON.stringify(views, null, 2));
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção (Vercel), usar Firestore com incremento atômico
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || !useLocalDatabase()) {
      const { db } = await import("@/lib/firebase/config");
      const { doc, setDoc, updateDoc, getDoc, increment } = await import("firebase/firestore");

      const viewRef = doc(db, "views", params.id);
      const snap = await getDoc(viewRef);
      if (!snap.exists()) {
        await setDoc(viewRef, { count: 1 });
        return NextResponse.json({ success: true, views: 1 });
      }
      await updateDoc(viewRef, { count: increment(1) });
      const updated = await getDoc(viewRef);
      return NextResponse.json({ success: true, views: (updated.data()?.count as number) || 0 });
    }

    // Modo local (desenvolvimento)
    const views = await getViewsFromFile();
    views[params.id] = (views[params.id] || 0) + 1;
    await saveViewsToFile(views);
    return NextResponse.json({ success: true, views: views[params.id] });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar visualização" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Em produção (Vercel), usar Firestore
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || !useLocalDatabase()) {
      const { db } = await import("@/lib/firebase/config");
      const { doc, getDoc } = await import("firebase/firestore");
      const viewRef = doc(db, "views", params.id);
      const snap = await getDoc(viewRef);
      const count = (snap.exists() ? (snap.data()?.count as number) : 0) || 0;
      return NextResponse.json({ views: count });
    }

    // Modo local (desenvolvimento)
    const views = await getViewsFromFile();
    return NextResponse.json({ views: views[params.id] || 0 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar visualizações" }, { status: 500 });
  }
}

