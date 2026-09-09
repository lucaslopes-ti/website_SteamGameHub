/**
 * Validação da base de conteúdo da SQL Quest.
 *
 * Camada pura (sem fs): recebe os dados já parseados do front matter e o corpo
 * Markdown e devolve uma lista de `SQLContentIssue`. A validação é estrita de
 * propósito — o objetivo é que erros de autoria apareçam no build, não em
 * produção.
 *
 * Níveis de validação:
 * - `validateLessonDocument`: valida UM arquivo de lição (campos + corpo).
 * - `validateChapterDocument`: valida o arquivo de capítulos (chapters.md).
 * - `validateBundle`: valida o conjunto (ids únicos, pré-requisitos, ciclos,
 *   consistência com capítulos).
 */
import type {
  SQLContentBundle,
  SQLContentChapter,
  SQLContentIssue,
} from "./types";

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const URL_RE = /^https?:\/\/\S+$/i;
const DIFFICULTIES = ["iniciante", "intermediario", "avancado"] as const;
const HEADING_RE = /^#{1,6}\s+/m;
const IMAGE_SRC_RE = /^[a-zA-Z0-9_\-./]+$/;
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;
const PATH_TRAVERSAL_RE = /(^|\/)\.\.(\/|$)/;

/**
 * Um caminho de imagem é "local seguro" quando:
 * - é relativo (não começa com `/`);
 * - não contém segmento `..` (sem path traversal);
 * - não tem scheme (http:, data:, etc.);
 * - usa apenas caracteres seguros e termina em extensão de imagem.
 */
export function isSafeImageSrc(src: string): boolean {
  if (src === "") return false;
  if (src.startsWith("/")) return false;
  if (PATH_TRAVERSAL_RE.test(src)) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src)) return false;
  if (!IMAGE_SRC_RE.test(src)) return false;
  if (!IMAGE_EXT_RE.test(src)) return false;
  return true;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}
function isInteger(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v);
}

function issue(file: string, message: string, field?: string): SQLContentIssue {
  return { file, severity: "error", message, field };
}

// ---------------------------------------------------------------------------
// Lição
// ---------------------------------------------------------------------------

