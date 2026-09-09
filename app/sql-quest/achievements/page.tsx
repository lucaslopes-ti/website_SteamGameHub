import type { Metadata } from "next";
import { AchievementsClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Conquistas · SQL Quest" };

export default function AchievementsPage() {
  return <AchievementsClient />;
}
