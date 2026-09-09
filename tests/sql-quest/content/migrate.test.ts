/**
 * Testes da migração de IDs da SQL Quest (catálogo legado → semântico).
 *
 * Cobre:
 * - o mapeamento explícito dos 12 ids legados ("capitulo-licao");
 * - `resolveLessonId` (semântico, legado e posicional);
 * - `resolveLessonIds` (dedupe + ordem oficial);
 * - `migrateLessonIds` (preserva o conjunto migrado, sem truncar lacunas).
 *
 * @jest-environment node
 */
import {
  LEGACY_ID_MIGRATION,
  migrateLessonIds,
  resolveLessonId,
  resolveLessonIds,
} from "@/lib/sql-quest/content/migrate";
import { lessons } from "@/lib/sql-quest/catalog";

const orderedIds = lessons.map((l) => l.id);

describe("LEGACY_ID_MIGRATION", () => {
  it("mapeia explicitamente os 12 ids antigos para ids semânticos", () => {
    expect(LEGACY_ID_MIGRATION).toEqual({
      "1-1": "select-01",
      "1-2": "select-02",
      "1-3": "select-03",
      "1-4": "select-04",
      "2-1": "tabelas-01",
      "2-2": "tabelas-02",
      "2-3": "tabelas-03",
      "2-4": "tabelas-04",
      "3-1": "restricoes-01",
      "3-2": "restricoes-02",
      "3-3": "restricoes-03",
      "3-4": "restricoes-04",
    });
  });

  it("todos os destinos existem no catálogo", () => {
    for (const target of Object.values(LEGACY_ID_MIGRATION)) {
      expect(lessons.some((l) => l.id === target)).toBe(true);
    }
  });
});

describe("resolveLessonId", () => {
  it("resolve ids semânticos diretamente", () => {
    expect(resolveLessonId("select-01")).toBe("select-01");
    expect(resolveLessonId("joins-10")).toBe("joins-10");
  });

  it("resolve ids legados via o mapa explícito", () => {
    expect(resolveLessonId("1-1")).toBe("select-01");
    expect(resolveLessonId("3-4")).toBe("restricoes-04");
  });

  it("resolve ids posicionais por capítulo/lição", () => {
    expect(resolveLessonId("4-13")).toBe("crud-13");
    expect(resolveLessonId("10-1")).toBe("joins-01");
  });

  it("devolve null para ids sem correspondência", () => {
    expect(resolveLessonId("abc")).toBeNull();
    expect(resolveLessonId("")).toBeNull();
    expect(resolveLessonId("99-1")).toBeNull();
    expect(resolveLessonId("1-99")).toBeNull();
    expect(resolveLessonId(null as unknown as string)).toBeNull();
  });
});

describe("resolveLessonIds", () => {
  it("deduplica e ordena pela ordem oficial da trilha", () => {
    expect(resolveLessonIds(["select-02", "select-01", "select-02"])).toEqual([
      "select-01",
      "select-02",
    ]);
  });

  it("descarta ids sem correspondência", () => {
    expect(resolveLessonIds(["select-01", "999-9", "abc"])).toEqual([
      "select-01",
    ]);
  });

  it("mistura formatos (semântico + legado + posicional)", () => {
    expect(resolveLessonIds(["1-1", "select-02", "2-1"])).toEqual([
      "select-01",
      "select-02",
      "tabelas-01",
    ]);
  });
});

describe("migrateLessonIds", () => {
  it("preserva o conjunto migrado completo (sem truncar lacunas)", () => {
    // Conjunto com lacunas (faltam select-04..07, tabelas-04..10, restricoes-01).
    const migrated = migrateLessonIds([
      "select-01",
      "select-02",
      "select-03",
      "tabelas-01",
      "tabelas-02",
      "tabelas-03",
      "restricoes-02",
      "restricoes-03",
      "restricoes-04",
    ]);
    expect(migrated).toEqual([
      "select-01",
      "select-02",
      "select-03",
      "tabelas-01",
      "tabelas-02",
      "tabelas-03",
      "restricoes-02",
      "restricoes-03",
      "restricoes-04",
    ]);
  });

  it("preserva um prefixo completo dos 12 ids legados", () => {
    const migrated = migrateLessonIds([
      "1-1",
      "1-2",
      "1-3",
      "1-4",
      "2-1",
      "2-2",
      "2-3",
      "2-4",
      "3-1",
      "3-2",
      "3-3",
      "3-4",
    ]);
    expect(migrated).toEqual([
      "select-01",
      "select-02",
      "select-03",
      "select-04",
      "tabelas-01",
      "tabelas-02",
      "tabelas-03",
      "tabelas-04",
      "restricoes-01",
      "restricoes-02",
      "restricoes-03",
      "restricoes-04",
    ]);
  });

  it("lista vazia → vazio", () => {
    expect(migrateLessonIds([])).toEqual([]);
  });

  it("ids desconhecidos são descartados", () => {
    expect(migrateLessonIds(["abc", "999-9"])).toEqual([]);
  });
});