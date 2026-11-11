import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GameDetailClient from "./GameDetailClient";
import { getPublicGame, SITE_URL, toMetaDescription } from "@/lib/public-games";

/**
 * Página de detalhe do jogo (Server Component).
 *
 * Antes, a página inteira era renderizada só no navegador: o HTML que o
 * Google recebia tinha apenas um esqueleto de carregamento, o mesmo título
 * genérico do site em todas as URLs e nenhum texto do jogo. Agora o jogo
 * aprovado é buscado no servidor e entregue pronto no HTML, com título,
 * descrição, canonical, Open Graph e dados estruturados (JSON-LD) próprios.
 */
export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

const FALLBACK_DESCRIPTION =
  "Jogo desenvolvido por alunos do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lookup = await getPublicGame(params.id);
  const canonical = `/games/${params.id}`;

  if (lookup.status !== "public") {
    // Pendente, inexistente ou erro: nunca deve entrar no índice.
    return {
      title: "Jogo",
      robots: { index: false, follow: true },
      alternates: { canonical },
    };
  }

  const { game } = lookup;
  const description = toMetaDescription(game.description, FALLBACK_DESCRIPTION);
  const title = game.author ? `${game.title}, jogo de ${game.author}` : game.title;
  const image =
    game.image && (game.image.startsWith("http") || game.image.startsWith("/"))
      ? game.image
      : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: game.title,
      description,
      ...(image ? { images: [{ url: image, alt: game.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: game.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

function absoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

/** Evita que "</script>" dentro de um texto do jogo quebre o JSON-LD. */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function GameDetailPage({ params }: Props) {
  const lookup = await getPublicGame(params.id);

  // Jogo que não existe: 404 de verdade (antes a resposta era 200 com
  // esqueleto, o que o Google trata como "soft 404").
  if (lookup.status === "missing") notFound();

  if (lookup.status !== "public") {
    // Pendente (só autor/staff veem) ou falha momentânea: o cliente carrega.
    return <GameDetailClient />;
  }

  const { game } = lookup;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    url: `${SITE_URL}/games/${game.id}`,
    ...(game.image ? { image: absoluteUrl(game.image) } : {}),
    ...(game.author ? { author: { "@type": "Person", name: game.author } } : {}),
    ...(game.genres?.length ? { genre: game.genres } : {}),
    ...(game.releaseDate ? { datePublished: game.releaseDate } : {}),
    ...(game.trailerUrl ? { trailer: { "@type": "VideoObject", name: `Trailer de ${game.title}`, embedUrl: game.trailerUrl } } : {}),
    publisher: {
      "@type": "EducationalOrganization",
      name: "SENAI Dr. Celso Charuri",
    },
    inLanguage: "pt-BR",
    ...(game.totalRatings > 0 && game.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(game.rating.toFixed(1)),
            ratingCount: game.totalRatings,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <GameDetailClient initialGame={game} />
    </>
  );
}
