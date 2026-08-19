import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, serializeTimestamps } from "@/lib/firebase/admin";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { loadVisibleGame } from "@/lib/game-access";
import { Comment } from "@/lib/comments";
import { sanitizeText } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CommentDoc {
  id: string;
  gameId: string;
  author: string;
  authorUid?: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getAdminDb();
    const user = await getAuthUser(request);

    // Comentários só são listados para jogos visíveis ao ator.
    const loaded = await loadVisibleGame(db, params.id, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const snap = await db
      .collection("comments")
      .where("gameId", "==", params.id)
      .get();

    const comments: Comment[] = snap.docs.map((d) => {
      const data = serializeTimestamps(
        d.data() as Record<string, unknown>
      ) as unknown as CommentDoc;
      // Leitura pública NUNCA expõe e-mail/UID do autor.
      const { authorUid, authorEmail, ...publicData } = data;
      const comment: Comment = {
        id: d.id,
        gameId: publicData.gameId,
        author: publicData.author,
        content: publicData.content,
        createdAt: publicData.createdAt,
      };
      // Se autenticado, informa se o usuário pode deletar (sem expor identidade).
      if (user) {
        comment.canDelete =
          user.isStaff ||
          (!!authorUid && authorUid === user.uid) ||
          (user.emailVerified && !!authorEmail && authorEmail === user.email);
      }
      return comment;
    });

    comments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const db = getAdminDb();
    // Comentários só são criados em jogos visíveis ao ator.
    const loaded = await loadVisibleGame(db, params.id, user);
    if (!loaded.exists || !loaded.visible) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const content = sanitizeText(body.content, 2000);
    if (!content) {
      return NextResponse.json(
        { error: "Comentário não pode ser vazio." },
        { status: 400 }
      );
    }

    // Identidade derivada do token — NUNCA do corpo da requisição.
    // Nome saneado do displayName ou, como fallback de exibição, o local-part
    // do e-mail verificado.
    const displayName = sanitizeText(user!.name ?? "", 100);
    const emailLocalPart = user!.emailVerified
      ? sanitizeText((user!.email ?? "").split("@")[0], 100)
      : "";
    const author = displayName || emailLocalPart || "Usuário";

    const docRef = await db.collection("comments").add({
      gameId: params.id,
      author,
      authorUid: user!.uid,
      authorEmail: user!.email ?? "",
      content,
      createdAt: new Date().toISOString(),
    });

    const comment: Comment = {
      id: docRef.id,
      gameId: params.id,
      author,
      content,
      createdAt: new Date().toISOString(),
      canDelete: true,
    };

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json({ error: "Erro ao criar comentário" }, { status: 500 });
  }
}