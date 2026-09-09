/**
 * Testes da validação de progresso da SQL Quest (progressão linear + XP).
 *
 * A validação é baseada em DELTA: no máximo UMA nova lição por requisição,
 * sempre a primeira não concluída na ordem oficial. Isso permite preencher
 * lacunas de progresso migrado do catálogo legado.
 *
 * Os ids podem ser semânticos ("select-01") ou legados/posicionais ("1-1");
 * a validação resolve para ids semânticos canônicos antes de validar.
 *
 * Camada pura: não depende de sql.js nem de Firebase.
 *
 * @jest-environment node
 */
import {
  computeTotalXp,
  validateCompletions,
} from "@/lib/sql-quest/progress";
import { lessons } from "@/lib/sql-quest/catalog";

const orderedIds = lessons.map((l) => l.id);

describe("validateCompletions — progressão linear (delta)", () => {
  it("aceita concluir a primeira lição", () => {
    const res = validateCompletions([], ["select-01"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["select-01"]);
  });

  it("aceita ids legados/posicionais e devolve ids semânticos", () => {
    const res = validateCompletions([], ["1-1"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["select-01"]);
  });

  it("rejeita mais de uma lição nova por requisição", () => {
    const res = validateCompletions([], ["select-01", "select-02"]);
    expect(res.ok).toBe(false);
  });

  it("rejeita começar por uma lição que não é a primeira", () => {
    const res = validateCompletions([], ["select-02"]);
    expect(res.ok).toBe(false);
  });

  it("não permite remover conclusões existentes", () => {
    const res = validateCompletions(
      ["select-01", "select-02"],
      ["select-01"]
    );
    expect(res.ok).toBe(false);
  });

  it("aceita estender um conjunto existente pela próxima lição", () => {
    const res = validateCompletions(["select-01"], ["select-01", "select-02"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["select-01", "select-02"]);
  });

  it("rejeita saltos a partir de um conjunto existente", () => {
    const res = validateCompletions(
      ["select-01"],
      ["select-01", "select-03"]
    );
    expect(res.ok).toBe(false);
  });

  it("é idempotente: repetir a mesma conclusão mantém o conjunto", () => {
    const res = validateCompletions(["select-01"], ["select-01"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["select-01"]);
  });

  it("preenche lacunas de progresso migrado em ordem", () => {
    // Progresso migrado do catálogo legado (12 ids antigos): lacunas em
    // select-05..07, tabelas-05..10 e restricoes-05..08.
    const migrated = [
      "select-01",
      "select-02",
      "select-03",
      "select-04",
      "tabelas-01",
      "tabelas-02",
      "tabelas-03",
      "tabelas-04",
      "restricoes-01",
      "restricoes-02",
      "restricoes-03",
      "restricoes-04",
    ];
    // A próxima lição é select-05 (primeira não concluída na ordem oficial).
    const res = validateCompletions(migrated, [...migrated, "select-05"]);
    expect(res.ok).toBe(true);
    if (res.ok) {
      // `final` é sempre ordenado pela ordem oficial da trilha.
      expect(res.final).toEqual([
        "select-01",
        "select-02",
        "select-03",
        "select-04",
        "select-05",
        "tabelas-01",
        "tabelas-02",
        "tabelas-03",
        "tabelas-04",
        "restricoes-01",
        "restricoes-02",
        "restricoes-03",
        "restricoes-04",
      ]);
    }
  });

  it("rejeita pular a lacuna (lição fora da primeira não concluída)", () => {
    const migrated = ["select-01", "select-02", "select-03", "select-04"];
    const res = validateCompletions(migrated, [...migrated, "tabelas-01"]);
    expect(res.ok).toBe(false);
  });

  it("aceita a trilha completa concluída uma lição por vez", () => {
    let current: string[] = [];
    for (const id of orderedIds) {
      const res = validateCompletions(current, [...current, id]);
      expect(res.ok).toBe(true);
      if (res.ok) current = res.final;
    }
    expect(current).toEqual(orderedIds);
  });
});

describe("computeTotalXp — deriva XP do catálogo", () => {
  it("soma o XP das lições do catálogo", () => {
    const expected = lessons
      .filter((l) => ["select-01", "select-02"].includes(l.id))
      .reduce((acc, l) => acc + l.xpReward, 0);
    expect(computeTotalXp(["select-01", "select-02"])).toBe(expected);
  });

  it("resolve ids legados/posicionais antes de somar", () => {
    expect(computeTotalXp(["1-1"])).toBe(
      lessons.find((l) => l.id === "select-01")!.xpReward
    );
  });

  it("ignora ids desconhecidos", () => {
    expect(computeTotalXp(["select-01", "999-9"])).toBe(
      lessons.find((l) => l.id === "select-01")!.xpReward
    );
  });

  it("lista vazia → 0", () => {
    expect(computeTotalXp([])).toBe(0);
  });
});