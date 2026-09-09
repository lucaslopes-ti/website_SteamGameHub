import type { MetadataRoute } from "next";

/**
 * robots.txt do SENAI Game HUB.
 *
 * Política conservadora: permite o crawl das páginas públicas e desestimula o
 * crawl de áreas autenticadas/internas (API, admin, autenticação, perfil,
 * SQL Quest, atividades/avaliações internas e materiais).
 *
 * Importante: `Disallow` apenas controla o rastreamento futuro. Ele NÃO remove
 * do índice URLs que já foram indexadas — para isso é necessário `noindex` na
 * própria página ou remoção manual no Search Console.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://senaigamehub.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // API interna
          "/api",
          // Painel administrativo
          "/admin",
          // Fluxos de autenticação (entrar/criar conta/recuperação)
          "/login",
          "/cadastro",
          "/recuperar-senha",
          // Áreas pessoais e de envio de conteúdo
          "/profile",
          "/favorites",
          "/upload",
          // Páginas de edição de jogo (somente autor/staff autenticado)
          "/games/*/edit",
          // Áreas protegidas do módulo SQL Quest (exigem autenticação)
          "/sql-quest",
          // Atividades e avaliações internas
          "/atividade",
          "/prova-logica-programacao",
          "/simulado-saep",
          // Materiais didáticos internos
          "/materiais",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
