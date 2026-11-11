import type { Metadata } from "next";

/** Metadados da rota /stats (a página é um client component). */
export const metadata: Metadata = {
  title: "Estatísticas",
  description:
    "Números do SENAI Game HUB: jogos publicados, visualizações, downloads e os jogos mais bem avaliados pelos visitantes.",
  alternates: { canonical: "/stats" },
  openGraph: { url: "/stats", title: "Estatísticas | SENAI Game HUB" },
};

export default function StatsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
