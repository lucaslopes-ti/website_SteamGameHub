import SqlQuestGuard from "@/components/sql-quest/SqlQuestGuard";

/**
 * Layout do módulo SQL Quest.
 *
 * Aplica o guard de autenticação a TODAS as páginas do módulo: o aluno precisa
 * entrar/criar conta pelo fluxo de autenticação existente antes de acessar as
 * missões. O progresso é persistido apenas para o UID autenticado via
 * API/Firebase Admin — nunca em localStorage anônimo.
 */
export default function SqlQuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SqlQuestGuard>{children}</SqlQuestGuard>;
}