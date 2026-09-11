/**
 * Testes das APIs de recompensas físicas da SQL Quest.
 *
 * Cobre: saldo derivado de conclusões reais (nunca do totalXp persistido),
 * validação de payload, limite individual por produto, visibilidade por
 * `classId` (admin/instrutor), estoque 1/5 com marca de inventário versionada,
 * aprovação idempotente, saldo/estoque insuficientes sem mutação, pedido
 * corrompido falhando fechado, rejeição e fulfillment.
 *
 * NOTA: o fake Firestore não simula retry/concorrência real de transações —
 * os testes validam a lógica, não a serialização concorrente.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { computeTotalXp } from "@/lib/sql-quest/progress";
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

import { GET as getRewards } from "@/app/api/sql-quest/rewards/route";
import {
  GET as listRequests,
  POST as createRequest,
} from "@/app/api/sql-quest/rewards/requests/route";
import { PATCH as decideRequest } from "@/app/api/sql-quest/rewards/requests/[id]/route";

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

const student2 = {
  uid: "u-student2",
  email: "student2@senai.com",
  emailVerified: true,
  name: "Aluno 2",
  role: "student",
  isAdmin: false,
  isTeacher: false,
  isStaff: false,
};

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

const admin = {
  uid: "u-admin",
  email: "admin@senai.com",
  emailVerified: true,
  name: "Admin",
  role: "admin",
  isAdmin: true,
  isTeacher: true,
  isStaff: true,
};

// Conjuntos de conclusões REAIS do catálogo (XP derivado via computeTotalXp).
const LESSONS_400 = [
  "select-01", "select-02", "select-03", "select-04", "select-05",
  "select-06", "select-07", "tabelas-01", "tabelas-02",
]; // 400 XP
const LESSONS_540 = [
  "select-01", "select-02", "select-03", "select-04", "select-05",
  "select-06", "select-07", "tabelas-01", "tabelas-02", "tabelas-03",
  "tabelas-04", "tabelas-05",
]; // 540 XP
const LESSONS_1000 = [
  "select-01", "select-02", "select-03", "select-04", "select-05",
  "select-06", "select-07", "tabelas-01", "tabelas-02", "tabelas-03",
  "tabelas-04", "tabelas-05", "tabelas-06", "tabelas-07", "tabelas-08",
  "tabelas-09", "tabelas-10", "restricoes-01", "restricoes-02",
  "restricoes-03", "restricoes-04", "restricoes-05",
]; // 1000 XP

const xpFor = (ids: string[]) => computeTotalXp(ids);

function makeJsonRequest(url: string, method: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Semeia progresso com conclusões REAIS. `totalXp` persistido é propositalmente
 * absurdo (999999) para provar que o XP ganho é SEMPRE derivado das conclusões.
 */
function seedProgress(
  uid: string,
  completedLessonIds: string[],
  spentXp = 0,
  classId: string | null = null
) {
  const { db, store } = createFakeDb();
  mockDbHolder.db = db;
  store["sql_quest_progress"] = {
    [uid]: {
      uid,
      displayName: "Aluno",
      completedLessonIds,
      totalXp: 999999,
      spentXp,
      updatedAt: "2026-09-08T12:00:00.000Z",
      streak: 0,
      lastActivityDate: null,
      achievements: [],
      classId,
      rankingOptIn: false,
    },
  };
  return { db, store };
}

function seedRequest(
  store: ReturnType<typeof createFakeDb>["store"],
  id: string,
  overrides: Record<string, unknown> = {}
) {
  store["sql_quest_reward_requests"] = store["sql_quest_reward_requests"] ?? {};
  store["sql_quest_reward_requests"][id] = {
    uid: "u-student",
    studentName: "Aluno",
    classId: null,
    itemId: "keychain",
    itemName: "Chaveiro simples",
    costXp: 500,
    requestDetails: "Quero um chaveiro do logo.",
    status: "requested",
    createdAt: "2026-09-10T10:00:00.000Z",
    updatedAt: "2026-09-10T10:00:00.000Z",
    approvedAt: null,
    approvedBy: null,
    rejectedAt: null,
    rejectedBy: null,
    fulfilledAt: null,
    fulfilledBy: null,
    ...overrides,
  };
}

