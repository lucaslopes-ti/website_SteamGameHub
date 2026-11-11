import type { Metadata } from "next";

/** Metadados da rota /about (a página é um client component). */
export const metadata: Metadata = {
  title: "Sobre o projeto",
  description:
    "Conheça o SENAI Game HUB, a vitrine dos jogos criados pelos alunos do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "Sobre o projeto | SENAI Game HUB" },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
