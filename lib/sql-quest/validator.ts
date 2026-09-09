/**
 * Validador da SQL Quest — lógica pura, sem dependência de sql.js/Firebase.
 *
 * Suporta três tipos de desafio:
 * - `exact`: o resultado do aluno deve ter as MESMAS colunas (na ordem) e as
 *   mesmas linhas do esperado.
 * - `schema`: a estrutura do banco (snapshot) deve conter as tabelas,
 *   colunas e restrições esperadas.
 * - `data`: o estado final das tabelas declaradas (após INSERT/UPDATE/DELETE)
 *   deve ter as mesmas colunas (na ordem) e as mesmas linhas do esperado
 *   (multiset por padrão; ordem apenas quando `orderSensitive`).
 *
 * Todas as mensagens de retorno são em PT-BR e prontas para exibição.
 */
import type {
  SQLLesson,
  SQLChallenge,
  SQLExecutionResult,
  SQLValidationResult,
  SQLValue,
  SQLTableSchema,
  SQLExpectedTable,
  SQLExpectedColumn,
  SQLColumnSchema,
  SQLForeignKeySchema,
} from "./types";

// ---------------------------------------------------------------------------
// Comparação de células e linhas
// ---------------------------------------------------------------------------

/** Compara duas células tratando null e número-vs-string-numérica. */
export function sqlCellsEqual(a: SQLValue, b: SQLValue): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a === "number" && typeof b === "number") return a === b;
  if (typeof a === "string" && typeof b === "string") return a === b;
  const na = Number(a);
  const nb = Number(b);
  return !Number.isNaN(na) && !Number.isNaN(nb) && na === nb;
}

/** Gera uma chave canônica de ordenação para uma linha (multiset compare). */
export function sqlRowKey(row: SQLValue[]): string {
  return JSON.stringify(
    row.map((cell) => {
      if (cell === null) return "0:null";
      if (typeof cell === "number") return `1:${cell}`;
      if (typeof cell === "string" && cell.trim() !== "" && !Number.isNaN(Number(cell))) {
        return `1:${Number(cell)}`;
      }
      return `2:${String(cell)}`;
    })
  );
}

