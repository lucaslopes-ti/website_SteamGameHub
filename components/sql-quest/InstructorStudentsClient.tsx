"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarClock,
  GraduationCap,
  RefreshCw,
  Search,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { authedFetch } from "@/lib/client-auth";

type Student = {
  uid: string;
  displayName: string | null;
  xp: number;
  level: number;
  lessonCount: number;
  lastSignInAt: string | null;
};

type StudentsResponse = { students: Student[] };

type SortKey = "xp" | "lastSignInAt" | "name";
type SortState = { key: SortKey; direction: "asc" | "desc" };

const DEFAULT_DIRECTION: Record<SortKey, "asc" | "desc"> = {
  xp: "desc",
  lastSignInAt: "desc",
  name: "asc",
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "xp", label: "Mais XP" },
  { key: "lastSignInAt", label: "Login recente" },
  { key: "name", label: "Nome A–Z" },
];

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

type LastLogin = { label: string; iso: string | null };

/**
 * O último login vem do Firebase (`lastSignInAt`) e representa o último acesso
 * autenticado na plataforma — não a última visita a uma página.
 */
function getLastLogin(value: string | null): LastLogin {
  if (!value) return { label: "Sem registro", iso: null };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { label: "Sem registro", iso: null };
  return { label: dateTimeFormatter.format(date), iso: value };
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function studentName(student: Student) {
  const name = student.displayName?.trim();
  return name ? name : "Aluno sem nome";
}

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("pt-BR") : "0";
}

function compareStudents(a: Student, b: Student, sort: SortState) {
  const direction = sort.direction === "asc" ? 1 : -1;
  const aName = studentName(a);
  const bName = studentName(b);

  if (sort.key === "name") {
    return aName.localeCompare(bName, "pt-BR") * direction || b.xp - a.xp;
  }

  if (sort.key === "lastSignInAt") {
    const aTime = a.lastSignInAt ? Date.parse(a.lastSignInAt) : Number.NaN;
    const bTime = b.lastSignInAt ? Date.parse(b.lastSignInAt) : Number.NaN;
    const aValid = !Number.isNaN(aTime);
    const bValid = !Number.isNaN(bTime);
    // Sem registro sempre no fim, independentemente da direção.
    if (!aValid && !bValid) return aName.localeCompare(bName, "pt-BR");
    if (!aValid) return 1;
    if (!bValid) return -1;
    return (aTime - bTime) * direction || aName.localeCompare(bName, "pt-BR");
  }

  return (a.xp - b.xp) * direction || aName.localeCompare(bName, "pt-BR");
}

function useStudents() {
  const [data, setData] = useState<StudentsResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch("/api/sql-quest/instructor/students");
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          body?.error || "Não foi possível carregar a lista de alunos."
        );
      }
      const students = Array.isArray(body?.students) ? body.students : [];
      setData({ students });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível carregar a lista de alunos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, loading, reload: load };
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface)] px-5 py-10 text-[var(--on-surface)] sm:px-8">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}

function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div
      className="rounded-3xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto h-7 w-7 animate-spin motion-reduce:animate-none rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      <p className="mt-4 text-sm text-[var(--on-surface-variant)]">{label}</p>
    </div>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div
      className="rounded-3xl border border-red-400/30 bg-red-500/5 p-8 text-center"
      role="alert"
    >
      <p className="font-semibold text-red-300">{message}</p>
      <button
        type="button"
        onClick={retry}
        className="mt-4 rounded-lg border border-[var(--outline-variant)] px-4 py-2 text-sm font-semibold [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]"
      >
        Tentar novamente
      </button>
    </div>
  );
}

function InstructorOnly() {
  return (
    <Page>
      <div className="rounded-3xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-10 text-center">
        <GraduationCap className="mx-auto h-10 w-10 text-[var(--primary-text)]" />
        <h1 className="mt-5 text-2xl font-bold">Área de instrutor</h1>
        <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
          Esta lista está disponível apenas para instrutores e administradores.
        </p>
        <Link
          href="/sql-quest"
          className="mt-6 inline-flex rounded-xl border border-[var(--outline-variant)] px-5 py-3 text-sm font-semibold [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]"
        >
          Voltar à trilha
        </Link>
      </div>
    </Page>
  );
}

function Avatar({ name }: { name: string | null }) {
  const label = name?.trim();
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-container-high)] text-xs font-bold text-[var(--secondary)]"
    >
      {label ? label.charAt(0).toLocaleUpperCase("pt-BR") : <User className="h-4 w-4" />}
    </span>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] p-5">
      <Icon className="h-5 w-5 text-[var(--secondary)]" aria-hidden="true" />
      <p className="mt-4 text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-[var(--on-surface-variant)]">{label}</p>
    </div>
  );
}

