/**
 * Autenticação/autorização no servidor.
 *
 * Extrai e valida estritamente `Authorization: Bearer <Firebase ID token>`.
 * - 401: token ausente ou inválido.
 * - 403: papel/ownership insuficiente.
 *
 * Papel é resolvido por:
 *   1. custom claims `admin` / `role` (se existirem);
 *   2. allowlists server-side de e-mails completos em `ADMIN_EMAILS` /
 *      `TEACHER_EMAILS` (compatibilidade).
 *
 * Nunca comparamos a parte anterior ao `@` (local-part) e nunca confiamos em
 * papel/e-mail/UID vindos do corpo ou da query.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

export type Role = "admin" | "teacher" | "student";

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  role: Role;
  isAdmin: boolean;
  isTeacher: boolean;
  isStaff: boolean;
}

function parseEmailList(value?: string): string[] {
  if (!value) return [];
  return value
    .split(/[;,]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function resolveRole(
  email: string | null,
  claims: Record<string, unknown>,
  emailVerified: boolean
): Role {
  // 1. Custom claims têm precedência (não dependem de verificação de e-mail).
  const claimRole = claims?.role;
  if (claimRole === "admin" || claimRole === "teacher") {
    return claimRole;
  }
  if (claims?.admin === true) {
    return "admin";
  }

  // 2. Allowlists server-side de e-mails completos (compatibilidade).
  //    Só são consideradas quando o e-mail do token está verificado.
  if (!email || !emailVerified) return "student";
  const adminEmails = parseEmailList(process.env.ADMIN_EMAILS);
  const teacherEmails = parseEmailList(process.env.TEACHER_EMAILS);
  if (adminEmails.includes(email)) return "admin";
  if (teacherEmails.includes(email)) return "teacher";

  // Sem configuração, não concede papel.
  return "student";
}

/**
 * Extrai e valida o token. Retorna `null` se ausente/inválido.
 */
export async function getAuthUser(
  request: NextRequest
): Promise<AuthUser | null> {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const [scheme, token, ...rest] = header.trim().split(/\s+/);
  if (scheme !== "Bearer" || !token || rest.length > 0) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const email = decoded.email ? decoded.email.toLowerCase() : null;
    const emailVerified = !!decoded.email_verified;
    const role = resolveRole(
      email,
      decoded as Record<string, unknown>,
      emailVerified
    );
    const isAdmin = role === "admin";
    const isTeacher = role === "teacher" || isAdmin;
    return {
      uid: decoded.uid,
      email,
      emailVerified,
      name: decoded.name ?? null,
      role,
      isAdmin,
      isTeacher,
      isStaff: isTeacher || isAdmin,
    };
  } catch {
    return null;
  }
}

/**
 * Retorna uma resposta 401 se não autenticado, ou `null` se ok.
 */
export function requireAuth(user: AuthUser | null): NextResponse | null {
  if (!user) {
    return NextResponse.json(
      { error: "Não autenticado. Faça login para continuar." },
      { status: 401 }
    );
  }
  return null;
}

/**
 * Retorna 401 se não autenticado ou 403 se não for staff (admin/teacher).
 */
export function requireStaff(user: AuthUser | null): NextResponse | null {
  const authError = requireAuth(user);
  if (authError) return authError;
  if (!user!.isStaff) {
    return NextResponse.json(
      { error: "Permissão insuficiente." },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Retorna 403 se o usuário não for o autor (por UID, ou por e-mail exato
 * apenas quando o e-mail do token está verificado) nem staff.
 */
export function requireOwnerOrStaff(
  user: AuthUser | null,
  ownerUid?: string | null,
  ownerEmail?: string | null
): NextResponse | null {
  const authError = requireAuth(user);
  if (authError) return authError;
  if (!user) return requireAuth(user);

  const isOwner =
    (ownerUid && user.uid === ownerUid) ||
    (user.emailVerified && ownerEmail && user.email === ownerEmail);
  if (isOwner || user.isStaff) return null;

  return NextResponse.json(
    { error: "Permissão insuficiente." },
    { status: 403 }
  );
}