/** Valida um documento de lição (dados do front matter + corpo). */
export function validateLessonDocument(
  data: Record<string, unknown>,
  body: string,
  file: string
): SQLContentIssue[] {
  const issues: SQLContentIssue[] = [];
  const err = (message: string, field?: string) => {
    issues.push(issue(file, message, field));
  };

  // id semântico
  if (!isNonEmptyString(data.id)) {
    err("Campo obrigatório 'id' ausente ou vazio.", "id");
  } else if (!ID_RE.test(data.id)) {
    err(
      `'id' inválido: "${data.id}". Use minúsculas e hífens (ex.: select-01).`,
      "id"
    );
  } else if (data.id.length > 64) {
    err("'id' muito longo (máx. 64 caracteres).", "id");
  }

  if (!isNonEmptyString(data.title)) {
    err("Campo obrigatório 'title' ausente ou vazio.", "title");
  }
  if (!isNonEmptyString(data.summary)) {
    err("Campo obrigatório 'summary' ausente ou vazio.", "summary");
  }

  if (!isInteger(data.chapter) || data.chapter < 1) {
    err("Campo obrigatório 'chapter' deve ser um inteiro >= 1.", "chapter");
  }

  if (!isNonEmptyString(data.chapterSlug)) {
    err("Campo obrigatório 'chapterSlug' ausente ou vazio.", "chapterSlug");
  } else if (!SLUG_RE.test(data.chapterSlug)) {
    err(
      `'chapterSlug' inválido: "${data.chapterSlug}". Use minúsculas e hífens.`,
      "chapterSlug"
    );
  }

  if (!isInteger(data.lesson) || data.lesson < 1) {
    err("Campo obrigatório 'lesson' deve ser um inteiro >= 1.", "lesson");
  }

  if (!isString(data.difficulty) || !(DIFFICULTIES as readonly string[]).includes(data.difficulty)) {
    err(
      `'difficulty' inválido: esperado um de ${DIFFICULTIES.join(", ")}.`,
      "difficulty"
    );
  }

  if (!isInteger(data.xp) || data.xp < 1) {
    err("Campo obrigatório 'xp' deve ser um inteiro >= 1.", "xp");
  }

  // pré-requisitos
  if (data.prerequisites !== undefined) {
    if (!Array.isArray(data.prerequisites)) {
      err("'prerequisites' deve ser uma lista.", "prerequisites");
    } else {
      data.prerequisites.forEach((p, idx) => {
        if (!isNonEmptyString(p)) {
          err(`'prerequisites[${idx}]' deve ser uma string não vazia.`, "prerequisites");
        } else if (!ID_RE.test(p)) {
          err(`'prerequisites[${idx}]' inválido: "${p}".`, "prerequisites");
        }
      });
      if (isString(data.id) && data.prerequisites.includes(data.id)) {
        err("'prerequisites' não pode incluir a própria lição.", "prerequisites");
      }
    }
  }

  // dicas
  if (data.hints !== undefined) {
    if (!Array.isArray(data.hints)) {
      err("'hints' deve ser uma lista.", "hints");
    } else {
      data.hints.forEach((h, idx) => {
        if (!isNonEmptyString(h)) {
          err(`'hints[${idx}]' deve ser uma string não vazia.`, "hints");
        }
      });
    }
  }

  // referências SQL
  if (data.references !== undefined) {
    if (!Array.isArray(data.references)) {
      err("'references' deve ser uma lista.", "references");
    } else {
      data.references.forEach((r, idx) => {
        if (!isRecord(r)) {
          err(`'references[${idx}]' deve ser um objeto { label, url }.`, "references");
          return;
        }
        if (!isNonEmptyString(r.label)) {
          err(`'references[${idx}].label' ausente ou vazio.`, "references");
        }
        if (!isNonEmptyString(r.url)) {
          err(`'references[${idx}].url' ausente ou vazio.`, "references");
        } else if (!URL_RE.test(r.url)) {
          err(
            `'references[${idx}].url' não é uma URL http(s) válida: "${r.url}".`,
            "references"
          );
        }
      });
    }
  }

  // setupSql — obrigatório apenas para desafios executáveis (exact/schema)
  const challengeKind = isRecord(data.challenge) ? data.challenge.kind : undefined;
  const hasExecutableChallenge =
    challengeKind === "exact" || challengeKind === "schema";
  if (hasExecutableChallenge) {
    if (!isNonEmptyString(data.setupSql)) {
      err(
        "Campo obrigatório 'setupSql' ausente ou vazio para desafios exact/schema.",
        "setupSql"
      );
    }
  } else if (data.setupSql !== undefined && !isNonEmptyString(data.setupSql)) {
    err("'setupSql' deve ser uma string não vazia quando presente.", "setupSql");
  }

  // schema inicial
  if (data.tables !== undefined) {
    if (!Array.isArray(data.tables)) {
      err("'tables' deve ser uma lista.", "tables");
    } else {
      data.tables.forEach((t, idx) =>
        validateTableShape(t, `tables[${idx}]`, file, issues)
      );
    }
  }

  // imagens (metadados por unidade)
  if (data.images !== undefined) {
    if (!Array.isArray(data.images)) {
      err("'images' deve ser uma lista.", "images");
    } else {
      data.images.forEach((img, idx) => {
        const imf = `images[${idx}]`;
        if (!isRecord(img)) {
          err(`${imf} deve ser um objeto { alt, src }.`, "images");
          return;
        }
        if (!isNonEmptyString(img.alt)) {
          err(`${imf}.alt ausente ou vazio.`, "images");
        }
        if (!isNonEmptyString(img.src)) {
          err(`${imf}.src ausente ou vazio.`, "images");
        } else if (!isSafeImageSrc(img.src)) {
          err(
            `${imf}.src não é um caminho local seguro: "${img.src}". Use caminho relativo (ex.: sql_logos.png), sem "..", sem scheme e com extensão de imagem.`,
            "images"
          );
        }
      });
    }
  }

  // desafio — ausente (ou null) em unidades theory
  if (data.challenge === undefined || data.challenge === null) {
    // unidade theory: sem desafio executável
  } else if (!isRecord(data.challenge)) {
    err("Campo 'challenge' inválido: deve ser um objeto.", "challenge");
  } else {
    validateChallenge(data.challenge, file, issues);
  }

  // corpo Markdown
  if (body.trim() === "") {
    err(
      "Corpo Markdown vazio: escreva a narrativa da lição após o front matter.",
      "body"
    );
  } else if (!HEADING_RE.test(body)) {
    err(
      "Corpo Markdown deve conter ao menos um título (ex.: ## Contexto).",
      "body"
    );
  }

  return issues;
}

