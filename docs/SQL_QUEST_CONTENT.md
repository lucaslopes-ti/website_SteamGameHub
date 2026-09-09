# 📚 SQL Quest — Base de Conteúdo em Markdown (Contrato)

> **Status:** v1.1 — SQLite · **Escopo:** conteúdo versionado em Markdown para a
> SQL Quest, **paralelo** às 12 lições atuais (`data/sql-quest/lessons.ts`),
> que **não são alteradas** até o envio do currículo real.
>
> **v1.1:** adiciona `challenge.kind: quiz`, unidades **theory** (sem desafio
> executável) e metadados de **imagem** por unidade — preparando a conversão de
> `docs/sql_bootdev.md` (CashPal → Senai Pay).

Este documento define o **contrato validável** de front matter + corpo Markdown
para lições da SQL Quest, os metadados estruturados necessários aos desafios
SQL e como o usuário deve fornecer seus arquivos `.md`.

---

## 1. Visão geral

A base de conteúdo vive em `content/sql-quest/`:

```
content/sql-quest/
├── chapters.md        # Metadados dos capítulos (fonte de verdade)
├── lessons/           # ← um arquivo .md por unidade (fornecido pelo usuário)
├── images/            # ← imagens locais referenciadas em `images` (front matter)
├── fixtures/          # Exemplos válidos/inválidos usados nos testes
└── README.md          # Guia rápido
```

Cada unidade é um arquivo Markdown com duas partes:

1. **Front matter** (entre `---` ... `---`): metadados estruturados em um
   subconjunto estrito de YAML — id semântico, capítulo, XP, pré-requisitos,
   dicas, referências SQL, `setupSql`, schema inicial, imagens e desafio.
2. **Corpo Markdown**: a narrativa da unidade (contexto, exemplos, "sua vez").

Uma unidade pode ser de três naturezas:

| Natureza | Como é representada |
|---|---|
| **Prática** | `challenge.kind: exact` ou `schema` (executa SQL) |
| **Quiz** | `challenge.kind: quiz` (perguntas de múltipla escolha) |
| **Theory** | sem `challenge` (apenas narrativa, sem desafio executável) |

O pipeline é **build-time e independente** do runtime da SQL Quest
(`lib/sql-quest/content/`), sem dependências novas:

| Módulo | Responsabilidade |
|---|---|
| `types.ts` | Contrato tipado (unidade, capítulo, desafio, bundle, issues) |
| `frontmatter.ts` | Parser do subconjunto YAML + separação front matter/corpo |
| `validate.ts` | Validação pura (campos, corpo, quiz, imagens, bundle, pré-requisitos, ciclos) |
| `loader.ts` | Leitura de `chapters.md` + `lessons/*.md` (Node/fs) |
| `build.ts` | Orquestra load + validação (inclui existência das imagens) e devolve `{ bundle, issues, ok }` |

---

## 2. Como fornecer suas lições (fluxo do usuário)

1. **Crie um arquivo `.md` por lição** em `content/sql-quest/lessons/`.
   Nomeie pelo id semântico (ex.: `select-01.md`).
2. **Preencha o front matter** conforme a seção 3.
3. **Escreva a narrativa** no corpo (seção 4).
4. **Valide**:

```bash
npm run validate:sql-quest-content
```

O script carrega e valida todo o diretório, imprime os problemas e sai com
código 1 se houver qualquer erro. Exemplos prontos:
`content/sql-quest/fixtures/valid/lessons/`.

> **Regra de ouro:** o front matter é a única fonte dos metadados do desafio.
> O corpo é apenas narrativa. Se um campo não estiver no contrato, o validador
> o ignora (mas o parser o preserva no objeto `data`).

---

## 3. Contrato do front matter

O front matter usa um **subconjunto estrito de YAML** (sem dependências):

