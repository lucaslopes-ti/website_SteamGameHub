/**
 * Testes do loader e do build-time da base de conteúdo da SQL Quest.
 *
 * Usa as fixtures em `content/sql-quest/fixtures/`.
 *
 * @jest-environment node
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  loadContentDirectory,
  loadLessonFile,
  loadChapterFile,
} from "@/lib/sql-quest/content/loader";
import { buildContentBundle } from "@/lib/sql-quest/content/build";

const FIXTURES = path.resolve(process.cwd(), "content/sql-quest/fixtures");

describe("loadContentDirectory", () => {
  it("carrega capítulos e lições do bundle válido", () => {
    const { bundle, parseErrors } = loadContentDirectory(path.join(FIXTURES, "valid"));
    expect(parseErrors).toEqual([]);
    expect(bundle.version).toBe("1.0.0");
    expect(bundle.chapters.length).toBe(3);
    expect(bundle.lessons.length).toBeGreaterThanOrEqual(3);

    const select = bundle.lessons.find((l) => l.id === "select-01");
    expect(select?.challenge?.kind).toBe("exact");
    expect(select?.setupSql).toContain("CREATE TABLE clientes");
    expect(select?.body).toContain("## Contexto");
    expect(select?.xp).toBe(50);
    expect(select?.prerequisites).toEqual([]);
    expect(select?.references[0].url).toMatch(/^https?:\/\//);

    const restricoes = bundle.lessons.find((l) => l.id === "restricoes-01");
    expect(restricoes?.challenge?.kind).toBe("schema");
    if (restricoes?.challenge?.kind === "schema") {
      expect(restricoes.challenge.expectedTables[0].foreignKeys).toHaveLength(1);
    }

    const quiz = bundle.lessons.find((l) => l.id === "quiz-01");
    expect(quiz?.challenge?.kind).toBe("quiz");
    if (quiz?.challenge?.kind === "quiz") {
      expect(quiz.challenge.questions.length).toBeGreaterThanOrEqual(2);
      expect(quiz.challenge.questions[0].options.length).toBeGreaterThanOrEqual(2);
      expect(quiz.challenge.questions[0].answer).toBeGreaterThanOrEqual(0);
      expect(quiz.challenge.questions[0].explanation).toBeTruthy();
    }
    expect(quiz?.images[0].src).toBe("sql_logos.png");

    const teoria = bundle.lessons.find((l) => l.id === "teoria-01");
    expect(teoria?.challenge).toBeUndefined();
    expect(teoria?.images[0].alt).toBeTruthy();
  });

  it("coleta erros de parse por arquivo sem lançar", () => {
    const { parseErrors } = loadContentDirectory(path.join(FIXTURES, "invalid"));
    expect(parseErrors.length).toBeGreaterThan(0);
    expect(parseErrors.some((e) => e.file.endsWith("bad-frontmatter.md"))).toBe(true);
  });
});

describe("loadLessonFile / loadChapterFile", () => {
  it("parseia um arquivo de lição individual", () => {
    const lesson = loadLessonFile(
      path.join(FIXTURES, "valid", "lessons", "select-01.md")
    );
    expect(lesson.id).toBe("select-01");
    expect(lesson.chapter).toBe(1);
    expect(lesson.chapterSlug).toBe("select");
    expect(lesson.difficulty).toBe("iniciante");
    expect(lesson.hints.length).toBeGreaterThan(0);
  });

  it("parseia o arquivo de capítulos", () => {
    const chapters = loadChapterFile(path.join(FIXTURES, "valid", "chapters.md"));
    expect(chapters.map((c) => c.number)).toEqual([1, 2, 3]);
    expect(chapters[0].slug).toBe("select");
  });
});

describe("buildContentBundle", () => {
  it("reporta ok=true para o bundle válido", () => {
    const result = buildContentBundle(path.join(FIXTURES, "valid"));
    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("reporta erros para o bundle inválido (pré-requisitos)", () => {
    const result = buildContentBundle(path.join(FIXTURES, "invalid-bundle"));
    expect(result.ok).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues.some((i) => i.message.includes("Ciclo"))).toBe(true);
    expect(result.issues.some((i) => i.message.includes("não existe"))).toBe(true);
  });

  it("reporta erros de validação e de parse para as lições inválidas", () => {
    const result = buildContentBundle(path.join(FIXTURES, "invalid"));
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.field === "id")).toBe(true);
    expect(result.issues.some((i) => i.field === "xp")).toBe(true);
    expect(result.issues.some((i) => i.field === "body")).toBe(true);
    expect(result.issues.some((i) => i.file.endsWith("bad-frontmatter.md"))).toBe(true);
  });

  it("reporta imagem referenciada mas ausente no diretório images/", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sql-quest-content-"));
    try {
      fs.mkdirSync(path.join(tmp, "lessons"));
      fs.writeFileSync(
        path.join(tmp, "chapters.md"),
        "---\nchapters:\n  - number: 1\n    slug: select\n    title: A\n    description: D\n---\n"
      );
      fs.writeFileSync(
        path.join(tmp, "lessons", "teoria-x.md"),
        `---
id: teoria-x
title: "Teoria"
summary: "Resumo"
chapter: 1
chapterSlug: select
lesson: 1
difficulty: iniciante
xp: 10
prerequisites: []
hints: []
references: []
images:
  - alt: "Figura"
    src: "nao-existe.png"
---

## Contexto

Texto.
`
      );
      const result = buildContentBundle(tmp);
      expect(result.ok).toBe(false);
      expect(result.issues.some((i) => i.message.includes("Imagem não encontrada"))).toBe(true);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});