function validateTableShape(
  value: unknown,
  field: string,
  file: string,
  issues: SQLContentIssue[]
): void {
  const err = (message: string, f?: string) => {
    issues.push(issue(file, message, f ?? field));
  };
  if (!isRecord(value)) {
    err(`${field} deve ser um objeto { name, columns }.`);
    return;
  }
  if (!isNonEmptyString(value.name)) {
    err(`${field}.name ausente ou vazio.`);
  }
  if (value.columns !== undefined) {
    if (!Array.isArray(value.columns)) {
      err(`${field}.columns deve ser uma lista.`);
    } else {
      value.columns.forEach((c, idx) => {
        const cf = `${field}.columns[${idx}]`;
        if (!isRecord(c)) {
          err(`${cf} deve ser um objeto.`);
          return;
        }
        if (!isNonEmptyString(c.name)) err(`${cf}.name ausente ou vazio.`);
        if (c.type !== undefined && !isNonEmptyString(c.type)) {
          err(`${cf}.type deve ser uma string.`);
        }
        for (const flag of ["notNull", "primaryKey", "unique"] as const) {
          if (c[flag] !== undefined && typeof c[flag] !== "boolean") {
            err(`${cf}.${flag} deve ser booleano.`);
          }
        }
        if (c.references !== undefined) {
          if (!isRecord(c.references) || !isNonEmptyString(c.references.table)) {
            err(`${cf}.references deve ser { table, column? }.`);
          }
        }
      });
    }
  }
}

function validateChallenge(
  value: Record<string, unknown>,
  file: string,
  issues: SQLContentIssue[]
): void {
  const err = (message: string, field?: string) => {
    issues.push(issue(file, message, field));
  };

  if (!isNonEmptyString(value.instruction)) {
    err("'challenge.instruction' ausente ou vazio.", "challenge.instruction");
  }

  if (value.kind === "exact") {
    if (!Array.isArray(value.expectedColumns) || value.expectedColumns.length === 0) {
      err(
        "'challenge.expectedColumns' deve ser uma lista não vazia de nomes de colunas.",
        "challenge.expectedColumns"
      );
    } else {
      value.expectedColumns.forEach((c, idx) => {
        if (!isNonEmptyString(c)) {
          err(
            `'challenge.expectedColumns[${idx}]' deve ser uma string não vazia.`,
            "challenge.expectedColumns"
          );
        }
      });
    }
    if (!Array.isArray(value.expectedRows)) {
      err(
        "'challenge.expectedRows' deve ser uma lista de linhas.",
        "challenge.expectedRows"
      );
    } else {
      value.expectedRows.forEach((row, idx) => {
        if (!Array.isArray(row)) {
          err(
            `'challenge.expectedRows[${idx}]' deve ser uma lista de valores.`,
            "challenge.expectedRows"
          );
        } else {
          row.forEach((cell, j) => {
            if (!(cell === null || typeof cell === "string" || typeof cell === "number")) {
              err(
                `'challenge.expectedRows[${idx}][${j}]' deve ser string, número ou null.`,
                "challenge.expectedRows"
              );
            }
          });
        }
      });
    }
    if (value.orderSensitive !== undefined && typeof value.orderSensitive !== "boolean") {
      err("'challenge.orderSensitive' deve ser booleano.", "challenge.orderSensitive");
    }
  } else if (value.kind === "schema") {
    if (!Array.isArray(value.expectedTables) || value.expectedTables.length === 0) {
      err(
        "'challenge.expectedTables' deve ser uma lista não vazia de tabelas esperadas.",
        "challenge.expectedTables"
      );
    } else {
      value.expectedTables.forEach((t, idx) =>
        validateExpectedTable(t, `challenge.expectedTables[${idx}]`, file, issues)
      );
    }
  } else if (value.kind === "data") {
    validateDataChallenge(value, file, issues);
  } else if (value.kind === "quiz") {
    validateQuizChallenge(value, file, issues);
  } else {
    err(
      `'challenge.kind' inválido: "${String(value.kind)}". Esperado "exact", "schema" ou "quiz".`,
      "challenge.kind"
    );
  }
}

