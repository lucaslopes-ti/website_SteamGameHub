import type { Metadata } from "next";
import { ClassesClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Turmas · SENAI Quest" };

export default function ClassesPage() {
  return <ClassesClient />;
}
