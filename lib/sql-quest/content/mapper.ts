/**
 * Mapper da base de conteúdo da SQL Quest — converte o contrato de conteúdo
 * (`SQLContentLesson`/`SQLContentChapter`) no catálogo runtime (`SQLLesson`/
 * `SQLChapter`).
 *
 * Camada 100% pura e serializável (sem fs, sem Node): é usada pelo script de
 * geração (`scripts/sql-quest-generate-catalog.ts`) para produzir o artefato
 * `data/sql-quest/generated.ts`, que por sua vez alimenta `catalog.ts` sem
 * importar loader/fs em componentes clientes.
 *
 * Regras de mapeamento:
 * - `id`/`chapter`/`lesson`/`title`/`summary`/`xp`/`difficulty` são copiados.
 * - `explanation` recebe o corpo Markdown da unidade (narrativa).
 * - `exampleSql` é sempre `null` (o corpo contém os exemplos).
 * - `challenge` é convertido preservando `exact`/`schema`/`data` e adicionando
 *   `quiz`/`theory` (unidades sem desafio executável viram `kind: "theory"`).
 * - Metadados novos (`prerequisites`, `references`, `images`, `chapterSlug`)
 *   são copiados do front matter.
 */
import type {
  SQLContentBundle,
  SQLContentChapter,
  SQLContentChallenge,
  SQLContentColumn,
  SQLContentLesson,
  SQLContentTable,
} from "./types";
import type {
  SQLChallenge,
  SQLChapter,
  SQLColumnSchema,
  SQLLesson,
  SQLTableSchema,
} from "../types";

/** Converte uma coluna do schema inicial (content) em `SQLColumnSchema`. */
export function mapContentColumn(column: SQLContentColumn): SQLColumnSchema {
  return {
    name: column.name,
    type: column.type ?? null,
    notNull: column.notNull ?? false,
    primaryKey: column.primaryKey ?? false,
    unique: column.unique ?? false,
    defaultValue: null,
    references: column.references
      ? {
          table: column.references.table,
          column: column.references.column ?? "",
        }
      : null,
  };
}

/** Converte uma tabela do schema inicial (content) em `SQLTableSchema`. */
export function mapContentTable(table: SQLContentTable): SQLTableSchema {
  return {
    name: table.name,
    columns: table.columns.map(mapContentColumn),
    foreignKeys: [],
  };
}

/**
 * Converte o desafio da unidade. Unidades **theory** (sem `challenge`) viram
 * `{ kind: "theory", instruction: summary }` — o runtime exige um desafio.
 */
export function mapContentChallenge(
  challenge: SQLContentChallenge | undefined,
  summary: string
): SQLChallenge {
  if (challenge === undefined || challenge === null) {
    return { kind: "theory", instruction: summary };
  }
  switch (challenge.kind) {
    case "exact":
      return {
        kind: "exact",
        instruction: challenge.instruction,
        expectedColumns: challenge.expectedColumns,
        expectedRows: challenge.expectedRows,
        orderSensitive: challenge.orderSensitive,
      };
    case "schema":
      return {
        kind: "schema",
        instruction: challenge.instruction,
        expectedTables: challenge.expectedTables,
      };
    case "data":
      return {
        kind: "data",
        instruction: challenge.instruction,
        expectedTables: challenge.expectedTables,
      };
    case "quiz":
      return {
        kind: "quiz",
        instruction: challenge.instruction,
        questions: challenge.questions,
      };
  }
}

/** Converte uma unidade de conteúdo em uma lição do catálogo runtime. */
export function mapContentLesson(content: SQLContentLesson): SQLLesson {
  return {
    id: content.id,
    chapter: content.chapter,
    chapterSlug: content.chapterSlug,
    lesson: content.lesson,
    title: content.title,
    summary: content.summary,
    difficulty: content.difficulty,
    xpReward: content.xp,
    explanation: content.body,
    exampleSql: null,
    setupSql: content.setupSql,
    tables: content.tables.map(mapContentTable),
    challenge: mapContentChallenge(content.challenge, content.summary),
    hints: content.hints,
    prerequisites: content.prerequisites,
    references: content.references.map((r) => ({ label: r.label, url: r.url })),
    images: content.images.map((img) => ({ alt: img.alt, src: img.src })),
  };
}

/** Converte os metadados de um capítulo (content) em `SQLChapter`. */
export function mapContentChapter(chapter: SQLContentChapter): SQLChapter {
  return {
    number: chapter.number,
    slug: chapter.slug,
    title: chapter.title,
    description: chapter.description,
  };
}

/** Converte um bundle de conteúdo completo em `{ chapters, lessons }`. */
export function mapContentBundle(bundle: SQLContentBundle): {
  chapters: SQLChapter[];
  lessons: SQLLesson[];
} {
  return {
    chapters: bundle.chapters.map(mapContentChapter),
    lessons: bundle.lessons
      .map(mapContentLesson)
      .sort((a, b) => a.chapter - b.chapter || a.lesson - b.lesson),
  };
}