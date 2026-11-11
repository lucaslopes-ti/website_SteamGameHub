import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getApprovedGames } from "@/lib/public-games";

/**
 * Home (Server Component): entrega os jogos aprovados já no HTML inicial,
 * para que o Google veja o catálogo e os links para cada jogo.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const games = await getApprovedGames();
  return <HomeClient initialGames={games} />;
}
