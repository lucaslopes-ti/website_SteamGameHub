import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, serializeTimestamps, stripUndefined } from "@/lib/firebase/admin";
import {
  getAuthUser,
  requireAuth,
  requireOwnerOrStaff,
} from "@/lib/server-auth";
import { loadVisibleGame } from "@/lib/game-access";
import { Game } from "@/lib/games";
import {
  isValidUrl,
  isValidDownloadUrl,
  isValidImageUrl,
  isValidVideoUrl,
  validateGameTitle,
  validateGameDescription,
  validateGameArrays,
  validatePresentArray,
  sanitizeText,
  sanitizeStringArray,
} from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Campos editáveis por autor/staff. Status, agregados, featured e ownership
// NUNCA são aceitos do cliente.
const EDITABLE_FIELDS = [
  "title",
  "description",
  "genres",
  "technologies",
  "trailerUrl",
  "image",
  "screenshots",
  "playableLink",
  "downloadLink",
] as const;

const FORBIDDEN_FIELDS = [
  "approved",
  "pending",
  "rating",
  "totalRatings",
  "featured",
  "author",
  "authorEmail",
  "authorUid",
  "id",
  "createdAt",
];

function toGame(id: string, data: Record<string, unknown>): Game {
  return { id, ...serializeTimestamps(data) } as unknown as Game;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getAdminDb();
    const user = await getAuthUser(request);
    const loaded = await loadVisibleGame(db, params.id, user);

    if (!loaded.exists || !loaded.visible) {
      // Não revelar existência de jogos pendentes para terceiros.
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(toGame(params.id, loaded.data!));
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const db = getAdminDb();
    const gameRef = db.collection("games").doc(params.id);
    const snap = await gameRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const data = snap.data() as Record<string, unknown>;
    const ownerError = requireOwnerOrStaff(
      user,
      (data.authorUid as string) || null,
      (data.authorEmail as string) || null
    );
    if (ownerError) return ownerError;

    const body = await request.json();

    // Rejeitar campos proibidos explicitamente.
    for (const field of FORBIDDEN_FIELDS) {
      if (field in body) {
        return NextResponse.json(
          { error: `Campo "${field}" não pode ser alterado.` },
          { status: 400 }
        );
      }
    }

    const updates: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo válido para atualizar." },
        { status: 400 }
      );
    }

    // Revalidar tipos, schema e URLs dos campos editáveis.
    if ("title" in updates) {
      if (typeof updates.title !== "string") {
        return NextResponse.json({ error: "Título inválido." }, { status: 400 });
      }
      const v = validateGameTitle(updates.title);
      if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
      updates.title = sanitizeText(updates.title, 100);
    }
    if ("description" in updates) {
      if (typeof updates.description !== "string") {
        return NextResponse.json(
          { error: "Descrição inválida." },
          { status: 400 }
        );
      }
      const v = validateGameDescription(updates.description);
      if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
      updates.description = sanitizeText(updates.description, 2000);
    }
    if ("genres" in updates || "technologies" in updates) {
      // Propriedades presentes devem ser arrays válidos de strings válidas.
      // Rejeita null, string, objeto ou arrays inválidos — nunca normaliza
      // entradas inválidas para [].
      if ("genres" in updates) {
        const v = validatePresentArray(updates.genres, {
          maxItems: 10,
          maxItemLength: 50,
          error: "Gêneros inválidos.",
        });
        if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
      }
      if ("technologies" in updates) {
        const v = validatePresentArray(updates.technologies, {
          maxItems: 10,
          maxItemLength: 50,
          error: "Tecnologias inválidas.",
        });
        if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
      }
      // Validação combinada: não é permitido zerar gêneros/tecnologias.
      const v = validateGameArrays(
        (updates.genres as string[]) ?? (data.genres as string[]) ?? [],
        (updates.technologies as string[]) ?? (data.technologies as string[]) ?? []
      );
      if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
      if ("genres" in updates) {
        updates.genres = sanitizeStringArray(updates.genres, 10, 50);
      }
      if ("technologies" in updates) {
        updates.technologies = sanitizeStringArray(updates.technologies, 10, 50);
      }
    }
    if ("trailerUrl" in updates) {
      const value = updates.trailerUrl;
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value !== "string" || !isValidVideoUrl(value)) {
          return NextResponse.json(
            { error: "Link do trailer inválido. Use YouTube ou Vimeo." },
            { status: 400 }
          );
        }
        updates.trailerUrl = value.trim();
      } else {
        updates.trailerUrl = null;
      }
    }
    if ("playableLink" in updates) {
      const value = updates.playableLink;
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value !== "string" || !isValidUrl(value)) {
          return NextResponse.json(
            { error: "Link jogável inválido. Use uma URL http(s)." },
            { status: 400 }
          );
        }
        updates.playableLink = value.trim();
      } else {
        updates.playableLink = null;
      }
    }
    if ("downloadLink" in updates) {
      const value = updates.downloadLink;
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value !== "string" || !isValidDownloadUrl(value)) {
          return NextResponse.json(
            { error: "Link de download inválido. Use Google Drive, OneDrive, Dropbox ou MEGA." },
            { status: 400 }
          );
        }
        updates.downloadLink = value.trim();
      } else {
        updates.downloadLink = null;
      }
    }
    if ("image" in updates) {
      const value = updates.image;
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value !== "string" || !isValidImageUrl(value)) {
          return NextResponse.json(
            { error: "URL da imagem de capa inválida." },
            { status: 400 }
          );
        }
        updates.image = value.trim();
      } else {
        updates.image = null;
      }
    }
    if ("screenshots" in updates) {
      // Presente → deve ser um array de URLs válidas (pode ser vazio para
      // limpar). Rejeita null, string, objeto ou URLs inválidas.
      const v = validatePresentArray(updates.screenshots, {
        maxItems: 5,
        maxItemLength: 2048,
        itemValidator: isValidImageUrl,
        error: "Screenshots deve ser uma lista de URLs válidas.",
      });
      if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });
      updates.screenshots = (updates.screenshots as string[]).map((url) =>
        url.trim()
      );
    }

    // Fallback legado: jogo identificado apenas por e-mail. Ao editar,
    // registra o authorUid para que o UID passe a ser a fonte primária.
    const isOwnerByUid = data.authorUid && data.authorUid === user!.uid;
    const isOwnerByEmail =
      user!.emailVerified &&
      data.authorEmail &&
      data.authorEmail === user!.email;
    if (isOwnerByEmail && !isOwnerByUid && !data.authorUid) {
      updates.authorUid = user!.uid;
    }

    // Autor editando campos publicáveis de um jogo aprovado → volta para
    // moderação. Staff mantém a permissão de atualizar sem rebaixar.
    if (!user!.isStaff && data.approved === true) {
      updates.pending = true;
      updates.approved = false;
    }

    await gameRef.update(stripUndefined(updates));
    const updated = await gameRef.get();
    return NextResponse.json({
      success: true,
      game: toGame(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const db = getAdminDb();
    const gameRef = db.collection("games").doc(params.id);
    const snap = await gameRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const data = snap.data() as Record<string, unknown>;
    const ownerError = requireOwnerOrStaff(
      user,
      (data.authorUid as string) || null,
      (data.authorEmail as string) || null
    );
    if (ownerError) return ownerError;

    await gameRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    return NextResponse.json({ error: "Erro ao deletar jogo" }, { status: 500 });
  }
}