export function InstructorStudentsClient() {
  const { loading, isStaff } = useAuth();

  if (loading) {
    return (
      <Page>
        <Loading label="Verificando permissão..." />
      </Page>
    );
  }

  if (!isStaff) return <InstructorOnly />;

  return <StudentsPanel />;
}

function StudentsPanel() {
  const { data, error, loading, reload } = useStudents();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "xp", direction: "desc" });

  const students = useMemo(() => data?.students ?? [], [data]);

  const visible = useMemo(() => {
    const term = normalize(query);
    const filtered = term
      ? students.filter((student) =>
          normalize(studentName(student)).includes(term)
        )
      : students;
    return [...filtered].sort((a, b) => compareStudents(a, b, sort));
  }, [students, query, sort]);

  const totalXp = useMemo(
    () =>
      students.reduce(
        (sum, student) => sum + (Number.isFinite(student.xp) ? student.xp : 0),
        0
      ),
    [students]
  );

  const withoutLogin = useMemo(
    () => students.filter((student) => getLastLogin(student.lastSignInAt).iso === null).length,
    [students]
  );

  const chooseSort = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? {
            key,
            direction: current.direction === "desc" ? "asc" : "desc",
          }
        : { key, direction: DEFAULT_DIRECTION[key] }
    );
  };

  const sortDirection = (key: SortKey): "ascending" | "descending" | "none" =>
    sort.key === key
      ? sort.direction === "asc"
        ? "ascending"
        : "descending"
      : "none";

  return (
    <Page>
      <header className="mb-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-text)]">
              Gestão
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Alunos e progresso
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--on-surface-variant)]">
              Todos os alunos com progresso em SQL Quest, com XP, nível, lições
              concluídas e o último login na plataforma.
            </p>
          </div>
          <Link
            href="/sql-quest/instructor"
            className="text-sm font-semibold text-[var(--on-surface-variant)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--primary-text)]"
          >
            ← Voltar ao painel
          </Link>
        </div>
        <nav
          aria-label="Navegação do instrutor"
          className="mt-7 flex flex-wrap gap-2 text-sm"
        >
          <Link
            href="/sql-quest/instructor"
            className="rounded-full border border-[var(--outline-variant)]/35 px-4 py-2 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50"
          >
            Turmas
          </Link>
          <Link
            href="/sql-quest/instructor/alunos"
            aria-current="page"
            className="rounded-full border border-[var(--primary)]/50 bg-[var(--primary-10)] px-4 py-2 font-semibold"
          >
            Alunos e login
          </Link>
          <Link
            href="/sql-quest/instructor/pedidos"
            className="rounded-full border border-[var(--outline-variant)]/35 px-4 py-2 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/50"
          >
            Pedidos de recompensas
          </Link>
        </nav>
      </header>

      {loading ? (
        <Loading label="Carregando alunos..." />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : (
        <>
          <p className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary-10)]/35 p-4 text-sm leading-6 text-[var(--on-surface-variant)]">
            <CalendarClock
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--primary-text)]"
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-[var(--on-surface)]">
                Último login
              </strong>{" "}
              é o último acesso autenticado na plataforma (login), não a última
              visita a uma página. Quando essa data não está disponível, aparece{" "}
              <span className="font-semibold text-[var(--on-surface)]">
                “Sem registro”
              </span>
              .
            </span>
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              icon={Users}
              label="Alunos com progresso"
              value={formatNumber(students.length)}
            />
            <Stat icon={Zap} label="XP somado" value={formatNumber(totalXp)} />
            <Stat
              icon={CalendarClock}
              label="Sem login registrado"
              value={formatNumber(withoutLogin)}
            />
          </div>

          <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--on-surface-variant)]"
                aria-hidden="true"
              />
              <label htmlFor="student-search" className="sr-only">
                Buscar aluno pelo nome
              </label>
              <input
                id="student-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome..."
                className="w-full rounded-xl border border-[var(--outline-variant)]/50 bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
                Ordenar
              </span>
              <div role="group" aria-label="Ordenar lista" className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => {
                  const active = sort.key === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => chooseSort(option.key)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        active
                          ? "border-[var(--primary)]/50 bg-[var(--primary-10)] text-[var(--primary-text)]"
                          : "border-[var(--outline-variant)]/40 text-[var(--on-surface-variant)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/40"
                      }`}
                    >
                      {option.label}
                      {active &&
                        (sort.direction === "desc" ? (
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        ))}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={reload}
                aria-label="Atualizar lista"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--outline-variant)]/40 px-3.5 py-2 text-xs font-semibold text-[var(--on-surface-variant)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--primary)]/40"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Atualizar
              </button>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-[var(--outline-variant)]/40 p-12 text-center">
              <Users className="mx-auto h-9 w-9 text-[var(--outline)]" />
              <h2 className="mt-4 font-bold">Ainda não há alunos</h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                Quando os alunos concluírem lições do SQL Quest, eles aparecerão
                aqui.
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-[var(--outline-variant)]/40 p-12 text-center">
              <Search className="mx-auto h-9 w-9 text-[var(--outline)]" />
              <h2 className="mt-4 font-bold">Nenhum aluno encontrado</h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                Nenhum resultado para “{query.trim()}”.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-5 rounded-lg border border-[var(--outline-variant)] px-4 py-2 text-sm font-semibold [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--surface-container-high)]"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <>
              <div className="mt-5 hidden overflow-hidden rounded-3xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] sm:block">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Alunos com progresso em SQL Quest. A coluna “Último login”
                    mostra o último login na plataforma, não a última visita.
                  </caption>
                  <thead>
                    <tr className="border-b border-[var(--outline-variant)]/25 text-xs uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
                      <th
                        scope="col"
                        aria-sort={sortDirection("name")}
                        className="px-5 py-4 font-bold"
                      >
                        Aluno
                      </th>
                      <th scope="col" className="px-5 py-4 font-bold">
                        Nível
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortDirection("xp")}
                        className="px-5 py-4 text-right font-bold"
                      >
                        XP
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-4 text-right font-bold"
                      >
                        Lições
                      </th>
                      <th
                        scope="col"
                        aria-sort={sortDirection("lastSignInAt")}
                        className="px-5 py-4 font-bold"
                      >
                        Último login
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((student) => {
                      const login = getLastLogin(student.lastSignInAt);
                      return (
                        <tr
                          key={student.uid}
                          className="border-b border-[var(--outline-variant)]/15 last:border-0"
                        >
                          <th scope="row" className="px-5 py-4 font-semibold">
                            <span className="flex items-center gap-3">
                              <Avatar name={student.displayName} />
                              <span className="min-w-0 truncate">
                                {studentName(student)}
                              </span>
                            </span>
                          </th>
                          <td className="px-5 py-4 text-[var(--on-surface-variant)]">
                            Nível {student.level}
                          </td>
                          <td className="px-5 py-4 text-right font-bold tabular-nums text-[var(--secondary)]">
                            {formatNumber(student.xp)} XP
                          </td>
                          <td className="px-5 py-4 text-right tabular-nums text-[var(--on-surface-variant)]">
                            {formatNumber(student.lessonCount)}
                          </td>
                          <td className="px-5 py-4 text-[var(--on-surface-variant)]">
                            {login.iso ? (
                              <time dateTime={login.iso}>{login.label}</time>
                            ) : (
                              <span className="italic">Sem registro</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ul className="mt-5 space-y-3 sm:hidden">
                {visible.map((student) => {
                  const login = getLastLogin(student.lastSignInAt);
                  return (
                    <li
                      key={student.uid}
                      className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-lowest)] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={student.displayName} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {studentName(student)}
                          </p>
                          <p className="text-xs text-[var(--on-surface-variant)]">
                            Nível {student.level} ·{" "}
                            {formatNumber(student.lessonCount)} lições
                          </p>
                        </div>
                        <span className="ml-auto shrink-0 font-bold tabular-nums text-[var(--secondary)]">
                          {formatNumber(student.xp)} XP
                        </span>
                      </div>
                      <p className="mt-3 flex items-center gap-2 border-t border-[var(--outline-variant)]/20 pt-3 text-xs text-[var(--on-surface-variant)]">
                        <CalendarClock
                          className="h-3.5 w-3.5 shrink-0 text-[var(--primary-text)]"
                          aria-hidden="true"
                        />
                        <span>
                          Último login:{" "}
                          {login.iso ? (
                            <time dateTime={login.iso}>{login.label}</time>
                          ) : (
                            <span className="italic">Sem registro</span>
                          )}
                        </span>
                      </p>
                    </li>
                  );
                })}
              </ul>

              <p
                className="mt-5 text-sm text-[var(--on-surface-variant)]"
                aria-live="polite"
              >
                Mostrando {formatNumber(visible.length)} de{" "}
                {formatNumber(students.length)}{" "}
                {students.length === 1 ? "aluno" : "alunos"}.
              </p>
            </>
          )}
        </>
      )}
    </Page>
  );
}
