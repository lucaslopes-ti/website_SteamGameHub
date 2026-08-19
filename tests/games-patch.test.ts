/**
 * Testes focados do PATCH /api/games/[id].
 *
 * Cobre o achado do Oracle: propriedades de array editáveis presentes no
 * PATCH (`genres`, `technologies`, `screenshots`) devem ser arrays válidos de
 * itens válidos. Rejeita explicitamente `null`, string, objeto ou arrays
 * inválidos — nunca normaliza entradas inválidas para `[]`. Ausência da
 * propriedade preserva o valor atual.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const updateMock = jest.fn();
const getMock = jest.fn();

jest.mock("@/lib/firebase/admin", () => {
  const actual = jest.requireActual("@/lib/firebase/admin");
  return {
    ...actual,
    getAdminDb: () => ({
      collection: () => ({
        doc: () => ({
          get: getMock,
          update: updateMock,
        }),
      }),
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
  requireOwnerOrStaff: jest.fn(() => null),
}));

import { PATCH } from "@/app/api/games/[id]/route";

function makePatchRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/games/game-1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const existingGame = {
  title: "Jogo Existente",
  description: "Uma descrição com mais de dez caracteres.",
  author: "Autor",
  authorEmail: "author@senai.com",
  authorUid: "u-author",
  genres: ["Ação"],
  technologies: ["Unity"],
  approved: true,
  pending: false,
  rating: 0,
  totalRatings: 0,
  featured: false,
  createdAt: "2024-01-01T00:00:00.000Z",
};

beforeEach(() => {
  updateMock.mockReset();
  updateMock.mockResolvedValue(undefined);
  getMock.mockReset();
  getMock.mockResolvedValue({
    exists: true,
    id: "game-1",
    data: () => existingGame,
  });
});

describe("PATCH /api/games/[id] — arrays editáveis", () => {
  it("rejeita genres null explicitamente", async () => {
    const res = await PATCH(makePatchRequest({ genres: null }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita genres como string", async () => {
    const res = await PATCH(makePatchRequest({ genres: "Ação" }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita genres como objeto", async () => {
    const res = await PATCH(makePatchRequest({ genres: { 0: "Ação" } }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita genres com item não-string", async () => {
    const res = await PATCH(makePatchRequest({ genres: ["Ação", 123] }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita technologies null", async () => {
    const res = await PATCH(makePatchRequest({ technologies: null }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita technologies como string", async () => {
    const res = await PATCH(makePatchRequest({ technologies: "Unity" }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita screenshots null", async () => {
    const res = await PATCH(makePatchRequest({ screenshots: null }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita screenshots como string", async () => {
    const res = await PATCH(
      makePatchRequest({ screenshots: "https://a.com/1.png" }),
      { params: { id: "game-1" } }
    );
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("rejeita screenshots com URL inválida", async () => {
    const res = await PATCH(
      makePatchRequest({ screenshots: ["javascript:alert(1)"] }),
      { params: { id: "game-1" } }
    );
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("aceita screenshots vazio para limpar", async () => {
    const res = await PATCH(makePatchRequest({ screenshots: [] }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(200);
    expect(updateMock).toHaveBeenCalled();
  });

  it("aceita arrays válidos", async () => {
    const res = await PATCH(
      makePatchRequest({ genres: ["RPG"], technologies: ["Godot"] }),
      { params: { id: "game-1" } }
    );
    expect(res.status).toBe(200);
    expect(updateMock).toHaveBeenCalled();
  });

  it("ausência de propriedade preserva o valor atual", async () => {
    const res = await PATCH(makePatchRequest({ title: "Novo Título" }), {
      params: { id: "game-1" },
    });
    expect(res.status).toBe(200);
    const updates = updateMock.mock.calls[0][0];
    expect(updates.genres).toBeUndefined();
    expect(updates.technologies).toBeUndefined();
    expect(updates.screenshots).toBeUndefined();
  });
});
