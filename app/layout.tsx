import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SENAI Dr. Celso Charuri Game HUB",
    template: "%s | SENAI Game HUB"
  },
  description: "Vitrine de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri. Explore, jogue e se inspire!",
  keywords: ["jogos", "games", "SENAI", "programação de jogos", "desenvolvimento de jogos", "estudantes", "repositório de jogos"],
  authors: [{ name: "Lucas Lopes", url: "https://github.com/lucaslopes-ti" }],
  creator: "Lucas Lopes",
  publisher: "SENAI Dr. Celso Charuri",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://senaigamehub.vercel.app",
    siteName: "SENAI Game HUB",
    title: "SENAI Dr. Celso Charuri Game HUB",
    description: "Vitrine de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SENAI Game HUB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SENAI Dr. Celso Charuri Game HUB",
    description: "Vitrine de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {/* Skip Links para navegação rápida (WCAG 2.4.1) */}
            <a href="#main-content" className="skip-link">
              Ir para o conteúdo principal
            </a>
            <a href="#navigation" className="skip-link">
              Ir para a navegação
            </a>
            <a href="#footer" className="skip-link">
              Ir para o rodapé
            </a>
            
            <Header />
            <main id="main-content" className="min-h-screen" role="main">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

