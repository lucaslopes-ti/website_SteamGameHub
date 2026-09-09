/**
 * Catálogo da SQL Quest — ponto único de acesso ao conteúdo.
 *
 * Agrega os metadados dos capítulos e as lições do catálogo GERADO
 * (`data/sql-quest/generated.ts`, produzido a partir de
 * `content/sql-quest/lessons/*.md` em tempo de build) e expõe helpers de
 * navegação. Camada pura: pode ser importada por API routes (servidor),
 * páginas (cliente) e testes Jest, sem depender de sql.js, Firebase nem de
 * fs/loader Node-only.
 */
import type { SQLLesson, SQLChapter } from "./types";
import {
  chapters as chapterDefinitions,
  lessons as lessonDefinitions,
} from "../../data/sql-quest/generated";
import { resolveLessonId } from "./content/migrate";

/** Capítulos da trilha (já ordenados por número). */
export const chapters: SQLChapter[] = [...chapterDefinitions].sort(
  (a, b) => a.number - b.number
);

/** Lições da trilha (já ordenadas por capítulo e posição). */
export const lessons: SQLLesson[] = [...lessonDefinitions].sort(
  (a, b) => a.chapter - b.chapter || a.lesson - b.lesson
);

/** Número total de capítulos. */
export const totalChapters: number = chapters.length;

/** Número total de lições. */
export const totalLessons: number = lessons.length;

/** Contagem de lições por capítulo (mapa `chapterNumber -> count`). */
export function getLessonsPerChapter(): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const lesson of lessons) {
    counts[lesson.chapter] = (counts[lesson.chapter] ?? 0) + 1;
  }
  return counts;
}

export function getChapterCount(): number {
  return totalChapters;
}

export function getLessonCount(): number {
  return totalLessons;
}

/** Retorna o capítulo pelo número (ou `null` se não existir). */
export function getChapter(chapterNumber: number): SQLChapter | null {
  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) return null;
  return chapters.find((c) => c.number === chapterNumber) ?? null;
}

/** Retorna a lição por capítulo + posição (ou `null` se não existir). */
export function getLesson(
  chapterNumber: number,
  lessonNumber: number
): SQLLesson | null {
  if (
    !Number.isInteger(chapterNumber) ||
    !Number.isInteger(lessonNumber) ||
    chapterNumber < 1 ||
    lessonNumber < 1
  ) {
    return null;
  }
  return (
    lessons.find(
      (l) => l.chapter === chapterNumber && l.lesson === lessonNumber
    ) ?? null
  );
}

/**
 * Retorna a lição pelo id. Aceita:
 * - ids semânticos do catálogo (ex.: "select-01");
 * - ids legados/posicionais "capitulo-licao" (ex.: "1-1"), resolvidos via a
 *   migração explícita dos 12 ids antigos.
 */
export function getLessonById(id: string): SQLLesson | null {
  if (typeof id !== "string") return null;
  const resolved = resolveLessonId(id, lessons);
  if (!resolved) return null;
  return lessons.find((l) => l.id === resolved) ?? null;
}

/** Próxima lição na ordem da trilha (ou `null` se a atual for a última). */
export function getNextLesson(
  chapterNumber: number,
  lessonNumber: number
): SQLLesson | null {
  const current = getLesson(chapterNumber, lessonNumber);
  if (!current) return null;
  const index = lessons.findIndex((l) => l.id === current.id);
  return index >= 0 && index < lessons.length - 1
    ? lessons[index + 1]
    : null;
}

/** Lição anterior na ordem da trilha (ou `null` se a atual for a primeira). */
export function getPreviousLesson(
  chapterNumber: number,
  lessonNumber: number
): SQLLesson | null {
  const current = getLesson(chapterNumber, lessonNumber);
  if (!current) return null;
  const index = lessons.findIndex((l) => l.id === current.id);
  return index > 0 ? lessons[index - 1] : null;
}