function seedClass(
  store: ReturnType<typeof createFakeDb>["store"],
  id: string,
  instructorUids: string[],
  memberUids: string[]
) {
  store["sql_quest_classes"] = store["sql_quest_classes"] ?? {};
  store["sql_quest_classes"][id] = {
    name: "Turma",
    code: "ABC234",
    instructorUids,
    memberUids,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
}

/** Semeia apenas a marca de inventário (simula inventário já inicializado). */
function seedMarker(store: ReturnType<typeof createFakeDb>["store"]) {
  store["sql_quest_reward_inventory"] = {
    current: {
      version: 1,
      itemIds: ["keychain", "character-piece", "object-12cm"],
      createdAt: "2026-09-01T00:00:00.000Z",
    },
  };
}

/** Semeia marca + estoque inicial completo (5/1/1). */
function seedInventory(store: ReturnType<typeof createFakeDb>["store"]) {
  seedMarker(store);
  store["sql_quest_reward_stock"] = {
    keychain: { itemId: "keychain", initialStock: 5, remainingStock: 5, updatedAt: "2026-09-01T00:00:00.000Z" },
    "character-piece": { itemId: "character-piece", initialStock: 1, remainingStock: 1, updatedAt: "2026-09-01T00:00:00.000Z" },
    "object-12cm": { itemId: "object-12cm", initialStock: 1, remainingStock: 1, updatedAt: "2026-09-01T00:00:00.000Z" },
  };
}

beforeEach(() => {
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "test-key";
  mockGetAuthUser.mockReset();
});

afterEach(() => {
  delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
});

describe("GET /api/sql-quest/rewards", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    expect(res.status).toBe(401);
  });

  it("devolve catálogo fixo com estoque 1/5 e saldo derivado das conclusões", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_1000, 500);
    store["sql_quest_reward_stock"] = {
      keychain: { itemId: "keychain", initialStock: 5, remainingStock: 3, updatedAt: "2026-09-10T00:00:00.000Z" },
    };

    const res = await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    expect(res.status).toBe(200);
    const body = await res.json();

    // XP derivado das conclusões reais (totalXp persistido = 999999 é ignorado).
    expect(body.earnedXp).toBe(xpFor(LESSONS_1000));
    expect(body.spentXp).toBe(500);
    expect(body.xpBalance).toBe(xpFor(LESSONS_1000) - 500);

    expect(body.items).toHaveLength(3);
    const keychain = body.items.find((i: { id: string }) => i.id === "keychain");
    expect(keychain).toMatchObject({
      id: "keychain",
      name: "Chaveiro simples",
      costXp: 500,
      initialStock: 5,
      remainingStock: 3,
      requestStatus: null,
    });
    const piece = body.items.find((i: { id: string }) => i.id === "character-piece");
    expect(piece).toMatchObject({ costXp: 1000, initialStock: 1, remainingStock: 1 });
    const object = body.items.find((i: { id: string }) => i.id === "object-12cm");
    expect(object).toMatchObject({ costXp: 3000, initialStock: 1, remainingStock: 1 });
  });

  it("inicializa o inventário 5/1/1 uma única vez (create-only)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);

    await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    expect(store["sql_quest_reward_inventory"]["current"]).toMatchObject({
      version: 1,
      itemIds: ["keychain", "character-piece", "object-12cm"],
    });
    expect(store["sql_quest_reward_stock"]["keychain"]).toMatchObject({
      initialStock: 5,
      remainingStock: 5,
    });
    expect(store["sql_quest_reward_stock"]["character-piece"]).toMatchObject({
      initialStock: 1,
      remainingStock: 1,
    });
    expect(store["sql_quest_reward_stock"]["object-12cm"]).toMatchObject({
      initialStock: 1,
      remainingStock: 1,
    });

    // Segunda chamada não repõe nada.
    store["sql_quest_reward_stock"]["keychain"].remainingStock = 2;
    await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    expect(store["sql_quest_reward_stock"]["keychain"].remainingStock).toBe(2);
  });

  it("inicialização parcial: lê tudo antes de escrever e cria apenas docs ausentes", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    // Marca ausente + apenas o doc de keychain existente (parcialmente gasto).
    store["sql_quest_reward_stock"] = {
      keychain: { itemId: "keychain", initialStock: 5, remainingStock: 3, updatedAt: "2026-09-10T00:00:00.000Z" },
    };

    // O fake Firestore lança se a transação ler após escrever — esta chamada
    // só passa se TODAS as leituras (marca + 3 docs) vierem antes dos writes.
    await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));

    expect(store["sql_quest_reward_inventory"]["current"]).toBeDefined();
    // Doc existente é preservado (nunca restaurado).
    expect(store["sql_quest_reward_stock"]["keychain"].remainingStock).toBe(3);
    // Docs ausentes são criados com o estoque inicial.
    expect(store["sql_quest_reward_stock"]["character-piece"]).toMatchObject({
      initialStock: 1,
      remainingStock: 1,
    });
    expect(store["sql_quest_reward_stock"]["object-12cm"]).toMatchObject({
      initialStock: 1,
      remainingStock: 1,
    });
  });

  it("estoque zero persistido é exibido como zero (não reinicia para o inicial)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    store["sql_quest_reward_stock"] = {
      keychain: { itemId: "keychain", initialStock: 5, remainingStock: 0, updatedAt: "2026-09-10T00:00:00.000Z" },
    };

    const res = await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    const body = await res.json();
    const keychain = body.items.find((i: { id: string }) => i.id === "keychain");
    expect(keychain.remainingStock).toBe(0);
    expect(keychain.initialStock).toBe(5);
  });

  it("estoque maior que o catálogo é limitado ao catálogo", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    store["sql_quest_reward_stock"] = {
      keychain: { itemId: "keychain", initialStock: 99, remainingStock: 99, updatedAt: "2026-09-10T00:00:00.000Z" },
    };

    const res = await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    const body = await res.json();
    const keychain = body.items.find((i: { id: string }) => i.id === "keychain");
    expect(keychain.initialStock).toBe(5);
    expect(keychain.remainingStock).toBe(5);
  });

  it("doc de estoque ausente após a marca existir é exibido como 0 (nunca restaurado)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedMarker(store); // marca existe, mas os docs de estoque foram removidos

    const res = await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    const body = await res.json();
    const keychain = body.items.find((i: { id: string }) => i.id === "keychain");
    expect(keychain.remainingStock).toBe(0);
    expect(keychain.initialStock).toBe(5);
    // Nada foi restaurado.
    expect(store["sql_quest_reward_stock"]).toBeUndefined();
  });

  it("reflete o requestStatus do próprio aluno por produto", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { status: "approved" });

    const res = await getRewards(new NextRequest("http://localhost/api/sql-quest/rewards"));
    const body = await res.json();
    const keychain = body.items.find((i: { id: string }) => i.id === "keychain");
    expect(keychain.requestStatus).toBe("approved");
    const piece = body.items.find((i: { id: string }) => i.id === "character-piece");
    expect(piece.requestStatus).toBeNull();
  });
});

