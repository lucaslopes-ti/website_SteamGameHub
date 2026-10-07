/**
 * Lógica pura de progresso da SQL Quest (validação de progressão linear + XP).
 *
 * Camada 100% serializável, sem dependência de sql.js, Firebase nem de runtime
 * específico — pode ser importada com segurança por API routes (servidor),
 * código de cliente e testes Jest.
 *
 * Fica em um módulo próprio (e não dentro da route) porque arquivos de rota do
 * Next.js não podem exportar funções auxiliares — apenas handlers HTTP.
 *
 * Os ids podem chegar em qualquer formato (semântico "select-01", legado
 * "1-1" ou posicional "capitulo-licao"); todas as funções resolvem para o id
 * semântico canônico antes de validar/calcular.
 */
import {
  getChapterEntryLesson,
  getLesson,
  isIndependentChapter,
  lessons,
} from "./catalog";
import { resolveLessonId, resolveLessonIds } from "./content/migrate";

/** Ordem oficial da trilha (ids semânticos na ordem de conclusão). */
const orderedIds = lessons.map((l) => l.id);

/** Lições indexadas por id semântico canônico. */
const lessonById = new Map(lessons.map((l) => [l.id, l]));

/** Mapa oficial de XP por lição (fonte única de verdade). */
const xpById = new Map(lessons.map((l) => [l.id, l.xpReward]));

/**
 * Verdadeiro quando `candidateId` é uma próxima lição VÁLIDA dado o conjunto
 * `previousIds` já concluído:
 * - a primeira lição ainda não concluída na ordem oficial da trilha (regra
 *   original, preenchendo lacunas de progresso migrado em ordem); OU
 * - a lição de entrada de um capítulo independente (12/13), mesmo sem os
 *   capítulos anteriores; OU
 * - a continuação sequencial DENTRO de um capítulo independente (a lição
 *   imediatamente anterior do mesmo capítulo já concluída).
 */
function isValidNextLesson(previousIds: string[], candidateId: string): boolean {
  const nextGlobal = orderedIds.find((id) => !previousIds.includes(id));
  if (candidateId === nextGlobal) return true;

  const lesson = lessonById.get(candidateId);
  if (!lesson || !isIndependentChapter(lesson.chapter)) return false;

  const entry = getChapterEntryLesson(lesson.chapter);
  if (entry !== null && entry.id === candidateId) return true;

  const previousInChapter = getLesson(lesson.chapter, lesson.lesson - 1);
  return previousInChapter !== null && previousIds.includes(previousInChapter.id);
}

/**
 * Soma o XP apenas pelas lições do catálogo (nunca confia no cliente).
 * Ids desconhecidos (ou sem correspondência) são ignorados.
 */
export function computeTotalXp(lessonIds: string[]): number {
  let total = 0;
  for (const id of lessonIds) {
    const resolved = resolveLessonId(id, lessons);
    total += resolved ? (xpById.get(resolved) ?? 0) : 0;
  }
  return total;
}

/**
 * Valida completions como uma progressão linear baseada em DELTA:
 * - não permite remoção de conclusões existentes;
 * - permite no máximo UMA nova lição por requisição;
 * - a nova lição deve ser a PRIMEIRA não concluída na ordem oficial da trilha
 *   (preenche lacunas em ordem — necessário para progresso migrado do catálogo
 *   legado, que pode pular lições novas da trilha);
 * - devolve o conjunto final VALIDADO (única fonte de XP).
 *
 * Ids legados/posicionais são resolvidos para ids semânticos antes da
 * validação.
 */
export function validateCompletions(
  previous: string[],
  incoming: string[]
): { ok: true; final: string[] } | { ok: false; error: string } {
  // Resolve ambos os conjuntos para ids semânticos canônicos (ordem oficial).
  const prev = resolveLessonIds(previous, lessons);
  const inc = resolveLessonIds(incoming, lessons);

  // 1) Não permitir remoção de conclusões existentes.
  for (const id of prev) {
    if (!inc.includes(id)) {
      return {
        ok: false,
        error: "Não é possível remover conclusões já salvas.",
      };
    }
  }

  // 2) No máximo UMA nova lição por requisição.
  const newIds = inc.filter((id) => !prev.includes(id));
  if (newIds.length > 1) {
    return {
      ok: false,
      error:
        "Conclua uma lição por vez: envie apenas a próxima lição da trilha nesta requisição.",
    };
  }

  // 3) A nova lição deve ser uma próxima válida: a primeira não concluída na
  //    ordem oficial OU a entrada/continuação de um capítulo independente
  //    (capítulos 12/13 podem ser iniciados sem os anteriores e entre si).
  if (newIds.length === 1) {
    if (!isValidNextLesson(prev, newIds[0])) {
      return {
        ok: false,
        error:
          "Progresso inválido: as lições devem ser concluídas em ordem, sem pular etapas.",
      };
    }
  }

  return { ok: true, final: inc };
}