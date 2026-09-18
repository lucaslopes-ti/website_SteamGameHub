/**
 * Testes de integração do motor sql.js para desafios de mutação/data-state
 * (INSERT, UPDATE, DELETE) e regressão dos modos exact/schema.
 *
 * Usa o sql.js REAL (WASM carregado do node_modules) via o seam de teste
 * `executeLessonQueryWithSqlJs`. O runtime público `executeLessonQuery` mantém
 * a guarda de navegador (verificado no último teste).
 *
 * @jest-environment node
 */
import initSqlJs from "sql.js";
import {
  executeLessonQuery,
  executeLessonQueryWithSqlJs,
} from "@/lib/sql-quest/sql-engine";
import type { SQLLesson, SQLChallenge } from "@/lib/sql-quest/types";

type SqlJsStatic = Awaited<ReturnType<typeof initSqlJs>>;

let SQL: SqlJsStatic;

beforeAll(async () => {
  SQL = await initSqlJs();
});

function makeLesson(challenge: SQLChallenge, setupSql: string): SQLLesson {
  return {
    id: "x-x",
    chapter: 1,
    chapterSlug: "select",
    lesson: 1,
    title: "Teste",
    summary: "Teste",
    difficulty: "iniciante",
    xpReward: 50,
    explanation: "teste",
    exampleSql: null,
    starterSql: null,
    setupSql,
    tables: [],
    challenge,
    hints: [],
    prerequisites: [],
    references: [],
    images: [],
  };
}

const SETUP = `
CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT, saldo REAL);
INSERT INTO clientes (id, nome, saldo) VALUES (1, 'Ana', 100);
INSERT INTO clientes (id, nome, saldo) VALUES (2, 'Bruno', 250.5);
`;

describe("motor sql.js — desafios data (INSERT/UPDATE/DELETE)", () => {
  it("INSERT: passa quando o estado final confere", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "insira Carla",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [
              [1, "Ana", 100],
              [2, "Bruno", 250.5],
              [3, "Carla", 0],
            ],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "INSERT INTO clientes (id, nome, saldo) VALUES (3, 'Carla', 0);"
    );
    expect(result.success).toBe(true);
    expect(result.tables).toHaveLength(1);
    expect(result.tables![0].rows).toHaveLength(3);
    expect(validation.passed).toBe(true);
    expect(validation.mode).toBe("data");
  });

  it("INSERT: reprova quando o estado final não confere (valor errado)", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "insira Carla com saldo 0",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [
              [1, "Ana", 100],
              [2, "Bruno", 250.5],
              [3, "Carla", 0],
            ],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "INSERT INTO clientes (id, nome, saldo) VALUES (3, 'Carla', 999);"
    );
    expect(result.success).toBe(true);
    expect(validation.passed).toBe(false);
    expect(validation.mode).toBe("data");
    expect(validation.details.join(" ")).toMatch(/linhas não conferem/);
  });

  it("INSERT: reprova quando a query falha (PRIMARY KEY duplicada)", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "insira um cliente novo",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [
              [1, "Ana", 100],
              [2, "Bruno", 250.5],
              [3, "Carla", 0],
            ],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "INSERT INTO clientes (id, nome, saldo) VALUES (1, 'Duplicado', 0);"
    );
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/duplicado|UNIQUE|PRIMARY KEY/i);
    expect(validation.passed).toBe(false);
    expect(validation.mode).toBe("error");
  });

  it("UPDATE: passa quando atualiza a linha certa", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "atualize o saldo da Ana para 150",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [
              [1, "Ana", 150],
              [2, "Bruno", 250.5],
            ],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "UPDATE clientes SET saldo = 150 WHERE id = 1;"
    );
    expect(result.success).toBe(true);
    expect(validation.passed).toBe(true);
  });

  it("UPDATE: reprova quando atualiza a linha errada", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "atualize o saldo da Ana para 150",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [
              [1, "Ana", 150],
              [2, "Bruno", 250.5],
            ],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "UPDATE clientes SET saldo = 150 WHERE id = 2;"
    );
    expect(result.success).toBe(true);
    expect(validation.passed).toBe(false);
  });

  it("DELETE: passa quando remove a linha certa", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "remova o Bruno",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [[1, "Ana", 100]],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "DELETE FROM clientes WHERE id = 2;"
    );
    expect(result.success).toBe(true);
    expect(validation.passed).toBe(true);
  });

  it("DELETE: reprova quando remove a linha errada", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "remova o Bruno",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [[1, "Ana", 100]],
          },
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "DELETE FROM clientes WHERE id = 1;"
    );
    expect(result.success).toBe(true);
    expect(validation.passed).toBe(false);
  });

  it("captura o estado final mesmo quando a query não retorna result set", async () => {
    const lesson = makeLesson(
      {
        kind: "data",
        instruction: "insira um cliente",
        expectedTables: [
          {
            name: "clientes",
            columns: ["id", "nome", "saldo"],
            rows: [
              [1, "Ana", 100],
              [2, "Bruno", 250.5],
              [3, "Carla", 0],
            ],
          },
        ],
      },
      SETUP
    );
    const { result } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "INSERT INTO clientes (id, nome, saldo) VALUES (3, 'Carla', 0);"
    );
    expect(result.columns).toEqual([]);
    expect(result.rows).toEqual([]);
    expect(result.tables).toHaveLength(1);
    expect(result.tables![0].rows).toEqual([
      [1, "Ana", 100],
      [2, "Bruno", 250.5],
      [3, "Carla", 0],
    ]);
  });
});

