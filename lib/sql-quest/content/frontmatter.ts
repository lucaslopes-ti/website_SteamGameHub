/**
 * Parser de front matter para a base de conteúdo da SQL Quest.
 *
 * Implementa um subconjunto estrito de YAML, SEM dependências externas:
 * - mapas aninhados por indentação (espaços; tab é rejeitado);
 * - listas em bloco (`- item`) e inline (`[a, b]`);
 * - mapas inline (`{a: 1}`);
 * - escalares: string (com ou sem aspas), inteiro, decimal, booleano, null;
 * - blocos literais (`|`) e dobrados (`>`), com chomping `-`/`+`.
 *
 * Fora desse subconjunto o parser lança `FrontMatterError` — o contrato é
 * estrito de propósito, para que erros de autoria apareçam cedo (build-time).
 *
 * Limitações documentadas:
 * - Linhas cujo conteúdo começa com `#` são tratadas como comentário YAML e
 *   removidas (inclusive dentro de blocos `|`/`>`).
 * - Indentação deve usar espaços (2 por nível é a convenção).
 */
export class FrontMatterError extends Error {
  constructor(
    message: string,
    public readonly line?: number
  ) {
    super(message);
    this.name = "FrontMatterError";
  }
}

export interface ParsedFrontMatter {
  /** Mapa de chaves do front matter (já tipado como objeto). */
  data: Record<string, unknown>;
  /** Corpo Markdown após o front matter. */
  body: string;
}

const FRONT_MATTER_RE = /^---\n([\s\S]*?)\n---(?:\n|$)/;

/**
 * Separa o front matter (entre `---` ... `---`) do corpo Markdown.
 * Lança `FrontMatterError` se o arquivo não começar com front matter.
 */
export function parseFrontMatter(raw: string): ParsedFrontMatter {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = FRONT_MATTER_RE.exec(normalized);
  if (!match) {
    throw new FrontMatterError(
      "Front matter ausente: o arquivo deve começar com '---' e fechar com '---'."
    );
  }
  const yamlText = match[1];
  const body = normalized.slice(match[0].length);
  const data = parseYamlSubset(yamlText);
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new FrontMatterError(
      "O front matter deve conter um mapa de chaves no nível superior."
    );
  }
  return { data: data as Record<string, unknown>, body };
}

// ---------------------------------------------------------------------------
// Subconjunto YAML
// ---------------------------------------------------------------------------

interface YamlLine {
  indent: number;
  /** Conteúdo sem a indentação inicial ("" para linhas em branco). */
  text: string;
  raw: string;
  /** Número da linha no front matter (1-based), para mensagens de erro. */
  lineNo: number;
  blank: boolean;
}

/** Parseia o subconjunto YAML descrito no cabeçalho do módulo. */
export function parseYamlSubset(text: string): unknown {
  const lines = text.split("\n");
  const nodes: YamlLine[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (trimmed === "") {
      nodes.push({ indent: 0, text: "", raw, lineNo: i + 1, blank: true });
      continue;
    }
    if (trimmed.startsWith("#")) continue; // comentário YAML
    const indentMatch = /^[ ]*/.exec(raw);
    const indent = indentMatch ? indentMatch[0].length : 0;
    if (raw[indent] === "\t") {
      throw new FrontMatterError(
        "Indentação com tab não é permitida; use espaços.",
        i + 1
      );
    }
    nodes.push({
      indent,
      text: raw.slice(indent),
      raw,
      lineNo: i + 1,
      blank: false,
    });
  }

  if (nodes.length === 0) return {};
  const first = skipBlank(nodes, 0);
  if (first >= nodes.length) return {};
  const { value, next } = parseBlock(nodes, first, nodes[first].indent);
  const end = skipBlank(nodes, next);
  if (end < nodes.length) {
    throw new FrontMatterError(
      "Indentação inconsistente no front matter.",
      nodes[end].lineNo
    );
  }
  return value;
}

function skipBlank(nodes: YamlLine[], i: number): number {
  let j = i;
  while (j < nodes.length && nodes[j].blank) j += 1;
  return j;
}

function parseBlock(
  nodes: YamlLine[],
  i: number,
  indent: number
): { value: unknown; next: number } {
  const node = nodes[i];
  if (node.indent !== indent) {
    throw new FrontMatterError("Indentação inesperada.", node.lineNo);
  }
  if (node.text.startsWith("-")) return parseSequence(nodes, i, indent);
  return parseMap(nodes, i, indent);
}

