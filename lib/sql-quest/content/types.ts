/**
 * Tipos da base de conteúdo versionada da SQL Quest.
 *
 * Esta camada é 100% independente do runtime da SQL Quest (sql.js, Firebase,
 * catálogo atual): define apenas o contrato de conteúdo em Markdown
 * (front matter + corpo) e os metadados estruturados necessários aos desafios
 * SQL. Pode ser importada por scripts de build, testes Jest e, futuramente,
 * por um loader que alimente o runtime — sem acoplamento.
 *
 * Todos os tipos são serializáveis (JSON-friendly).
 */

/** Valor escalar permitido em linhas esperadas de desafios `exact`. */
export type SQLContentValue = string | number | null;

/** Coluna esperada em desafios de schema. */
export interface SQLContentExpectedColumn {
  name: string;
  /** Tipo esperado — comparado por afinidade SQLite (INTEGER/TEXT/REAL/etc). */
  type?: string;
  notNull?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  /** Ex.: `{ table: "clientes", column: "id" }` (column opcional). */
  references?: { table: string; column?: string };
}

/** Chave estrangeira esperada em desafios de schema. */
export interface SQLContentExpectedForeignKey {
  /** Colunas locais que compõem a FK. */
  columns: string[];
  /** Tabela referenciada. */
  table: string;
  /** Colunas referenciadas; quando omitido, apenas a tabela é conferida. */
  referencedColumns?: string[];
}

/** Tabela esperada em desafios de schema. */
export interface SQLContentExpectedTable {
  name: string;
  /** Colunas que DEVEM existir (as demais presentes não reprovam). */
  columns?: SQLContentExpectedColumn[];
  /** Chaves estrangeiras que DEVEM existir. */
  foreignKeys?: SQLContentExpectedForeignKey[];
  /** Colunas que NÃO podem existir (ex.: após um RENAME COLUMN). */
  forbidColumns?: string[];
}

/**
 * Estado final esperado de uma tabela em desafios `data` (INSERT/UPDATE/
 * DELETE): compara colunas (na ordem) e linhas (multiset por padrão) do
 * estado final da tabela após a query do aluno.
 */
export interface SQLContentExpectedTableState {
  name: string;
  /** Colunas esperadas, NA ORDEM em que devem aparecer. */
  columns: string[];
  /** Linhas esperadas do estado final. */
  rows: SQLContentValue[][];
  /**
   * Quando true, a ordem das linhas importa (ex.: após um ORDER BY explícito).
   * Padrão: false (linhas são comparadas como multiset, ignorando a ordem).
   */
  orderSensitive?: boolean;
}

/** Pergunta de um desafio quiz (múltipla escolha). */
export interface SQLContentQuizQuestion {
  /** Enunciado da pergunta. */
  prompt: string;
  /** Opções de resposta (ao menos 2). */
  options: string[];
  /** Índice (0-based) da opção correta. */
  answer: number;
  /** Explicação exibida após responder (opcional). */
  explanation?: string;
}

/**
 * Desafio de uma unidade (espelha o contrato do runtime):
 * - `exact`: compara colunas e linhas do resultado com o esperado.
 * - `schema`: valida a estrutura do banco após a execução (DDL).
 * - `data`: compara o estado final das tabelas declaradas após a execução
 *   (mutação/data-state — INSERT, UPDATE, DELETE).
 * - `quiz`: perguntas de múltipla escolha (sem execução de SQL).
 *
 * Unidades **theory** (sem desafio executável) simplesmente omitem `challenge`.
 */
