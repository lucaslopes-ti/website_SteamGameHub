/**
 * Testes do mapper da base de conteúdo → catálogo runtime.
 *
 * Verifica a conversão de `SQLContentLesson`/`SQLContentChapter` em
 * `SQLLesson`/`SQLChapter`, incluindo os novos kinds quiz/theory e os
 * metadados (prerequisites, references, images, chapterSlug).
 *
 * @jest-environment node
 */
import {
  mapContentBundle,
  mapContentChapter,
  mapContentLesson,
} from "@/lib/sql-quest/content/mapper";
import type {
  SQLContentBundle,
  SQLContentChapter,
  SQLContentLesson,
} from "@/lib/sql-quest/content/types";

function makeContentLesson(
  overrides: Partial<SQLContentLesson> = {}
): SQLContentLesson {
  return {
    id: "select-01",
    title: "SELECT *",
    summary: "Busque todas as colunas.",
    chapter: 1,
    chapterSlug: "select",
    lesson: 1,
    difficulty: "iniciante",
    xp: 50,
    prerequisites: [],
    hints: ["Use SELECT *"],
    references: [{ label: "SQLite — SELECT", url: "https://www.sqlite.org/lang_select.html" }],
    setupSql: "CREATE TABLE users (id INTEGER);",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INTEGER", primaryKey: true },
          { name: "nome", type: "TEXT", notNull: true, references: { table: "paises", column: "sigla" } },
        ],
      },
    ],
    images: [{ alt: "Logos SQL", src: "sql_logos.png" }],
    challenge: {
      kind: "exact",
      instruction: "Escreva SELECT * FROM users;",
      expectedColumns: ["id", "nome"],
      expectedRows: [[1, "Ana"]],
      orderSensitive: false,
    },
    body: "## Contexto\n\nTexto da lição.",
    sourcePath: "content/sql-quest/lessons/select-01.md",
    ...overrides,
  };
}