function validateQuizChallenge(
  value: Record<string, unknown>,
  file: string,
  issues: SQLContentIssue[]
): void {
  const err = (message: string, field?: string) => {
    issues.push(issue(file, message, field));
  };

  if (!Array.isArray(value.questions) || value.questions.length === 0) {
    err(
      "'challenge.questions' deve ser uma lista não vazia de perguntas.",
      "challenge.questions"
    );
    return;
  }

  value.questions.forEach((q, idx) => {
    const qf = `challenge.questions[${idx}]`;
    if (!isRecord(q)) {
      err(`${qf} deve ser um objeto { prompt, options, answer, explanation? }.`, qf);
      return;
    }
    if (!isNonEmptyString(q.prompt)) {
      err(`${qf}.prompt ausente ou vazio.`, qf);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      err(`${qf}.options deve ter ao menos 2 opções.`, qf);
    } else {
      q.options.forEach((o, oi) => {
        if (!isNonEmptyString(o)) {
          err(`${qf}.options[${oi}] deve ser uma string não vazia.`, qf);
        }
      });
    }
    if (!isInteger(q.answer)) {
      err(`${qf}.answer deve ser um inteiro (índice 0-based da opção correta).`, qf);
    } else if (
      Array.isArray(q.options) &&
      (q.answer < 0 || q.answer >= q.options.length)
    ) {
      err(
        `${qf}.answer (${q.answer}) está fora do intervalo de options (0..${q.options.length - 1}).`,
        qf
      );
    }
    if (q.explanation !== undefined && !isNonEmptyString(q.explanation)) {
      err(`${qf}.explanation deve ser uma string não vazia.`, qf);
    }
  });
}

/**
 * Valida um desafio `data` (estado final de tabelas após INSERT/UPDATE/DELETE):
 * `expectedTables` não vazia; cada tabela com `name`, `columns` (na ordem) e
 * `rows` (células string/número/null); `orderSensitive` booleano opcional.
 */
function validateDataChallenge(
  value: Record<string, unknown>,
  file: string,
  issues: SQLContentIssue[]
): void {
  const err = (message: string, field?: string) => {
    issues.push(issue(file, message, field));
  };

  if (!Array.isArray(value.expectedTables) || value.expectedTables.length === 0) {
    err(
      "'challenge.expectedTables' deve ser uma lista não vazia de tabelas esperadas.",
      "challenge.expectedTables"
    );
    return;
  }

  value.expectedTables.forEach((t, idx) => {
    const tf = `challenge.expectedTables[${idx}]`;
    if (!isRecord(t)) {
      err(`${tf} deve ser um objeto { name, columns, rows }.`, tf);
      return;
    }
    if (!isNonEmptyString(t.name)) {
      err(`${tf}.name ausente ou vazio.`, tf);
    }
    if (!Array.isArray(t.columns) || t.columns.length === 0) {
      err(`${tf}.columns deve ser uma lista não vazia de nomes de colunas.`, tf);
    } else {
      t.columns.forEach((c, ci) => {
        if (!isNonEmptyString(c)) {
          err(`${tf}.columns[${ci}] deve ser uma string não vazia.`, tf);
        }
      });
    }
    if (!Array.isArray(t.rows)) {
      err(`${tf}.rows deve ser uma lista de linhas.`, tf);
    } else {
      t.rows.forEach((row, ri) => {
        if (!Array.isArray(row)) {
          err(`${tf}.rows[${ri}] deve ser uma lista de valores.`, tf);
        } else {
          row.forEach((cell, ci) => {
            if (!(cell === null || typeof cell === "string" || typeof cell === "number")) {
              err(
                `${tf}.rows[${ri}][${ci}] deve ser string, número ou null.`,
                tf
              );
            }
          });
        }
      });
    }
    if (t.orderSensitive !== undefined && typeof t.orderSensitive !== "boolean") {
      err(`${tf}.orderSensitive deve ser booleano.`, tf);
    }
  });
}

