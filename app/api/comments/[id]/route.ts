import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Comment } from "@/lib/comments";

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json");

async function getCommentsFromFile(): Promise<Comment[]> {
  if (!existsSync(COMMENTS_FILE)) {
    return [];
  }
  const content = await readFile(COMMENTS_FILE, "utf-8");
  return JSON.parse(content);
}

async function saveCommentsToFile(comments: Comment[]) {
  await writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await getCommentsFromFile();
    const filtered = comments.filter((c) => c.id !== params.id);
    
    if (filtered.length === comments.length) {
      return NextResponse.json({ error: "Comentário não encontrado" }, { status: 404 });
    }
    
    await saveCommentsToFile(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar comentário" }, { status: 500 });
  }
}

