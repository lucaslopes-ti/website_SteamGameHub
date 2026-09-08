/**
 * Testes da validação de progresso da SQL Quest (progressão linear + XP).
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

describe("validateCompletions — progressão linear", () => {
  it("aceita um prefixo contíguo válido", () => {
    const res = validateCompletions([], ["1-1", "1-2"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["1-1", "1-2"]);
  });

  it("rejeita saltos (lição fora da próxima disponível)", () => {
    const res = validateCompletions([], ["1-1", "1-3"]);
    expect(res.ok).toBe(false);
  });

  it("rejeita começar por uma lição que não é a primeira", () => {
    const res = validateCompletions([], ["1-2"]);
    expect(res.ok).toBe(false);
  });

  it("não permite remover conclusões existentes", () => {
    const res = validateCompletions(["1-1", "1-2"], ["1-1"]);
    expect(res.ok).toBe(false);
  });

  it("aceita estender um prefixo existente pela próxima lição", () => {
    const res = validateCompletions(["1-1"], ["1-1", "1-2"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["1-1", "1-2"]);
  });

  it("rejeita saltos a partir de um prefixo existente", () => {
    const res = validateCompletions(["1-1"], ["1-1", "1-3"]);
    expect(res.ok).toBe(false);
  });

  it("é idempotente: repetir a mesma conclusão mantém o conjunto", () => {
    const res = validateCompletions(["1-1"], ["1-1"]);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(["1-1"]);
  });

  it("o conjunto final validado é sempre um prefixo da trilha", () => {
    const res = validateCompletions([], orderedIds);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.final).toEqual(orderedIds);
  });
});

describe("computeTotalXp — deriva XP do catálogo", () => {
  it("soma o XP das lições do catálogo", () => {
    const expected = lessons
      .filter((l) => ["1-1", "1-2"].includes(l.id))
      .reduce((acc, l) => acc + l.xpReward, 0);
    expect(computeTotalXp(["1-1", "1-2"])).toBe(expected);
  });

  it("ignora ids desconhecidos", () => {
    expect(computeTotalXp(["1-1", "999-9"])).toBe(
      lessons.find((l) => l.id === "1-1")!.xpReward
    );
  });

  it("lista vazia → 0", () => {
    expect(computeTotalXp([])).toBe(0);
  });
});