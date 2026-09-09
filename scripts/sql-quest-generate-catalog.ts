/**
 * Gera o catálogo da SQL Quest a partir do conteúdo Markdown.
 *
 * Fluxo:
 * 1. Carrega e VALIDA `content/sql-quest` (chapters.md + lessons/*.md) via
 *    `buildContentBundle` — qualquer erro de conteúdo aborta a geração.
 * 2. Mapeia o bundle de conteúdo para o catálogo runtime (`SQLLesson`/
 *    `SQLChapter`) via `mapContentBundle`.
 * 3. Serializa em `data/sql-quest/generated.ts` (módulo puro de dados, sem
 *    fs/Node) — idempotente: só escreve quando o conteúdo muda.
 *
 * Uso:
 *   npm run generate:sql-quest-catalog
 *
 * Este script roda automaticamente antes de `next build`/`next dev` (hooks
 * `prebuild`/`predev` no package.json), garantindo que o artefato esteja em
 * dia antes de o Next compilar.
 */
import fs from "node:fs";
import path from "node:path";
import { buildContentBundle } from "../lib/sql-quest/content/build";
import { mapContentBundle } from "../lib/sql-quest/content/mapper";
import { serializeCatalogSource } from "../lib/sql-quest/content/codegen";

const CONTENT_DIR = path.resolve(process.cwd(), "content/sql-quest");
const OUT_FILE = path.resolve(process.cwd(), "data/sql-quest/generated.ts");

function printIssues(issues: { file: string; severity: string; field?: string; message: string }[]): void {
  for (const issue of issues) {
    const tag = issue.severity === "error" ? "ERRO" : "AVISO";
    const field = issue.field ? ` (${issue.field})` : "";
    console.error(`  [${tag}] ${issue.file}${field}: ${issue.message}`);
  }
}

const result = buildContentBundle(CONTENT_DIR);
if (!result.ok) {
  console.error(
    `SQL Quest — geração de catálogo abortada (${result.issues.length} problema(s)):`
  );
  printIssues(result.issues);
  process.exit(1);
}

const mapped = mapContentBundle(result.bundle);
const source = serializeCatalogSource(
  mapped.chapters,
  mapped.lessons,
  result.bundle.version
);

const existing = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : null;
if (existing === source) {
  console.log(
    `SQL Quest — catálogo já em dia (${mapped.chapters.length} capítulo(s), ${mapped.lessons.length} lição(ões)); nada a escrever.`
  );
} else {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, source, "utf8");
  console.log(
    `SQL Quest — catálogo gerado em ${path.relative(process.cwd(), OUT_FILE)} (${mapped.chapters.length} capítulo(s), ${mapped.lessons.length} lição(ões)).`
  );
}