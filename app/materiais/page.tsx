"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const driveUrl = process.env.NEXT_PUBLIC_MATERIAIS_DRIVE_URL ?? "https://drive.google.com/";
const hasConfiguredDriveUrl = Boolean(process.env.NEXT_PUBLIC_MATERIAIS_DRIVE_URL);

export default function MateriaisPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-senai-blue/30 bg-senai-blueDark/40 px-4 py-2 text-sm text-senai-blueLight">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Área de apoio para ex-alunos
        </div>
        <h1 className="mt-4 text-4xl font-bold text-senai-orange">Materiais do Curso</h1>
        <p className="mt-3 text-gray-300 max-w-3xl leading-relaxed">
          Nesta página você encontra o acesso centralizado aos materiais utilizados ao longo do curso.
          O conteúdo está organizado no Google Drive para facilitar consulta e download.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-senai-blue/30 bg-senai-blueDark p-6">
          <div className="mb-4 flex items-center gap-3 text-white">
            <BookOpen className="h-5 w-5 text-senai-orange" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Acesso aos materiais</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            Clique no botão abaixo para abrir a pasta oficial com apostilas, exemplos, atividades e conteúdos de apoio.
          </p>
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-senai-orange px-5 py-3 font-semibold text-white transition-colors hover:bg-senai-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2"
            aria-label="Abrir materiais do curso no Google Drive"
          >
            Abrir materiais no Drive
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </article>

        <article className="rounded-xl border border-senai-blueLight/30 bg-senai-blueLight/10 p-6">
          <div className="mb-4 flex items-center gap-3 text-white">
            <ShieldCheck className="h-5 w-5 text-senai-blueLight" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Boas práticas</h2>
          </div>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Use seu e-mail autorizado para acessar os arquivos.</li>
            <li>Não altere ou remova conteúdos compartilhados.</li>
            <li>Em caso de link quebrado, avise a coordenação.</li>
          </ul>

          {!hasConfiguredDriveUrl && (
            <p className="mt-4 rounded-lg border border-yellow-400/40 bg-yellow-400/10 p-3 text-sm text-yellow-200">
              Link do Drive em modo padrão. Para configurar o link oficial, defina{" "}
              <strong>NEXT_PUBLIC_MATERIAIS_DRIVE_URL</strong> no ambiente.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
