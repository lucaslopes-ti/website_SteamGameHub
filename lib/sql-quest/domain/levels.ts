/**
 * Níveis deriváveis da SQL Quest.
 *
 * Camada 100% serializável e pura: o nível é SEMPRE derivado do XP acumulado
 * (nunca armazenado/confiado no cliente). Fórmula simples e estável:
 * `XP_PER_LEVEL` XP por nível, começando no nível 1.
 *
 * Recalibração de XP (fator 2120/3070): o total de XP do catálogo foi reduzido
 * de 3070 para exatamente 2120 (a soma anterior dos capítulos 1–5). Todos os
 * marcos ligados a XP usam o mesmo fator e arredondamento para o inteiro mais
 * próximo:
 *   - nível: 100 × 2120/3070 = 69,055… → 69;
 *   - conquistas: 100 → 69 e 300 → 207;
 *   - loja: 500 → 345, 1000 → 691 e 3000 → 2072.
 *
 * Regra de arredondamento das lições (método do maior resto, determinístico):
 * para cada lição, `exato = xpAnterior × 2120/3070`; a base é `floor(exato)`; as
 * `2120 − Σfloor` unidades residuais são distribuídas (+1) às lições de maior
 * parte fracionária; empates são desempatados pela ordem estável do caminho da
 * lição (nome de arquivo crescente). Assim o total fecha exatamente em 2120.
 */

/** XP necessário para subir um nível. */
export const XP_PER_LEVEL = 69;

export interface LevelInfo {
  /** Nível atual (1-based). */
  level: number;
  /** XP acumulado dentro do nível atual (0..xpForNext-1). */
  currentXp: number;
  /** XP total necessário para completar o nível atual. */
  xpForNext: number;
  /** Progresso dentro do nível atual (0..1). */
  progress: number;
}

/** Deriva o nível a partir do XP total (valores inválidos → nível 1). */
export function levelFromXp(xp: number): number {
  if (!Number.isFinite(xp) || xp < 0) return 1;
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/** XP total necessário para ALCANÇAR um nível (1-based). */
export function xpForLevel(level: number): number {
  const safe = Number.isFinite(level) && level >= 1 ? Math.floor(level) : 1;
  return (safe - 1) * XP_PER_LEVEL;
}

/** Informações completas de nível para um XP acumulado. */
export function levelInfo(xp: number): LevelInfo {
  const level = levelFromXp(xp);
  const currentXp = Math.max(0, xp - xpForLevel(level));
  return {
    level,
    currentXp,
    xpForNext: XP_PER_LEVEL,
    progress: XP_PER_LEVEL > 0 ? Math.min(1, currentXp / XP_PER_LEVEL) : 0,
  };
}