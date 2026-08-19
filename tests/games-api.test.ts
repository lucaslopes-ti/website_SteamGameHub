/**
 * Testes da lógica de criação de jogo (POST /api/games).
 *
 * Foca em: remoção de campos `undefined` antes de gravar no Firestore e
 * validação de URLs/arrays.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const addMock = jest.fn();

jest.mock("@/lib/firebase/admin", () => {
  const actual = jest.requireActual("@/lib/firebase/admin");
  return {
    ...actual,
    getAdminDb: () => ({
      collection: () => ({ add: addMock }),
    }),
  };
});

jest.mock("@/lib/server-auth", () => ({
  getAuthUser: jest.fn(async () => ({
    uid: "u-author",
    email: "author@senai.com",
    emailVerified: true,
    name: "Autor",
    role: "student",
    isAdmin: false,
    isTeacher: false,
    isStaff: false,
  })),
  requireAuth: jest.fn(() => null),
}));

import { POST } from "@/app/api/games/route";

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  title: "Meu Jogo",
  description: "Uma descrição com mais de dez caracteres.",
  author: "Autor",
  genres: ["Ação"],
  technologies: ["Unity"],
  downloadLink: "https://drive.google.com/file/d/abc",
};

beforeEach(() => {
  addMock.mockReset();
  addMock.mockResolvedValue({ id: "game-1" });
});

describe("POST /api/games", () => {
  it("grava documento sem campos undefined", async () => {
    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(201);

    const written = addMock.mock.calls[0][0];
    // Nenhum valor undefined deve ser gravado no Firestore.
    for (const value of Object.values(written)) {
      expect(value).not.toBeUndefined();
    }
    // Campos opcionais ausentes não aparecem no documento.
    expect(written.image).toBeUndefined();
    expect(written.screenshots).toBeUndefined();
    expect(written.trailerUrl).toBeUndefined();
    // Identidade vem do token.
    expect(written.authorUid).toBe("u-author");
    expect(written.authorEmail).toBe("author@senai.com");
  });

  it("rejeita link de download com hostname que apenas contém o domínio", async () => {
    const res = await POST(
      makePostRequest({
        ...validBody,
        downloadLink: "https://notdrive.google.com/file",
      })
    );
    expect(res.status).toBe(400);
    expect(addMock).not.toHaveBeenCalled();
  });

  it("rejeita trailer de hostname não permitido", async () => {
    const res = await POST(
      makePostRequest({ ...validBody, trailerUrl: "https://evil.com/v" })
    );
    expect(res.status).toBe(400);
    expect(addMock).not.toHaveBeenCalled();
  });

  it("rejeita screenshots inválidos", async () => {
    const res = await POST(
      makePostRequest({ ...validBody, screenshots: ["javascript:alert(1)"] })
    );
    expect(res.status).toBe(400);
    expect(addMock).not.toHaveBeenCalled();
  });

  it("rejeita gêneros não-string", async () => {
    const res = await POST(
      makePostRequest({ ...validBody, genres: ["Ação", 123] })
    );
    expect(res.status).toBe(400);
    expect(addMock).not.toHaveBeenCalled();
  });
});
