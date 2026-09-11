/**
 * Testes da API de progresso da SQL Quest (GET/PUT).
 *
 * Cobre: autenticação obrigatória, primeira conclusão (XP/streak/conquistas),
 * idempotência (repetir lição não acumula XP nem streak) e streak diário em
 * America/Sao_Paulo.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { createFakeDb, type FakeDb } from "./fake-firestore";
import { lessons, getLessonById } from "@/lib/sql-quest/catalog";

const mockGetAuthUser = jest.fn();
jest.mock("@/lib/server-auth", () => ({
  getAuthUser: () => mockGetAuthUser(),
  requireAuth: jest.requireActual("@/lib/server-auth").requireAuth,
}));

const mockDbHolder: { db: FakeDb | null } = { db: null };
jest.mock("@/lib/firebase/admin", () => ({
  getAdminDb: () => mockDbHolder.db,
}));

import { GET, PUT } from "@/app/api/sql-quest/progress/route";

// Resolve XP por id semântico OU posicional/legado (ex.: "1-1" → select-01).
const xpOf = (id: string) => getLessonById(id)?.xpReward ?? 0;

const student = {
  uid: "u-student",
  email: "student@senai.com",
  emailVerified: true,
  name: "Aluno",
  role: "student",
  isAdmin: false,
  isTeacher: false,
  isStaff: false,
};

function makePutRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/sql-quest/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(): NextRequest {
  return new NextRequest("http://localhost/api/sql-quest/progress");
}

beforeEach(() => {
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "test-key";
  mockGetAuthUser.mockReset();
  mockGetAuthUser.mockResolvedValue(student);
  mockDbHolder.db = createFakeDb().db;
});

afterEach(() => {
  delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
});

describe("GET /api/sql-quest/progress", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
  });

  it("devolve estado vazio para aluno sem progresso", async () => {
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.uid).toBe("u-student");
    expect(body.completedLessonIds).toEqual([]);
    expect(body.totalXp).toBe(0);
    expect(body.level).toBe(1);
    expect(body.streak).toBe(0);
    expect(body.achievements).toEqual([]);
  });

  it("migra progresso legado (ids 'capitulo-licao') para o catálogo semântico", async () => {
    // Documento antigo armazenado com ids legados "1-1"/"1-2".
    mockDbHolder.db!.collection("sql_quest_progress").doc("u-student").set({
      uid: "u-student",
      completedLessonIds: ["1-1", "1-2"],
      totalXp: 90,
      updatedAt: "2026-09-08T12:00:00.000Z",
      streak: 1,
      lastActivityDate: "2026-09-08",
      achievements: ["first-lesson"],
    });
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    // A resposta devolve ids SEMÂNTICOS; o progresso legado é migrado, não zerado.
    expect(body.completedLessonIds).toEqual(["select-01", "select-02"]);
    expect(body.lessonCount).toBe(2);
    expect(body.totalXp).toBe(90);
  });

  it("devolve ids semânticos para progresso já armazenado em formato semântico", async () => {
    mockDbHolder.db!.collection("sql_quest_progress").doc("u-student").set({
      uid: "u-student",
      completedLessonIds: ["select-01", "select-02"],
      totalXp: 90,
      updatedAt: "2026-09-08T12:00:00.000Z",
      streak: 1,
      lastActivityDate: "2026-09-08",
      achievements: ["first-lesson"],
    });
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.completedLessonIds).toEqual(["select-01", "select-02"]);
    expect(body.totalXp).toBe(90);
  });
});

describe("PUT /api/sql-quest/progress", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));
    expect(res.status).toBe(401);
  });

  it("rejeita payload sem completedLessonIds", async () => {
    const res = await PUT(makePutRequest({}));
    expect(res.status).toBe(400);
  });

  it("primeira conclusão: XP, streak 1 e conquista first-lesson", async () => {
    const res = await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isNewCompletion).toBe(true);
    expect(body.xpEarned).toBe(xpOf("1-1"));
    expect(body.totalXp).toBe(xpOf("1-1"));
    expect(body.streak).toBe(1);
    expect(body.lastActivityDate).toBeTruthy();
    expect(body.achievements).toContain("first-lesson");
    expect(body.newAchievements).toContain("first-lesson");
    // A resposta devolve ids SEMÂNTICOS (formato canônico do catálogo).
    expect(body.completedLessonIds).toEqual(["select-01"]);
  });

  it("novo documento de progresso inicializa spentXp 0", async () => {
    await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));
    const stored = mockDbHolder.db!.collection("sql_quest_progress").doc("u-student");
    const snap = await stored.get();
    expect(snap.data()!.spentXp).toBe(0);
  });

  it("preserva spentXp existente ao concluir novas lições", async () => {
    mockDbHolder.db!.collection("sql_quest_progress").doc("u-student").set({
      uid: "u-student",
      completedLessonIds: ["select-01"],
      totalXp: 50,
      spentXp: 300, // já gasto na loja de recompensas
      updatedAt: "2026-09-08T12:00:00.000Z",
      streak: 1,
      lastActivityDate: "2026-09-08",
      achievements: [],
    });

    const res = await PUT(makePutRequest({ completedLessonIds: ["select-01", "select-02"] }));
    expect(res.status).toBe(200);
    const stored = mockDbHolder.db!.collection("sql_quest_progress").doc("u-student");
    const snap = await stored.get();
    expect(snap.data()!.spentXp).toBe(300);
    // XP/leaderboard permanecem separados do gasto.
    expect(snap.data()!.totalXp).toBe(xpOf("select-01") + xpOf("select-02"));
  });

  it("aceita ids semânticos no PUT e armazena o formato canônico", async () => {
    const res = await PUT(makePutRequest({ completedLessonIds: ["select-01"] }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.completedLessonIds).toEqual(["select-01"]);
    expect(body.totalXp).toBe(xpOf("select-01"));
    // O armazenamento usa ids semânticos canônicos.
    const stored = mockDbHolder.db!.collection("sql_quest_progress").doc("u-student");
    const snap = await stored.get();
    expect(snap.data()!.completedLessonIds).toEqual(["select-01"]);
  });

  it("migra ids legados no PUT para o armazenamento semântico", async () => {
    const res = await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));
    expect(res.status).toBe(200);
    const stored = mockDbHolder.db!.collection("sql_quest_progress").doc("u-student");
    const snap = await stored.get();
    expect(snap.data()!.completedLessonIds).toEqual(["select-01"]);
  });

  it("é idempotente: repetir a mesma lição não acumula XP nem streak", async () => {
    await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));
    const res = await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isNewCompletion).toBe(false);
    expect(body.xpEarned).toBe(0);
    expect(body.totalXp).toBe(xpOf("1-1"));
    expect(body.streak).toBe(1);
    expect(body.newAchievements).toEqual([]);
  });

  it("rejeita salto de lição (progressão linear)", async () => {
    const res = await PUT(makePutRequest({ completedLessonIds: ["1-2"] }));
    expect(res.status).toBe(400);
  });

  it("concluir o capítulo 1 concede a conquista chapter-1", async () => {
    const chapter1 = lessons.filter((l) => l.chapter === 1);
    let ids: string[] = [];
    let lastBody: Record<string, unknown> = {};
    for (const lesson of chapter1) {
      ids = [...ids, lesson.id];
      const res = await PUT(makePutRequest({ completedLessonIds: ids }));
      lastBody = await res.json();
    }
    expect(lastBody.achievements).toContain("chapter-1");
    expect(lastBody.achievements).toContain("first-lesson");
  });

  it("incrementa streak no dia seguinte (America/Sao_Paulo)", async () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-09-08T12:00:00Z"));
      await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));

      jest.setSystemTime(new Date("2026-09-09T12:00:00Z"));
      const res = await PUT(makePutRequest({ completedLessonIds: ["1-1", "1-2"] }));
      const body = await res.json();
      expect(body.streak).toBe(2);
      expect(body.lastActivityDate).toBe("2026-09-09");
    } finally {
      jest.useRealTimers();
    }
  });

  it("reinicia streak após lacuna de dias", async () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-09-08T12:00:00Z"));
      await PUT(makePutRequest({ completedLessonIds: ["1-1"] }));

      jest.setSystemTime(new Date("2026-09-15T12:00:00Z"));
      const res = await PUT(makePutRequest({ completedLessonIds: ["1-1", "1-2"] }));
      const body = await res.json();
      expect(body.streak).toBe(1);
    } finally {
      jest.useRealTimers();
    }
  });
});