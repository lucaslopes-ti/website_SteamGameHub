/**
 * Testes dos níveis deriváveis da SQL Quest.
 *
 * @jest-environment node
 */
import { levelFromXp, levelInfo, xpForLevel, XP_PER_LEVEL } from "@/lib/sql-quest/domain/levels";

describe("levelFromXp", () => {
  it("nível 1 para XP 0", () => {
    expect(levelFromXp(0)).toBe(1);
  });

  it("nível 1 para XP abaixo de XP_PER_LEVEL", () => {
    expect(levelFromXp(XP_PER_LEVEL - 1)).toBe(1);
  });

  it("nível 2 a partir de XP_PER_LEVEL", () => {
    expect(levelFromXp(XP_PER_LEVEL)).toBe(2);
    expect(levelFromXp(2 * XP_PER_LEVEL - 1)).toBe(2);
  });

  it("nível 3 a partir de 2 * XP_PER_LEVEL", () => {
    expect(levelFromXp(2 * XP_PER_LEVEL)).toBe(3);
  });

  it("valores inválidos caem para nível 1", () => {
    expect(levelFromXp(-5)).toBe(1);
    expect(levelFromXp(Number.NaN)).toBe(1);
    expect(levelFromXp(Number.POSITIVE_INFINITY)).toBe(1);
  });
});

describe("xpForLevel", () => {
  it("devolve o XP total necessário para alcançar o nível", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(XP_PER_LEVEL);
    expect(xpForLevel(3)).toBe(2 * XP_PER_LEVEL);
  });

  it("níveis inválidos caem para 1", () => {
    expect(xpForLevel(0)).toBe(0);
    expect(xpForLevel(Number.NaN)).toBe(0);
  });
});

describe("levelInfo", () => {
  it("devolve progresso dentro do nível", () => {
    const currentXp = Math.floor(XP_PER_LEVEL / 2);
    const info = levelInfo(XP_PER_LEVEL + currentXp);
    expect(info.level).toBe(2);
    expect(info.currentXp).toBe(currentXp);
    expect(info.xpForNext).toBe(XP_PER_LEVEL);
    expect(info.progress).toBeCloseTo(currentXp / XP_PER_LEVEL);
  });

  it("progresso 0 no início do nível", () => {
    const info = levelInfo(XP_PER_LEVEL);
    expect(info.progress).toBe(0);
  });

  it("progresso ~1 no fim do nível", () => {
    const info = levelInfo(2 * XP_PER_LEVEL - 1);
    expect(info.progress).toBeCloseTo((XP_PER_LEVEL - 1) / XP_PER_LEVEL);
  });
});
