/**
 * Tipos compartilhados da SQL Quest.
 *
 * Esta camada é 100% serializável e não depende de `sql.js`, Firebase nem de
 * qualquer runtime específico — pode ser importada com segurança por código de
 * servidor (API routes), código de cliente (editor/validação no browser) e
 * testes Jest.
 *
 * Valores de banco (`SQLValue`) são sempre JSON-friendly: `string | number |
 * null`. Qualquer célula retornada pelo motor (ex.: BLOB) é convertida antes de
 * sair de `executeLessonQuery`.
 */

/** Uma célula de resultado de query, já serializável para JSON. */
export type SQLValue = string | number | null;

/** Descrição de uma coluna, como aparece no schema (real ou esperado). */
export interface SQLColumnSchema {
  name: string;
  /** Declaração bruta do tipo informada no CREATE (ex.: "INTEGER", "VARCHAR(40)"). */
  type: string | null;
  notNull: boolean;
  primaryKey: boolean;
  unique: boolean;
  /** Valor padrão textual (coluna `dflt_value`), ou null quando não há. */
  defaultValue: string | null;
  /** Referência de chave estrangeira (quando a coluna participa de uma FK). */
  references: { table: string; column: string } | null;
}

/** Descrição de uma tabela no schema (usada em snapshot e para exibição). */
export interface SQLTableSchema {
  name: string;
  columns: SQLColumnSchema[];
  foreignKeys: SQLForeignKeySchema[];
}

/** Chave estrangeira (pode ser composta). */
export interface SQLForeignKeySchema {
  /** Colunas locais que compõem a FK. */
  columns: string[];
  /** Tabela referenciada. */
  table: string;
  /** Colunas referenciadas na tabela pai (na mesma ordem de `columns`). */
  referencedColumns: string[];
}

/**
 * Snapshot do schema de um banco SQLite (todas as tabelas, exceto internas do
 * SQLite), obtido após a execução da query do aluno. É o que permite validar
 * desafios DDL/CREATE/ALTER.
 */
export interface SQLSchemaSnapshot {
  tables: SQLTableSchema[];
}

/**
 * Estado final de uma tabela após a execução da query do aluno (desafios de
 * mutação/data-state: INSERT, UPDATE, DELETE). Capturado pelo motor via
 * `SELECT *` na tabela declarada.
 */
export interface SQLTableState {
  name: string;
  /** Nomes das colunas na ordem declarada da tabela. */
  columns: string[];
  /** Linhas do estado final (valores já serializáveis). */
  rows: SQLValue[][];
}

/**
 * Resultado normalizado da execução de uma query.
 *
 * `columns`/`rows` refletem APENAS o primeiro result set retornado (o que será
 * exibido como tabela). `schema` é preenchido pelo motor quando a lição é um
 * desafio de estrutura (DDL); `tables` quando é um desafio de mutação/data.
 */
export interface SQLExecutionResult {
  success: boolean;
  /** Mensagem de erro legível quando `success === false` (senão `null`). */
  error: string | null;
  /** Nomes das colunas do primeiro result set (vazio se não houver). */
  columns: string[];
  /** Linhas do primeiro result set. */
  rows: SQLValue[][];
  rowCount: number;
  schema: SQLSchemaSnapshot | null;
  /** Estado final das tabelas declaradas (preenchido em desafios "data"). */
  tables?: SQLTableState[];
}

// ---------------------------------------------------------------------------
// Expectativas de validação (campo `challenge` das lições)
// ---------------------------------------------------------------------------

/** Expectativa opcional sobre uma coluna em desafios de schema. */
export interface SQLExpectedColumn {
  name: string;
  /** Tipo esperado — comparado por afinidade SQLite (INTEGER/TEXT/REAL/etc). */
  type?: string;
  notNull?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  /** Ex.: `{ table: "clientes", column: "id" }` (column opcional). */
  references?: { table: string; column?: string };
}

/** Expectativa opcional sobre uma chave estrangeira de uma tabela. */
export interface SQLExpectedForeignKey {
  /** Colunas locais. */
  columns: string[];
  /** Tabela referenciada. */
  table: string;
  /** Colunas referenciadas; quando omitido, apenas a tabela é conferida. */
  referencedColumns?: string[];
}

