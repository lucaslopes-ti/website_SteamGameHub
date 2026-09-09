/**
 * Testes do validador da base de conteúdo da SQL Quest.
 *
 * Usa as fixtures em `content/sql-quest/fixtures/` (válidas e inválidas).
 *
 * @jest-environment node
 */
import fs from "node:fs";
import path from "node:path";
import { parseFrontMatter } from "@/lib/sql-quest/content/frontmatter";
import {
  validateLessonDocument,
  validateChapterDocument,
  validateBundle,
} from "@/lib/sql-quest/content/validate";
import { loadContentDirectory } from "@/lib/sql-quest/content/loader";

const FIXTURES = path.resolve(process.cwd(), "content/sql-quest/fixtures");

function readLesson(file: string) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, body } = parseFrontMatter(raw);
  return { data, body, file };
}

function issuesForInvalidLesson(file: string) {
  const { data, body } = readLesson(path.join(FIXTURES, "invalid", "lessons", file));
  return validateLessonDocument(data, body, file);
}

describe("validateLessonDocument — lições válidas", () => {
  it("aceita uma lição com desafio exact", () => {
    const { data, body } = readLesson(
      path.join(FIXTURES, "valid", "lessons", "select-01.md")
    );
    expect(validateLessonDocument(data, body, "select-01.md")).toEqual([]);
  });

  it("aceita uma lição com desafio schema (CREATE TABLE)", () => {
    const { data, body } = readLesson(
      path.join(FIXTURES, "valid", "lessons", "tabelas-01.md")
    );
    expect(validateLessonDocument(data, body, "tabelas-01.md")).toEqual([]);
  });

  it("aceita uma lição com forbidColumns e foreignKeys", () => {
    const { data, body } = readLesson(
      path.join(FIXTURES, "valid", "lessons", "tabelas-02.md")
    );
    expect(validateLessonDocument(data, body, "tabelas-02.md")).toEqual([]);
    const { data: data3, body: body3 } = readLesson(
      path.join(FIXTURES, "valid", "lessons", "restricoes-01.md")
    );
    expect(validateLessonDocument(data3, body3, "restricoes-01.md")).toEqual([]);
  });

  it("aceita uma unidade com desafio quiz", () => {
    const { data, body } = readLesson(
      path.join(FIXTURES, "valid", "lessons", "quiz-01.md")
    );
    expect(validateLessonDocument(data, body, "quiz-01.md")).toEqual([]);
  });

  it("aceita uma unidade theory (sem challenge) com imagens", () => {
    const { data, body } = readLesson(
      path.join(FIXTURES, "valid", "lessons", "teoria-01.md")
    );
    expect(validateLessonDocument(data, body, "teoria-01.md")).toEqual([]);
  });
});

describe("validateLessonDocument — lições inválidas", () => {
  it("rejeita lição sem id", () => {
    const issues = issuesForInvalidLesson("missing-id.md");
    expect(issues.some((i) => i.field === "id")).toBe(true);
  });

  it("rejeita id fora do padrão semântico", () => {
    const issues = issuesForInvalidLesson("bad-id.md");
    expect(issues.some((i) => i.field === "id")).toBe(true);
  });

  it("rejeita xp não positivo", () => {
    const issues = issuesForInvalidLesson("bad-xp.md");
    expect(issues.some((i) => i.field === "xp")).toBe(true);
  });

  it("rejeita challenge.kind desconhecido", () => {
    const issues = issuesForInvalidLesson("bad-challenge.md");
    expect(issues.some((i) => i.field === "challenge.kind")).toBe(true);
  });

  it("rejeita expectedRows malformado", () => {
    const issues = issuesForInvalidLesson("bad-rows.md");
    expect(issues.some((i) => i.field === "challenge.expectedRows")).toBe(true);
  });

  it("rejeita corpo Markdown vazio", () => {
    const issues = issuesForInvalidLesson("empty-body.md");
    expect(issues.some((i) => i.field === "body")).toBe(true);
  });

  it("rejeita lição sem setupSql", () => {
    const issues = issuesForInvalidLesson("bad-setup.md");
    expect(issues.some((i) => i.field === "setupSql")).toBe(true);
  });
});