function parseMap(
  nodes: YamlLine[],
  i: number,
  indent: number
): { value: Record<string, unknown>; next: number } {
  const result: Record<string, unknown> = {};
  while (i < nodes.length) {
    i = skipBlank(nodes, i);
    if (i >= nodes.length) break;
    const node = nodes[i];
    if (node.indent < indent) break;
    if (node.indent > indent) {
      throw new FrontMatterError("Indentação inesperada.", node.lineNo);
    }
    if (node.text.startsWith("-")) break; // sequência no mesmo nível: inválido aqui
    const { key, rest } = splitKeyValue(node.text, node.lineNo);

    if (rest === null) {
      // Valor aninhado (mapa/lista) nas linhas seguintes.
      const childIdx = skipBlank(nodes, i + 1);
      if (childIdx < nodes.length && nodes[childIdx].indent > indent) {
        const child = parseBlock(nodes, childIdx, nodes[childIdx].indent);
        result[key] = child.value;
        i = child.next;
      } else {
        result[key] = null;
        i = childIdx;
      }
    } else {
      const blockMatch = /^([|>])([+-]?)$/.exec(rest);
      if (blockMatch) {
        const collected = collectBlockLines(nodes, i + 1, indent);
        let text = collected.join("\n");
        if (blockMatch[1] === ">") text = foldBlock(text);
        if (blockMatch[2] === "-") text = text.replace(/\n+$/, "");
        if (blockMatch[2] === "+") text = `${text}\n`;
        result[key] = text;
        i = i + 1 + collected.length;
      } else {
        result[key] = parseScalarOrInline(rest, node.lineNo);
        i += 1;
      }
    }
  }
  return { value: result, next: i };
}

function parseSequence(
  nodes: YamlLine[],
  i: number,
  indent: number
): { value: unknown[]; next: number } {
  const result: unknown[] = [];
  while (i < nodes.length) {
    i = skipBlank(nodes, i);
    if (i >= nodes.length) break;
    const node = nodes[i];
    if (node.indent < indent) break;
    if (node.indent > indent) {
      throw new FrontMatterError("Indentação inesperada.", node.lineNo);
    }
    if (!node.text.startsWith("-")) break;
    const itemText = node.text.slice(1).trim();

    if (itemText === "") {
      const childIdx = skipBlank(nodes, i + 1);
      if (childIdx < nodes.length && nodes[childIdx].indent > indent) {
        const child = parseBlock(nodes, childIdx, nodes[childIdx].indent);
        result.push(child.value);
        i = child.next;
      } else {
        result.push(null);
        i = childIdx;
      }
      continue;
    }

    if (isKeyValueLine(itemText)) {
      const { key, rest } = splitKeyValue(itemText, node.lineNo);
      const item: Record<string, unknown> = {};
      if (rest === null) {
        const childIdx = skipBlank(nodes, i + 1);
        if (childIdx < nodes.length && nodes[childIdx].indent > indent) {
          const child = parseBlock(nodes, childIdx, nodes[childIdx].indent);
          item[key] = child.value;
          i = child.next;
        } else {
          item[key] = null;
          i = childIdx;
        }
      } else {
        const blockMatch = /^([|>])([+-]?)$/.exec(rest);
        if (blockMatch) {
          const collected = collectBlockLines(nodes, i + 1, indent);
          let text = collected.join("\n");
          if (blockMatch[1] === ">") text = foldBlock(text);
          if (blockMatch[2] === "-") text = text.replace(/\n+$/, "");
          if (blockMatch[2] === "+") text = `${text}\n`;
          item[key] = text;
          i = i + 1 + collected.length;
        } else {
          item[key] = parseScalarOrInline(rest, node.lineNo);
          i += 1;
        }
      }
      // Chaves de continuação do item de mapa (indentação mais profunda).
      const contIdx = skipBlank(nodes, i);
      if (contIdx < nodes.length && nodes[contIdx].indent > indent) {
        const cont = parseMap(nodes, contIdx, nodes[contIdx].indent);
        Object.assign(item, cont.value);
        i = cont.next;
      }
      result.push(item);
    } else {
      result.push(parseScalarOrInline(itemText, node.lineNo));
      i += 1;
    }
  }
  return { value: result, next: i };
}

/**
 * Coleta as linhas de um bloco literal/dobrado, preservando linhas em branco.
 * Retorna o conteúdo com a indentação do bloco removida.
 */