- indentação por **espaços** (2 por nível; **tab é rejeitado**);
- mapas aninhados, listas em bloco (`- item`) e inline (`[a, b]`);
- mapas inline (`{a: 1}`);
- escalares: string (com/sem aspas), inteiro, decimal, booleano, `null`;
- blocos literais `|` e dobrados `>`, com chomping `-`/`+`;
- linhas cujo conteúdo começa com `#` são comentários (removidos).

### 3.1 Campos da lição

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `id` | string | ✅ | **Id semântico**: minúsculas e hífens, ex.: `select-01`, `joins-02`. Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`, máx. 64 chars, único no bundle |
| `title` | string | ✅ | Título exibido na lição |
| `summary` | string | ✅ | Resumo curto para cards/listas |
| `chapter` | inteiro | ✅ | Número do capítulo (1-based); deve existir em `chapters.md` |
| `chapterSlug` | string | ✅ | Slug do capítulo; deve conferir com `chapters.md` |
| `lesson` | inteiro | ✅ | Posição da lição no capítulo (1-based); única por capítulo |
| `difficulty` | string | ✅ | `iniciante` \| `intermediario` \| `avancado` |
| `xp` | inteiro | ✅ | XP ao concluir; inteiro >= 1 |
| `prerequisites` | lista de strings | ➖ | Ids semânticos de lições concluídas antes; devem existir e não formar ciclo |
| `hints` | lista de strings | ➖ | Dicas liberadas progressivamente |
| `references` | lista de `{label, url}` | ➖ | Referências SQL (documentação); `url` deve ser http(s) |
| `setupSql` | string (bloco `\|`) | ⚠️ | **Obrigatório** para desafios `exact`/`schema`; opcional para `quiz`/theory |
| `tables` | lista de tabelas | ➖ | Schema inicial para o SchemaViewer (ver 3.3) |
| `images` | lista de `{alt, src}` | ➖ | Metadados de imagem por unidade (ver 3.5) |
| `challenge` | objeto | ⚠️ | Desafio da unidade (ver 3.4). **Ausente** (ou `null`) em unidades **theory** |

### 3.2 Exemplo mínimo (desafio `exact`)

```markdown
---
id: select-01
title: "Sua primeira consulta: SELECT *"
summary: "Busque todas as colunas da tabela de clientes do NexoPay com SELECT *."
chapter: 1
chapterSlug: select
lesson: 1
difficulty: iniciante
xp: 50
prerequisites: []
hints:
  - "Use o comando SELECT seguido do coringa *."
  - "SELECT * FROM clientes;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE clientes (
    id INTEGER PRIMARY KEY,
    nome TEXT,
    cidade TEXT,
    saldo REAL,
    ativo INTEGER
  );

  INSERT INTO clientes (id, nome, cidade, saldo, ativo) VALUES
    (1, 'Ana Souza', 'São Paulo', 1250.75, 1),
    (2, 'Bruno Lima', 'Rio de Janeiro', 480.5, 1);
tables:
  - name: clientes
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: nome
        type: TEXT
challenge:
  kind: exact
  instruction: "Escreva uma consulta que traga todas as colunas e todos os registros da tabela `clientes`."
  expectedColumns: [id, nome, cidade, saldo, ativo]
  expectedRows:
    - [1, "Ana Souza", "São Paulo", 1250.75, 1]
    - [2, "Bruno Lima", "Rio de Janeiro", 480.5, 1]
  orderSensitive: false
---

## Contexto

Bancos de dados relacionais guardam informações em tabelas...

## Sua vez

Escreva a consulta que traz tudo da tabela `clientes`.
```

### 3.3 Schema inicial (`tables`)

Espelha o `SQLTableSchema` do runtime. Cada tabela:

```yaml
tables:
  - name: clientes
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: nome
        type: TEXT
        notNull: true
      - name: cidade
        type: TEXT
        references: { table: estados, column: sigla }
```

Atributos de coluna: `name` (obrigatório), `type`, `notNull`, `primaryKey`,
`unique`, `references: { table, column? }`.

### 3.4 Desafio (`challenge`)

#### `kind: exact` — compara colunas e linhas do resultado

```yaml
challenge:
  kind: exact
  instruction: "Escreva uma consulta que retorne nome e cidade."
  expectedColumns: [nome, cidade]   # na ordem exata
  expectedRows:
    - ["Ana Souza", "São Paulo"]
    - ["Bruno Lima", "Rio de Janeiro"]
  orderSensitive: false             # true quando a ordem das linhas importa
