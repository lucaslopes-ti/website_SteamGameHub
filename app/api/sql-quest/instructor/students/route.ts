import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth, requireStaff } from "@/lib/server-auth";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { listInstructorStudents } from "@/lib/sql-quest/server/students";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;
  const staffError = requireStaff(user);
  if (staffError) return staffError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const students = await listInstructorStudents(db!, getAdminAuth());
    return NextResponse.json(
      { students },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("[sql-quest] Erro ao listar alunos:", error);
    return NextResponse.json({ error: "Erro ao listar os alunos." }, { status: 500 });
  }
}
