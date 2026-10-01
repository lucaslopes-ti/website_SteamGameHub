import type { Metadata } from "next";
import CatalogClient from "@/components/sql-quest/CatalogClient";

export const metadata: Metadata = {
  title: "Catálogo SENAI Quest",
  description: "Explore os capítulos e lições do SENAI Quest no SENAI Game Hub.",
};

export default function CatalogPage() {
  return <CatalogClient />;
}