```

- `expectedColumns`: lista não vazia de nomes, **na ordem**.
- `expectedRows`: lista de linhas; cada célula é `string | number | null`.
- `orderSensitive`: booleano opcional (padrão `false`).

#### `kind: schema` — valida a estrutura do banco (DDL)

```yaml
challenge:
  kind: schema
  instruction: "Crie a tabela `transferencias` com FK para `clientes(id)`."
  expectedTables:
    - name: transferencias
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: cliente_id
          type: INTEGER
        - name: valor
          type: REAL
      foreignKeys:
        - columns: [cliente_id]
          table: clientes
          referencedColumns: [id]
      forbidColumns:
        - valor_antigo
```

- `columns`: colunas que DEVEM existir (as demais presentes não reprovam).
- `foreignKeys`: FKs que DEVEM existir (`columns`, `table`, `referencedColumns?`).
- `forbidColumns`: colunas que NÃO podem existir (ex.: após `RENAME COLUMN`).

#### `kind: quiz` — perguntas de múltipla escolha (sem execução de SQL)

```yaml
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual você usaria para controlar seus impostos e orçamento pessoal?"
      options:
        - "Um ábaco"
        - "Uma planilha (Excel ou Google Sheets)"
        - "Um banco SQL altamente escalável"
      answer: 1
      explanation: "Planilhas são ótimas para manipulação manual simples de dados."
    - prompt: "Qual você usaria para armazenar os registros de alunos de uma escola online?"
      options: ["Dedos", "Uma planilha", "Uma máquina de Turing", "Um banco SQL"]
      answer: 3
```

- `questions`: lista **não vazia** de perguntas.
- Cada pergunta: `prompt` (obrigatório), `options` (**ao menos 2** opções não
  vazias), `answer` (**índice 0-based** da opção correta, dentro do intervalo),
  `explanation` (opcional, exibida após responder).

#### Unidades **theory** (sem desafio executável)

Basta **omitir** `challenge` (ou usar `challenge: null`). O validador trata a
unidade como teoria: `setupSql` deixa de ser obrigatório e o corpo Markdown
continua sendo a narrativa. Exemplo: `content/sql-quest/fixtures/valid/lessons/teoria-01.md`.

### 3.5 Imagens por unidade (`images`)

Metadados estruturados das imagens usadas na unidade. Os arquivos ficam em
`content/sql-quest/images/` e o `src` é **relativo** a esse diretório:

```yaml
images:
  - alt: "Logos de bancos de dados SQL"
    src: "sql_logos.png"
  - alt: "Diagrama de Venn do INNER JOIN"
    src: "joins/innerjoin.jpg"
```

Regras de validação:

- `alt`: texto alternativo **não vazio** (acessibilidade).
- `src`: **caminho local seguro** — relativo (não começa com `/`), sem
  segmento `..` (sem path traversal), sem scheme (`http:`, `data:`, ...), sem
  barras invertidas, apenas caracteres seguros (`[a-zA-Z0-9_\-./]`) e extensão
  de imagem (`png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`).
- No **build**, o arquivo deve existir em `content/sql-quest/images/<src>`
  (erro se ausente).

No corpo Markdown, a imagem pode ser exibida normalmente com
`![alt](src)` — o front matter é o registro validado.

---

## 4. Contrato do corpo Markdown

O corpo é a **narrativa da unidade** e deve:

- ser **não vazio**;
- conter **ao menos um título** (`#` a `######`, ex.: `## Contexto`).

Sugestão de estrutura (não obrigatória, mas recomendada):

```markdown
## Contexto
Explicação do conceito com exemplos em blocos ```sql ... ```.

## Sua vez
Enunciado do desafio (reforça `challenge.instruction`).
```