function validateExpectedTable(
  value: unknown,
  field: string,
  file: string,
  issues: SQLContentIssue[]
): void {
  const err = (message: string, f?: string) => {
    issues.push(issue(file, message, f ?? field));
  };
  if (!isRecord(value)) {
    err(`${field} deve ser um objeto { name, columns?, foreignKeys?, forbidColumns? }.`);
    return;
  }
  if (!isNonEmptyString(value.name)) {
    err(`${field}.name ausente ou vazio.`);
  }
  if (value.columns !== undefined) {
    if (!Array.isArray(value.columns)) {
      err(`${field}.columns deve ser uma lista.`);
    } else {
      value.columns.forEach((c, idx) => {
        const cf = `${field}.columns[${idx}]`;
        if (!isRecord(c)) {
          err(`${cf} deve ser um objeto.`);
          return;
        }
        if (!isNonEmptyString(c.name)) err(`${cf}.name ausente ou vazio.`);
        if (c.type !== undefined && !isNonEmptyString(c.type)) {
          err(`${cf}.type deve ser uma string.`);
        }
        for (const flag of ["notNull", "primaryKey", "unique"] as const) {
          if (c[flag] !== undefined && typeof c[flag] !== "boolean") {
            err(`${cf}.${flag} deve ser booleano.`);
          }
        }
        if (c.references !== undefined) {
          if (!isRecord(c.references) || !isNonEmptyString(c.references.table)) {
            err(`${cf}.references deve ser { table, column? }.`);
          }
        }
      });
    }
  }
  if (value.foreignKeys !== undefined) {
    if (!Array.isArray(value.foreignKeys)) {
      err(`${field}.foreignKeys deve ser uma lista.`);
    } else {
      value.foreignKeys.forEach((fk, idx) => {
        const ff = `${field}.foreignKeys[${idx}]`;
        if (!isRecord(fk)) {
          err(`${ff} deve ser um objeto.`);
          return;
        }
        if (
          !Array.isArray(fk.columns) ||
          fk.columns.length === 0 ||
          !fk.columns.every(isNonEmptyString)
        ) {
          err(`${ff}.columns deve ser uma lista não vazia de strings.`);
        }
        if (!isNonEmptyString(fk.table)) {
          err(`${ff}.table ausente ou vazio.`);
        }
        if (
          fk.referencedColumns !== undefined &&
          (!Array.isArray(fk.referencedColumns) || !fk.referencedColumns.every(isNonEmptyString))
        ) {
          err(`${ff}.referencedColumns deve ser uma lista de strings.`);
        }
      });
    }
  }
  if (value.forbidColumns !== undefined) {
    if (!Array.isArray(value.forbidColumns) || !value.forbidColumns.every(isNonEmptyString)) {
      err(`${field}.forbidColumns deve ser uma lista de strings.`);
    }
  }
}

// ---------------------------------------------------------------------------
// Capítulos
// ---------------------------------------------------------------------------

