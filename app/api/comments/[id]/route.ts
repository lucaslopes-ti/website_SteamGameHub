import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAuthUser, requireAuth, requireOwnerOrStaff } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    const authError = requireAuth(user);
    if (authError) return authError;

    const db = getAdminDb();
    const commentRef = db.collection("comments").doc(params.id);
    const snap = await commentRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    const data = snap.data() as Record<string, unknown>;
    // Autor (por UID ou e-mail exato — suporta ownership legado) ou staff.
    const ownerError = requireOwnerOrStaff(
      user,
      (data.authorUid as string) || null,
      (data.authorEmail as string) || null
    );
    if (ownerError) return ownerError;

    await commentRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao deletar comentário" },
      { status: 500 }
    );
  }
}
