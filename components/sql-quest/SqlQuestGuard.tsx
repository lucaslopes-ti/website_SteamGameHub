"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Loader2, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export type SqlQuestAccessState = "loading" | "login" | "content";

/**
 * Regra de acesso do módulo SQL Quest (função pura, testável):
 * - enquanto a sessão está sendo resolvida → "loading";
 * - sem usuário autenticado → "login" (bloqueia o acesso às missões);
 * - autenticado → "content".
 *
 * O aluno precisa entrar/criar conta pelo fluxo de autenticação existente
 * antes de acessar as missões. O progresso é persistido apenas para o UID
 * autenticado via API/Firebase Admin — nunca em localStorage anônimo.
 */
export function resolveSqlQuestAccess(input: {
  loading: boolean;
  isAuthenticated: boolean;
}): SqlQuestAccessState {
  if (input.loading) return "loading";
  return input.isAuthenticated ? "content" : "login";
}

export default function SqlQuestGuard({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const redirect = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";

  const access = resolveSqlQuestAccess({ loading, isAuthenticated });

  if (access === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--surface)] text-[var(--on-surface)]">
        <div className="flex flex-col items-center gap-3 text-[var(--on-surface-variant)]">
          <Loader2
            className="h-8 w-8 animate-spin text-[var(--primary-text)]"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">Verificando sua sessão...</p>
        </div>
      </div>
    );
  }

  if (access === "login") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--surface)] px-6 text-[var(--on-surface)]">
        <div className="w-full max-w-md rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)]/60 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-10)] text-[var(--primary-text)]">
            <Database className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
            Entre com sua conta do SENAI para acessar as missões do SQL
            SenaiUdi. Seu progresso é salvo automaticamente na sua conta.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/login${redirect}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--secondary-container)] px-6 py-3 text-sm font-bold text-[var(--on-secondary-container)] transition-transform hover:scale-[1.02]"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Entrar
            </Link>
            <Link
              href={`/cadastro${redirect}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-6 py-3 text-sm font-semibold text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-container-high)]"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}