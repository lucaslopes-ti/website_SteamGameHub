/**
 * Testes do validador da SQL Quest (modos exact e schema).
 *
 * Lógica pura: os testes montam objetos de resultado/schema na mão, sem
 * depender de sql.js (WASM) nem de Firebase.
 *
 * @jest-environment node
 */
import { validateLessonResult } from "@/lib/sql-quest/validator";
import type {
  SQLLesson,
  SQLChallenge,
  SQLExecutionResult,
  SQLValue,
  SQLSchemaSnapshot,
  SQLTableSchema,
  SQLColumnSchema,
} from "@/lib/sql-quest/types";

function makeLesson(challenge: SQLChallenge): SQLLesson {
  return {
    id: "x-x",
    chapter: 1,
    lesson: 1,
    title: "Teste",
    summary: "Teste",
    difficulty: "iniciante",
    xpReward: 50,
    explanation: "teste",
    exampleSql: null,
    setupSql: "",
    tables: [],
    challenge,
    hints: [],
  };
}

function colSchema(
  name: string,
  type: string,
  opts: { pk?: boolean; notNull?: boolean; unique?: boolean; refs?: { table: string; column: string } } = {}
): SQLColumnSchema {
  return {
    name,
    type,
    notNull: opts.notNull ?? false,
    primaryKey: opts.pk ?? false,
    unique: opts.unique ?? false,
    defaultValue: null,
    references: opts.refs ?? null,
  };
}

function makeResult(
  overrides: Partial<SQLExecutionResult> = {}
): SQLExecutionResult {
  return {
    success: true,
    error: null,
    columns: [],
    rows: [],
    rowCount: 0,
    schema: null,
    ...overrides,
  };
}

function makeSchema(tables: SQLTableSchema[]): SQLSchemaSnapshot {
  return { tables };
}

