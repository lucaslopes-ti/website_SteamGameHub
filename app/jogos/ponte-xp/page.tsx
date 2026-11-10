import type { Metadata } from "next";
import PonteXpClient from "./PonteXpClient";

export const metadata: Metadata = {
  title: "Ponte de XP dos jogos",
  robots: { index: false, follow: false },
};

/**
 * Página invisível carregada num <iframe> escondido pelos jogos estáticos das
 * aulas (public/montador-cabo etc.). Ela usa o login do Game Hub e conversa
 * com o jogo por postMessage (mesma origem), para o jogo poder dar XP sem
 * precisar do Firebase dentro do HTML do jogo.
 */
export default function PonteXpPage() {
  return <PonteXpClient />;
}
