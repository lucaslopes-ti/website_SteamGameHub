/**
 * Testes do parser de front matter (subconjunto YAML) da base de conteúdo.
 *
 * Camada pura: não depende de fs, sql.js nem Firebase.
 *
 * @jest-environment node
 */
import {
  parseFrontMatter,
  parseYamlSubset,
  FrontMatterError,
} from "@/lib/sql-quest/content/frontmatter";

describe("parseFrontMatter", () => {
  it("separa dados e corpo Markdown", () => {
    const raw = `---
id: select-01
title: "Olá"
---

# Corpo

Texto da lição.
`;
    const { data, body } = parseFrontMatter(raw);
    expect(data.id).toBe("select-01");
    expect(data.title).toBe("Olá");
    expect(body).toContain("# Corpo");
    expect(body).toContain("Texto da lição.");
  });

  it("aceita quebras de linha CRLF (Windows)", () => {
    const raw = "---\r\nid: select-01\r\n---\r\n# Corpo\r\n";
    const { data, body } = parseFrontMatter(raw);
    expect(data.id).toBe("select-01");
    expect(body).toBe("# Corpo\n");
  });

  it("lança FrontMatterError quando não há front matter", () => {
    expect(() => parseFrontMatter("# sem front matter")).toThrow(FrontMatterError);
  });

  it("lança FrontMatterError quando o topo não é um mapa", () => {
    expect(() => parseFrontMatter("---\n- a\n- b\n---\n")).toThrow(FrontMatterError);
  });
});

describe("parseYamlSubset — escalares", () => {
  it("parseia inteiros, decimais, booleanos e null", () => {
    const v = parseYamlSubset(
      "a: 1\nb: 2.5\nc: true\nd: false\ne: null\nf: texto\n"
    );
    expect(v).toEqual({ a: 1, b: 2.5, c: true, d: false, e: null, f: "texto" });
  });

  it("parseia strings com aspas simples e duplas", () => {
    const v = parseYamlSubset('a: "com aspas"\nb: \'simples\'\n');
    expect(v).toEqual({ a: "com aspas", b: "simples" });
  });

  it("ignora linhas de comentário e em branco", () => {
    const v = parseYamlSubset("# comentário\n\na: 1\n\n# outro\nb: 2\n");
    expect(v).toEqual({ a: 1, b: 2 });
  });
});

describe("parseYamlSubset — listas e mapas", () => {
  it("parseia listas em bloco", () => {
    const v = parseYamlSubset("hints:\n  - um\n  - dois\n");
    expect(v).toEqual({ hints: ["um", "dois"] });
  });

  it("parseia listas inline", () => {
    const v = parseYamlSubset("nums: [1, 2, 3]\ncols: [id, nome]\n");
    expect(v).toEqual({ nums: [1, 2, 3], cols: ["id", "nome"] });
  });

  it("parseia mapas aninhados e listas de mapas", () => {
    const v = parseYamlSubset(`challenge:
  kind: exact
  expectedTables:
    - name: a
      columns:
        - name: id
          type: INTEGER
`);
    expect(v).toEqual({
      challenge: {
        kind: "exact",
        expectedTables: [
          { name: "a", columns: [{ name: "id", type: "INTEGER" }] },
        ],
      },
    });
  });

  it("parseia mapas inline", () => {
    const v = parseYamlSubset("ref: { label: SQLite, url: https://x.dev }\n");
    expect(v).toEqual({ ref: { label: "SQLite", url: "https://x.dev" } });
  });

  it("parseia linhas de valores aninhados com listas inline", () => {
    const v = parseYamlSubset(
      "foreignKeys:\n  - columns: [cliente_id]\n    table: clientes\n"
    );
    expect(v).toEqual({
      foreignKeys: [{ columns: ["cliente_id"], table: "clientes" }],
    });
  });

  it("parseia estrutura de quiz (lista de perguntas com options e answer)", () => {
    const v = parseYamlSubset(`challenge:
  kind: quiz
  instruction: "Responda."
  questions:
    - prompt: "Qual a capital?"
      options:
        - "São Paulo"
        - "Brasília"
      answer: 1
      explanation: "Brasília é a capital."
    - prompt: "Qual a maior cidade?"
      options: ["São Paulo", "Rio"]
      answer: 0
`);
    expect(v).toEqual({
      challenge: {
        kind: "quiz",
        instruction: "Responda.",
        questions: [
          {
            prompt: "Qual a capital?",
            options: ["São Paulo", "Brasília"],
            answer: 1,
            explanation: "Brasília é a capital.",
          },
          {
            prompt: "Qual a maior cidade?",
            options: ["São Paulo", "Rio"],
            answer: 0,
          },
        ],
      },
    });
  });

  it("parseia metadados de imagem (alt + src)", () => {
    const v = parseYamlSubset(
      "images:\n  - alt: \"Logos SQL\"\n    src: sql_logos.png\n"
    );
    expect(v).toEqual({ images: [{ alt: "Logos SQL", src: "sql_logos.png" }] });
  });
});

describe("parseYamlSubset — blocos literais", () => {
  it("parseia bloco literal (|) preservando quebras e linhas em branco", () => {
    const v = parseYamlSubset("sql: |\n  SELECT 1;\n\n  SELECT 2;\n") as Record<string, unknown>;
    expect(v.sql).toBe("SELECT 1;\n\nSELECT 2;");
  });

  it("parseia bloco dobrado (>) unindo linhas com espaço", () => {
    const v = parseYamlSubset("desc: >\n  linha um\n  linha dois\n") as Record<string, unknown>;
    expect(v.desc).toBe("linha um linha dois");
  });

  it("suporta chomping '-' (remove quebras finais)", () => {
    const v = parseYamlSubset("sql: |-\n  SELECT 1;\n") as Record<string, unknown>;
    expect(v.sql).toBe("SELECT 1;");
  });
});

describe("parseYamlSubset — erros", () => {
  it("rejeita indentação com tab", () => {
    expect(() => parseYamlSubset("a:\n\tb: 1\n")).toThrow(FrontMatterError);
  });

  it("rejeita string com aspas duplas não fechada", () => {
    expect(() => parseYamlSubset('a: "sem fechar\n')).toThrow(FrontMatterError);
  });

  it("rejeita indentação inconsistente", () => {
    expect(() => parseYamlSubset("a: 1\n  b: 2\n")).toThrow(FrontMatterError);
  });

  it("rejeita linha sem chave", () => {
    expect(() => parseYamlSubset("apenas texto\n")).toThrow(FrontMatterError);
  });
});