export type SQLContentChallenge =
  | {
      kind: "exact";
      /** Enunciado/objetivo exibido ao aluno. */
      instruction: string;
      /** Colunas esperadas, NA ORDEM em que devem aparecer. */
      expectedColumns: string[];
      expectedRows: SQLContentValue[][];
      /** Quando true, a ordem das linhas importa (ex.: ORDER BY). */
      orderSensitive?: boolean;
    }
  | {
      kind: "schema";
      instruction: string;
      expectedTables: SQLContentExpectedTable[];
    }
  | {
      kind: "data";
      instruction: string;
      /** Tabelas cujo estado final deve ser comparado após a query. */
      expectedTables: SQLContentExpectedTableState[];
    }
  | {
      kind: "quiz";
      instruction: string;
      questions: SQLContentQuizQuestion[];
    };

/** Coluna do schema inicial (exibido no SchemaViewer da UI). */
export interface SQLContentColumn {
  name: string;
  type: string;
  notNull?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  references?: { table: string; column?: string };
}

/** Tabela do schema inicial. */
export interface SQLContentTable {
  name: string;
  columns: SQLContentColumn[];
}

/** Referência SQL (documentação oficial / link de apoio). */
export interface SQLContentReference {
  label: string;
  url: string;
}

/** Metadados de uma imagem usada na unidade. */
export interface SQLContentImage {
  /** Texto alternativo (acessibilidade). */
  alt: string;
  /**
   * Caminho local seguro, relativo a `content/sql-quest/images/`.
   * Sem `..`, sem caminho absoluto, sem scheme (http/data/...), extensão de
   * imagem (png/jpg/jpeg/gif/webp/svg).
   */
  src: string;
}

/** Dificuldade de uma lição. */
export type SQLContentDifficulty = "iniciante" | "intermediario" | "avancado";

/**
 * Lição carregada de um arquivo `.md` (front matter + corpo).
 *
 * `sourcePath` é o caminho do arquivo de origem — usado apenas para relatar
 * problemas de validação.
 */
export interface SQLContentLesson {
  /** Identificador semântico estável, ex.: "select-01". */
  id: string;
  title: string;
  summary: string;
  /** Número do capítulo (1-based). */
  chapter: number;
  /** Slug do capítulo (deve conferir com chapters.md). */
  chapterSlug: string;
  /** Posição da lição dentro do capítulo (1-based). */
  lesson: number;
  difficulty: SQLContentDifficulty;
  /** XP concedido ao concluir. */
  xp: number;
  /** IDs semânticos de lições que devem ser concluídas antes. */
  prerequisites: string[];
  /** Dicas liberadas progressivamente. */
  hints: string[];
  /** Referências SQL (documentação). */
  references: SQLContentReference[];
  /** SQL executado para preparar o banco da lição (schema inicial + seed). */
  setupSql: string;
  /** Schema inicial (para o SchemaViewer da UI). */
  tables: SQLContentTable[];
  /**
   * Desafio da unidade. Ausente (ou `null`) em unidades **theory** — sem
   * desafio executável.
   */
  challenge?: SQLContentChallenge;
  /** Metadados das imagens usadas na unidade (alt + caminho local seguro). */
  images: SQLContentImage[];
  /** Corpo Markdown (narrativa da lição). */
  body: string;
  sourcePath: string;
}

/** Metadados de um capítulo da trilha. */
export interface SQLContentChapter {
  number: number;
  slug: string;
  title: string;
  description: string;
}

/** Bundle completo de conteúdo carregado de um diretório. */
export interface SQLContentBundle {
  /** Versão do conteúdo (semver), lida de chapters.md. */
  version: string;
  chapters: SQLContentChapter[];
  lessons: SQLContentLesson[];
}

/** Problema encontrado na validação de conteúdo. */
export interface SQLContentIssue {
  /** Arquivo de origem (caminho relativo ou absoluto). */
  file: string;
  severity: "error" | "warning";
  message: string;
  /** Campo do front matter relacionado (quando aplicável). */
  field?: string;
}

/** Uma unidade é "theory" quando não possui desafio executável. */
export function isTheoryUnit(lesson: SQLContentLesson): boolean {
  return lesson.challenge === undefined || lesson.challenge === null;
}