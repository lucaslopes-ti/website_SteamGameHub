/**
 * Testes do streak diário da SQL Quest (America/Sao_Paulo).
 *
 * @jest-environment node
 */
import {
  addDays,
  computeStreak,
  dateKeyInSaoPaulo,
  yesterdayOf,
} from "@/lib/sql-quest/domain/streak";

describe("dateKeyInSaoPaulo", () => {
  it("formata como YYYY-MM-DD", () => {
    expect(dateKeyInSaoPaulo(new Date("2026-09-08T12:00:00Z"))).toBe("2026-09-08");
  });

  it("respeita o fuso America/Sao_Paulo (UTC-3)", () => {
    // 2026-09-08T01:00:00Z = 2026-09-07 22:00 em São Paulo.
    expect(dateKeyInSaoPaulo(new Date("2026-09-08T01:00:00Z"))).toBe("2026-09-07");
    // 2026-09-08T03:00:00Z = 2026-09-08 00:00 em São Paulo.
    expect(dateKeyInSaoPaulo(new Date("2026-09-08T03:00:00Z"))).toBe("2026-09-08");
  });
});

describe("addDays / yesterdayOf", () => {
  it("soma e subtrai dias em chaves de data", () => {
    expect(addDays("2026-09-08", 1)).toBe("2026-09-09");
    expect(addDays("2026-09-08", -1)).toBe("2026-09-07");
    expect(yesterdayOf("2026-09-08")).toBe("2026-09-07");
  });

  it("cruza meses corretamente", () => {
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
    expect(yesterdayOf("2026-03-01")).toBe("2026-02-28");
  });
});

describe("computeStreak", () => {
  it("primeira atividade → streak 1", () => {
    expect(computeStreak({ streak: 0, lastActivityDate: null }, "2026-09-08")).toEqual({
      streak: 1,
      lastActivityDate: "2026-09-08",
    });
  });

  it("mesmo dia → idempotente (não incrementa de novo)", () => {
    const prev = { streak: 3, lastActivityDate: "2026-09-08" };
    expect(computeStreak(prev, "2026-09-08")).toEqual(prev);
  });

  it("dia seguinte → streak + 1", () => {
    expect(
      computeStreak({ streak: 3, lastActivityDate: "2026-09-08" }, "2026-09-09")
    ).toEqual({ streak: 4, lastActivityDate: "2026-09-09" });
  });

  it("lacuna → reinicia em 1", () => {
    expect(
      computeStreak({ streak: 5, lastActivityDate: "2026-09-01" }, "2026-09-08")
    ).toEqual({ streak: 1, lastActivityDate: "2026-09-08" });
  });

  it("cruzamento de mês no streak", () => {
    expect(
      computeStreak({ streak: 2, lastActivityDate: "2026-09-30" }, "2026-10-01")
    ).toEqual({ streak: 3, lastActivityDate: "2026-10-01" });
  });
});