/** Expectativa opcional sobre uma tabela em desafios de schema. */
export interface SQLExpectedTable {
  name: string;
  /** Colunas que DEVEM existir (as demais presentes não reprovam). */
  columns?: SQLExpectedColumn[];
  /** Chaves estrangeiras que DEVEM existir. */
  foreignKeys?: SQLExpectedForeignKey[];
  /** Colunas que NÃO podem existir (ex.: após um RENAME COLUMN). */
  forbidColumns?: string[];
}

/**
 * Expectativa de estado final de uma tabela em desafios "data"
 * (INSERT/UPDATE/DELETE): compara colunas (na ordem) e linhas (multiset por
 * padrão) do estado final da tabela após a query do aluno.
 */
export interface SQLExpectedTableState {
  name: string;
  /** Colunas esperadas, NA ORDEM em que devem aparecer. */
  columns: string[];
  /** Linhas esperadas do estado final. */
  rows: SQLValue[][];
  /**
   * Quando true, a ordem das linhas importa (ex.: após um ORDER BY explícito).
   * Padrão: false (linhas são comparadas como multiset, ignorando a ordem).
   */
  orderSensitive?: boolean;
}

/**
 * Desafio de uma lição:
 * - `exact`: compara colunas e linhas do resultado com o esperado.
 * - `schema`: valida a estrutura do banco após a execução (DDL).
 * - `data`: compara o estado final das tabelas declaradas após a execução
 *   (mutação/data-state — INSERT, UPDATE, DELETE).
 */
export type SQLChallenge =
  | {
      kind: "exact";
      /** Enunciado/objetivo exibido ao aluno. */
      instruction: string;
      /** Colunas esperadas, NA ORDEM em que devem aparecer. */
      expectedColumns: string[];
      expectedRows: SQLValue[][];
      /**
       * Quando true, a ordem das linhas importa (como em ORDER BY).
       * Padrão: false (linhas são comparadas ignorando a ordem).
       */
      orderSensitive?: boolean;
    }
  | {
      kind: "schema";
      instruction: string;
      expectedTables: SQLExpectedTable[];
    }
  | {
      kind: "data";
      instruction: string;
      /** Tabelas cujo estado final deve ser comparado após a query. */
      expectedTables: SQLExpectedTableState[];
    };

/** Resultado da validação (feedback amigável em PT-BR). */
export interface SQLValidationResult {
  passed: boolean;
  /** `exact` | `schema` | `data` para lições executadas; `error` quando a query falhou. */
  mode: "exact" | "schema" | "data" | "error";
  /** Mensagem principal para o aluno. */
  message: string;
  /** Detalhes granulares (usados para exibir a lista de problemas). */
  details: string[];
}

/** Contrato do que `executeLessonQuery` devolve (nunca lança). */
export interface SQLExecutionResponse {
  result: SQLExecutionResult;
  validation: SQLValidationResult;
}

// ---------------------------------------------------------------------------
// Catálogo de conteúdo
// ---------------------------------------------------------------------------

/** Uma lição prática da trilha. */
export interface SQLLesson {
  /** Identificador estável, ex.: "2-3" (capítulo-lição). */
  id: string;
  chapter: number;
  lesson: number;
  title: string;
  /** Resumo curto usado em listas/cards. */
  summary: string;
  difficulty: "iniciante" | "intermediario";
  /** XP concedido ao concluir (fonte oficial — nunca confiar no cliente). */
  xpReward: number;
  /** Conteúdo teórico da lição (markdown simples). */
  explanation: string;
  /** Código de exemplo exibido junto à teoria (opcional). */
  exampleSql: string | null;
  /**
   * SQL executado para preparar o banco da lição (schema inicial + seed).
   * Roda em um banco novo a cada execução.
   */
  setupSql: string;
  /** Schema inicial (para o SchemaViewer da UI). */
  tables: SQLTableSchema[];
  challenge: SQLChallenge;
  /** Dicas liberadas progressivamente. */
  hints: string[];
}

/** Metadados de um capítulo da trilha. */
export interface SQLChapter {
  number: number;
  /** Slug para URLs, ex.: "select". */
  slug: string;
  title: string;
  description: string;
}
