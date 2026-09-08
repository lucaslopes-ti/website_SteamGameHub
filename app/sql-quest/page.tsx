import type { Metadata } from "next";
import LandingClient from "@/components/sql-quest/LandingClient";

export const metadata: Metadata = {
  title: "SQL SenaiUdi",
  description: "Aprenda SQL na prática com desafios curtos, feedback imediato e recompensas em XP no SENAI Game Hub.",
};

export default function SqlQuestPage() {
  return <LandingClient />;
}
