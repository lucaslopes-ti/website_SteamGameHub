/**
 * Testes do catálogo da SQL Quest (dados + navegação).
 *
 * O catálogo é gerado a partir de `content/sql-quest/lessons/*.md` (ids
 * semânticos). `getLessonById` também aceita ids legados/posicionais
 * "capitulo-licao" (ex.: "1-1") via a migração explícita.
 *
 * Camada pura: não depende de sql.js nem de Firebase.
 *
 * @jest-environment node
 */
import {
  chapters,
  lessons,
  totalChapters,
  totalLessons,
  getChapter,
  getChapterCount,
  getLesson,
  getLessonById,
  getLessonCount,
  getLessonsPerChapter,
  getNextLesson,
  getPreviousLesson,
} from "@/lib/sql-quest/catalog";

describe("catálogo — capítulos", () => {
  it("define exatamente os capítulos esperados", () => {
    expect(totalChapters).toBe(11);
    expect(getChapterCount()).toBe(11);
  });

  it("está ordenado por número e tem metadados completos", () => {
    // A trilha preserva os números históricos dos capítulos; com a expansão,
    // a sequência atual vai de 1 a 11 sem lacunas.
    expect(chapters.map((c) => c.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
    expect(chapters.map((c) => c.slug)).toEqual([
      "select",
      "tabelas",
      "restricoes",
      "crud",
      "filtros",
      "ordenacao",
      "agregacao",
      "subqueries",
      "normalizacao",
      "joins",
      "performance",
    ]);
    for (const chapter of chapters) {
      expect(chapter.slug).toBeTruthy();
      expect(chapter.title).toBeTruthy();
      expect(chapter.description).toBeTruthy();
    }
  });

  it("getChapter devolve o capítulo certo ou null", () => {
    expect(getChapter(2)?.slug).toBe("tabelas");
    expect(getChapter(4)?.slug).toBe("crud");
    expect(getChapter(6)?.slug).toBe("ordenacao");
    expect(getChapter(9)?.slug).toBe("normalizacao");
    expect(getChapter(11)?.slug).toBe("performance");
    expect(getChapter(0)).toBeNull();
    expect(getChapter(99)).toBeNull();
    expect(getChapter(1.5)).toBeNull();
  });
});

describe("catálogo — lições", () => {
  it("tem 95 lições (7+10+8+13+11+6+9+5+11+10+5)", () => {
    expect(totalLessons).toBe(95);
    expect(getLessonCount()).toBe(totalLessons);
    expect(getLessonsPerChapter()).toEqual({
      1: 7,
      2: 10,
      3: 8,
      4: 13,
      5: 11,
      6: 6,
      7: 9,
      8: 5,
      9: 11,
      10: 10,
      11: 5,
    });
  });

  it("todas as lições têm ids semânticos únicos e pertencem a um capítulo conhecido", () => {
    const ids = new Set<string>();
    const known = new Set(chapters.map((c) => c.number));
    for (const lesson of lessons) {
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);
      expect(lesson.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(known.has(lesson.chapter)).toBe(true);
      expect(lesson.chapterSlug).toBe(
        chapters.find((c) => c.number === lesson.chapter)?.slug
      );
      expect(lesson.challenge.kind).toMatch(/^(exact|schema|data|quiz|theory)$/);
      expect(Number.isInteger(lesson.xpReward) && lesson.xpReward > 0).toBe(true);
      expect(["iniciante", "intermediario", "avancado"]).toContain(
        lesson.difficulty
      );
      expect(Array.isArray(lesson.prerequisites)).toBe(true);
      expect(Array.isArray(lesson.references)).toBe(true);
      expect(Array.isArray(lesson.images)).toBe(true);
      // Desafios executáveis exigem setupSql; quiz/theory não.
      if (lesson.challenge.kind === "exact" || lesson.challenge.kind === "schema") {
        expect(lesson.setupSql).toBeTruthy();
      }
    }
  });

  it("cobre os tópicos obrigatórios da trilha", () => {
    // Cap. 1 — SELECT (asterisco, coluna única, múltiplas, quiz, booleanos)
    expect(getLesson(1, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(1, 2)?.challenge.kind).toBe("exact");
    expect(getLesson(1, 3)?.challenge.kind).toBe("exact");
    expect(getLesson(1, 4)?.challenge.kind).toBe("quiz");
    expect(getLesson(1, 5)?.challenge.kind).toBe("exact");
    // Cap. 2 — CREATE TABLE / ALTER / migrações / tipos
    expect(getLesson(2, 1)?.challenge.kind).toBe("schema");
    expect(getLesson(2, 3)?.challenge.kind).toBe("schema");
    expect(getLesson(2, 8)?.challenge.kind).toBe("theory");
    // Cap. 3 — NULL / constraints / PK / FK
    expect(getLesson(3, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(3, 2)?.challenge.kind).toBe("schema");
    expect(getLesson(3, 3)?.challenge.kind).toBe("exact");
    expect(getLesson(3, 4)?.challenge.kind).toBe("exact");
    // Cap. 4 — CRUD (leitura, INSERT/UPDATE/DELETE como data, quizzes)
    expect(getLesson(4, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(4, 2)?.challenge.kind).toBe("data");
    expect(getLesson(4, 3)?.challenge.kind).toBe("data");
    expect(getLesson(4, 4)?.challenge.kind).toBe("quiz");
    expect(getLesson(4, 8)?.challenge.kind).toBe("data");
    expect(getLesson(4, 10)?.challenge.kind).toBe("data");
    expect(getLesson(4, 12)?.challenge.kind).toBe("exact");
    expect(getLesson(4, 13)?.challenge.kind).toBe("data");
    // Cap. 5 — filtros, operadores e curingas
    expect(getLesson(5, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(5, 10)?.challenge.kind).toBe("quiz");
    expect(getLesson(5, 11)?.challenge.kind).toBe("exact");
    // Cap. 6 — ordenação e limites (LIMIT / ORDER BY)
    expect(getLesson(6, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(6, 3)?.challenge.kind).toBe("exact");
    expect(getLesson(6, 5)?.challenge.kind).toBe("exact");
    expect(getLesson(6, 6)?.challenge.kind).toBe("exact");
    // Cap. 7 — funções de agregação
    expect(getLesson(7, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(7, 7)?.challenge.kind).toBe("exact");
    expect(getLesson(7, 9)?.challenge.kind).toBe("exact");
    // Cap. 8 — subqueries
    expect(getLesson(8, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(8, 4)?.challenge.kind).toBe("exact");
    expect(getLesson(8, 5)?.challenge.kind).toBe("exact");
    // Cap. 9 — normalização (quiz, DDL de FKs/junções e prática de ALTER)
    expect(getLesson(9, 1)?.challenge.kind).toBe("quiz");
    expect(getLesson(9, 2)?.challenge.kind).toBe("schema");
    expect(getLesson(9, 3)?.challenge.kind).toBe("schema");
    expect(getLesson(9, 8)?.challenge.kind).toBe("exact");
    expect(getLesson(9, 11)?.challenge.kind).toBe("schema");
    // Cap. 10 — JOINs
    expect(getLesson(10, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(10, 4)?.challenge.kind).toBe("theory");
    expect(getLesson(10, 6)?.challenge.kind).toBe("quiz");
    // Cap. 11 — performance (índices via DDL + quizzes conceituais)
    expect(getLesson(11, 1)?.challenge.kind).toBe("schema");
    expect(getLesson(11, 2)?.challenge.kind).toBe("quiz");
    expect(getLesson(11, 3)?.challenge.kind).toBe("schema");
    expect(getLesson(11, 4)?.challenge.kind).toBe("quiz");
    expect(getLesson(11, 5)?.challenge.kind).toBe("quiz");
  });

  it("cobre os índices dos desafios de performance", () => {
    const single = getLessonById("performance-01")?.challenge;
    expect(single?.kind).toBe("schema");
    if (single?.kind === "schema") {
      const index = single.expectedTables[0].indexes?.[0];
      expect(index?.name).toBe("email_idx");
      expect(index?.columns).toEqual(["email"]);
      expect(index?.unique).toBe(false);
    }

    const multi = getLessonById("performance-03")?.challenge;
    expect(multi?.kind).toBe("schema");
    if (multi?.kind === "schema") {
      const index = multi.expectedTables[0].indexes?.[0];
      expect(index?.name).toBe("user_id_recipient_id_idx");
      expect(index?.columns).toEqual(["user_id", "recipient_id"]);
    }
  });

  it("getLesson valida faixa e posição", () => {
    expect(getLesson(1, 1)?.id).toBe("select-01");
    expect(getLesson(10, 10)?.id).toBe("joins-10");
    expect(getLesson(11, 5)?.id).toBe("performance-05");
    expect(getLesson(99, 1)).toBeNull();
    expect(getLesson(1, 0)).toBeNull();
    expect(getLesson(1, 99)).toBeNull();
    expect(getLesson(1.5, 1)).toBeNull();
  });

  it("getLessonById resolve ids semânticos", () => {
    expect(getLessonById("select-01")?.id).toBe("select-01");
    expect(getLessonById("tabelas-03")?.chapter).toBe(2);
    expect(getLessonById("filtros-11")?.chapter).toBe(5);
    expect(getLessonById("agregacao-09")?.chapter).toBe(7);
    expect(getLessonById("normalizacao-11")?.chapter).toBe(9);
    expect(getLessonById("joins-10")?.lesson).toBe(10);
    expect(getLessonById("performance-01")?.chapter).toBe(11);
    expect(getLessonById("abc")).toBeNull();
    expect(getLessonById("")).toBeNull();
  });

  it("getLessonById resolve ids legados/posicionais via migração", () => {
    expect(getLessonById("1-1")?.id).toBe("select-01");
    expect(getLessonById("2-3")?.id).toBe("tabelas-03");
    expect(getLessonById("3-4")?.id).toBe("restricoes-04");
    expect(getLessonById("99-1")).toBeNull();
    expect(getLessonById("1-99")).toBeNull();
  });

  it("getLessonsPerChapter soma o total", () => {
    const perChapter = getLessonsPerChapter();
    const sum = Object.values(perChapter).reduce((acc, n) => acc + n, 0);
    expect(sum).toBe(totalLessons);
    for (const chapter of chapters) {
      expect(perChapter[chapter.number]).toBeGreaterThan(0);
    }
  });
});

describe("catálogo — navegação", () => {
  it("getNextLesson atravessa a fronteira entre capítulos", () => {
    expect(getNextLesson(1, 7)?.id).toBe("tabelas-01");
    expect(getNextLesson(3, 8)?.id).toBe("crud-01");
    // Fronteiras novas trazidas pela expansão (caps. 6, 8, 9 e 11).
    expect(getNextLesson(5, 11)?.id).toBe("ordenacao-01");
    expect(getNextLesson(6, 6)?.id).toBe("agregacao-01");
    expect(getNextLesson(7, 9)?.id).toBe("subqueries-01");
    expect(getNextLesson(8, 5)?.id).toBe("normalizacao-01");
    expect(getNextLesson(9, 11)?.id).toBe("joins-01");
    expect(getNextLesson(10, 10)?.id).toBe("performance-01");
    expect(getNextLesson(11, 5)).toBeNull();
  });

  it("getPreviousLesson atravessa a fronteira entre capítulos", () => {
    expect(getPreviousLesson(1, 1)).toBeNull();
    expect(getPreviousLesson(2, 1)?.id).toBe("select-07");
    expect(getPreviousLesson(4, 1)?.id).toBe("restricoes-08");
    // Fronteiras novas trazidas pela expansão (caps. 6, 8, 9 e 11).
    expect(getPreviousLesson(6, 1)?.id).toBe("filtros-11");
    expect(getPreviousLesson(8, 1)?.id).toBe("agregacao-09");
    expect(getPreviousLesson(9, 1)?.id).toBe("subqueries-05");
    expect(getPreviousLesson(10, 1)?.id).toBe("normalizacao-11");
    expect(getPreviousLesson(11, 1)?.id).toBe("joins-10");
  });

  it("devolve null para posições inexistentes", () => {
    expect(getNextLesson(1, 99)).toBeNull();
    expect(getPreviousLesson(1, 99)).toBeNull();
    expect(getNextLesson(0, 0)).toBeNull();
  });
});