describe("validador — modo exact (resultado)", () => {
  const lesson = makeLesson({
    kind: "exact",
    instruction: "traz a tabela inteira",
    expectedColumns: ["id", "nome", "saldo"],
    expectedRows: [
      [1, "Ana", 100],
      [2, "Bruno", 250.5],
    ],
  });

  it("passa quando colunas e linhas conferem (ignorando ordem de linhas)", () => {
    const result = makeResult({
      columns: ["id", "nome", "saldo"],
      rows: [
        [2, "Bruno", 250.5],
        [1, "Ana", 100],
      ],
    });
    const validation = validateLessonResult(lesson, result);
    expect(validation.passed).toBe(true);
    expect(validation.mode).toBe("exact");
  });

  it("reprova quando o número de colunas difere", () => {
    const result = makeResult({ columns: ["id", "nome"], rows: [] });
    const validation = validateLessonResult(lesson, result);
    expect(validation.passed).toBe(false);
    expect(validation.details.join(" ")).toMatch(/colunas/i);
  });

  it("reprova quando as colunas vêm em outra ordem", () => {
    const result = makeResult({
      columns: ["saldo", "id", "nome"],
      rows: [],
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("reprova quando há coluna extra com nome errado", () => {
    const result = makeResult({
      columns: ["id", "nome", "cidade"],
      rows: [],
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("reprova quando faltam linhas", () => {
    const result = makeResult({
      columns: ["id", "nome", "saldo"],
      rows: [[1, "Ana", 100]],
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("reprova quando há linhas a mais", () => {
    const result = makeResult({
      columns: ["id", "nome", "saldo"],
      rows: [
        [1, "Ana", 100],
        [2, "Bruno", 250.5],
        [3, "Carla", 0],
      ],
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("trata número e string numérica como equivalentes", () => {
    const result = makeResult({
      columns: ["id", "nome", "saldo"],
      rows: [
        [1, "Ana", "100"],
        [2, "Bruno", "250.5"],
      ],
    });
    expect(validateLessonResult(lesson, result).passed).toBe(true);
  });

  it("respeita orderSensitive quando habilitado", () => {
    const orderedLesson = makeLesson({
      kind: "exact",
      instruction: "ordem importa",
      expectedColumns: ["id", "nome"],
      expectedRows: [
        [1, "Ana"],
        [2, "Bruno"],
      ],
      orderSensitive: true,
    });
    const reversed = makeResult({
      columns: ["id", "nome"],
      rows: [
        [2, "Bruno"],
        [1, "Ana"],
      ],
    });
    expect(validateLessonResult(orderedLesson, reversed).passed).toBe(false);

    const correct = makeResult({
      columns: ["id", "nome"],
      rows: [
        [1, "Ana"],
        [2, "Bruno"],
      ],
    });
    expect(validateLessonResult(orderedLesson, correct).passed).toBe(true);
  });

  it("reprova resultado vazio para um desafio com linhas esperadas", () => {
    const result = makeResult({ columns: [], rows: [] });
    const validation = validateLessonResult(lesson, result);
    expect(validation.passed).toBe(false);
  });
});

describe("validador — query com erro", () => {
  it("devolve modo error e passed=false quando a query falhou", () => {
    const lesson = makeLesson({
      kind: "exact",
      instruction: "x",
      expectedColumns: ["a"],
      expectedRows: [["b"]],
    });
    const result = makeResult({ success: false, error: "no such column: x" });
    const validation = validateLessonResult(lesson, result);
    expect(validation.passed).toBe(false);
    expect(validation.mode).toBe("error");
    expect(validation.details[0]).toContain("no such column");
  });
});

describe("validador — modo schema (DDL)", () => {
  it("passa quando a estrutura esperada existe", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "crie a tabela",
      expectedTables: [
        {
          name: "cobrancas",
          columns: [
            { name: "id", type: "INTEGER", primaryKey: true },
            { name: "valor", type: "REAL" },
          ],
        },
      ],
    });
    const result = makeResult({
      schema: makeSchema([
        {
          name: "cobrancas",
          columns: [
            colSchema("id", "INTEGER", { pk: true }),
            colSchema("valor", "REAL"),
          ],
          foreignKeys: [],
        },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(true);
  });

  it("reprova quando a tabela não existe", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "crie a tabela",
      expectedTables: [{ name: "cobrancas" }],
    });
    const result = makeResult({ schema: makeSchema([]) });
    const validation = validateLessonResult(lesson, result);
    expect(validation.passed).toBe(false);
    expect(validation.details.join(" ")).toMatch(/não existe/);
  });

  it("reprova quando falta uma coluna", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [{ name: "t", columns: [{ name: "nome", type: "TEXT" }] }],
    });
    const result = makeResult({
      schema: makeSchema([
        {
          name: "t",
          columns: [colSchema("id", "INTEGER")],
          foreignKeys: [],
        },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("reprova quando a coluna deveria ser NOT NULL e não é", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [{ name: "t", columns: [{ name: "nome", type: "TEXT", notNull: true }] }],
    });
    const result = makeResult({
      schema: makeSchema([
        { name: "t", columns: [colSchema("nome", "TEXT")], foreignKeys: [] },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);

    const ok = makeResult({
      schema: makeSchema([
        {
          name: "t",
          columns: [colSchema("nome", "TEXT", { notNull: true })],
          foreignKeys: [],
        },
      ]),
    });
    expect(validateLessonResult(lesson, ok).passed).toBe(true);
  });

  it("aceita afinidade compatível (REAL vs NUMERIC)", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [{ name: "t", columns: [{ name: "valor", type: "REAL" }] }],
    });
    const result = makeResult({
      schema: makeSchema([
        { name: "t", columns: [colSchema("valor", "DECIMAL(10,2)")], foreignKeys: [] },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(true);
  });

  it("reprova afinidade incompatível (TEXT vs INTEGER)", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [{ name: "t", columns: [{ name: "valor", type: "INTEGER" }] }],
    });
    const result = makeResult({
      schema: makeSchema([
        { name: "t", columns: [colSchema("valor", "TEXT")], foreignKeys: [] },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("considera PRIMARY KEY como satisfazendo UNIQUE", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [{ name: "t", columns: [{ name: "codigo", type: "TEXT", unique: true }] }],
    });
    const result = makeResult({
      schema: makeSchema([
        {
          name: "t",
          columns: [colSchema("codigo", "TEXT", { pk: true })],
          foreignKeys: [],
        },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(true);
  });

  it("valida chave estrangeira esperada", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [
        {
          name: "transferencias",
          columns: [
            { name: "id", type: "INTEGER", primaryKey: true },
            { name: "cliente_id", type: "INTEGER" },
          ],
          foreignKeys: [
            { columns: ["cliente_id"], table: "clientes", referencedColumns: ["id"] },
          ],
        },
      ],
    });

    const ok = makeResult({
      schema: makeSchema([
        {
          name: "transferencias",
          columns: [
            colSchema("id", "INTEGER", { pk: true }),
            colSchema("cliente_id", "INTEGER", { refs: { table: "clientes", column: "id" } }),
          ],
          foreignKeys: [
            { columns: ["cliente_id"], table: "clientes", referencedColumns: ["id"] },
          ],
        },
      ]),
    });
    expect(validateLessonResult(lesson, ok).passed).toBe(true);

    const missing = makeResult({
      schema: makeSchema([
        {
          name: "transferencias",
          columns: [
            colSchema("id", "INTEGER", { pk: true }),
            colSchema("cliente_id", "INTEGER"),
          ],
          foreignKeys: [],
        },
      ]),
    });
    const validation = validateLessonResult(lesson, missing);
    expect(validation.passed).toBe(false);
    expect(validation.details.join(" ")).toMatch(/FOREIGN KEY/i);
  });

  it("reprova quando há coluna proibida (forbidColumns)", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [
        { name: "cartoes", columns: [{ name: "codigo", type: "TEXT" }], forbidColumns: ["numero"] },
      ],
    });
    const result = makeResult({
      schema: makeSchema([
        {
          name: "cartoes",
          columns: [colSchema("codigo", "TEXT"), colSchema("numero", "TEXT")],
          foreignKeys: [],
        },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(false);
  });

  it("passa quando a coluna proibida não existe mais", () => {
    const lesson = makeLesson({
      kind: "schema",
      instruction: "x",
      expectedTables: [
        { name: "cartoes", columns: [{ name: "codigo", type: "TEXT" }], forbidColumns: ["numero"] },
      ],
    });
    const result = makeResult({
      schema: makeSchema([
        { name: "cartoes", columns: [colSchema("codigo", "TEXT")], foreignKeys: [] },
      ]),
    });
    expect(validateLessonResult(lesson, result).passed).toBe(true);
  });
});

describe("validador — células (helpers)", () => {
  it("compara células com null corretamente", () => {
    const lesson = makeLesson({
      kind: "exact",
      instruction: "x",
      expectedColumns: ["a"],
      expectedRows: [[null]],
    });
    const ok = makeResult({ columns: ["a"], rows: [[null]] });
    expect(validateLessonResult(lesson, ok).passed).toBe(true);

    const no = makeResult({ columns: ["a"], rows: [["x"]] });
    expect(validateLessonResult(lesson, no).passed).toBe(false);
  });
});