/** Valida o documento de capítulos (chapters.md). */
export function validateChapterDocument(
  data: Record<string, unknown>,
  file: string
): SQLContentIssue[] {
  const issues: SQLContentIssue[] = [];
  const err = (message: string, field?: string) => {
    issues.push(issue(file, message, field));
  };

  if (data.version !== undefined) {
    if (!isNonEmptyString(data.version) || !SEMVER_RE.test(data.version)) {
      err("'version' deve seguir o padrão semver (ex.: 1.0.0).", "version");
    }
  }

  if (!Array.isArray(data.chapters) || data.chapters.length === 0) {
    err("Campo obrigatório 'chapters' deve ser uma lista não vazia.", "chapters");
    return issues;
  }

  const seenNumbers = new Set<number>();
  const seenSlugs = new Set<string>();
  data.chapters.forEach((c, idx) => {
    const cf = `chapters[${idx}]`;
    if (!isRecord(c)) {
      err(`${cf} deve ser um objeto { number, slug, title, description }.`);
      return;
    }
    if (!isInteger(c.number) || c.number < 1) {
      err(`${cf}.number deve ser um inteiro >= 1.`);
    } else if (seenNumbers.has(c.number)) {
      err(`${cf}.number duplicado: ${c.number}.`);
    } else {
      seenNumbers.add(c.number);
    }
    if (!isNonEmptyString(c.slug)) {
      err(`${cf}.slug ausente ou vazio.`);
    } else if (!SLUG_RE.test(c.slug)) {
      err(`${cf}.slug inválido: "${c.slug}".`);
    } else if (seenSlugs.has(c.slug)) {
      err(`${cf}.slug duplicado: ${c.slug}.`);
    } else {
      seenSlugs.add(c.slug);
    }
    if (!isNonEmptyString(c.title)) {
      err(`${cf}.title ausente ou vazio.`);
    }
    if (!isNonEmptyString(c.description)) {
      err(`${cf}.description ausente ou vazio.`);
    }
  });

  return issues;
}

// ---------------------------------------------------------------------------
// Bundle (conjunto)
// ---------------------------------------------------------------------------

/** Valida o conjunto: ids únicos, posições, pré-requisitos e ciclos. */
export function validateBundle(bundle: SQLContentBundle): SQLContentIssue[] {
  const issues: SQLContentIssue[] = [];
  const err = (message: string, file: string, field?: string) => {
    issues.push(issue(file, message, field));
  };

  const chapterByNumber = new Map<number, SQLContentChapter>();
  for (const chapter of bundle.chapters) {
    chapterByNumber.set(chapter.number, chapter);
  }

  const lessonIds = new Set<string>();
  const positionByChapter = new Map<number, Set<number>>();
  for (const lesson of bundle.lessons) {
    if (lessonIds.has(lesson.id)) {
      err(`ID de lição duplicado: "${lesson.id}".`, lesson.sourcePath, "id");
    }
    lessonIds.add(lesson.id);

    const chapter = chapterByNumber.get(lesson.chapter);
    if (!chapter) {
      err(
        `'chapter' ${lesson.chapter} não existe em chapters.md.`,
        lesson.sourcePath,
        "chapter"
      );
    } else if (chapter.slug !== lesson.chapterSlug) {
      err(
        `'chapterSlug' "${lesson.chapterSlug}" não confere com o capítulo ${lesson.chapter} ("${chapter.slug}").`,
        lesson.sourcePath,
        "chapterSlug"
      );
    }

    const positions = positionByChapter.get(lesson.chapter) ?? new Set<number>();
    if (positions.has(lesson.lesson)) {
      err(
        `Posição duplicada no capítulo ${lesson.chapter}: lição ${lesson.lesson}.`,
        lesson.sourcePath,
        "lesson"
      );
    }
    positions.add(lesson.lesson);
    positionByChapter.set(lesson.chapter, positions);
  }

  // pré-requisitos devem existir
  for (const lesson of bundle.lessons) {
    for (const prereq of lesson.prerequisites) {
      if (!lessonIds.has(prereq)) {
        err(
          `Pré-requisito "${prereq}" não existe entre as lições.`,
          lesson.sourcePath,
          "prerequisites"
        );
      }
    }
  }

  // ciclos de pré-requisitos (DFS com detecção de ciclo)
  const byId = new Map(bundle.lessons.map((l) => [l.id, l] as const));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string, path: string[]): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      const cycle = [...path, id].join(" -> ");
      err(
        `Ciclo de pré-requisitos detectado: ${cycle}.`,
        byId.get(id)?.sourcePath ?? "",
        "prerequisites"
      );
      return;
    }
    visiting.add(id);
    const lesson = byId.get(id);
    if (lesson) {
      for (const prereq of lesson.prerequisites) {
        visit(prereq, [...path, id]);
      }
    }
    visiting.delete(id);
    visited.add(id);
  };
  for (const lesson of bundle.lessons) {
    visit(lesson.id, []);
  }

  return issues;
}