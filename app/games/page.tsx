import type { Metadata } from "next";
import GamesPageClient from "./GamesPageClient";
import { getApprovedGames } from "@/lib/public-games";

/**
 * Catálogo de jogos (Server Component).
 *
 * Os jogos aprovados vêm renderizados no HTML inicial, com links reais para
 * cada /games/:id. É por esses links internos que o Google descobre e decide
 * rastrear as páginas de jogo; antes, a lista só aparecia depois do
 * JavaScript, e o HTML trazia apenas o esqueleto de carregamento.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Todos os jogos",
  description:
    "Catálogo completo dos jogos criados pelos alunos do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri. Filtre por gênero, tecnologia e autor.",
  alternates: { canonical: "/games" },
  openGraph: { url: "/games", title: "Todos os jogos | SENAI Game HUB" },
};

export default async function GamesPage() {
  const games = await getApprovedGames();
  return <GamesPageClient initialGames={games} />;
}