describe("POST /api/sql-quest/rewards/requests", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
      })
    );
    expect(res.status).toBe(401);
  });

  it("rejeita corpo inválido", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_540);
    const res = await createRequest(
      new NextRequest("http://localhost/api/sql-quest/rewards/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("rejeita itemId ausente/desconhecido", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_540);

    const missing = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", { requestDetails: "Quero um chaveiro." })
    );
    expect(missing.status).toBe(404);

    const unknown = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "trophy",
        requestDetails: "Quero um troféu.",
      })
    );
    expect(unknown.status).toBe(404);
  });

  it("valida a descrição obrigatória (3–500 chars)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_540);

    const short = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "ab",
      })
    );
    expect(short.status).toBe(400);

    const nonString = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: 123,
      })
    );
    expect(nonString.status).toBe(400);

    const long = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "a".repeat(501),
      })
    );
    expect(long.status).toBe(400);
  });

  it("bloqueia criação com saldo insuficiente (409)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_400); // 400 XP < 500

    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
      })
    );
    expect(res.status).toBe(409);
    expect(store["sql_quest_reward_requests"]).toBeUndefined();
  });

  it("cria pedido requested sem descontar nem reservar, registrando classId", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540, 0, "class-1");

    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "  Quero um chaveiro do logo.  ",
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.uid).toBe("u-student");
    expect(body.itemId).toBe("keychain");
    expect(body.status).toBe("requested");
    expect(body.classId).toBe("class-1");
    expect(body.requestDetails).toBe("Quero um chaveiro do logo.");

    // Nada foi debitado nem reservado.
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
    expect(store["sql_quest_reward_stock"]).toBeUndefined();
  });

  it("registra classId null quando o aluno não tem turma", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_540);

    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.classId).toBeNull();
  });

  it("ignora uid enviado no corpo (UID vem do token)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_540);

    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
        uid: "u-hacker",
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.uid).toBe("u-student");
  });

  it("persiste studentName do token no pedido", async () => {
    mockGetAuthUser.mockResolvedValue({ ...student, name: "Maria Silva" });
    const { store } = seedProgress("u-student", LESSONS_540);

    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.studentName).toBe("Maria Silva");
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].studentName).toBe(
      "Maria Silva"
    );
  });

  it("usa fallback seguro Aluno quando o token não tem nome", async () => {
    mockGetAuthUser.mockResolvedValue({ ...student, name: null });
    const { store } = seedProgress("u-student", LESSONS_540);

    const res = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.studentName).toBe("Aluno");
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].studentName).toBe(
      "Aluno"
    );
  });

  it("limite individual: no máximo um pedido por produto", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_1000);

    const first = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero um chaveiro.",
      })
    );
    expect(first.status).toBe(201);

    const duplicate = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "keychain",
        requestDetails: "Quero outro chaveiro.",
      })
    );
    expect(duplicate.status).toBe(409);

    // Produto diferente é permitido.
    const other = await createRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests", "POST", {
        itemId: "character-piece",
        requestDetails: "Quero uma peça do meu personagem.",
      })
    );
    expect(other.status).toBe(201);
  });
});

