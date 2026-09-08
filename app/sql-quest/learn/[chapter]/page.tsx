import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChapter } from "@/lib/sql-quest/catalog";
import { lessons } from "@/lib/sql-quest/catalog";
import ChapterClient from "@/components/sql-quest/ChapterClient";

interface ChapterPageProps {
  params: { chapter: string };
}

export function generateMetadata({ params }: ChapterPageProps): Metadata {
  const chapter = getChapter(Number(params.chapter));
  return {
    title: chapter ? `Capítulo ${chapter.number}: ${chapter.title}` : "Capítulo não encontrado",
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapter = getChapter(Number(params.chapter));
  if (!chapter) notFound();

  const chapterLessons = lessons
    .filter((l) => l.chapter === chapter.number)
    .sort((a, b) => a.lesson - b.lesson);

  return <ChapterClient chapter={chapter} lessons={chapterLessons} />;
}