function collectBlockLines(nodes: YamlLine[], start: number, indent: number): string[] {
  const collected: string[] = [];
  let j = start;
  while (j < nodes.length && (nodes[j].blank || nodes[j].indent > indent)) {
    collected.push(nodes[j].blank ? "" : nodes[j].raw.slice(nodes[j].indent));
    j += 1;
  }
  while (collected.length > 0 && collected[collected.length - 1] === "") {
    collected.pop();
  }
  return collected;
}

function findKeyValueColon(text: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === ":" && !inSingle && !inDouble) return i;
  }
  return -1;
}

function isKeyValueLine(text: string): boolean {
  return findKeyValueColon(text) >= 0;
}

function splitKeyValue(
  text: string,
  lineNo: number
): { key: string; rest: string | null } {
  const colon = findKeyValueColon(text);
  if (colon < 0) {
    throw new FrontMatterError(
      `Linha sem chave: esperado "chave: valor".`,
      lineNo
    );
  }
  const key = text.slice(0, colon).trim();
  if (key === "") {
    throw new FrontMatterError("Chave vazia no front matter.", lineNo);
  }
  const rest = text.slice(colon + 1).trim();
  return { key, rest: rest === "" ? null : rest };
}

function parseScalarOrInline(text: string, lineNo: number): unknown {
  const t = text.trim();
  if (t === "") return null;
  if (t.startsWith("[") && t.endsWith("]")) return parseInlineArray(t, lineNo);
  if (t.startsWith("{") && t.endsWith("}")) return parseInlineMap(t, lineNo);
  return parseScalar(t, lineNo);
}

function parseInlineArray(text: string, lineNo: number): unknown[] {
  const inner = text.slice(1, -1).trim();
  if (inner === "") return [];
  return splitTopLevel(inner, ",").map((part) =>
    parseScalarOrInline(part.trim(), lineNo)
  );
}

function parseInlineMap(text: string, lineNo: number): Record<string, unknown> {
  const inner = text.slice(1, -1).trim();
  const result: Record<string, unknown> = {};
  if (inner === "") return result;
  for (const part of splitTopLevel(inner, ",")) {
    const { key, rest } = splitKeyValue(part.trim(), lineNo);
    result[key] = rest === null ? null : parseScalarOrInline(rest, lineNo);
  }
  return result;
}

/** Divide por um delimitador respeitando aspas e colchetes/chaves aninhados. */
function splitTopLevel(text: string, delim: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let current = "";
  for (const ch of text) {
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === "[" || ch === "{") depth += 1;
      else if (ch === "]" || ch === "}") depth -= 1;
      else if (ch === delim && depth === 0) {
        parts.push(current);
        current = "";
        continue;
      }
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

function parseScalar(text: string, lineNo: number): unknown {
  const t = text.trim();
  if (t === "") return null;
  if (t === "null" || t === "~" || t === "Null" || t === "NULL") return null;
  if (t === "true" || t === "True" || t === "TRUE") return true;
  if (t === "false" || t === "False" || t === "FALSE") return false;
  if (/^-?\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n;
  }
  if (/^-?\d+\.\d+$/.test(t)) {
    const n = Number(t);
    if (!Number.isNaN(n)) return n;
  }
  if (t.startsWith('"')) {
    if (!t.endsWith('"')) {
      throw new FrontMatterError(
        `String com aspas duplas não fechada: "${t}".`,
        lineNo
      );
    }
    return unquoteDouble(t.slice(1, -1));
  }
  if (t.startsWith("'")) {
    if (!t.endsWith("'")) {
      throw new FrontMatterError(
        `String com aspas simples não fechada: "${t}".`,
        lineNo
      );
    }
    return t.slice(1, -1).replace(/''/g, "'");
  }
  return t;
}

function unquoteDouble(s: string): string {
  return s.replace(/\\(["\\/bfnrt])/g, (_match, c: string) => {
    switch (c) {
      case "n":
        return "\n";
      case "t":
        return "\t";
      case "r":
        return "\r";
      case "b":
        return "\b";
      case "f":
        return "\f";
      default:
        return c;
    }
  });
}

/** Dobra quebras de linha simples em espaço (bloco `>`), preservando vazios. */
function foldBlock(text: string): string {
  const lines = text.split("\n");
  let out = "";
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "") {
      out += "\n";
    } else if (i > 0 && lines[i - 1].trim() !== "") {
      out += ` ${line}`;
    } else {
      out += line;
    }
  }
  return out;
}