Em unidades **theory**, o corpo é apenas a narrativa (ex.: `## Contexto` +
`## Observação`), sem seção de desafio.

---

## 5. Capítulos (`chapters.md`)

```markdown
---
version: 1.0.0
chapters:
  - number: 1
    slug: select
    title: "Consultas com SELECT"
    description: "Leia dados do NexoPay com SELECT."
  - number: 2
    slug: tabelas
    title: "Criando e alterando tabelas"
    description: "Crie e ajuste tabelas."
---
```

- `version`: semver opcional (padrão `1.0.0`).
- `chapters`: lista não vazia; `number` e `slug` únicos.

---

## 6. Validação (o que é checado)

**Por unidade** (`validateLessonDocument`): presença/tipo de todos os campos da
seção 3, padrão do `id`, `xp >= 1`, `difficulty` válida, estrutura de
`tables`/`challenge`, URLs http(s) em `references`, corpo não vazio com título.
Específico por natureza:

- **exact/schema**: `setupSql` obrigatório; estrutura de `expectedColumns`/
  `expectedRows`/`expectedTables` conforme 3.4.
- **quiz**: `questions` não vazia; cada pergunta com `prompt`, `options` (≥ 2),
  `answer` inteiro **dentro do intervalo** de `options`, `explanation` opcional.
- **theory** (sem `challenge`): `setupSql` opcional; corpo é a narrativa.
- **images**: `alt` não vazio e `src` **caminho local seguro** (relativo, sem
  `..`, sem scheme, extensão de imagem).

**Por capítulo** (`validateChapterDocument`): `version` semver, `chapters`
não vazia, `number`/`slug` únicos, campos preenchidos.

**Por bundle** (`validateBundle`):
- ids de lição únicos;
- `chapter` existe em `chapters.md` e `chapterSlug` confere;
- posição `lesson` única dentro do capítulo;
- pré-requisitos existem entre as lições;
- **sem ciclos** de pré-requisitos (DFS com detecção de ciclo).

**No build** (`buildContentBundle`): além de tudo acima, cada `images[].src`
deve existir em `content/sql-quest/images/` (erro se ausente).

**Erros de parse** (front matter malformado) são coletados por arquivo e
reportados junto — um arquivo quebrado não esconde os demais.

---

## 7. Testes

```bash
npx jest tests/sql-quest/content
```

| Arquivo | Cobre |
|---|---|
| `frontmatter.test.ts` | Parser YAML (escalares, listas, mapas, blocos `\|`/`>`, quiz, imagens, erros) |
| `validate.test.ts` | Unidades válidas/inválidas (exact/schema/quiz/theory), imagens, capítulos, bundle (pré-requisitos, ciclos) |
| `loader.test.ts` | Loader, build-time, erros de parse, existência de imagens |

Fixtures: `content/sql-quest/fixtures/{valid,invalid,invalid-bundle}/`.

---

## 8. Notas técnicas e limitações

- **Sem dependências novas**: o parser YAML é um subconjunto estrito escrito
  para este contrato. Não é um parser YAML completo — não use ancoras,
  aliases, tags, fluxos multi-documento nem indentação com tab.
- **Comentários `#`** são removidos mesmo dentro de blocos `|`/`>` (limitação
  documentada; SQLite usa `--` e `/* */`, então não afeta `setupSql`).
- **Node-only**: `loader.ts`/`build.ts` usam `node:fs`; tipos, front matter e
  validação são puros e podem ser importados em qualquer ambiente.
- **Imagens**: o build verifica existência em `content/sql-quest/images/`, mas
  não valida o conteúdo binário (apenas extensão e caminho seguro).
- **Integração futura**: quando o currículo real chegar, um mapper poderá
  converter `SQLContentLesson` no `SQLLesson` do runtime — nada disso é feito
  agora, e as 12 lições atuais permanecem intactas. O próximo passo converte
  `docs/sql_bootdev.md` (CashPal → Senai Pay) usando as imagens enviadas pelo
  usuário.