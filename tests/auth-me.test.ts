/**
 * Testes do endpoint autenticado mínimo GET /api/auth/me.
 *
 * Devolve somente o papel efetivo e o nome seguro — nunca e-mail/UID. O papel
 * é resolvido no servidor (custom claims + allowlists server-side). Cobre o
 * caso de usuário sem claims (papel "student") e o de admin.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";

jest.mock("@/lib/server-auth", () => ({
  getAuthUser: jest.fn(),
}));

import { GET } from "@/app/api/auth/me/route";
import { getAuthUser } from "@/lib/server-auth";

function makeRequest(authHeader?: string): NextRequest {
  return {
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "authorization" ? authHeader ?? null : null,
    },
  } as unknown as NextRequest;
}

describe("GET /api/auth/me", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it("devolve papel efetivo e nome seguro para usuário sem claims", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue({
      uid: "u-student",
      email: "student@senai.com",
      emailVerified: true,
      name: "Aluno",
      role: "student",
      isAdmin: false,
      isTeacher: false,
      isStaff: false,
    });
    const res = await GET(makeRequest("Bearer token"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("student");
    expect(body.isAdmin).toBe(false);
    expect(body.isTeacher).toBe(false);
    expect(body.isStaff).toBe(false);
    expect(body.name).toBe("Aluno");
    // Nunca expõe e-mail/UID.
    expect(body.email).toBeUndefined();
    expect(body.uid).toBeUndefined();
  });

  it("devolve admin para usuário com papel admin", async () => {
    (getAuthUser as jest.Mock).mockResolvedValue({
      uid: "u-admin",
      email: "admin@senai.com",
      emailVerified: true,
      name: "Admin",
      role: "admin",
      isAdmin: true,
      isTeacher: true,
      isStaff: true,
    });
    const res = await GET(makeRequest("Bearer token"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("admin");
    expect(body.isAdmin).toBe(true);
    expect(body.isStaff).toBe(true);
  });
});
