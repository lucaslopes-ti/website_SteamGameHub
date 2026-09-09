/**
 * Build-time da base de conteúdo da SQL Quest.
 *
 * Orquestra load + validação de um diretório de conteúdo e devolve um
 * `SQLContentBuildResult` com o bundle e a lista de problemas. É o ponto de
 * entrada usado pelo script `scripts/sql-quest-validate-content.ts` e pelos
 * testes de integração.
 *
 * Node-only (usa fs via `loader.ts`).
 */
import fs from "node:fs";
import path from "node:path";
import { loadContentDirectory } from "./loader";
import {
  validateChapterDocument,
  validateLessonDocument,
  validateBundle,
  isSafeImageSrc,
} from "./validate";
import type { SQLContentBundle, SQLContentIssue } from "./types";

export interface SQLContentBuildResult {
  bundle: SQLContentBundle;
  issues: SQLContentIssue[];
  /** true quando não há nenhum erro (avisos não reprovam). */
  ok: boolean;
}

/** Carrega e valida um diretório de conteúdo. Nunca lança. */
export function buildContentBundle(dir: string): SQLContentBuildResult {
  const load = loadContentDirectory(dir);
  const issues: SQLContentIssue[] = [...load.parseErrors];

  if (!load.chaptersDoc) {
    issues.push({
      file: path.join(dir, "chapters.md"),
      severity: "error",
      message: "Arquivo 'chapters.md' ausente.",
    });
  } else {
    issues.push(
      ...validateChapterDocument(load.chaptersDoc.data, load.chaptersDoc.file)
    );
  }

  if (load.lessonDocs.length === 0) {
    issues.push({
      file: path.join(dir, "lessons"),
      severity: "warning",
      message: "Nenhuma lição .md encontrada em 'lessons/'.",
    });
  }
  for (const doc of load.lessonDocs) {
    issues.push(...validateLessonDocument(doc.data, doc.body, doc.file));
  }

  // imagens referenciadas devem existir em <dir>/images/
  const imagesDir = path.join(dir, "images");
  for (const lesson of load.bundle.lessons) {
    for (const image of lesson.images) {
      if (!isSafeImageSrc(image.src)) continue; // já reportado pela validação pura
      const imagePath = path.join(imagesDir, image.src);
      if (!fs.existsSync(imagePath)) {
        issues.push({
          file: lesson.sourcePath,
          severity: "error",
          message: `Imagem não encontrada: "${image.src}" (esperada em ${path.relative(dir, imagePath)}).`,
          field: "images",
        });
      }
    }
  }

  issues.push(...validateBundle(load.bundle));

  return {
    bundle: load.bundle,
    issues,
    ok: issues.every((i) => i.severity !== "error"),
  };
}