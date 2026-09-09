/**
 * Loader da base de conteúdo da SQL Quest — build-time (Node.js).
 *
 * Lê `chapters.md` e `lessons/*.md` de um diretório e produz um
 * `SQLContentBundle` tipado. A validação é feita em separado (`validate.ts` /
 * `build.ts`); aqui o foco é apenas parsear e normalizar.
 *
 * Este módulo usa `node:fs`/`node:path` e NÃO deve ser importado por código de
 * cliente (browser). Para uso em runtime, consuma apenas os tipos e a
 * validação pura.
 */
import fs from "node:fs";
import path from "node:path";
import { parseFrontMatter } from "./frontmatter";
import type {
  SQLContentBundle,
  SQLContentChapter,
  SQLContentChallenge,
  SQLContentColumn,
  SQLContentImage,
  SQLContentIssue,
  SQLContentLesson,
  SQLContentReference,
  SQLContentTable,
} from "./types";

/** Documento bruto (front matter parseado + corpo) de um arquivo .md. */
export interface SQLContentRawDoc {
  file: string;
  data: Record<string, unknown>;
  body: string;
}

/** Resultado do carregamento de um diretório de conteúdo. */
export interface SQLContentDirectoryLoad {
  bundle: SQLContentBundle;
  chaptersDoc: SQLContentRawDoc | null;
  lessonDocs: SQLContentRawDoc[];
  /** Erros de parse (front matter malformado) encontrados durante a leitura. */
  parseErrors: SQLContentIssue[];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : [];
}

function asDifficulty(v: unknown): SQLContentLesson["difficulty"] {
  return v === "iniciante" || v === "intermediario" || v === "avancado"
    ? v
    : "iniciante";
}

function asReferences(v: unknown): SQLContentReference[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((r) => ({
    label: typeof r.label === "string" ? r.label : "",
    url: typeof r.url === "string" ? r.url : "",
  }));
}

function asColumns(v: unknown): SQLContentColumn[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((c) => ({
    name: typeof c.name === "string" ? c.name : "",
    type: typeof c.type === "string" ? c.type : "",
    notNull: c.notNull === true,
    primaryKey: c.primaryKey === true,
    unique: c.unique === true,
    references:
      isRecord(c.references) && typeof c.references.table === "string"
        ? {
            table: c.references.table,
            column:
              typeof c.references.column === "string"
                ? c.references.column
                : undefined,
          }
        : undefined,
  }));
}

function asTables(v: unknown): SQLContentTable[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((t) => ({
    name: typeof t.name === "string" ? t.name : "",
    columns: asColumns(t.columns),
  }));
}

function asChallenge(v: unknown): SQLContentChallenge | undefined {
  if (v === undefined || v === null) return undefined; // unidade theory
  if (!isRecord(v)) {
    return { kind: "exact", instruction: "", expectedColumns: [], expectedRows: [] };
  }
  if (v.kind === "schema") {
    return {
      kind: "schema",
      instruction: typeof v.instruction === "string" ? v.instruction : "",
      expectedTables: Array.isArray(v.expectedTables)
        ? v.expectedTables.filter(isRecord).map((t) => ({
            name: typeof t.name === "string" ? t.name : "",
            columns: Array.isArray(t.columns)
              ? t.columns.filter(isRecord).map((c) => ({
                  name: typeof c.name === "string" ? c.name : "",
                  type: typeof c.type === "string" ? c.type : undefined,
                  notNull: c.notNull === true ? true : undefined,
                  primaryKey: c.primaryKey === true ? true : undefined,
                  unique: c.unique === true ? true : undefined,
                  references:
                    isRecord(c.references) && typeof c.references.table === "string"
                      ? {
                          table: c.references.table,
                          column:
                            typeof c.references.column === "string"
                              ? c.references.column
                              : undefined,
                        }
                      : undefined,
                }))
              : [],
            foreignKeys: Array.isArray(t.foreignKeys)
              ? t.foreignKeys.filter(isRecord).map((fk) => ({
                  columns: Array.isArray(fk.columns)
                    ? fk.columns.filter((x): x is string => typeof x === "string")
                    : [],
                  table: typeof fk.table === "string" ? fk.table : "",
                  referencedColumns: Array.isArray(fk.referencedColumns)
                    ? fk.referencedColumns.filter(
                        (x): x is string => typeof x === "string"
                      )
                    : undefined,
                }))
              : [],
            forbidColumns: Array.isArray(t.forbidColumns)
              ? t.forbidColumns.filter((x): x is string => typeof x === "string")
              : [],
          }))
        : [],
    };
  }
  if (v.kind === "quiz") {
    return {
      kind: "quiz",
      instruction: typeof v.instruction === "string" ? v.instruction : "",
      questions: Array.isArray(v.questions)
        ? v.questions.filter(isRecord).map((q) => ({
            prompt: typeof q.prompt === "string" ? q.prompt : "",
            options: Array.isArray(q.options)
              ? q.options.filter((x): x is string => typeof x === "string")
              : [],
            answer:
              typeof q.answer === "number" && Number.isInteger(q.answer)
                ? q.answer
                : -1,
            explanation:
              typeof q.explanation === "string" ? q.explanation : undefined,
          }))
        : [],
    };
  }
  return {
    kind: "exact",
    instruction: typeof v.instruction === "string" ? v.instruction : "",
    expectedColumns: Array.isArray(v.expectedColumns)
      ? v.expectedColumns.filter((x): x is string => typeof x === "string")
      : [],
    expectedRows: Array.isArray(v.expectedRows)
      ? v.expectedRows
          .filter((r): r is unknown[] => Array.isArray(r))
          .map((r) =>
            r.map((cell) =>
              cell === null || typeof cell === "string" || typeof cell === "number"
                ? cell
                : null
            )
          )
      : [],
    orderSensitive: v.orderSensitive === true ? true : undefined,
  };
}

