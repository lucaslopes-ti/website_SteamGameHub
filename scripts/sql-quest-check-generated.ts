/**
 * Verifica se o catálogo gerado (`data/sql-quest/generated.ts`) está em dia
 * com o conteúdo Markdown (`content/sql-quest`).
 *
 * Regenera o artefato em memória e compara com o arquivo versionado. Sai com
 * código 1 se estiver desatualizado (o CI deve rodar
 * `npm run generate:sql-quest-catalog` e commitar o resultado).
 *
 * Uso:
 *   npm run validate:sql-quest-catalog
 */
import fs from "node:fs";
import path from "node:path";
import { buildContentBundle } from "../lib/sql-quest/content/build";
import { mapContentBundle } from "../lib/sql-quest/content/mapper";
import { serializeCatalogSource } from "../lib/sql-quest/content/codegen";

const CONTENT_DIR = path.resolve(process.cwd(), "content/sql-quest");
const OUT_FILE = path.resolve(process.cwd(), "data/sql-quest/generated.ts");

const result = buildContentBundle(CONTENT_DIR);
if (!result.ok) {
  console.error(
    `SQL Quest — conteúdo inválido (${result.issues.length} problema(s)):`
  );
  for (const issue of result.issues) {
    const tag = issue.severity === "error" ? "ERRO" : "AVISO";
    const field = issue.field ? ` (${issue.field})` : "";
    console.error(`  [${tag}] ${issue.file}${field}: ${issue.message}`);
  }
  process.exit(1);
}

const mapped = mapContentBundle(result.bundle);
const expected = serializeCatalogSource(
  mapped.chapters,
  mapped.lessons,
  result.bundle.version
);

const existing = fs.existsSync(OUT_FILE) ? fs.readFileSync(OUT_FILE, "utf8") : null;
if (existing !== expected) {
  console.error(
    "SQL Quest — catálogo gerado DESATUALIZADO. Rode `npm run generate:sql-quest-catalog` e commite o artefato."
  );
  process.exit(1);
}

console.log(
  `SQL Quest — catálogo gerado em dia (${mapped.chapters.length} capítulo(s), ${mapped.lessons.length} lição(ões)).`
);