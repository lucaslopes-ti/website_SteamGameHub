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

describe("validateCompletions — capítulos independentes (12/13)", () => {
  it("aceita iniciar redes-01 sem concluir a trilha principal", () => {
    const res = validateCompletions([], ["redes-01"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["redes-01"]);
  });

  it("aceita iniciar cabeamento-01 sem a trilha principal nem redes", () => {
    const res = validateCompletions([], ["cabeamento-01"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["cabeamento-01"]);
  });

  it("aceita 12/1 e 13/1 de forma independente entre si", () => {
    const first = validateCompletions([], ["redes-01"]);
    expect(first.ok).toBe(true);
    const second = validateCompletions(
      ["redes-01"],
      ["redes-01", "cabeamento-01"]
    );
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.final).toEqual(["redes-01", "cabeamento-01"]);
    }
  });

  it("mantém a sequência interna: 12/2 só depois de 12/1", () => {
    expect(validateCompletions([], ["redes-02"]).ok).toBe(false);
    const res = validateCompletions(["redes-01"], ["redes-01", "redes-02"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["redes-01", "redes-02"]);
  });

  it("mantém a sequência interna: 13/2 só depois de 13/1", () => {
    expect(validateCompletions([], ["cabeamento-02"]).ok).toBe(false);
    const res = validateCompletions(
      ["cabeamento-01"],
      ["cabeamento-01", "cabeamento-02"]
    );
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.final).toEqual(["cabeamento-01", "cabeamento-02"]);
    }
  });

  it("rejeita saltos internos dentro de 12/13", () => {
    expect(
      validateCompletions(["redes-01"], ["redes-01", "redes-03"]).ok
    ).toBe(false);
    expect(
      validateCompletions(["cabeamento-01"], ["cabeamento-01", "cabeamento-03"])
        .ok
    ).toBe(false);
  });

  it("não libera 13/2 por ter concluído 12/1", () => {
    expect(
      validateCompletions(["redes-01"], ["redes-01", "cabeamento-02"]).ok
    ).toBe(false);
  });

  it("continua aceitando a trilha principal após iniciar um independente", () => {
    const res = validateCompletions(["redes-01"], ["redes-01", "select-01"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["select-01", "redes-01"]);
  });

  it("mantém as regras dos caps. 1–11 (rejeita pulo do SQL)", () => {
    expect(validateCompletions([], ["select-02"]).ok).toBe(false);
    expect(validateCompletions([], ["1-2"]).ok).toBe(false);
    expect(
      validateCompletions(["select-01"], ["select-01", "select-03"]).ok
    ).toBe(false);
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

  it("soma integral do catálogo reflete as 110 unidades (3356)", () => {
    // O total é apenas a soma das recompensas das lições ativas do catálogo;
    // os limiares de nível, conquistas e loja são constantes calibradas e não
    // são recalculados quando o currículo cresce.
    const total = lessons.reduce((acc, l) => acc + l.xpReward, 0);
    expect(total).toBe(3356);
    expect(computeTotalXp(lessons.map((l) => l.id))).toBe(3356);
  });

  it("distribuição de XP por lição reflete o catálogo atual", () => {
    const counts: Record<number, number> = {};
    for (const lesson of lessons) {
      counts[lesson.xpReward] = (counts[lesson.xpReward] ?? 0) + 1;
    }
    expect(counts).toEqual({ 20: 14, 21: 7, 25: 1, 28: 38, 34: 24, 35: 7, 41: 19 });
    const unitSum = Object.values(counts).reduce((acc, n) => acc + n, 0);
    expect(unitSum).toBe(lessons.length);
  });
});