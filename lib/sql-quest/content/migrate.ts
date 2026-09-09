/**
 * Migração de IDs da SQL Quest — ponte entre o catálogo legado (12 lições
 * TypeScript com ids "capitulo-licao", ex.: "1-1") e o catálogo Markdown
 * (ids semânticos, ex.: "select-01").
 *
 * Camada 100% pura e serializável (sem fs, sem Node). Usada por:
 * - `catalog.ts` (`getLessonById` aceita ids semânticos E legados/posicionais);
 * - `progress.ts` (XP e validação de progressão resolvem ids antes de validar);
 * - `server/progress.ts` (sanitização do progresso armazenado).
 *
 * Regras:
 * - `LEGACY_ID_MIGRATION` mapeia EXPLICITAMENTE os 12 ids antigos para os
 *   novos. O critério é posicional (mesmo capítulo/posição na trilha), o que
 *   preserva o máximo de progresso possível. Onde o tópico coincide (ex.:
 *   "1-1" SELECT * → "select-01"), o mapeamento também é temático.
 * - Ids sem correspondência são descartados.
 * - `migrateLessonIds` resolve e ordena o conjunto SEM truncar: progresso
 *   migrado pode ter lacunas em relação à trilha nova, preenchidas em ordem
 *   pela validação de progresso baseada em delta.
 */
import type { SQLLesson } from "../types";
import { lessons as catalogLessons } from "../../../data/sql-quest/generated";

/**
 * Mapeamento explícito dos 12 ids legados (formato "capitulo-licao") para os
 * ids semânticos do catálogo Markdown. Posicional por capítulo/lição.
 */
export const LEGACY_ID_MIGRATION: Record<string, string> = {
  "1-1": "select-01",
  "1-2": "select-02",
  "1-3": "select-03",
  "1-4": "select-04",
  "2-1": "tabelas-01",
  "2-2": "tabelas-02",
  "2-3": "tabelas-03",
  "2-4": "tabelas-04",
  "3-1": "restricoes-01",
  "3-2": "restricoes-02",
  "3-3": "restricoes-03",
  "3-4": "restricoes-04",
};

/** Formato posicional "capitulo-licao" (ex.: "1-1"), usado pelo cliente atual. */
const POSITIONAL_RE = /^(\d+)-(\d+)$/;

/**
 * Resolve QUALQUER id (semântico, legado ou posicional) para o id semântico
 * canônico do catálogo. Devolve `null` quando não há correspondência.
 */
export function resolveLessonId(
  id: string,
  lessons: SQLLesson[] = catalogLessons
): string | null {
  if (typeof id !== "string") return null;
  const trimmed = id.trim();
  if (trimmed === "") return null;

  // 1) id semântico direto (ex.: "select-01").
  if (lessons.some((l) => l.id === trimmed)) return trimmed;

  // 2) migração explícita dos 12 ids legados (ex.: "1-1" → "select-01").
  const migrated = LEGACY_ID_MIGRATION[trimmed];
  if (migrated && lessons.some((l) => l.id === migrated)) return migrated;

  // 3) formato posicional "capitulo-licao" (ex.: "1-1" → capítulo 1, lição 1).
  const match = POSITIONAL_RE.exec(trimmed);
  if (match) {
    const lesson = lessons.find(
      (l) => l.chapter === Number(match[1]) && l.lesson === Number(match[2])
    );
    if (lesson) return lesson.id;
  }

  return null;
}

/**
 * Resolve uma lista de ids para ids semânticos canônicos, sem duplicatas e na
 * ordem oficial da trilha. Ids sem correspondência são descartados.
 */
export function resolveLessonIds(
  ids: string[],
  lessons: SQLLesson[] = catalogLessons
): string[] {
  const known = new Set<string>();
  for (const id of ids) {
    const resolved = resolveLessonId(id, lessons);
    if (resolved) known.add(resolved);
  }
  return lessons.map((l) => l.id).filter((id) => known.has(id));
}

/**
 * Sanitiza uma lista de ids para o progresso armazenado: resolve ids
 * legados/posicionais para ids semânticos canônicos, sem duplicatas e na
 * ordem oficial da trilha. Ids sem correspondência são descartados.
 *
 * NÃO trunca o conjunto: progresso migrado do catálogo legado pode ter
 * "lacunas" em relação à trilha nova (ex.: os 12 ids antigos mapeiam para
 * select-01..04, tabelas-01..04 e restricoes-01..04, pulando select-05..07).
 * A validação de progresso é baseada em DELTA (uma nova lição por vez, sempre
 * a primeira não concluída), então lacunas são preenchidas em ordem.
 */
export function migrateLessonIds(
  ids: string[],
  lessons: SQLLesson[] = catalogLessons
): string[] {
  return resolveLessonIds(ids, lessons);
}