function asImages(v: unknown): SQLContentImage[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((img) => ({
    alt: typeof img.alt === "string" ? img.alt : "",
    src: typeof img.src === "string" ? img.src : "",
  }));
}

/** Normaliza um documento de lição já parseado em `SQLContentLesson`. */
export function parseLesson(
  data: Record<string, unknown>,
  body: string,
  file: string
): SQLContentLesson {
  return {
    id: asString(data.id, ""),
    title: asString(data.title, ""),
    summary: asString(data.summary, ""),
    chapter: asNumber(data.chapter, 0),
    chapterSlug: asString(data.chapterSlug, ""),
    lesson: asNumber(data.lesson, 0),
    difficulty: asDifficulty(data.difficulty),
    xp: asNumber(data.xp, 0),
    prerequisites: asStringArray(data.prerequisites),
    hints: asStringArray(data.hints),
    references: asReferences(data.references),
    setupSql: asString(data.setupSql, ""),
    tables: asTables(data.tables),
    challenge: asChallenge(data.challenge),
    images: asImages(data.images),
    body,
    sourcePath: file,
  };
}

/** Normaliza o documento de capítulos em `SQLContentChapter[]`. */
export function parseChapters(data: Record<string, unknown>): SQLContentChapter[] {
  if (!Array.isArray(data.chapters)) return [];
  return data.chapters.filter(isRecord).map((c) => ({
    number:
      typeof c.number === "number" && Number.isInteger(c.number) ? c.number : 0,
    slug: typeof c.slug === "string" ? c.slug : "",
    title: typeof c.title === "string" ? c.title : "",
    description: typeof c.description === "string" ? c.description : "",
  }));
}

/** Carrega e parseia UM arquivo de lição. Lança em front matter inválido. */
export function loadLessonFile(filePath: string): SQLContentLesson {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontMatter(raw);
  return parseLesson(data, body, filePath);
}

/** Carrega e parseia o arquivo de capítulos. Lança em front matter inválido. */
export function loadChapterFile(filePath: string): SQLContentChapter[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = parseFrontMatter(raw);
  return parseChapters(data);
}

/**
 * Carrega um diretório de conteúdo (`chapters.md` + `lessons/*.md`).
 *
 * Erros de parse por arquivo são coletados em `parseErrors` (não lançam), para
 * que a validação consiga reportar todos os problemas de uma vez.
 */
export function loadContentDirectory(dir: string): SQLContentDirectoryLoad {
  const chaptersPath = path.join(dir, "chapters.md");
  const lessonsDir = path.join(dir, "lessons");
  const parseErrors: SQLContentIssue[] = [];

  let chaptersDoc: SQLContentRawDoc | null = null;
  if (fs.existsSync(chaptersPath)) {
    try {
      const raw = fs.readFileSync(chaptersPath, "utf8");
      const { data, body } = parseFrontMatter(raw);
      chaptersDoc = { file: chaptersPath, data, body };
    } catch (error) {
      parseErrors.push({
        file: chaptersPath,
        severity: "error",
        message: errorMessage(error),
      });
    }
  }

  const lessonDocs: SQLContentRawDoc[] = [];
  if (fs.existsSync(lessonsDir)) {
    const files = fs
      .readdirSync(lessonsDir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => path.join(lessonsDir, e.name))
      .sort();
    for (const file of files) {
      try {
        const raw = fs.readFileSync(file, "utf8");
        const { data, body } = parseFrontMatter(raw);
        lessonDocs.push({ file, data, body });
      } catch (error) {
        parseErrors.push({ file, severity: "error", message: errorMessage(error) });
      }
    }
  }

  const chapters = chaptersDoc ? parseChapters(chaptersDoc.data) : [];
  const lessons = lessonDocs.map((doc) =>
    parseLesson(doc.data, doc.body, doc.file)
  );

  return {
    bundle: {
      version: asString(chaptersDoc?.data.version, "1.0.0"),
      chapters,
      lessons,
    },
    chaptersDoc,
    lessonDocs,
    parseErrors,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}