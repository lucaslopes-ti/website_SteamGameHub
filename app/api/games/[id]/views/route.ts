import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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
    const views = await getViewsFromFile();
    return NextResponse.json({ views: views[params.id] || 0 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar visualizações" }, { status: 500 });
  }
}

