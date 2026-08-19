/**
 * Testes focados de autenticação/autorização e ownership (incluindo spoofing).
 *
 * Cobre a lógica pura de `lib/server-auth.ts`:
 * - 401 para token ausente/inválido;
 * - 403 para papel/ownership insuficiente;
 * - custom claims `admin`/`role`;
 * - allowlists server-side de e-mails completos;
 * - NUNCA compara local-part (parte antes do @);
 * - ownership por UID ou e-mail exato.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import {
  getAuthUser,
  requireAuth,
  requireStaff,
  requireOwnerOrStaff,
  type AuthUser,
} from "@/lib/server-auth";

jest.mock("@/lib/firebase/admin", () => ({
  getAdminAuth: () => ({
    verifyIdToken: jest.fn(async (token: string) => {
      if (token === "INVALID") throw new Error("invalid token");
      if (token === "admin-claims") {
        return { uid: "u-admin", email: "admin@senai.com", admin: true };
      }
      if (token === "teacher-claims") {
        return { uid: "u-teacher", email: "teacher@senai.com", role: "teacher" };
      }
      if (token === "student-token") {
        return { uid: "u-student", email: "student@senai.com" };
      }
      if (token === "spoof-localpart") {
        // Tenta se passar por admin usando apenas o local-part.
        return { uid: "u-spoof", email: "lucaslopes0@evil.com" };
      }
      if (token === "owner-uid") {
        return { uid: "u-owner", email: "owner@senai.com" };
      }
      if (token === "owner-email") {
        return { uid: "u-owner2", email: "owner2@senai.com" };
      }
      if (token === "verified-allowlist") {
        return { uid: "u-allow", email: "allow@senai.com", email_verified: true };
      }
      if (token === "unverified-allowlist") {
        return { uid: "u-allow2", email: "allow@senai.com", email_verified: false };
      }
      if (token === "verified-owner") {
        return { uid: "u-owner3", email: "owner3@senai.com", email_verified: true };
      }
      if (token === "unverified-owner") {
        return { uid: "u-owner4", email: "owner4@senai.com", email_verified: false };
      }
      throw new Error("unknown token");
    }),
  }),
}));

function makeRequest(authHeader?: string): NextRequest {
  return {
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "authorization" ? authHeader ?? null : null,
    },
  } as unknown as NextRequest;
}

describe("getAuthUser", () => {
  it("retorna null quando não há header de autorização", async () => {
    const user = await getAuthUser(makeRequest());
    expect(user).toBeNull();
  });

  it("retorna null para token inválido", async () => {
    const user = await getAuthUser(makeRequest("Bearer INVALID"));
    expect(user).toBeNull();
  });

  it("retorna null para esquema que não é Bearer", async () => {
    const user = await getAuthUser(makeRequest("Basic abc123"));
    expect(user).toBeNull();
  });

  it("retorna null para header malformado", async () => {
    const user = await getAuthUser(makeRequest("Bearer"));
    expect(user).toBeNull();
  });

  it("concede admin via custom claim admin=true", async () => {
    const user = await getAuthUser(makeRequest("Bearer admin-claims"));
    expect(user?.isAdmin).toBe(true);
    expect(user?.isStaff).toBe(true);
  });

  it("concede teacher via custom claim role=teacher", async () => {
    const user = await getAuthUser(makeRequest("Bearer teacher-claims"));
    expect(user?.isTeacher).toBe(true);
    expect(user?.isAdmin).toBe(false);
    expect(user?.isStaff).toBe(true);
  });

  it("não concede papel sem configuração", async () => {
    const user = await getAuthUser(makeRequest("Bearer student-token"));
    expect(user?.role).toBe("student");
    expect(user?.isStaff).toBe(false);
  });

  it("NÃO concede admin por spoofing de local-part", async () => {
    // ADMIN_EMAILS contém o e-mail completo do admin real.
    process.env.ADMIN_EMAILS = "lucaslopes0@outlook.com.br";
    const user = await getAuthUser(makeRequest("Bearer spoof-localpart"));
    // O atacante usa lucaslopes0@evil.com — local-part igual, domínio diferente.
    expect(user?.email).toBe("lucaslopes0@evil.com");
    expect(user?.isAdmin).toBe(false);
    expect(user?.isStaff).toBe(false);
    delete process.env.ADMIN_EMAILS;
  });

  it("concede admin por e-mail completo na allowlist", async () => {
    process.env.ADMIN_EMAILS = "admin@senai.com";
    const user = await getAuthUser(makeRequest("Bearer admin-claims"));
    expect(user?.isAdmin).toBe(true);
    delete process.env.ADMIN_EMAILS;
  });

  it("concede teacher por e-mail completo na allowlist TEACHER_EMAILS", async () => {
    process.env.TEACHER_EMAILS = "teacher@senai.com";
    const user = await getAuthUser(makeRequest("Bearer teacher-claims"));
    expect(user?.isTeacher).toBe(true);
    delete process.env.TEACHER_EMAILS;
  });

  it("concede admin por allowlist quando o e-mail está verificado", async () => {
    process.env.ADMIN_EMAILS = "allow@senai.com";
    const user = await getAuthUser(makeRequest("Bearer verified-allowlist"));
    expect(user?.emailVerified).toBe(true);
    expect(user?.isAdmin).toBe(true);
    delete process.env.ADMIN_EMAILS;
  });

  it("NÃO concede admin por allowlist quando o e-mail NÃO está verificado", async () => {
    process.env.ADMIN_EMAILS = "allow@senai.com";
    const user = await getAuthUser(makeRequest("Bearer unverified-allowlist"));
    expect(user?.emailVerified).toBe(false);
    expect(user?.isAdmin).toBe(false);
    expect(user?.isStaff).toBe(false);
    delete process.env.ADMIN_EMAILS;
  });

  it("custom claims continuam válidos mesmo sem e-mail verificado", async () => {
    // admin-claims não tem email_verified, mas o claim admin=true prevalece.
    const user = await getAuthUser(makeRequest("Bearer admin-claims"));
    expect(user?.emailVerified).toBe(false);
    expect(user?.isAdmin).toBe(true);
    expect(user?.isStaff).toBe(true);
  });

  it("NÃO concede admin por spoofing de local-part com e-mail não verificado", async () => {
    process.env.ADMIN_EMAILS = "lucaslopes0@outlook.com.br";
    const user = await getAuthUser(makeRequest("Bearer spoof-localpart"));
    expect(user?.emailVerified).toBe(false);
    expect(user?.isAdmin).toBe(false);
    expect(user?.isStaff).toBe(false);
    delete process.env.ADMIN_EMAILS;
  });
});

describe("requireAuth / requireStaff / requireOwnerOrStaff", () => {
  const admin: AuthUser = {
    uid: "u-admin",
    email: "admin@senai.com",
    emailVerified: true,
    name: null,
    role: "admin",
    isAdmin: true,
    isTeacher: true,
    isStaff: true,
  };
  const student: AuthUser = {
    uid: "u-student",
    email: "student@senai.com",
    emailVerified: true,
    name: null,
    role: "student",
    isAdmin: false,
    isTeacher: false,
    isStaff: false,
  };

  it("requireAuth retorna 401 para usuário nulo", () => {
    const res = requireAuth(null);
    expect(res?.status).toBe(401);
  });

  it("requireAuth retorna null para usuário autenticado", () => {
    expect(requireAuth(student)).toBeNull();
  });

  it("requireStaff retorna 403 para não-staff", () => {
    const res = requireStaff(student);
    expect(res?.status).toBe(403);
  });

  it("requireStaff retorna null para admin", () => {
    expect(requireStaff(admin)).toBeNull();
  });

  it("requireOwnerOrStaff retorna 403 para não-dono não-staff", () => {
    const res = requireOwnerOrStaff(student, "outro-uid", "outro@senai.com");
    expect(res?.status).toBe(403);
  });

  it("requireOwnerOrStaff permite dono por UID", () => {
    expect(requireOwnerOrStaff(student, "u-student", null)).toBeNull();
  });

  it("requireOwnerOrStaff permite dono por e-mail exato", () => {
    expect(requireOwnerOrStaff(student, null, "student@senai.com")).toBeNull();
  });

  it("requireOwnerOrStaff permite staff", () => {
    expect(requireOwnerOrStaff(admin, "outro-uid", "outro@senai.com")).toBeNull();
  });

  it("requireOwnerOrStaff retorna 401 para usuário nulo", () => {
    const res = requireOwnerOrStaff(null, "u-student", null);
    expect(res?.status).toBe(401);
  });

  it("requireOwnerOrStaff NÃO permite dono por e-mail quando e-mail não verificado", () => {
    const unverified: AuthUser = {
      uid: "u-unverified",
      email: "student@senai.com",
      emailVerified: false,
      name: null,
      role: "student",
      isAdmin: false,
      isTeacher: false,
      isStaff: false,
    };
    const res = requireOwnerOrStaff(unverified, null, "student@senai.com");
    expect(res?.status).toBe(403);
  });

  it("requireOwnerOrStaff permite dono por e-mail quando e-mail verificado", () => {
    const verified: AuthUser = {
      uid: "u-verified",
      email: "student@senai.com",
      emailVerified: true,
      name: null,
      role: "student",
      isAdmin: false,
      isTeacher: false,
      isStaff: false,
    };
    expect(requireOwnerOrStaff(verified, null, "student@senai.com")).toBeNull();
  });

  it("requireOwnerOrStaff permite dono por UID mesmo sem e-mail verificado", () => {
    const unverified: AuthUser = {
      uid: "u-unverified",
      email: "student@senai.com",
      emailVerified: false,
      name: null,
      role: "student",
      isAdmin: false,
      isTeacher: false,
      isStaff: false,
    };
    expect(requireOwnerOrStaff(unverified, "u-unverified", null)).toBeNull();
  });
});
