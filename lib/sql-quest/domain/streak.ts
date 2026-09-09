/**
 * Streak diário da SQL Quest — fuso America/Sao_Paulo.
 *
 * Camada 100% serializável e pura. O "dia" é definido pelo fuso
 * `America/Sao_Paulo` (data local "YYYY-MM-DD"), nunca pelo fuso do servidor.
 *
 * Regras:
 * - primeira atividade → streak 1;
 * - atividade no mesmo dia → idempotente (não incrementa de novo);
 * - atividade no dia seguinte → streak + 1;
 * - atividade após uma lacuna → streak reinicia em 1.
 */

export const SAO_PAULO_TIMEZONE = "America/Sao_Paulo";

/** Data local "YYYY-MM-DD" em America/Sao_Paulo para um instante. */
export function dateKeyInSaoPaulo(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SAO_PAULO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Soma dias a uma chave de data "YYYY-MM-DD" (aritmética UTC pura). */
export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Dia anterior a uma chave de data "YYYY-MM-DD". */
export function yesterdayOf(dateKey: string): string {
  return addDays(dateKey, -1);
}

export interface StreakState {
  /** Streak atual (0 quando nunca houve atividade). */
  streak: number;
  /** Última data de atividade "YYYY-MM-DD" (America/Sao_Paulo), ou null. */
  lastActivityDate: string | null;
}

/**
 * Computa o novo estado de streak dado o estado anterior e o dia atual
 * (America/Sao_Paulo). Idempotente para o mesmo dia.
 */
export function computeStreak(
  previous: StreakState,
  today: string
): StreakState {
  if (!previous.lastActivityDate) {
    return { streak: 1, lastActivityDate: today };
  }
  if (previous.lastActivityDate === today) {
    // Já contabilizado hoje — não incrementa de novo.
    return previous;
  }
  if (previous.lastActivityDate === yesterdayOf(today)) {
    return { streak: previous.streak + 1, lastActivityDate: today };
  }
  // Lacuna: reinicia.
  return { streak: 1, lastActivityDate: today };
}