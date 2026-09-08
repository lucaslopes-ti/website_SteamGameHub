/**
 * Testes do catálogo da SQL Quest (dados + navegação).
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
    expect(totalChapters).toBe(3);
    expect(getChapterCount()).toBe(3);
  });

  it("está ordenado por número e tem metadados completos", () => {
    expect(chapters.map((c) => c.number)).toEqual([1, 2, 3]);
    for (const chapter of chapters) {
      expect(chapter.slug).toBeTruthy();
      expect(chapter.title).toBeTruthy();
      expect(chapter.description).toBeTruthy();
    }
  });

  it("getChapter devolve o capítulo certo ou null", () => {
    expect(getChapter(2)?.slug).toBe("tabelas");
    expect(getChapter(0)).toBeNull();
    expect(getChapter(99)).toBeNull();
    expect(getChapter(1.5)).toBeNull();
  });
});

describe("catálogo — lições", () => {
  it("tem pelo menos 12 lições práticas", () => {
    expect(totalLessons).toBeGreaterThanOrEqual(12);
    expect(getLessonCount()).toBe(totalLessons);
  });

  it("todas as lições têm ids únicos e pertencem a um capítulo conhecido", () => {
    const ids = new Set<string>();
    const known = new Set(chapters.map((c) => c.number));
    for (const lesson of lessons) {
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);
      expect(known.has(lesson.chapter)).toBe(true);
      expect(lesson.challenge.kind).toMatch(/^(exact|schema)$/);
      expect(Number.isInteger(lesson.xpReward) && lesson.xpReward > 0).toBe(true);
      expect(lesson.setupSql).toBeTruthy();
      expect(lesson.hints.length).toBeGreaterThan(0);
    }
  });

  it("cobre os tópicos obrigatórios do MVP", () => {
    const titles = lessons.map((l) => l.title);
    // Cap. 1 — SELECT (asterisco, coluna única, múltiplas, alias)
    expect(getLesson(1, 1)?.challenge.kind).toBe("exact");
    expect(getLesson(1, 2)?.challenge.kind).toBe("exact");
    expect(getLesson(1, 3)?.challenge.kind).toBe("exact");
    expect(getLesson(1, 4)?.challenge.kind).toBe("exact");
    // Cap. 2 — CREATE TABLE / tipos / ALTER
    expect(getLesson(2, 1)?.challenge.kind).toBe("schema");
    expect(getLesson(2, 2)?.challenge.kind).toBe("schema");
    expect(getLesson(2, 3)?.challenge.kind).toBe("schema");
    expect(getLesson(2, 4)?.challenge.kind).toBe("schema");
    // Cap. 3 — NOT NULL / UNIQUE / PRIMARY KEY / FOREIGN KEY
    expect(getLesson(3, 1)?.challenge.kind).toBe("schema");
    expect(getLesson(3, 2)?.challenge.kind).toBe("schema");
    expect(getLesson(3, 3)?.challenge.kind).toBe("schema");
    expect(getLesson(3, 4)?.challenge.kind).toBe("schema");
    expect(titles.length).toBeGreaterThanOrEqual(12);
  });

  it("getLesson valida faixa e posição", () => {
    expect(getLesson(1, 1)?.id).toBe("1-1");
    expect(getLesson(99, 1)).toBeNull();
    expect(getLesson(1, 0)).toBeNull();
    expect(getLesson(1, 99)).toBeNull();
    expect(getLesson(1.5, 1)).toBeNull();
  });

  it("getLessonById resolve ids no formato capitulo-licao", () => {
    expect(getLessonById("2-3")?.id).toBe("2-3");
    expect(getLessonById("3-4")?.chapter).toBe(3);
    expect(getLessonById("abc")).toBeNull();
    expect(getLessonById("99-1")).toBeNull();
    expect(getLessonById("")).toBeNull();
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
    expect(getNextLesson(1, 4)?.id).toBe("2-1");
    expect(getNextLesson(3, 4)).toBeNull();
  });

  it("getPreviousLesson atravessa a fronteira entre capítulos", () => {
    expect(getPreviousLesson(1, 1)).toBeNull();
    expect(getPreviousLesson(2, 1)?.id).toBe("1-4");
  });

  it("devolve null para posições inexistentes", () => {
    expect(getNextLesson(1, 99)).toBeNull();
    expect(getPreviousLesson(1, 99)).toBeNull();
    expect(getNextLesson(0, 0)).toBeNull();
  });
});
