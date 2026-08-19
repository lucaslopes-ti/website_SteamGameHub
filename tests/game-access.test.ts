/**
 * Testes do helper de visibilidade de jogos (lib/game-access.ts).
 *
 * @jest-environment node
 */
import { canAccessGame } from "@/lib/game-access";
import type { AuthUser } from "@/lib/server-auth";

const staff: AuthUser = {
  uid: "u-staff",
  email: "staff@senai.com",
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

describe("canAccessGame", () => {
  it("jogo aprovado é público (mesmo sem usuário)", () => {
    expect(canAccessGame({ approved: true }, null)).toBe(true);
  });

  it("jogo pendente não é visível para anônimo", () => {
    expect(canAccessGame({ approved: false, pending: true }, null)).toBe(false);
  });

  it("jogo pendente é visível para staff", () => {
    expect(canAccessGame({ approved: false, pending: true }, staff)).toBe(true);
  });

  it("jogo pendente é visível para o autor por UID", () => {
    expect(
      canAccessGame({ approved: false, authorUid: "u-student" }, student)
    ).toBe(true);
  });

  it("jogo pendente é visível para o autor por e-mail verificado", () => {
    expect(
      canAccessGame({ approved: false, authorEmail: "student@senai.com" }, student)
    ).toBe(true);
  });

  it("jogo pendente NÃO é visível por e-mail quando não verificado", () => {
    expect(
      canAccessGame({ approved: false, authorEmail: "student@senai.com" }, unverified)
    ).toBe(false);
  });

  it("jogo pendente não é visível para terceiros", () => {
    expect(
      canAccessGame({ approved: false, authorUid: "outro" }, student)
    ).toBe(false);
  });
});