function rowsEqualIgnoreOrder(
  expected: SQLValue[][],
  received: SQLValue[][]
): boolean {
  if (expected.length !== received.length) return false;
  const counts = new Map<string, number>();
  for (const row of expected) {
    const key = sqlRowKey(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  for (const row of received) {
    const key = sqlRowKey(row);
    const remaining = counts.get(key) ?? 0;
    if (remaining <= 0) return false;
    counts.set(key, remaining - 1);
  }
  return true;
}

function rowsEqualInOrder(
  expected: SQLValue[][],
  received: SQLValue[][]
): boolean {
  if (expected.length !== received.length) return false;
  return expected.every((row, i) => {
    const other = received[i];
    return (
      other !== undefined &&
      row.length === other.length &&
      row.every((cell, j) => sqlCellsEqual(cell, other[j]))
    );
  });
}

// ---------------------------------------------------------------------------
// Afinidade de tipo do SQLite (para comparar declarações de forma tolerante)
// ---------------------------------------------------------------------------

/** Normaliza o tipo declarado para a afinidade SQLite correspondente. */
export function sqliteAffinity(declaredType: string | null | undefined): string {
  const t = (declaredType ?? "").toUpperCase().trim();
  if (t === "") return "BLOB";
  if (t.includes("INT")) return "INTEGER";
  if (t.includes("CHAR") || t.includes("CLOB") || t.includes("TEXT")) {
    return "TEXT";
  }
  if (t.includes("REAL") || t.includes("FLOA") || t.includes("DOUB")) {
    return "REAL";
  }
  return "NUMERIC";
}

/**
 * Duas afinidades são compatíveis quando idênticas — exceto REAL/NUMERIC, que
 * se aceitam mutuamente (ex.: `REAL` vs `DECIMAL(10,2)`), e BLOB vs outras,
 * que nunca casam por si.
 */
function affinityCompatible(expected: string, actual: string): boolean {
  if (expected === actual) return true;
  if (expected === "REAL" && actual === "NUMERIC") return true;
  if (expected === "NUMERIC" && actual === "REAL") return true;
  return false;
}

// ---------------------------------------------------------------------------
// Validação do modo "exact"
// ---------------------------------------------------------------------------

function compareHeaders(
  expectedColumns: string[],
  receivedColumns: string[]
): string | null {
  const receivedLower = receivedColumns.map((c) => c.toLowerCase());
  const expectedLower = expectedColumns.map((c) => c.toLowerCase());
  if (receivedColumns.length !== expectedColumns.length) {
    return `Quantidade de colunas diferente: esperadas ${expectedColumns.length}, recebidas ${receivedColumns.length}.`;
  }
  for (let i = 0; i < expectedLower.length; i += 1) {
    if (receivedLower[i] !== expectedLower[i]) {
      return `Coluna ${i + 1} incorreta: esperado "${expectedColumns[i]}", recebido "${receivedColumns[i]}".`;
    }
  }
  return null;
}

function validateExact(
  challenge: Extract<SQLChallenge, { kind: "exact" }>,
  result: SQLExecutionResult
): SQLValidationResult {
  const details: string[] = [];

  const headerError = compareHeaders(
    challenge.expectedColumns,
    result.columns
  );
  if (headerError) details.push(headerError);

  if (details.length === 0) {
    const rowsOk =
      challenge.orderSensitive === true
        ? rowsEqualInOrder(challenge.expectedRows, result.rows)
        : rowsEqualIgnoreOrder(challenge.expectedRows, result.rows);
    if (!rowsOk) {
      details.push(
        `As linhas não conferem: eram esperadas ${challenge.expectedRows.length} linha(s) e foram recebidas ${result.rows.length}.`
      );
    }
  }

  if (details.length > 0) {
    return {
      passed: false,
      mode: "exact",
      message: "Ainda não é dessa vez. Compare as colunas e as linhas do seu resultado com o esperado.",
      details,
    };
  }
  return {
    passed: true,
    mode: "exact",
    message: "Parabéns! O resultado da sua consulta está correto.",
    details: [],
  };
}

// ---------------------------------------------------------------------------
// Validação do modo "schema"
// ---------------------------------------------------------------------------

function findTable(snapshotTables: SQLTableSchema[], name: string) {
  const wanted = name.toLowerCase();
  return (
    snapshotTables.find((t) => t.name.toLowerCase() === wanted) ?? null
  );
}

function findColumn(tableSchema: SQLTableSchema, name: string) {
  const wanted = name.toLowerCase();
  return (
    tableSchema.columns.find((c) => c.name.toLowerCase() === wanted) ?? null
  );
}

function checkExpectedColumn(
  actual: SQLColumnSchema,
  expected: SQLExpectedColumn,
  tableName: string
): string[] {
  const problems: string[] = [];
  const label = `coluna "${expected.name}" de "${tableName}"`;

  if (expected.type !== undefined) {
    const expectedAff = sqliteAffinity(expected.type);
    const actualAff = sqliteAffinity(actual.type);
    if (!affinityCompatible(expectedAff, actualAff)) {
      problems.push(
        `Tipo incompatível na ${label}: esperado algo ${expected.type}, recebido "${actual.type ?? "sem tipo"}".`
      );
    }
  }
  if (expected.notNull === true && !actual.notNull) {
    problems.push(`A ${label} deveria ser NOT NULL (não pode ficar vazia).`);
  }
  if (expected.primaryKey === true && !actual.primaryKey) {
    problems.push(`A ${label} deveria ser a chave primária (PRIMARY KEY).`);
  }
  if (expected.unique === true && !(actual.unique || actual.primaryKey)) {
    problems.push(`A ${label} deveria ter valores únicos (UNIQUE).`);
  }
  if (expected.references !== undefined) {
    const matches = actual.references !== null &&
      actual.references.table.toLowerCase() === expected.references.table.toLowerCase() &&
      (expected.references.column === undefined ||
        actual.references.column.toLowerCase() === expected.references.column.toLowerCase());
    if (!matches) {
      const target = expected.references.column
        ? `${expected.references.table}(${expected.references.column})`
        : expected.references.table;
      problems.push(
        `A ${label} deveria referenciar ${target} com uma FOREIGN KEY.`
      );
    }
  }
  return problems;
}

function normalizeColumnsForFkMatch(columns: string[]): string[] {
  return columns.map((c) => c.toLowerCase());
}

function fkMatches(
  actualFks: SQLForeignKeySchema[],
  expected: {
    columns: string[];
    table: string;
    referencedColumns?: string[];
  }
): boolean {
  return actualFks.some((fk) => {
    if (fk.table.toLowerCase() !== expected.table.toLowerCase()) return false;
    const localExpected = normalizeColumnsForFkMatch(expected.columns);
    const localActual = normalizeColumnsForFkMatch(fk.columns);
    if (localExpected.length !== localActual.length) return false;
    if (!localExpected.every((c, i) => localActual[i] === c)) return false;
    if (expected.referencedColumns !== undefined) {
      const refExpected = normalizeColumnsForFkMatch(expected.referencedColumns);
      const refActual = normalizeColumnsForFkMatch(fk.referencedColumns);
      if (refExpected.length !== refActual.length) return false;
      if (!refExpected.every((c, i) => refActual[i] === c)) return false;
    }
    return true;
  });
}

function validateExpectedTable(
  actualTable: SQLTableSchema | null,
  expectedTable: SQLExpectedTable
): string[] {
  const problems: string[] = [];
  if (!actualTable) {
    problems.push(`A tabela "${expectedTable.name}" não existe no banco.`);
    return problems;
  }

  for (const expectedColumn of expectedTable.columns ?? []) {
    const actualColumn = findColumn(actualTable, expectedColumn.name);
    if (!actualColumn) {
      problems.push(
        `A tabela "${expectedTable.name}" não possui a coluna "${expectedColumn.name}".`
      );
      continue;
    }
    problems.push(
      ...checkExpectedColumn(actualColumn, expectedColumn, expectedTable.name)
    );
  }

  for (const forbidden of expectedTable.forbidColumns ?? []) {
    if (findColumn(actualTable, forbidden)) {
      problems.push(
        `A tabela "${expectedTable.name}" ainda possui a coluna "${forbidden}", que não deveria existir.`
      );
    }
  }

  for (const expectedFk of expectedTable.foreignKeys ?? []) {
    if (!fkMatches(actualTable.foreignKeys, expectedFk)) {
      const refs = expectedFk.referencedColumns
        ? `${expectedFk.table}(${expectedFk.referencedColumns.join(", ")})`
        : expectedFk.table;
      problems.push(
        `A tabela "${expectedTable.name}" deveria ter uma FOREIGN KEY de "${expectedFk.columns.join(", ")}" referenciando ${refs}.`
      );
    }
  }

  return problems;
}

function validateSchema(
  challenge: Extract<SQLChallenge, { kind: "schema" }>,
  result: SQLExecutionResult
): SQLValidationResult {
  const details: string[] = [];
  const snapshotTables = result.schema?.tables ?? [];

  for (const expectedTable of challenge.expectedTables) {
    const actualTable = findTable(snapshotTables, expectedTable.name);
    details.push(
      ...validateExpectedTable(actualTable, expectedTable)
    );
  }

  if (details.length > 0) {
    return {
      passed: false,
      mode: "schema",
      message:
        "A estrutura do banco ainda não atende ao que foi pedido. Revise os itens abaixo.",
      details,
    };
  }
  return {
    passed: true,
    mode: "schema",
    message:
      "Parabéns! A estrutura do banco está correta e respeita as regras pedidas.",
    details: [],
  };
}

// ---------------------------------------------------------------------------
// Validação do modo "data" (estado final de tabelas — mutação/data-state)
// ---------------------------------------------------------------------------

function validateData(
  challenge: Extract<SQLChallenge, { kind: "data" }>,
  result: SQLExecutionResult
): SQLValidationResult {
  const details: string[] = [];
  const actualTables = result.tables ?? [];

  for (const expected of challenge.expectedTables) {
    const actual = actualTables.find(
      (table) => table.name.toLowerCase() === expected.name.toLowerCase()
    );

    if (!actual) {
      details.push(
        `A tabela "${expected.name}" não existe no banco após a execução.`
      );
      continue;
    }

    const headerError = compareHeaders(expected.columns, actual.columns);
    if (headerError) {
      details.push(`Na tabela "${expected.name}": ${headerError}`);
      continue;
    }

    const rowsOk =
      expected.orderSensitive === true
        ? rowsEqualInOrder(expected.rows, actual.rows)
        : rowsEqualIgnoreOrder(expected.rows, actual.rows);
    if (!rowsOk) {
      details.push(
        `Na tabela "${expected.name}", as linhas não conferem: eram esperadas ${expected.rows.length} linha(s) e foram encontradas ${actual.rows.length}.`
      );
    }
  }

  if (details.length > 0) {
    return {
      passed: false,
      mode: "data",
      message:
        "O estado final das tabelas ainda não confere com o esperado. Revise os itens abaixo.",
      details,
    };
  }
  return {
    passed: true,
    mode: "data",
    message: "Parabéns! O estado final das tabelas está correto.",
    details: [],
  };
}

// ---------------------------------------------------------------------------
// Ponto de entrada
// ---------------------------------------------------------------------------

/**
 * Valida a execução de uma lição. `lesson.challenge` decide o modo.
 *
 * Nunca lança: se a query do aluno falhou (`result.success === false`), a
 * validação devolve `passed: false` em modo "error".
 */
export function validateLessonResult(
  lesson: SQLLesson,
  result: SQLExecutionResult
): SQLValidationResult {
  if (!result.success) {
    return {
      passed: false,
      mode: "error",
      message: "Sua consulta não pôde ser executada. Veja o erro abaixo e ajuste o SQL.",
      details: result.error ? [result.error] : ["Erro desconhecido ao executar a consulta."],
    };
  }

  switch (lesson.challenge.kind) {
    case "exact":
      return validateExact(lesson.challenge, result);
    case "schema":
      return validateSchema(lesson.challenge, result);
    case "data":
      return validateData(lesson.challenge, result);
    default:
      return {
        passed: false,
        mode: "error",
        message: "Esta lição não possui um desafio válido configurado.",
        details: [],
      };
  }
}
