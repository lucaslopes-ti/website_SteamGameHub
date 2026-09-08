/**
 * Lógica pura de progresso da SQL Quest (validação de progressão linear + XP).
 *
 * Camada 100% serializável, sem dependência de sql.js, Firebase nem de runtime
 * específico — pode ser importada com segurança por API routes (servidor),
 * código de cliente e testes Jest.
 *
 * Fica em um módulo próprio (e não dentro da route) porque arquivos de rota do
 * Next.js não podem exportar funções auxiliares — apenas handlers HTTP.
 */
import { lessons } from "../../data/sql-quest/lessons";

/** Ordem oficial da trilha (ids na ordem de conclusão). */
const orderedIds = lessons.map((l) => l.id);

/** Mapa oficial de XP por lição (fonte única de verdade). */
const xpById = new Map(lessons.map((l) => [l.id, l.xpReward]));

/**
 * Soma o XP apenas pelas lições do catálogo (nunca confia no cliente).
 * Ids desconhecidos são ignorados.
 */
export function computeTotalXp(lessonIds: string[]): number {
  let total = 0;
  for (const id of lessonIds) {
    total += xpById.get(id) ?? 0;
  }
  return total;
}

/**
 * Valida completions como uma progressão linear:
 * - não permite remoção de conclusões existentes;
 * - não aceita saltos nem novas lições fora da próxima disponível — o conjunto
 *   final precisa ser um prefixo contíguo da trilha em ordem;
 * - devolve o conjunto final VALIDADO (única fonte de XP).
 */
export function validateCompletions(
  previous: string[],
  incoming: string[]
): { ok: true; final: string[] } | { ok: false; error: string } {
  // 1) Não permitir remoção de conclusões existentes.
  for (const id of previous) {
    if (!incoming.includes(id)) {
      return {
        ok: false,
        error: "Não é possível remover conclusões já salvas.",
      };
    }
  }

  // 2) Conjunto final = união, ordenado pela ordem oficial da trilha.
  const merged = Array.from(new Set([...previous, ...incoming]));
  const sorted = orderedIds.filter((id) => merged.includes(id));

  // 3) Deve ser um prefixo contíguo (sem saltos / fora da próxima disponível).
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== orderedIds[i]) {
      return {
        ok: false,
        error:
          "Progresso inválido: as lições devem ser concluídas em ordem, sem pular etapas.",
      };
    }
  }

  return { ok: true, final: sorted };
}