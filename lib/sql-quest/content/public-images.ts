/**
 * Publicação das imagens das lições da SQL Quest.
 *
 * O front matter aponta para arquivos em `content/sql-quest/images/`, mas o
 * navegador só enxerga o que está em `public/`. O `LessonClient` resolve cada
 * `src` relativo para `/uploads/images/<src>`, então toda imagem referenciada
 * precisa ter uma cópia idêntica em `public/uploads/images/`.
 *
 * Node-only (usa fs).
 */
import fs from "node:fs";
import path from "node:path";
import { isSafeImageSrc } from "./validate";
import type { SQLContentBundle } from "./types";

/** Diretório público (relativo à raiz do projeto) servido como `/uploads/images/`. */
export const PUBLIC_LESSON_IMAGES_DIR = "public/uploads/images";

/** `src` únicos e seguros referenciados pelas lições do bundle. */
export function collectLessonImageSrcs(bundle: SQLContentBundle): string[] {
  const srcs = new Set<string>();
  for (const lesson of bundle.lessons) {
    for (const image of lesson.images) {
      if (isSafeImageSrc(image.src)) srcs.add(image.src);
    }
  }
  return [...srcs].sort();
}

/**
 * Lista os `src` cuja cópia pública está ausente ou diferente da original em
 * `<contentDir>/images/`. Imagens ausentes no conteúdo são ignoradas (o build
 * já reporta esse erro).
 */
export function findStalePublicImages(
  contentDir: string,
  publicDir: string,
  srcs: string[]
): string[] {
  const stale: string[] = [];
  for (const src of srcs) {
    const source = path.join(contentDir, "images", src);
    if (!fs.existsSync(source)) continue;
    const target = path.join(publicDir, src);
    if (
      !fs.existsSync(target) ||
      !fs.readFileSync(source).equals(fs.readFileSync(target))
    ) {
      stale.push(src);
    }
  }
  return stale;
}

/** Copia para `publicDir` as imagens ausentes ou desatualizadas. Devolve os `src` copiados. */
export function syncPublicImages(
  contentDir: string,
  publicDir: string,
  srcs: string[]
): string[] {
  const stale = findStalePublicImages(contentDir, publicDir, srcs);
  for (const src of stale) {
    const target = path.join(publicDir, src);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(contentDir, "images", src), target);
  }
  return stale;
}
