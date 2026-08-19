import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint autenticado mínimo que devolve o papel efetivo do usuário e um
 * nome seguro para orientação visual no cliente.
 *
 * O papel é resolvido no servidor (custom claims + allowlists server-side
 * `ADMIN_EMAILS`/`TEACHER_EMAILS`). NUNCA devolve e-mail ou UID — apenas o
 * papel efetivo e o nome. O servidor continua sendo a única barreira de
 * segurança; este endpoint serve apenas para alinhar a UI.
 */
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  return NextResponse.json({
    role: user.role,
    isAdmin: user.isAdmin,
    isTeacher: user.isTeacher,
    isStaff: user.isStaff,
    name: user.name,
  });
}