describe("mapContentLesson", () => {
  it("mapeia campos básicos e metadados", () => {
    const lesson = mapContentLesson(makeContentLesson());
    expect(lesson.id).toBe("select-01");
    expect(lesson.chapter).toBe(1);
    expect(lesson.chapterSlug).toBe("select");
    expect(lesson.lesson).toBe(1);
    expect(lesson.title).toBe("SELECT *");
    expect(lesson.summary).toBe("Busque todas as colunas.");
    expect(lesson.difficulty).toBe("iniciante");
    expect(lesson.xpReward).toBe(50);
    expect(lesson.explanation).toContain("## Contexto");
    expect(lesson.exampleSql).toBeNull();
    expect(lesson.prerequisites).toEqual([]);
    expect(lesson.references).toEqual([
      { label: "SQLite — SELECT", url: "https://www.sqlite.org/lang_select.html" },
    ]);
    expect(lesson.images).toEqual([{ alt: "Logos SQL", src: "sql_logos.png" }]);
  });

  it("mapeia o schema inicial (tables) para SQLTableSchema", () => {
    const lesson = mapContentLesson(makeContentLesson());
    expect(lesson.tables).toHaveLength(1);
    const [table] = lesson.tables;
    expect(table.name).toBe("users");
    expect(table.foreignKeys).toEqual([]);
    expect(table.columns[0]).toMatchObject({
      name: "id",
      type: "INTEGER",
      primaryKey: true,
      notNull: false,
      unique: false,
      defaultValue: null,
      references: null,
    });
    expect(table.columns[1]).toMatchObject({
      name: "nome",
      type: "TEXT",
      notNull: true,
      references: { table: "paises", column: "sigla" },
    });
  });

  it("preserva desafios exact (com orderSensitive)", () => {
    const lesson = mapContentLesson(makeContentLesson());
    expect(lesson.challenge).toEqual({
      kind: "exact",
      instruction: "Escreva SELECT * FROM users;",
      expectedColumns: ["id", "nome"],
      expectedRows: [[1, "Ana"]],
      orderSensitive: false,
    });
  });

  it("preserva desafios schema (expectedTables)", () => {
    const lesson = mapContentLesson(
      makeContentLesson({
        challenge: {
          kind: "schema",
          instruction: "Crie a tabela users.",
          expectedTables: [
            {
              name: "users",
              columns: [{ name: "id", type: "INTEGER", primaryKey: true }],
              foreignKeys: [
                { columns: ["pais_id"], table: "paises", referencedColumns: ["id"] },
              ],
              forbidColumns: ["tag"],
            },
          ],
        },
      })
    );
    expect(lesson.challenge).toEqual({
      kind: "schema",
      instruction: "Crie a tabela users.",
      expectedTables: [
        {
          name: "users",
          columns: [{ name: "id", type: "INTEGER", primaryKey: true }],
          foreignKeys: [
            { columns: ["pais_id"], table: "paises", referencedColumns: ["id"] },
          ],
          forbidColumns: ["tag"],
        },
      ],
    });
  });

  it("preserva desafios data (estado final de tabelas)", () => {
    const lesson = mapContentLesson(
      makeContentLesson({
        challenge: {
          kind: "data",
          instruction: "Insira os registros.",
          expectedTables: [
            {
              name: "users",
              columns: ["id", "name"],
              rows: [
                [1, "Ana"],
                [2, "Bruno"],
              ],
              orderSensitive: false,
            },
          ],
        },
      })
    );
    expect(lesson.challenge).toEqual({
      kind: "data",
      instruction: "Insira os registros.",
      expectedTables: [
        {
          name: "users",
          columns: ["id", "name"],
          rows: [
            [1, "Ana"],
            [2, "Bruno"],
          ],
          orderSensitive: false,
        },
      ],
    });
  });

  it("mapeia desafios quiz", () => {
    const lesson = mapContentLesson(
      makeContentLesson({
        challenge: {
          kind: "quiz",
          instruction: "Responda.",
          questions: [
            { prompt: "Qual comando cria um registro?", options: ["SELECT", "INSERT"], answer: 1, explanation: "INSERT cria." },
          ],
        },
      })
    );
    expect(lesson.challenge).toEqual({
      kind: "quiz",
      instruction: "Responda.",
      questions: [
        { prompt: "Qual comando cria um registro?", options: ["SELECT", "INSERT"], answer: 1, explanation: "INSERT cria." },
      ],
    });
  });

  it("unidade sem challenge vira theory com a summary como instrução", () => {
    const lesson = mapContentLesson(makeContentLesson({ challenge: undefined }));
    expect(lesson.challenge).toEqual({
      kind: "theory",
      instruction: "Busque todas as colunas.",
    });
  });
});

describe("mapContentChapter / mapContentBundle", () => {
  it("mapeia capítulos", () => {
    const chapter: SQLContentChapter = {
      number: 2,
      slug: "tabelas",
      title: "Criando tabelas",
      description: "Crie tabelas.",
    };
    expect(mapContentChapter(chapter)).toEqual({
      number: 2,
      slug: "tabelas",
      title: "Criando tabelas",
      description: "Crie tabelas.",
    });
  });

  it("mapeia o bundle e ordena lições por capítulo/posição", () => {
    const bundle: SQLContentBundle = {
      version: "1.0.0",
      chapters: [
        { number: 2, slug: "tabelas", title: "Tabelas", description: "d" },
        { number: 1, slug: "select", title: "Select", description: "d" },
      ],
      lessons: [
        makeContentLesson({ id: "tabelas-01", chapter: 2, lesson: 1 }),
        makeContentLesson({ id: "select-02", chapter: 1, lesson: 2 }),
        makeContentLesson({ id: "select-01", chapter: 1, lesson: 1 }),
      ],
    };
    const mapped = mapContentBundle(bundle);
    expect(mapped.chapters.map((c) => c.number)).toEqual([2, 1]);
    expect(mapped.lessons.map((l) => l.id)).toEqual([
      "select-01",
      "select-02",
      "tabelas-01",
    ]);
  });
});