/**
 * Script de validação build-time da base de conteúdo da SQL Quest.
 *
 * Carrega e valida `content/sql-quest` (chapters.md + lessons/*.md) e imprime
 * todos os problemas encontrados. Sai com código 1 se houver qualquer erro.
 *
 * Uso:
 *   npm run validate:sql-quest-content
 */
import path from "node:path";
import { buildContentBundle } from "../lib/sql-quest/content/build";

const CONTENT_DIR = path.resolve(process.cwd(), "content/sql-quest");

const result = buildContentBundle(CONTENT_DIR);

if (result.issues.length > 0) {
  console.log(
    `SQL Quest — validação de conteúdo (${result.issues.length} problema(s)):`
  );
  for (const issue of result.issues) {
    const tag = issue.severity === "error" ? "ERRO" : "AVISO";
    const field = issue.field ? ` (${issue.field})` : "";
    console.log(`  [${tag}] ${issue.file}${field}: ${issue.message}`);
  }
} else {
  console.log("SQL Quest — conteúdo válido: nenhum problema encontrado.");
}

console.log(
  `Resumo: ${result.bundle.chapters.length} capítulo(s), ${result.bundle.lessons.length} lição(ões), versão ${result.bundle.version}.`
);

if (!result.ok) {
  process.exitCode = 1;
}