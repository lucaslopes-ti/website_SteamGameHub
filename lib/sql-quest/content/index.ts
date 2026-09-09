/**
 * Ponto de entrada público da base de conteúdo da SQL Quest.
 *
 * Exporta tipos, parser de front matter, validação, loader e build-time.
 * Apenas `loader.ts`/`build.ts` dependem de Node (fs); tipos, front matter e
 * validação são puros e podem ser importados em qualquer ambiente.
 */
export * from "./types";
export * from "./frontmatter";
export * from "./validate";
export * from "./loader";
export * from "./build";