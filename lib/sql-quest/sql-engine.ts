"use client";

/**
 * Motor de execução SQL da SQL Quest — client-side (navegador).
 *
 * - Inicializa o sql.js (SQLite via WebAssembly) de forma preguiçosa e única,
 *   carregando o binário WASM de um asset hospedado localmente em
 *   `/sql-quest/*.wasm` (copiado de `node_modules/sql.js/dist`).
 * - A cada chamada de `executeLessonQuery` cria um banco NOVO, habilita
 *   `PRAGMA foreign_keys`, aplica o `setupSql` da lição e executa o SQL do
 *   aluno.
 * - Normaliza APENAS o primeiro result set (o que é exibido como tabela).
 * - Nunca lança exceção: toda falha vira `{ result, validation }` com
 *   `result.success === false` e mensagens legíveis.
 *
 * Este módulo é exclusivo de cliente e nunca deve ser importado por API
 * routes nem por código de servidor.
 */
import initSqlJs from "sql.js";
import type {
  SQLLesson,
  SQLExecutionResult,
  SQLValidationResult,
  SQLExecutionResponse,
  SQLValue,
  SQLSchemaSnapshot,
  SQLTableSchema,
  SQLColumnSchema,
  SQLForeignKeySchema,
  SQLTableState,
} from "./types";
import { validateLessonResult } from "./validator";

/** Célula crua devolvida pelo sql.js (inclui BLOB como Uint8Array). */
type RawSqlCell = number | string | Uint8Array | null;

type SqlJsStatic = Awaited<ReturnType<typeof initSqlJs>>;
type SqlJsDatabase = InstanceType<SqlJsStatic["Database"]>;

/** Caminho público onde o WASM do sql.js está hospedado neste app. */
const WASM_PREFIX = "/sql-quest/";

/** Filtro para nomes de tabela/índice usados em introspecção (anti-injeção). */
const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

let sqlJsInitPromise: Promise<SqlJsStatic> | null = null;

/**
 * Carrega o sql.js uma única vez (cache em memória). `locateFile` aponta para
 * o asset local em `public/sql-quest/`, evitando dependência de CDN.
 */
function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsInitPromise) {
    sqlJsInitPromise = initSqlJs({
      locateFile: (file) => `${WASM_PREFIX}${file}`,
    }).catch((error) => {
      // Permite nova tentativa em um próximo clique se a primeira falhar.
      sqlJsInitPromise = null;
      throw error;
    });
  }
  return sqlJsInitPromise;
}

/**
 * Inicializa (e cacheia) o motor sql.js. O app pode chamá-lo ao carregar a
 * página para pré-aquecer o WASM; `executeLessonQuery` também o inicializa sob
 * demanda internamente. Nunca lança para o chamador além da rejeição da
 * promessa em caso de falha de carregamento do WASM.
 */
export function initEngine(): Promise<SqlJsStatic> {
  return loadSqlJs();
}

/** Converte uma célula crua do sql.js em valor serializável (JSON). */
function normalizeCell(cell: RawSqlCell): SQLValue {
  if (cell === null || typeof cell === "number" || typeof cell === "string") {
    return cell;
  }
  if (cell instanceof Uint8Array) {
    try {
      const decoder =
        typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8") : null;
      if (decoder) return decoder.decode(cell);
    } catch {
      // segue para o fallback abaixo
    }
    return `[BLOB ${cell.byteLength} bytes]`;
  }
  return String(cell);
}

/** Executa um SQL de introspecção e devolve as linhas como objetos. */
function execRowObjects(
  db: SqlJsDatabase,
  sql: string
): Array<Record<string, RawSqlCell>> {
  const results = db.exec(sql);
  const first = results && results[0];
  if (!first || !first.columns) return [];
  const { columns, values } = first;
  return values.map((row) => {
    const obj: Record<string, RawSqlCell> = {};
    columns.forEach((columnName, index) => {
      obj[columnName] = row[index] ?? null;
    });
    return obj;
  });
}

