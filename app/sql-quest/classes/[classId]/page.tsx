import type { Metadata } from "next";
import { ClassDetailClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Ranking da turma · SQL Quest" };

export default function ClassPage({ params }: { params: { classId: string } }) {
  return <ClassDetailClient classId={params.classId} />;
}