describe("GET /api/sql-quest/rewards/requests", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await listRequests(new NextRequest("http://localhost/api/sql-quest/rewards/requests"));
    expect(res.status).toBe(401);
  });

  it("aluno vê apenas os próprios pedidos", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { status: "approved" });
    seedRequest(store, "u-student2_keychain", { uid: "u-student2", status: "requested" });

    const res = await listRequests(new NextRequest("http://localhost/api/sql-quest/rewards/requests"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.requests).toHaveLength(1);
    expect(body.requests[0].uid).toBe("u-student");
    expect(body.requests[0].status).toBe("approved");
  });

  it("scope=staff exige staff (aluno recebe 403)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    seedProgress("u-student", LESSONS_540);
    const res = await listRequests(
      new NextRequest("http://localhost/api/sql-quest/rewards/requests?scope=staff")
    );
    expect(res.status).toBe(403);
  });

  it("instrutor vê apenas pedidos cujo classId é de turma que ele instrui", async () => {
    mockGetAuthUser.mockResolvedValue(teacher);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedClass(store, "class-1", ["u-teacher"], ["u-student"]);
    seedClass(store, "class-2", ["u-other-teacher"], ["u-student"]);
    seedRequest(store, "u-student_keychain", { uid: "u-student", classId: "class-1", studentName: "Maria Silva" });
    seedRequest(store, "u-student_character-piece", {
      uid: "u-student",
      classId: "class-2",
      itemId: "character-piece",
      itemName: "Peça de personagem",
      costXp: 1000,
    });
    seedRequest(store, "u-student_object-12cm", {
      uid: "u-student",
      classId: null,
      itemId: "object-12cm",
      itemName: "Objeto personalizado de até 12 cm",
      costXp: 3000,
    });

    const res = await listRequests(
      new NextRequest("http://localhost/api/sql-quest/rewards/requests?scope=staff")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.requests).toHaveLength(1);
    expect(body.requests[0].itemId).toBe("keychain");
    expect(body.requests[0].studentName).toBe("Maria Silva");
  });

  it("admin vê todos os pedidos (inclusive sem turma)", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { uid: "u-student", classId: "class-1" });
    seedRequest(store, "u-student2_keychain", { uid: "u-student2", classId: null });

    const res = await listRequests(
      new NextRequest("http://localhost/api/sql-quest/rewards/requests?scope=staff")
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.requests).toHaveLength(2);
  });
});

