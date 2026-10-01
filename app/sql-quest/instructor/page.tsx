import type { Metadata } from "next";
import { InstructorClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Painel do instrutor · SENAI Quest" };

export default function InstructorPage() {
  return <InstructorClient />;
}