describe("motor sql.js — snapshot de índices explícitos", () => {
  it("registra índice explícito e mantém a detecção de UNIQUE automática", async () => {
    const lesson = makeLesson(
      {
        kind: "schema",
        instruction: "crie o índice",
        expectedTables: [
          {
            name: "clientes",
            indexes: [
              { name: "idx_clientes_nome", columns: ["nome"], unique: false },
            ],
          },
        ],
      },
      ""
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT UNIQUE, cidade TEXT);" +
        "CREATE INDEX idx_clientes_nome ON clientes(nome);"
    );

    expect(result.success).toBe(true);
    const table = result.schema!.tables[0];
    expect(table.indexes).toEqual([
      { name: "idx_clientes_nome", columns: ["nome"], unique: false },
    ]);
    // A detecção automática de UNIQUE (origin 'u') continua funcionando.
    const nome = table.columns.find((c) => c.name === "nome");
    expect(nome?.unique).toBe(true);
    expect(validation.passed).toBe(true);
    expect(validation.mode).toBe("schema");
  });

  it("preserva a ordem (seqno) das colunas de um índice composto", async () => {
    const setup =
      "CREATE TABLE t (a INTEGER, b INTEGER, c INTEGER);" +
      "CREATE INDEX idx_b_a ON t(b, a);";

    const ordered = makeLesson(
      {
        kind: "schema",
        instruction: "crie o índice",
        expectedTables: [
          {
            name: "t",
            indexes: [{ name: "idx_b_a", columns: ["b", "a"] }],
          },
        ],
      },
      ""
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      ordered,
      setup
    );
    expect(result.success).toBe(true);
    expect(result.schema!.tables[0].indexes).toEqual([
      { name: "idx_b_a", columns: ["b", "a"], unique: false },
    ]);
    expect(validation.passed).toBe(true);

    const reversed = makeLesson(
      {
        kind: "schema",
        instruction: "crie o índice",
        expectedTables: [
          {
            name: "t",
            indexes: [{ name: "idx_b_a", columns: ["a", "b"] }],
          },
        ],
      },
      ""
    );
    const wrong = await executeLessonQueryWithSqlJs(SQL, reversed, setup);
    expect(wrong.validation.passed).toBe(false);
  });

  it("registra índice UNIQUE explícito com unique=true", async () => {
    const lesson = makeLesson(
      {
        kind: "schema",
        instruction: "crie o índice único",
        expectedTables: [
          {
            name: "t",
            indexes: [
              { name: "uq_composto", columns: ["a", "b"], unique: true },
            ],
          },
        ],
      },
      ""
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "CREATE TABLE t (a INTEGER, b INTEGER);" +
        "CREATE UNIQUE INDEX uq_composto ON t(a, b);"
    );
    expect(result.success).toBe(true);
    expect(result.schema!.tables[0].indexes).toEqual([
      { name: "uq_composto", columns: ["a", "b"], unique: true },
    ]);
    expect(validation.passed).toBe(true);
  });

  it("ignora índices parciais", async () => {
    const { result } = await executeLessonQueryWithSqlJs(
      SQL,
      makeLesson(
        {
          kind: "schema",
          instruction: "crie a tabela",
          expectedTables: [{ name: "t" }],
        },
        ""
      ),
      "CREATE TABLE t (a INTEGER, b INTEGER);" +
        "CREATE INDEX idx_parcial ON t(a) WHERE a > 0;"
    );
    expect(result.success).toBe(true);
    expect(result.schema!.tables[0].indexes).toEqual([]);
  });

  it("descarta índices com expressão (termo não-coluna)", async () => {
    const { result } = await executeLessonQueryWithSqlJs(
      SQL,
      makeLesson(
        {
          kind: "schema",
          instruction: "crie a tabela",
          expectedTables: [{ name: "t" }],
        },
        ""
      ),
      "CREATE TABLE t (a INTEGER, b TEXT);" +
        "CREATE INDEX idx_expr ON t(lower(b));"
    );
    expect(result.success).toBe(true);
    expect(result.schema!.tables[0].indexes).toEqual([]);
  });

  it("tabela sem índice explícito tem indexes vazio", async () => {
    const { result } = await executeLessonQueryWithSqlJs(
      SQL,
      makeLesson(
        {
          kind: "schema",
          instruction: "crie a tabela",
          expectedTables: [{ name: "t" }],
        },
        ""
      ),
      "CREATE TABLE t (a INTEGER, b TEXT UNIQUE);"
    );
    expect(result.success).toBe(true);
    expect(result.schema!.tables[0].indexes).toEqual([]);
  });
});

