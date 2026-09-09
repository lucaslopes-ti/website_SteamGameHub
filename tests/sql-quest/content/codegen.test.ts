/**
 * Testes do serializador do catálogo gerado (codegen).
 *
 * Verifica que `serializeCatalogSource` produz um módulo TypeScript válido,
 * determinístico e idempotente (mesma entrada → mesma saída), com os dados
 * serializados e o aviso de autoria.
 *
 * @jest-environment node
 */
import { serializeCatalogSource } from "@/lib/sql-quest/content/codegen";
import type { SQLChapter, SQLLesson } from "@/lib/sql-quest/types";

function makeLesson(overrides: Partial<SQLLesson> = {}): SQLLesson {
  return {
    id: "select-01",
    chapter: 1,
    chapterSlug: "select",
    lesson: 1,
    title: "SELECT *",
    summary: "Busque todas as colunas.",
    difficulty: "iniciante",
    xpReward: 50,
    explanation: "## Contexto\n\nTexto.",
    exampleSql: null,
    setupSql: "CREATE TABLE users (id INTEGER);",
    tables: [],
    challenge: {
      kind: "exact",
      instruction: "Escreva SELECT * FROM users;",
      expectedColumns: ["id"],
      expectedRows: [[1]],
    },
    hints: ["Use SELECT *"],
    prerequisites: [],
    references: [],
    images: [],
    ...overrides,
  };
}

const chapters: SQLChapter[] = [
  { number: 1, slug: "select", title: "Consultas com SELECT", description: "Leia dados." },
];

describe("serializeCatalogSource", () => {
  it("gera um módulo TS com cabeçalho, imports e dados", () => {
    const source = serializeCatalogSource(chapters, [makeLesson()], "1.0.0");
    expect(source).toContain("NÃO EDITE MANUALMENTE");
    expect(source).toContain(
      `import type { SQLChapter, SQLLesson } from "../../lib/sql-quest/types";`
    );
    expect(source).toContain(`export const catalogVersion = "1.0.0";`);
    expect(source).toContain(`export const chapters: SQLChapter[] =`);
    expect(source).toContain(`export const lessons: SQLLesson[] =`);
    expect(source).toContain(`"id": "select-01"`);
    expect(source).toContain(`"kind": "exact"`);
  });

  it("é determinístico e idempotente (mesma entrada → mesma saída)", () => {
    const lessons = [makeLesson(), makeLesson({ id: "select-02", lesson: 2 })];
    const a = serializeCatalogSource(chapters, lessons, "1.0.0");
    const b = serializeCatalogSource(chapters, lessons, "1.0.0");
    expect(a).toBe(b);
  });

  it("serializa quiz e theory", () => {
    const quiz = makeLesson({
      id: "select-04",
      lesson: 4,
      challenge: {
        kind: "quiz",
        instruction: "Responda.",
        questions: [{ prompt: "P?", options: ["A", "B"], answer: 1 }],
      },
    });
    const theory = makeLesson({
      id: "tabelas-08",
      chapter: 2,
      chapterSlug: "tabelas",
      lesson: 8,
      challenge: { kind: "theory", instruction: "Leia." },
    });
    const source = serializeCatalogSource(chapters, [quiz, theory], "1.0.0");
    expect(source).toContain(`"kind": "quiz"`);
    expect(source).toContain(`"kind": "theory"`);
    expect(source).toContain(`"questions":`);
  });

  it("omite orderSensitive quando ausente e preserva quando true", () => {
    const without = serializeCatalogSource(chapters, [makeLesson()], "1.0.0");
    expect(without).not.toContain("orderSensitive");

    const withOrder = serializeCatalogSource(
      chapters,
      [
        makeLesson({
          challenge: {
            kind: "exact",
            instruction: "Ordene.",
            expectedColumns: ["id"],
            expectedRows: [[1]],
            orderSensitive: true,
          },
        }),
      ],
      "1.0.0"
    );
    expect(withOrder).toContain(`"orderSensitive": true`);
  });
});