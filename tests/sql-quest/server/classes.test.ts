/**
 * Testes das APIs de turmas da SQL Quest (criar, listar, entrar).
 *
 * Cobre: criação restrita a staff, entrada por código (idempotente) e listagem
 * das turmas do usuário.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { createFakeDb, type FakeDb } from "./fake-firestore";

const mockGetAuthUser = jest.fn();
jest.mock("@/lib/server-auth", () => ({
  getAuthUser: () => mockGetAuthUser(),
  requireAuth: jest.requireActual("@/lib/server-auth").requireAuth,
  requireStaff: jest.requireActual("@/lib/server-auth").requireStaff,
}));

const mockDbHolder: { db: FakeDb | null } = { db: null };
jest.mock("@/lib/firebase/admin", () => ({
  getAdminDb: () => mockDbHolder.db,
}));

import { GET as listClasses, POST as createClass } from "@/app/api/sql-quest/classes/route";
import { POST as joinClass } from "@/app/api/sql-quest/classes/join/route";

const teacher = {
  uid: "u-teacher",
  email: "teacher@senai.com",
  emailVerified: true,
  name: "Professor",
  role: "teacher",
  isAdmin: false,
  isTeacher: true,
  isStaff: true,
};

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

function makeJsonRequest(url: string, method: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "test-key";
  mockGetAuthUser.mockReset();
  mockDbHolder.db = createFakeDb().db;
});

afterEach(() => {
  delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
});

describe("POST /api/sql-quest/classes (criar)", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await createClass(makeJsonRequest("http://localhost/api/sql-quest/classes", "POST", { name: "Turma A" }));
    expect(res.status).toBe(401);
  });

  it("bloqueia aluno (403) — apenas staff cria turmas", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const res = await createClass(makeJsonRequest("http://localhost/api/sql-quest/classes", "POST", { name: "Turma A" }));
    expect(res.status).toBe(403);
  });

  it("instrutor cria turma com código gerado no servidor", async () => {
    mockGetAuthUser.mockResolvedValue(teacher);
    const res = await createClass(makeJsonRequest("http://localhost/api/sql-quest/classes", "POST", { name: "Turma A" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Turma A");
    expect(body.code).toHaveLength(6);
    expect(body.instructorUids).toEqual(["u-teacher"]);
    expect(body.memberCount).toBe(0);
  });

  it("rejeita nome curto", async () => {
    mockGetAuthUser.mockResolvedValue(teacher);
    const res = await createClass(makeJsonRequest("http://localhost/api/sql-quest/classes", "POST", { name: "AB" }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/sql-quest/classes/join (entrar)", () => {
  it("entra na turma pelo código e vincula classId ao progresso", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { db, store } = createFakeDb();
    mockDbHolder.db = db;
    store["sql_quest_classes"] = {
      "class-1": {
        name: "Turma A",
        code: "ABC234",
        instructorUids: ["u-teacher"],
        memberUids: [],
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
      },
    };

    const res = await joinClass(makeJsonRequest("http://localhost/api/sql-quest/classes/join", "POST", { code: "abc234" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("class-1");
    expect(body.memberCount).toBe(1);

    expect(store["sql_quest_classes"]["class-1"].memberUids).toEqual(["u-student"]);
    expect(store["sql_quest_progress"]["u-student"].classId).toBe("class-1");
  });

  it("é idempotente: entrar de novo não duplica o membro", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { db, store } = createFakeDb();
    mockDbHolder.db = db;
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

    await joinClass(makeJsonRequest("http://localhost/api/sql-quest/classes/join", "POST", { code: "ABC234" }));
    const res = await joinClass(makeJsonRequest("http://localhost/api/sql-quest/classes/join", "POST", { code: "ABC234" }));
    expect(res.status).toBe(200);
    expect(store["sql_quest_classes"]["class-1"].memberUids).toEqual(["u-student"]);
  });

  it("rejeita código inválido", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const res = await joinClass(makeJsonRequest("http://localhost/api/sql-quest/classes/join", "POST", { code: "BAD!" }));
    expect(res.status).toBe(400);
  });

  it("404 para código inexistente", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const res = await joinClass(makeJsonRequest("http://localhost/api/sql-quest/classes/join", "POST", { code: "ZZZZ99" }));
    expect(res.status).toBe(404);
  });
});

describe("GET /api/sql-quest/classes (listar)", () => {
  it("lista turmas onde o usuário é instrutor ou membro", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { db, store } = createFakeDb();
    mockDbHolder.db = db;
    store["sql_quest_classes"] = {
      "class-1": {
        name: "Turma A",
        code: "ABC234",
        instructorUids: ["u-teacher"],
        memberUids: ["u-student"],
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
      },
      "class-2": {
        name: "Turma B",
        code: "DEF567",
        instructorUids: ["u-teacher"],
        memberUids: [],
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
      },
    };

    const res = await listClasses(new NextRequest("http://localhost/api/sql-quest/classes"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.classes).toHaveLength(1);
    expect(body.classes[0].id).toBe("class-1");
    expect(body.classes[0].memberCount).toBe(1);
  });
});