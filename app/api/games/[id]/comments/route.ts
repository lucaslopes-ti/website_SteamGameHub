import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await getCommentsFromFile();
    const gameComments = comments.filter((c) => c.gameId === params.id);
    return NextResponse.json(gameComments);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar comentários" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const comments = await getCommentsFromFile();

    const newComment: Comment = {
      id: randomUUID(),
      gameId: params.id,
      author: body.author,
      authorEmail: body.authorEmail,
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    await saveCommentsToFile(comments);

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar comentário" }, { status: 500 });
  }
}

