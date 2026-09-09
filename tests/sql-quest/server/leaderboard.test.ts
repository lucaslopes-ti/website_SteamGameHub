/**
 * Testes do ranking da SQL Quest (privacidade por turma + opt-in).
 *
 * Cobre: apenas membros/instrutores veem o ranking (403 para estranhos),
 * apenas alunos com rankingOptIn aparecem, e a ordenação por XP.
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

import { GET } from "@/app/api/sql-quest/leaderboard/route";
import { computeLeaderboard } from "@/lib/sql-quest/server/leaderboard";

const member = {
  uid: "u-member",
  email: "member@senai.com",
  emailVerified: true,
  name: "Membro",
  role: "student",
  isAdmin: false,
  isTeacher: false,
  isStaff: false,
};

const outsider = {
  uid: "u-outsider",
  email: "outsider@senai.com",
  emailVerified: true,
  name: "Estranho",
  role: "student",
  isAdmin: false,
  isTeacher: false,
  isStaff: false,
};

function seedClassAndProgress() {
  const { db, store } = createFakeDb();
  mockDbHolder.db = db;
  store["sql_quest_classes"] = {
    "class-1": {
      name: "Turma A",
      code: "ABC234",
      instructorUids: ["u-teacher"],
      memberUids: ["u-member", "u-opted", "u-hidden"],
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  };
  store["sql_quest_progress"] = {
    "u-member": {
      uid: "u-member",
      displayName: "Membro",
      totalXp: 150,
      completedLessonIds: ["1-1", "1-2"],
      rankingOptIn: true,
    },
    "u-opted": {
      uid: "u-opted",
      displayName: "Optado",
      totalXp: 300,
      completedLessonIds: ["1-1", "1-2", "1-3", "1-4"],
      rankingOptIn: true,
    },
    "u-hidden": {
      uid: "u-hidden",
      displayName: "Oculto",
      totalXp: 999,
      completedLessonIds: ["1-1", "1-2", "1-3", "1-4"],
      rankingOptIn: false, // não optou → não aparece
    },
  };
  return { db, store };
}

beforeEach(() => {
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "test-key";
  mockGetAuthUser.mockReset();
});

afterEach(() => {
  delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
});

describe("GET /api/sql-quest/leaderboard", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/leaderboard?classId=class-1"));
    expect(res.status).toBe(401);
  });

  it("exige o parâmetro classId", async () => {
    mockGetAuthUser.mockResolvedValue(member);
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/leaderboard"));
    expect(res.status).toBe(400);
  });

  it("bloqueia estranho à turma (403)", async () => {
    seedClassAndProgress();
    mockGetAuthUser.mockResolvedValue(outsider);
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/leaderboard?classId=class-1"));
    expect(res.status).toBe(403);
  });

  it("membro vê apenas quem optou por ranking, ordenado por XP", async () => {
    seedClassAndProgress();
    mockGetAuthUser.mockResolvedValue(member);
    const res = await GET(new NextRequest("http://localhost/api/sql-quest/leaderboard?classId=class-1"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.entries).toHaveLength(2);
    expect(body.entries[0].uid).toBe("u-opted");
    expect(body.entries[0].rank).toBe(1);
    expect(body.entries[1].uid).toBe("u-member");
    expect(body.entries[1].rank).toBe(2);
    // O aluno que não optou não aparece.
    expect(body.entries.some((e: { uid: string }) => e.uid === "u-hidden")).toBe(false);
  });
});

describe("computeLeaderboard (camada server)", () => {
  it("devolve lista vazia sem membros", async () => {
    const { db } = createFakeDb();
    const entries = await computeLeaderboard(
      db as unknown as Parameters<typeof computeLeaderboard>[0],
      []
    );
    expect(entries).toEqual([]);
  });

  it("ignora membros sem documento de progresso", async () => {
    const { db, store } = createFakeDb();
    store["sql_quest_progress"] = {
      "u-a": { uid: "u-a", totalXp: 50, rankingOptIn: true },
    };
    const entries = await computeLeaderboard(
      db as unknown as Parameters<typeof computeLeaderboard>[0],
      ["u-a", "u-missing"]
    );
    expect(entries).toHaveLength(1);
    expect(entries[0].uid).toBe("u-a");
  });
});