describe("validateLessonDocument — quiz, theory e imagens", () => {
  it("rejeita quiz com answer fora do intervalo de options", () => {
    const issues = issuesForInvalidLesson("bad-quiz.md");
    expect(issues.some((i) => i.field?.startsWith("challenge.questions"))).toBe(true);
    expect(issues.some((i) => i.message.includes("fora do intervalo"))).toBe(true);
  });

  it("rejeita quiz com options vazias", () => {
    const issues = issuesForInvalidLesson("bad-quiz-options.md");
    expect(issues.some((i) => i.message.includes("ao menos 2 opções"))).toBe(true);
  });

  it("rejeita imagem com src remoto (scheme http)", () => {
    const issues = issuesForInvalidLesson("bad-image.md");
    expect(issues.some((i) => i.field === "images")).toBe(true);
    expect(issues.some((i) => i.message.includes("caminho local seguro"))).toBe(true);
  });

  it("rejeita imagem com path traversal (..)", () => {
    const issues = issuesForInvalidLesson("bad-image-path.md");
    expect(issues.some((i) => i.field === "images")).toBe(true);
  });

  it("rejeita challenge presente mas vazio", () => {
    const issues = issuesForInvalidLesson("bad-challenge-empty.md");
    expect(issues.some((i) => i.field === "challenge.kind")).toBe(true);
  });

  it("aceita unidade theory sem challenge e sem setupSql", () => {
    const issues = validateLessonDocument(
      {
        id: "teoria-x",
        title: "Teoria",
        summary: "Resumo",
        chapter: 1,
        chapterSlug: "select",
        lesson: 9,
        difficulty: "iniciante",
        xp: 10,
        prerequisites: [],
        hints: [],
        references: [],
        images: [{ alt: "Figura", src: "fig.png" }],
      },
      "## Contexto\n\nTexto.",
      "teoria-x.md"
    );
    expect(issues).toEqual([]);
  });

  it("rejeita imagem com alt vazio", () => {
    const issues = validateLessonDocument(
      {
        id: "teoria-x",
        title: "Teoria",
        summary: "Resumo",
        chapter: 1,
        chapterSlug: "select",
        lesson: 9,
        difficulty: "iniciante",
        xp: 10,
        prerequisites: [],
        hints: [],
        references: [],
        images: [{ alt: "", src: "fig.png" }],
      },
      "## Contexto\n\nTexto.",
      "teoria-x.md"
    );
    expect(issues.some((i) => i.field === "images")).toBe(true);
  });
});

describe("validateChapterDocument", () => {
  it("aceita chapters.md válido", () => {
    const raw = fs.readFileSync(path.join(FIXTURES, "valid", "chapters.md"), "utf8");
    const { data } = parseFrontMatter(raw);
    expect(validateChapterDocument(data, "chapters.md")).toEqual([]);
  });

  it("rejeita version fora do padrão semver", () => {
    const issues = validateChapterDocument(
      { version: "abc", chapters: [{ number: 1, slug: "a", title: "A", description: "D" }] },
      "chapters.md"
    );
    expect(issues.some((i) => i.field === "version")).toBe(true);
  });

  it("rejeita capítulos duplicados", () => {
    const issues = validateChapterDocument(
      {
        chapters: [
          { number: 1, slug: "a", title: "A", description: "D" },
          { number: 1, slug: "b", title: "B", description: "D" },
        ],
      },
      "chapters.md"
    );
    expect(issues.some((i) => i.message.includes("duplicado"))).toBe(true);
  });
});

describe("validateBundle", () => {
  it("aceita o bundle válido", () => {
    const { bundle } = loadContentDirectory(path.join(FIXTURES, "valid"));
    expect(validateBundle(bundle)).toEqual([]);
  });

  it("detecta pré-requisito inexistente", () => {
    const { bundle } = loadContentDirectory(path.join(FIXTURES, "invalid-bundle"));
    const issues = validateBundle(bundle);
    expect(issues.some((i) => i.message.includes("não existe"))).toBe(true);
  });

  it("detecta ciclo de pré-requisitos", () => {
    const { bundle } = loadContentDirectory(path.join(FIXTURES, "invalid-bundle"));
    const issues = validateBundle(bundle);
    expect(issues.some((i) => i.message.includes("Ciclo"))).toBe(true);
  });

  it("detecta chapterSlug inconsistente com chapters.md", () => {
    const { bundle } = loadContentDirectory(path.join(FIXTURES, "valid"));
    const mutated = {
      ...bundle,
      lessons: bundle.lessons.map((l) =>
        l.id === "select-01" ? { ...l, chapterSlug: "errado" } : l
      ),
    };
    const issues = validateBundle(mutated);
    expect(issues.some((i) => i.field === "chapterSlug")).toBe(true);
  });
});