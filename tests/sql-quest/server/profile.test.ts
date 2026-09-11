/**
 * Testes da API de perfil da SQL Quest (GET/PATCH).
 *
 * Cobre: autenticação obrigatória, perfil com nível derivado/streak/conquistas,
 * ranking apenas quando optou, e opt-in/opt-out de ranking.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { createFakeDb, type FakeDb } from "./fake-firestore";

const mockGetAuthUser = jest.fn();
jest.mock("@/lib/server-auth", () => ({
  getAuthUser: () => mockGetAuthUser(),
  requireAuth: jest.requireActual("@/lib/server-auth").requireAuth,
}));

const mockDbHolder: { db: FakeDb | null } = { db: null };
jest.mock("@/lib/firebase/admin", () => ({
  getAdminDb: () => mockDbHolder.db,
}));

import { GET, PATCH } from "@/app/api/sql-quest/profile/route";

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

function makePatchRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/sql-quest/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function seedProgress(overrides: Record<string, unknown> = {}) {
  const { db, store } = createFakeDb();
  mockDbHolder.db = db;
  store["sql_quest_progress"] = {
    "u-student": {
      uid: "u-student",
      displayName: "Aluno",
      completedLessonIds: ["1-1", "1-2"],
      totalXp: 150,
      updatedAt: "2026-09-08T12:00:00.000Z",
      streak: 2,
      lastActivityDate: "2026-09-08",
      achievements: ["first-lesson", "first-streak"],
      classId: null,
      rankingOptIn: false,
      ...overrides,
    },
  };
  return { db, store };
}

beforeEach(() => {
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "test-key";
  mockGetAuthUser.mockReset();
  mockGetAuthUser.mockResolvedValue(student);
});

afterEach(() => {
  delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
});

describe("GET /api/sql-quest/profile", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/profile"));
    expect(res.status).toBe(401);
  });

  it("devolve perfil com nível derivado, streak e conquistas", async () => {
    seedProgress();
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/profile"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.uid).toBe("u-student");
    expect(body.xp).toBe(150);
    expect(body.level).toBe(3); // 150 XP → nível 3 (69 XP/nível)
    expect(body.levelInfo.level).toBe(3);
    expect(body.streak).toBe(2);
    expect(body.achievements).toContain("first-lesson");
    expect(body.lessonCount).toBe(2);
    expect(body.rankingOptIn).toBe(false);
    expect(body.rank).toBeNull();
  });

  it("devolve rank quando o aluno optou por ranking e está em turma", async () => {
    const { db, store } = seedProgress({
      classId: "class-1",
      rankingOptIn: true,
    });
    store["sql_quest_classes"] = {
      "class-1": {
        name: "Turma A",
        code: "ABC234",
        instructorUids: ["u-teacher"],
        memberUids: ["u-student", "u-other"],
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
      },
    };
    store["sql_quest_progress"]["u-other"] = {
      uid: "u-other",
      displayName: "Outro",
      totalXp: 300,
      completedLessonIds: ["1-1", "1-2", "1-3", "1-4"],
      rankingOptIn: true,
    };

    const res = await GET(new NextRequest("http://localhost/api/sql-quest/profile"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.classId).toBe("class-1");
    expect(body.className).toBe("Turma A");
    expect(body.rank).toBe(2); // u-other tem mais XP
  });

  it("não calcula rank quando o aluno não optou", async () => {
    const { db, store } = seedProgress({ classId: "class-1", rankingOptIn: false });
    store["sql_quest_classes"] = {
      "class-1": {
        name: "Turma A",
        code: "ABC234",
        instructorUids: ["u-teacher"],
        memberUids: ["u-student"],
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
      },
    };
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/profile"));
    const body = await res.json();
    expect(body.rank).toBeNull();
  });
});

describe("PATCH /api/sql-quest/profile", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await PATCH(makePatchRequest({ rankingOptIn: true }));
    expect(res.status).toBe(401);
  });

  it("rejeita payload sem rankingOptIn boolean", async () => {
    seedProgress();
    const res = await PATCH(makePatchRequest({ rankingOptIn: "sim" }));
    expect(res.status).toBe(400);
  });

  it("atualiza o opt-in de ranking", async () => {
    const { store } = seedProgress();
    const res = await PATCH(makePatchRequest({ rankingOptIn: true }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.rankingOptIn).toBe(true);
    expect(store["sql_quest_progress"]["u-student"].rankingOptIn).toBe(true);
  });

  it("permite desativar o opt-in", async () => {
    seedProgress({ rankingOptIn: true });
    const res = await PATCH(makePatchRequest({ rankingOptIn: false }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.rankingOptIn).toBe(false);
  });
});