/** Monta o snapshot do schema (tabelas/colunas/restrições) após a execução. */
function buildSchemaSnapshot(db: SqlJsDatabase): SQLSchemaSnapshot {
  const tables: SQLTableSchema[] = [];

  const tableNames = execRowObjects(
    db,
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  ).map((row) => String(row.name));

  for (const tableName of tableNames) {
    if (!IDENTIFIER_RE.test(tableName)) continue;
    const quoted = `"${tableName}"`;

    // Colunas via PRAGMA table_info.
    const columnRows = execRowObjects(db, `PRAGMA table_info(${quoted});`);
    const columns: SQLColumnSchema[] = columnRows.map((row) => {
      const pkValue = Number(row.pk ?? 0) > 0;
      return {
        name: String(row.name),
        type: row.type === null ? null : String(row.type),
        notNull: Number(row.notnull ?? 0) === 1,
        primaryKey: pkValue,
        unique: pkValue, // PRIMARY KEY implica unicidade; refinado abaixo
        defaultValue: row.dflt_value === null ? null : String(row.dflt_value),
        references: null,
      };
    });

    // Índices únicos automáticos (origin = 'u') para detectar UNIQUE.
    const uniqueIndexNames = execRowObjects(
      db,
      `PRAGMA index_list(${quoted});`
    )
      .filter((row) => Number(row.unique ?? 0) === 1 && row.origin === "u")
      .map((row) => String(row.name));
    const singleColumnUnique = new Set<string>();
    for (const indexName of uniqueIndexNames) {
      if (!IDENTIFIER_RE.test(indexName)) continue;
      const indexColumns = execRowObjects(
        db,
        `PRAGMA index_info("${indexName}");`
      )
        .map((row) => String(row.name))
        .filter((name) => name !== "undefined" && name.length > 0);
      if (indexColumns.length === 1) {
        singleColumnUnique.add(indexColumns[0].toLowerCase());
      }
    }

    // Chaves estrangeiras via PRAGMA foreign_key_list (agrupadas por id).
    const fkRows = execRowObjects(db, `PRAGMA foreign_key_list(${quoted});`);
    const groups = new Map<string, Array<Record<string, RawSqlCell>>>();
    for (const row of fkRows) {
      const id = String(row.id);
      const list = groups.get(id) ?? [];
      list.push(row);
      groups.set(id, list);
    }
    const foreignKeys: SQLForeignKeySchema[] = Array.from(groups.values()).map(
      (groupRows) => ({
        columns: groupRows.map((row) => String(row.from)),
        table: String(groupRows[0]?.table ?? ""),
        referencedColumns: groupRows.map((row) => String(row.to)),
      })
    );

    // Preenche `unique` (origem 'u' de uma única coluna ou PRIMARY KEY) e
    // `references` por coluna.
    for (const column of columns) {
      const columnLower = column.name.toLowerCase();
      if (singleColumnUnique.has(columnLower)) column.unique = true;
      for (const fk of foreignKeys) {
        const position = fk.columns.findIndex(
          (name) => name.toLowerCase() === columnLower
        );
        if (position >= 0) {
          column.references = {
            table: fk.table,
            column: fk.referencedColumns[position] ?? "",
          };
          break;
        }
      }
    }

    tables.push({ name: tableName, columns, foreignKeys });
  }

  return { tables };
}

/**
 * Captura o estado final de uma tabela (colunas na ordem declarada + linhas)
 * via `SELECT *`. Devolve `null` quando a tabela não existe ou o nome não é um
 * identificador seguro (o validador reporta a tabela como ausente).
 */
function buildTableState(
  db: SqlJsDatabase,
  tableName: string
): SQLTableState | null {
  if (!IDENTIFIER_RE.test(tableName)) return null;
  try {
    const quoted = `"${tableName}"`;
    const results = db.exec(`SELECT * FROM ${quoted};`);
    const first = results && results[0];
    if (!first) return { name: tableName, columns: [], rows: [] };
    return {
      name: tableName,
      columns: first.columns.slice(),
      rows: first.values.map((row) =>
        row.map((cell) => normalizeCell(cell as RawSqlCell))
      ),
    };
  } catch {
    return null;
  }
}

