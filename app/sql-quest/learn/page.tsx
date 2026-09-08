import type { Metadata } from "next";
import CatalogClient from "@/components/sql-quest/CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo SQL SenaiUdi",
  description: "Explore os capítulos e lições do SQL SenaiUdi no SENAI Game Hub.",
};

export default function CatalogPage() {
  return <CatalogClient />;
}
