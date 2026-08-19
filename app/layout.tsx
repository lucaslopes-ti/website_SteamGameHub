import type { Metadata } from "next";
import { Orbitron, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/I18nProvider";
import SkipLinks from "@/components/SkipLinks";
import VLibrasWidget from "@/components/VLibrasWidget";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://senaigamehub.vercel.app"),
  alternates: {
    canonical: "/",
  },
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
    url: "/",
    siteName: "SENAI Game HUB",
    title: "SENAI Dr. Celso Charuri Game HUB",
    description: "Vitrine de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SENAI Dr. Celso Charuri Game HUB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SENAI Dr. Celso Charuri Game HUB",
    description: "Vitrine de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais",
    images: ["/opengraph-image"],
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
    <html lang="pt-BR" className={`dark ${plusJakartaSans.variable} ${orbitron.variable}`}>
      <body className={plusJakartaSans.className}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <I18nProvider>
                <VLibrasWidget />
                <SkipLinks />

                <Header />
                <main id="main-content" className="min-h-screen" role="main">
                  {children}
                </main>
                <Footer />
              </I18nProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

