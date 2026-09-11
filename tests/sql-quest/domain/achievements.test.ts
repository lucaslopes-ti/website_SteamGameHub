/**
 * Testes das conquistas da SQL Quest.
 *
 * @jest-environment node
 */
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  newlyEarned,
} from "@/lib/sql-quest/domain/achievements";
import { lessons } from "@/lib/sql-quest/catalog";

const totalLessons = lessons.length;
const allIds = lessons.map((l) => l.id);
const chapter1Ids = lessons.filter((l) => l.chapter === 1).map((l) => l.id);

describe("evaluateAchievements", () => {
  it("nenhuma conquista para estado vazio", () => {
    expect(
      evaluateAchievements({ completedLessonIds: [], totalXp: 0, streak: 0 })
    ).toEqual([]);
  });

  it("primeira lição → first-lesson e first-streak", () => {
    const earned = evaluateAchievements({
      completedLessonIds: ["select-01"],
      totalXp: 50,
      streak: 1,
    });
    expect(earned).toContain("first-lesson");
    expect(earned).toContain("first-streak");
    expect(earned).not.toContain("chapter-1");
  });

  it("capítulo 1 completo → chapter-1", () => {
    const earned = evaluateAchievements({
      completedLessonIds: chapter1Ids,
      totalXp: 200,
      streak: 1,
    });
    expect(earned).toContain("chapter-1");
  });

  it("trilha completa → full-track", () => {
    const earned = evaluateAchievements({
      completedLessonIds: allIds,
      totalXp: 1000,
      streak: 7,
    });
    expect(earned).toContain("full-track");
    expect(earned).toContain("half-track");
    expect(earned).toContain("streak-7");
    expect(earned).toContain("xp-300");
  });

  it("metade da trilha → half-track", () => {
    const half = Math.ceil(totalLessons / 2);
    const earned = evaluateAchievements({
      completedLessonIds: allIds.slice(0, half),
      totalXp: 100,
      streak: 1,
    });
    expect(earned).toContain("half-track");
    expect(earned).not.toContain("full-track");
  });

  it("limiares de XP", () => {
    expect(
      evaluateAchievements({ completedLessonIds: ["select-01"], totalXp: 69, streak: 1 })
    ).toContain("xp-100");
    expect(
      evaluateAchievements({ completedLessonIds: ["select-01"], totalXp: 68, streak: 1 })
    ).not.toContain("xp-100");
    expect(
      evaluateAchievements({ completedLessonIds: ["select-01"], totalXp: 207, streak: 1 })
    ).toContain("xp-300");
  });

  it("limiares de streak", () => {
    expect(
      evaluateAchievements({ completedLessonIds: ["select-01"], totalXp: 0, streak: 3 })
    ).toContain("streak-3");
    expect(
      evaluateAchievements({ completedLessonIds: ["select-01"], totalXp: 0, streak: 7 })
    ).toContain("streak-7");
    expect(
      evaluateAchievements({ completedLessonIds: ["select-01"], totalXp: 0, streak: 2 })
    ).not.toContain("streak-3");
  });

  it("ids de conquistas são únicos", () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("newlyEarned", () => {
  it("devolve apenas as conquistas novas", () => {
    expect(newlyEarned(["first-lesson"], ["first-lesson", "chapter-1"])).toEqual([
      "chapter-1",
    ]);
  });

  it("lista vazia quando nada mudou", () => {
    expect(newlyEarned(["a", "b"], ["a", "b"])).toEqual([]);
  });
});