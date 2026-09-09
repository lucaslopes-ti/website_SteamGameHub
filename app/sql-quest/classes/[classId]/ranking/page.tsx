import type { Metadata } from "next";
import { LeaderboardClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Ranking da turma · SQL Quest" };

export default function ClassRankingPage({ params }: { params: { classId: string } }) {
  return <LeaderboardClient classId={params.classId} />;
}
