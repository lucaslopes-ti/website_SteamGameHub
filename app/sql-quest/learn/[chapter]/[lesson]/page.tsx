import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLesson, getNextLesson, getPreviousLesson } from "@/lib/sql-quest/catalog";
import LessonClient from "@/components/sql-quest/LessonClient";

interface LessonPageProps {
  params: { chapter: string; lesson: string };
}

export function generateMetadata({ params }: LessonPageProps): Metadata {
  const lesson = getLesson(Number(params.chapter), Number(params.lesson));
  return {
    title: lesson
      ? `Lição ${lesson.chapter}.${lesson.lesson}: ${lesson.title}`
      : "Lição não encontrada",
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  const lesson = getLesson(Number(params.chapter), Number(params.lesson));
  if (!lesson) notFound();

  const previous = getPreviousLesson(lesson.chapter, lesson.lesson);
  const next = getNextLesson(lesson.chapter, lesson.lesson);

  return <LessonClient lesson={lesson} previous={previous} next={next} />;
}
