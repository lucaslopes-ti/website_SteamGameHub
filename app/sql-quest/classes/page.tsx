import type { Metadata } from "next";
import { ClassesClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Turmas · SQL Quest" };

export default function ClassesPage() {
  return <ClassesClient />;
}
