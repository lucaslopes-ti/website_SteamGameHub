import type { Metadata } from "next";
import { InstructorClient } from "@/components/sql-quest/SocialClient";

export const metadata: Metadata = { title: "Painel do instrutor · SQL Quest" };

export default function InstructorPage() {
  return <InstructorClient />;
}
