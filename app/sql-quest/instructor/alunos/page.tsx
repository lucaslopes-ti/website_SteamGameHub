import type { Metadata } from "next";
import { InstructorStudentsClient } from "@/components/sql-quest/InstructorStudentsClient";

export const metadata: Metadata = {
  title: "Alunos e progresso · SQL Quest",
};

export default function InstructorStudentsPage() {
  return <InstructorStudentsClient />;
}