/** Converte erros crus do SQLite em mensagens amigáveis (PT-BR). */
function readableSqlError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const msg = raw || "Erro desconhecido ao executar o SQL.";

  const known: Array<[RegExp, string]> = [
    [/no such table/i, "A tabela referenciada não existe no banco."],
    [/no such column/i, "Uma das colunas usadas na consulta não existe."],
    [/no such function/i, "A função SQL usada não existe neste banco."],
    [/already exists/i, "Já existe uma tabela/objeto com esse nome no banco."],
    [/duplicate column name/i, "Há um nome de coluna duplicado na instrução."],
    [/table .* has no column named/i, "A tabela não possui a coluna informada."],
    [/cannot add a NOT NULL column/i, "Não é possível adicionar uma coluna NOT NULL sem um valor padrão a uma tabela com registros."],
    [/foreign key mismatch/i, "A chave estrangeira não corresponde a uma chave primária (ou única) da tabela referenciada."],
    [/UNIQUE constraint failed/i, "Uma restrição UNIQUE foi violada: há um valor duplicado."],
    [/NOT NULL constraint failed/i, "Uma restrição NOT NULL foi violada: uma coluna obrigatória ficou sem valor."],
    [/PRIMARY KEY constraint failed/i, "Uma restrição de chave primária foi violada: valor duplicado ou nulo."],
    [/FOREIGN KEY constraint failed/i, "Uma restrição de chave estrangeira foi violada: o valor referenciado não existe na tabela pai."],
    [/near "/i, "Erro de sintaxe: revise a escrita do comando (palavras-chave, vírgulas e ponto e vírgula)."],
    [/syntax error/i, "Erro de sintaxe: revise a escrita do comando."],
    [/incomplete input/i, "A instrução parece incompleta: confira se faltou algum parêntese ou ponto e vírgula."],
  ];

  for (const [pattern, friendly] of known) {
    if (pattern.test(msg)) {
      return `${friendly} Detalhe técnico: "${msg}".`;
    }
  }
  return `Erro ao executar o SQL: ${msg}`;
}

function emptyResult(error: string | null): SQLExecutionResult {
  return {
    success: error === null,
    error,
    columns: [],
    rows: [],
    rowCount: 0,
    schema: null,
  };
}

/**
 * Executa o SQL do aluno contra um banco novo preparado pela lição.
 *
 * Retorna SEMPRE `{ result, validation }` (nunca lança). O cliente só precisa
 * chamar esta função para obter a tabela de resultados e o veredito.
 *
 * Guarda de runtime: SQL NUNCA executa fora do navegador. Em ambiente sem
 * `window` (ex.: servidor), devolve `success: false` com mensagem clara.
 */
export async function executeLessonQuery(
  lesson: SQLLesson,
  sqlText: string
): Promise<SQLExecutionResponse> {
  if (typeof window === "undefined") {
    const result = emptyResult(
      "A execução de SQL está disponível apenas no navegador (client-side)."
    );
    return { result, validation: validateLessonResult(lesson, result) };
  }

  const SQL = await loadSqlJs();
  return executeLessonQueryWithSqlJs(SQL, lesson, sqlText);
}

/**
 * Núcleo de execução com uma instância já carregada do sql.js.
 *
 * Exportado como seam de teste (permite integração realista com sql.js em
 * Jest/Node). O runtime público (`executeLessonQuery`) mantém a guarda de
 * navegador; este núcleo não deve ser usado fora de testes.
 */
export async function executeLessonQueryWithSqlJs(
  SQL: SqlJsStatic,
  lesson: SQLLesson,
  sqlText: string
): Promise<SQLExecutionResponse> {
  const result = emptyResult(null);
  let db: SqlJsDatabase | null = null;

  try {
    db = new SQL.Database();
    db.run("PRAGMA foreign_keys = ON;");

    if (lesson.setupSql && lesson.setupSql.trim().length > 0) {
      db.run(lesson.setupSql);
    }

    const sql = String(sqlText ?? "").trim();
    if (!sql) {
      result.error = "Escreva uma consulta antes de executar.";
      result.success = false;
    } else {
      const executed = db.exec(sql);
      const first = executed && executed[0];
      if (first && first.columns && first.columns.length > 0) {
        result.columns = first.columns.slice();
        result.rows = first.values.map((row) =>
          row.map((cell) => normalizeCell(cell as RawSqlCell))
        );
      }
      result.success = true;
    }
  } catch (error) {
    result.success = false;
    result.error = readableSqlError(error);
  } finally {
    if (result.success && db) {
      if (lesson.challenge.kind === "schema") {
        try {
          result.schema = buildSchemaSnapshot(db);
        } catch {
          result.schema = { tables: [] };
        }
      } else if (lesson.challenge.kind === "data") {
        // Estado final das tabelas declaradas (INSERT/UPDATE/DELETE).
        try {
          result.tables = lesson.challenge.expectedTables
            .map((expected) => buildTableState(db!, expected.name))
            .filter((state): state is SQLTableState => state !== null);
        } catch {
          result.tables = [];
        }
      }
    }
    if (db) {
      try {
        db.close();
      } catch {
        // banco já fechado ou com erro: não há o que fazer
      }
    }
    result.rowCount = result.rows.length;
  }

  const validation = validateLessonResult(lesson, result);
  return { result, validation };
}

// Reexporta os tipos principais para conveniência do consumidor.
export type {
  SQLExecutionResponse,
  SQLExecutionResult,
  SQLValidationResult,
  SQLValue,
  SQLSchemaSnapshot,
  SQLTableState,
} from "./types";
