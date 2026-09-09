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

  it("nível 1 para XP abaixo de 100", () => {
    expect(levelFromXp(99)).toBe(1);
  });

  it("nível 2 a partir de 100 XP", () => {
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(199)).toBe(2);
  });

  it("nível 3 a partir de 200 XP", () => {
    expect(levelFromXp(200)).toBe(3);
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
    const info = levelInfo(150);
    expect(info.level).toBe(2);
    expect(info.currentXp).toBe(50);
    expect(info.xpForNext).toBe(XP_PER_LEVEL);
    expect(info.progress).toBe(0.5);
  });

  it("progresso 0 no início do nível", () => {
    const info = levelInfo(100);
    expect(info.progress).toBe(0);
  });

  it("progresso ~1 no fim do nível", () => {
    const info = levelInfo(199);
    expect(info.progress).toBeCloseTo(0.99);
  });
});