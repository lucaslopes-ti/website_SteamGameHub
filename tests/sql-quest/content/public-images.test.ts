/**
 * Testes da publicação das imagens das lições em `public/uploads/images/`.
 *
 * Garante que a sincronização copia imagens ausentes ou alteradas e que todas
 * as imagens do conteúdo real já têm cópia pública idêntica (sem isso o
 * navegador recebe 404, como aconteceu no capítulo 15).
 *
 * @jest-environment node
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildContentBundle } from "@/lib/sql-quest/content/build";
import {
  PUBLIC_LESSON_IMAGES_DIR,
  collectLessonImageSrcs,
  findStalePublicImages,
  syncPublicImages,
} from "@/lib/sql-quest/content/public-images";

describe("syncPublicImages", () => {
  let tmp: string;
  let contentDir: string;
  let publicDir: string;

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sql-quest-images-"));
    contentDir = path.join(tmp, "content");
    publicDir = path.join(tmp, "public");
    fs.mkdirSync(path.join(contentDir, "images"), { recursive: true });
    fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(contentDir, "images", "a.png"), "A");
    fs.writeFileSync(path.join(contentDir, "images", "b.png"), "B");
    fs.writeFileSync(path.join(publicDir, "b.png"), "B");
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("copia apenas as imagens ausentes ou diferentes", () => {
    fs.writeFileSync(path.join(contentDir, "images", "b.png"), "B2");
    const copied = syncPublicImages(contentDir, publicDir, ["a.png", "b.png"]);
    expect(copied).toEqual(["a.png", "b.png"]);
    expect(fs.readFileSync(path.join(publicDir, "a.png"), "utf8")).toBe("A");
    expect(fs.readFileSync(path.join(publicDir, "b.png"), "utf8")).toBe("B2");
    expect(findStalePublicImages(contentDir, publicDir, ["a.png", "b.png"])).toEqual([]);
  });

  it("ignora imagens que não existem no conteúdo", () => {
    expect(syncPublicImages(contentDir, publicDir, ["nao-existe.png", "b.png"])).toEqual([]);
  });
});

describe("conteúdo real da SQL Quest", () => {
  it("todas as imagens das lições têm cópia idêntica em public/uploads/images", () => {
    const contentDir = path.resolve(process.cwd(), "content/sql-quest");
    const result = buildContentBundle(contentDir);
    const srcs = collectLessonImageSrcs(result.bundle);
    expect(srcs).toContain("subsistemas_plenum_riser.jpg");
    expect(
      findStalePublicImages(
        contentDir,
        path.resolve(process.cwd(), PUBLIC_LESSON_IMAGES_DIR),
        srcs
      )
    ).toEqual([]);
  });
});
