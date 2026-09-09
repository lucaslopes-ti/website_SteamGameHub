import type { Metadata } from "next";

/**
 * Layout da rota /login.
 *
 * A página em si é um client component, então o metadata de robôs (noindex,
 * nofollow) é exportado deste layout de rota — o mínimo necessário para manter
 * a página de autenticação fora do índice do Google.
 */
export const metadata: Metadata = {
  title: "Entrar",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