describe("PATCH /api/sql-quest/rewards/requests/[id]", () => {
  it("retorna 401 sem usuário autenticado", async () => {
    mockGetAuthUser.mockResolvedValue(null);
    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/req-1", "PATCH", { action: "approve" }),
      { params: { id: "req-1" } }
    );
    expect(res.status).toBe(401);
  });

  it("bloqueia aluno (403)", async () => {
    mockGetAuthUser.mockResolvedValue(student);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(403);
  });

  it("404 para pedido inexistente", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    seedProgress("u-student", LESSONS_540);
    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/nao-existe", "PATCH", { action: "approve" }),
      { params: { id: "nao-existe" } }
    );
    expect(res.status).toBe(404);
  });

  it("400 para ação inválida", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "delete" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(400);
  });

  it("instrutor decide pedido cujo classId é de turma que ele instrui", async () => {
    mockGetAuthUser.mockResolvedValue(teacher);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedClass(store, "class-1", ["u-teacher"], ["u-student"]);
    seedRequest(store, "u-student_keychain", { uid: "u-student", classId: "class-1" });

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(200);
  });

  it("instrutor não decide pedido de turma que não instrui (403)", async () => {
    mockGetAuthUser.mockResolvedValue(teacher);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedClass(store, "class-1", ["u-other-teacher"], ["u-student"]);
    seedRequest(store, "u-student_keychain", { uid: "u-student", classId: "class-1" });

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(403);
  });

  it("instrutor não decide pedido sem turma (403)", async () => {
    mockGetAuthUser.mockResolvedValue(teacher);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { uid: "u-student", classId: null });

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(403);
  });

  it("aprovação atomiza débito de spentXp e decremento de estoque", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540); // 540 XP
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.request.status).toBe("approved");
    expect(body.request.approvedBy).toBe("u-admin");
    expect(body.request.approvedAt).toBeTruthy();
    expect(body.idempotent).toBe(false);

    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(500);
    expect(store["sql_quest_reward_stock"]["keychain"]).toMatchObject({
      initialStock: 5,
      remainingStock: 4,
    });
    // A marca de inventário foi criada pela inicialização.
    expect(store["sql_quest_reward_inventory"]["current"]).toBeDefined();
  });

  it("aprovação é idempotente: repetir não debita nem decrementa de novo", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain");

    const first = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(first.status).toBe(200);

    const second = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(second.status).toBe(200);
    const body = await second.json();
    expect(body.idempotent).toBe(true);

    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(500);
    expect(store["sql_quest_reward_stock"]["keychain"].remainingStock).toBe(4);
  });

  it("inventário já inicializado não é re-executado (create-only, sem restaurar)", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedMarker(store);
    store["sql_quest_reward_stock"] = {
      keychain: { itemId: "keychain", initialStock: 5, remainingStock: 3, updatedAt: "2026-09-10T00:00:00.000Z" },
    };
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(200);

    // Aprovação apenas decrementa o doc existente (3 → 2).
    expect(store["sql_quest_reward_stock"]["keychain"].remainingStock).toBe(2);
    // Docs ausentes NÃO são recriados porque a marca já existe.
    expect(store["sql_quest_reward_stock"]["character-piece"]).toBeUndefined();
    expect(store["sql_quest_reward_stock"]["object-12cm"]).toBeUndefined();
  });

  it("doc de estoque ausente após a marca existir bloqueia a aprovação (nunca restaura)", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedMarker(store); // marca existe, docs de estoque removidos
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);

    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
    expect(store["sql_quest_reward_stock"]).toBeUndefined();
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].status).toBe("requested");
  });

  it("saldo insuficiente bloqueia a aprovação sem mutar nada", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_400); // 400 XP < 500
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);

    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].status).toBe("requested");
  });

  it("spentXp inválido no progresso bloqueia a aprovação sem mutar", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540, -5); // spentXp negativo
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(-5);
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].status).toBe("requested");
  });

  it("spentXp corrompido (string) bloqueia a aprovação sem mutar", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { db, store } = createFakeDb();
    mockDbHolder.db = db;
    store["sql_quest_progress"] = {
      "u-student": {
        uid: "u-student",
        completedLessonIds: LESSONS_540,
        totalXp: 999999,
        spentXp: "muitos", // campo PRESENTE e inválido
        updatedAt: "2026-09-08T12:00:00.000Z",
        streak: 0,
        lastActivityDate: null,
        achievements: [],
        classId: null,
        rankingOptIn: false,
      },
    };
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe("muitos");
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].status).toBe("requested");
  });

  it("primeiro resgate aceita progresso legado sem o campo spentXp (trata como 0)", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { db, store } = createFakeDb();
    mockDbHolder.db = db;
    store["sql_quest_progress"] = {
      "u-student": {
        uid: "u-student",
        completedLessonIds: LESSONS_540,
        totalXp: 999999,
        // SEM o campo spentXp (progresso legado anterior à loja).
        updatedAt: "2026-09-08T12:00:00.000Z",
        streak: 0,
        lastActivityDate: null,
        achievements: [],
        classId: null,
        rankingOptIn: false,
      },
    };
    seedRequest(store, "u-student_keychain");

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(200);
    // Débito normal a partir de spentXp = 0.
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(500);
    expect(store["sql_quest_reward_stock"]["keychain"]).toMatchObject({
      initialStock: 5,
      remainingStock: 4,
    });
  });

  it("estoque insuficiente (0) bloqueia a aprovação sem mutar nada", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_1000);
    seedRequest(store, "u-student_character-piece", {
      itemId: "character-piece",
      itemName: "Peça de personagem",
      costXp: 1000,
    });
    store["sql_quest_reward_stock"] = {
      "character-piece": { itemId: "character-piece", initialStock: 1, remainingStock: 0, updatedAt: "2026-09-10T00:00:00.000Z" },
    };

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_character-piece", "PATCH", { action: "approve" }),
      { params: { id: "u-student_character-piece" } }
    );
    expect(res.status).toBe(409);

    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
    expect(store["sql_quest_reward_stock"]["character-piece"].remainingStock).toBe(0);
    expect(store["sql_quest_reward_requests"]["u-student_character-piece"].status).toBe("requested");
  });

  it("estoque 1: segundo aluno com pedido aprovado é bloqueado", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_1000);
    seedRequest(store, "u-student_character-piece", {
      uid: "u-student",
      itemId: "character-piece",
      itemName: "Peça de personagem",
      costXp: 1000,
    });
    seedRequest(store, "u-student2_character-piece", {
      uid: "u-student2",
      itemId: "character-piece",
      itemName: "Peça de personagem",
      costXp: 1000,
    });
    store["sql_quest_progress"]["u-student2"] = {
      uid: "u-student2",
      completedLessonIds: LESSONS_1000,
      totalXp: 999999,
      spentXp: 0,
    };

    const first = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_character-piece", "PATCH", { action: "approve" }),
      { params: { id: "u-student_character-piece" } }
    );
    expect(first.status).toBe(200);
    expect(store["sql_quest_reward_stock"]["character-piece"].remainingStock).toBe(0);

    const second = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student2_character-piece", "PATCH", { action: "approve" }),
      { params: { id: "u-student2_character-piece" } }
    );
    expect(second.status).toBe(409);
    expect(store["sql_quest_progress"]["u-student2"].spentXp).toBe(0);
  });

  it("pedido corrompido (custo divergente do catálogo) falha fechado sem mutar", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { costXp: 100 }); // catálogo = 500

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
    expect(store["sql_quest_reward_requests"]["u-student_keychain"].status).toBe("requested");
  });

  it("pedido corrompido (status desconhecido) falha fechado sem mutar", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { status: "pending" });

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
  });

  it("pedido corrompido (produto desconhecido) falha fechado sem mutar", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { itemId: "trophy", itemName: "Troféu" });

    const res = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(res.status).toBe(409);
    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
  });

  it("rejeição não debita nem mexe no estoque e é idempotente", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain");

    const first = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "reject" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(first.status).toBe(200);
    const body = await first.json();
    expect(body.request.status).toBe("rejected");
    expect(body.request.rejectedBy).toBe("u-admin");

    expect(store["sql_quest_progress"]["u-student"].spentXp).toBe(0);
    // Rejeição não mexe no estoque: docs existem (inicializados), mas intactos.
    expect(store["sql_quest_reward_stock"]["keychain"]).toMatchObject({
      initialStock: 5,
      remainingStock: 5,
    });

    const second = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "reject" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(second.status).toBe(200);
    expect((await second.json()).idempotent).toBe(true);
  });

  it("fulfillment só a partir de approved e é idempotente", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { status: "approved", approvedAt: "2026-09-11T00:00:00.000Z", approvedBy: "u-admin" });

    const first = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "fulfill" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(first.status).toBe(200);
    const body = await first.json();
    expect(body.request.status).toBe("fulfilled");
    expect(body.request.fulfilledBy).toBe("u-admin");

    const second = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "fulfill" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(second.status).toBe(200);
    expect((await second.json()).idempotent).toBe(true);
  });

  it("transições inválidas retornam 409", async () => {
    mockGetAuthUser.mockResolvedValue(admin);
    const { store } = seedProgress("u-student", LESSONS_540);
    seedRequest(store, "u-student_keychain", { status: "rejected", rejectedAt: "2026-09-11T00:00:00.000Z", rejectedBy: "u-admin" });

    const approveRejected = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "approve" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(approveRejected.status).toBe(409);

    const fulfillRequested = await decideRequest(
      makeJsonRequest("http://localhost/api/sql-quest/rewards/requests/u-student_keychain", "PATCH", { action: "fulfill" }),
      { params: { id: "u-student_keychain" } }
    );
    expect(fulfillRequested.status).toBe(409);
  });
});