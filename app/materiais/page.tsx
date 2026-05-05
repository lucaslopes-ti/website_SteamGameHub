"use client";

import Link from "next/link";
import { BookOpen, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const driveUrl = process.env.NEXT_PUBLIC_MATERIAIS_DRIVE_URL ?? "https://drive.google.com/";
const hasConfiguredDriveUrl = Boolean(process.env.NEXT_PUBLIC_MATERIAIS_DRIVE_URL);

export default function MateriaisPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <section className="rounded-xl border border-[var(--outline-10)] bg-[var(--surface-container-lowest)] p-8 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--primary-20)] bg-[var(--primary-10)] px-4 py-2 text-sm text-[var(--primary)]">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Área exclusiva para ex-alunos
          </div>

          <h1 className="text-3xl font-bold text-[var(--secondary)]">Acesso aos materiais do curso</h1>
          <p className="mt-4 text-[var(--on-surface-variant)] leading-relaxed">
            Ex-alunos que desejam acessar os materiais devem fazer login.
            Se ainda não tiver conta, faça seu cadastro gratuitamente.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--secondary-container)] px-6 py-3 font-semibold text-[var(--on-secondary-container)] transition-colors hover:opacity-90"
            >
              Fazer login
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--primary)]/30 bg-[var(--primary-10)] px-6 py-3 font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-20)]"
            >
              Criar conta
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline-10)] bg-[var(--surface-container-low)] px-4 py-2 text-sm text-[var(--primary)]">
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Área de apoio para ex-alunos
        </div>
        <h1 className="mt-4 text-4xl font-bold text-[var(--secondary)]">Materiais do Curso</h1>
        <p className="mt-3 text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
          Nesta página você encontra o acesso centralizado aos materiais utilizados ao longo do curso.
          O conteúdo está organizado no Google Drive para facilitar consulta e download.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-[var(--outline-10)] bg-[var(--surface-container-lowest)] p-6">
          <div className="mb-4 flex items-center gap-3 text-[var(--on-surface)]">
            <BookOpen className="h-5 w-5 text-[var(--secondary)]" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Acesso aos materiais</h2>
          </div>
          <p className="text-[var(--on-surface-variant)] leading-relaxed">
            Clique no botão abaixo para abrir a pasta oficial com apostilas, exemplos, atividades e conteúdos de apoio.
          </p>
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--secondary-container)] px-5 py-3 font-semibold text-[var(--on-secondary-container)] transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--secondary-container)] focus-visible:outline-offset-2"
            aria-label="Abrir materiais do curso no Google Drive"
          >
            Abrir materiais no Drive
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </article>

        <article className="rounded-xl border border-[var(--outline-10)] bg-[var(--surface-container-low)] p-6">
          <div className="mb-4 flex items-center gap-3 text-[var(--on-surface)]">
            <ShieldCheck className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Boas práticas</h2>
          </div>
          <ul className="space-y-2 text-[var(--on-surface-variant)] list-disc list-inside">
            <li>Use seu e-mail autorizado para acessar os arquivos.</li>
            <li>Não altere ou remova conteúdos compartilhados.</li>
            <li>Em caso de link quebrado, avise a coordenação.</li>
          </ul>

          {!hasConfiguredDriveUrl && (
            <p className="mt-4 rounded-lg border border-yellow-400/40 bg-yellow-400/10 p-3 text-sm text-yellow-800">
              Link do Drive em modo padrão. Para configurar o link oficial, defina{" "}
              <strong>NEXT_PUBLIC_MATERIAIS_DRIVE_URL</strong> no ambiente.
            </p>
          )}
        </article>
      </section>
    </main>
  );
}
