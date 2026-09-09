/**
 * Serializador do catálogo gerado da SQL Quest.
 *
 * Produz o texto-fonte TypeScript de `data/sql-quest/generated.ts` a partir do
 * catálogo mapeado (`SQLChapter[]` + `SQLLesson[]`). O artefato é um módulo
 * puro de dados (sem fs, sem Node) que pode ser importado por componentes
 * clientes, API routes e testes.
 *
 * Idempotência: a serialização é determinística — a mesma entrada produz
 * exatamente o mesmo texto, permitindo que o script de geração compare com o
 * arquivo existente e só escreva quando houver mudança.
 */
import type { SQLChapter, SQLLesson } from "../types";

/** Cabeçalho fixo do artefato gerado (aviso de autoria). */
const GENERATED_HEADER = `/**
 * Catálogo gerado da SQL Quest — NÃO EDITE MANUALMENTE.
 *
 * Fonte de verdade: content/sql-quest (chapters.md + lessons/*.md).
 * Gerado por scripts/sql-quest-generate-catalog.ts (npm run generate:sql-quest-catalog).
 * Qualquer edição manual será sobrescrita na próxima geração.
 */`;

/**
 * Serializa o catálogo em um módulo TypeScript válido e determinístico.
 * `JSON.stringify` produz expressões TS válidas para dados JSON-friendly.
 */
export function serializeCatalogSource(
  chapters: SQLChapter[],
  lessons: SQLLesson[],
  version: string
): string {
  const chaptersJson = JSON.stringify(chapters, null, 2);
  const lessonsJson = JSON.stringify(lessons, null, 2);
  return [
    GENERATED_HEADER,
    `import type { SQLChapter, SQLLesson } from "../../lib/sql-quest/types";`,
    ``,
    `/** Versão do conteúdo (semver), lida de chapters.md. */`,
    `export const catalogVersion = ${JSON.stringify(version)};`,
    ``,
    `/** Capítulos da trilha (ordenados por número). */`,
    `export const chapters: SQLChapter[] = ${chaptersJson};`,
    ``,
    `/** Lições da trilha (ordenadas por capítulo e posição). */`,
    `export const lessons: SQLLesson[] = ${lessonsJson};`,
    ``,
  ].join("\n");
}