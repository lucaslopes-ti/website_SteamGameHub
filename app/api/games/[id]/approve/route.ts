import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, serializeTimestamps } from "@/lib/firebase/admin";
import { getAuthUser, requireStaff } from "@/lib/server-auth";
import { Game } from "@/lib/games";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toGame(id: string, data: Record<string, unknown>): Game {
  return { id, ...serializeTimestamps(data) } as unknown as Game;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const staffError = requireStaff(user);
    if (staffError) return staffError;

    const db = getAdminDb();
    const gameRef = db.collection("games").doc(params.id);
    const snap = await gameRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    await gameRef.update({ approved: true, pending: false });
    const updated = await gameRef.get();
    return NextResponse.json({
      success: true,
      game: toGame(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Erro ao aprovar jogo:", error);
    return NextResponse.json({ error: "Erro ao aprovar jogo" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const staffError = requireStaff(user);
    if (staffError) return staffError;

    const db = getAdminDb();
    const gameRef = db.collection("games").doc(params.id);
    const snap = await gameRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    await gameRef.update({ approved: false, pending: true });
    const updated = await gameRef.get();
    return NextResponse.json({
      success: true,
      game: toGame(updated.id, updated.data() as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Erro ao reverter aprovação:", error);
    return NextResponse.json(
      { error: "Erro ao reverter aprovação" },
      { status: 500 }
    );
  }
}
