/**
 * Conquistas da SQL Quest — primeiras conquistas específicas do módulo.
 *
 * Camada 100% serializável e pura: as conquistas são avaliadas a partir do
 * estado do aluno (lições concluídas, XP e streak), nunca de flags enviadas
 * pelo cliente. O servidor persiste apenas os ids conquistados.
 */
import { lessons } from "../catalog";

const totalLessons = lessons.length;

/** Contagem de lições por capítulo (para conquistas de capítulo completo). */
const lessonsByChapter = new Map<number, number>();
for (const lesson of lessons) {
  lessonsByChapter.set(
    lesson.chapter,
    (lessonsByChapter.get(lesson.chapter) ?? 0) + 1
  );
}

function chapterOf(id: string): number {
  const match = /^(\d+)-/.exec(id);
  return match ? Number(match[1]) : 0;
}

function isChapterComplete(completedLessonIds: string[], chapter: number): boolean {
  const expected = lessonsByChapter.get(chapter) ?? 0;
  if (expected === 0) return false;
  const done = completedLessonIds.filter((id) => chapterOf(id) === chapter).length;
  return done >= expected;
}

export interface AchievementState {
  /** Ids de lições concluídas (formato "chapter-lesson"). */
  completedLessonIds: string[];
  /** XP total derivado do catálogo. */
  totalXp: number;
  /** Streak diário atual. */
  streak: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Condição pura: dado o estado, a conquista foi atingida? */
  earned: (state: AchievementState) => boolean;
}

/** Catálogo oficial de conquistas (fonte única de verdade). */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-lesson",
    title: "Primeiro SELECT",
    description: "Conclua sua primeira lição de SQL.",
    icon: "🚀",
    earned: (s) => s.completedLessonIds.length >= 1,
  },
  {
    id: "chapter-1",
    title: "Fundamentos dominados",
    description: "Conclua todas as lições do Capítulo 1.",
    icon: "📘",
    earned: (s) => isChapterComplete(s.completedLessonIds, 1),
  },
  {
    id: "chapter-2",
    title: "Consultas avançadas",
    description: "Conclua todas as lições do Capítulo 2.",
    icon: "📗",
    earned: (s) => isChapterComplete(s.completedLessonIds, 2),
  },
  {
    id: "chapter-3",
    title: "Modelagem de dados",
    description: "Conclua todas as lições do Capítulo 3.",
    icon: "📕",
    earned: (s) => isChapterComplete(s.completedLessonIds, 3),
  },
  {
    id: "half-track",
    title: "Metade da trilha",
    description: "Conclua metade das lições da trilha.",
    icon: "🏁",
    earned: (s) => s.completedLessonIds.length >= Math.ceil(totalLessons / 2),
  },
  {
    id: "full-track",
    title: "Trilha completa",
    description: "Conclua todas as lições da trilha.",
    icon: "🏆",
    earned: (s) => s.completedLessonIds.length >= totalLessons,
  },
  {
    id: "xp-100",
    title: "100 XP",
    description: "Acumule 100 XP.",
    icon: "⚡",
    earned: (s) => s.totalXp >= 100,
  },
  {
    id: "xp-300",
    title: "300 XP",
    description: "Acumule 300 XP.",
    icon: "🔥",
    earned: (s) => s.totalXp >= 300,
  },
  {
    id: "first-streak",
    title: "Primeiro dia seguido",
    description: "Pratique SQL em um dia.",
    icon: "📅",
    earned: (s) => s.streak >= 1,
  },
  {
    id: "streak-3",
    title: "3 dias seguidos",
    description: "Pratique SQL por 3 dias consecutivos.",
    icon: "🔗",
    earned: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    title: "1 semana seguida",
    description: "Pratique SQL por 7 dias consecutivos.",
    icon: "💪",
    earned: (s) => s.streak >= 7,
  },
];

/** Avalia o estado e devolve os ids de todas as conquistas atingidas. */
export function evaluateAchievements(state: AchievementState): string[] {
  return ACHIEVEMENTS.filter((a) => a.earned(state)).map((a) => a.id);
}

/** Conquistas recém-atingidas (diff entre o estado anterior e o atual). */
export function newlyEarned(previous: string[], current: string[]): string[] {
  return current.filter((id) => !previous.includes(id));
}