describe("motor sql.js — regressão dos modos existentes", () => {
  it("modo exact continua funcionando", async () => {
    const lesson = makeLesson(
      {
        kind: "exact",
        instruction: "selecione todos",
        expectedColumns: ["id", "nome", "saldo"],
        expectedRows: [
          [1, "Ana", 100],
          [2, "Bruno", 250.5],
        ],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "SELECT * FROM clientes;"
    );
    expect(result.success).toBe(true);
    expect(result.columns).toEqual(["id", "nome", "saldo"]);
    expect(validation.passed).toBe(true);
    expect(validation.mode).toBe("exact");
  });

  it("modo schema continua funcionando", async () => {
    const lesson = makeLesson(
      {
        kind: "schema",
        instruction: "crie a tabela",
        expectedTables: [
          {
            name: "clientes",
            columns: [
              { name: "id", type: "INTEGER", primaryKey: true },
              { name: "nome", type: "TEXT" },
              { name: "saldo", type: "REAL" },
            ],
          },
        ],
      },
      ""
    );
    const { result, validation } = await executeLessonQueryWithSqlJs(
      SQL,
      lesson,
      "CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT, saldo REAL);"
    );
    expect(result.success).toBe(true);
    expect(result.schema).not.toBeNull();
    expect(validation.passed).toBe(true);
    expect(validation.mode).toBe("schema");
  });

  it("guarda de runtime: executeLessonQuery não executa fora do navegador", async () => {
    // Ambiente node: `window` é undefined → o runtime público recusa.
    const lesson = makeLesson(
      {
        kind: "exact",
        instruction: "x",
        expectedColumns: ["id"],
        expectedRows: [[1]],
      },
      SETUP
    );
    const { result, validation } = await executeLessonQuery(
      lesson,
      "SELECT * FROM clientes;"
    );
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/navegador/i);
    expect(validation.passed).toBe(false);
    expect(validation.mode).toBe("error");
  });
});