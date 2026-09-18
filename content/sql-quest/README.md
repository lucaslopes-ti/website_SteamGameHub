# SQL Quest — Base de Conteúdo (Markdown versionado)

Este diretório é a **fonte de conteúdo** da SQL Quest em Markdown. O runtime usa
esta base: `lib/sql-quest/catalog.ts` consome o catálogo gerado
(`data/sql-quest/generated.ts`), produzido a partir de
`content/sql-quest/lessons/*.md` e `chapters.md` em tempo de build.

## Estado atual

O currículo completo foi convertido de `docs/sql_bootdev.md` para esta base:
**95 unidades** em Português do Brasil, ambientadas no **Senai Pay** (aplicativo
de pagamentos fictício) e no **Senai Pay Comunidade** (recurso de rede social),
organizadas em **11 capítulos**:

| Capítulo | Slug | Unidades |
|---|---|---|
| 1 — Consultas com SELECT | `select` | 7 |
| 2 — Criando e alterando tabelas | `tabelas` | 10 |
| 3 — Restrições e integridade dos dados | `restricoes` | 8 |
| 4 — CRUD: inserir, atualizar e excluir registros | `crud` | 13 |
| 5 — Filtros, operadores e curingas | `filtros` | 11 |
| 6 — Ordenação e limites de resultados | `ordenacao` | 6 |
| 7 — Funções de agregação | `agregacao` | 9 |
| 8 — Subqueries | `subqueries` | 5 |
| 9 — Normalização e modelagem de dados | `normalizacao` | 11 |
| 10 — Juntando tabelas com JOIN | `joins` | 10 |
| 11 — Performance e índices | `performance` | 5 |

As imagens já fornecidas ficam em `images/` e são referenciadas no front matter
das unidades (a UI resolve o `src` relativo para `/uploads/images/<src>`):

| Arquivo | Unidade | Tema |
|---|---|---|
| `sql_logos.png` | `select-01` | Logos de bancos de dados SQL |
| `cardinalidade.png` | `normalizacao-01` | Relacionamentos e cardinalidade (1:1, 1:N, N:N) |
| `normalizacao1fn2fn3fn.png` | `normalizacao-05` | Comparação das formas normais (1NF, 2NF, 3NF) |

O manifesto `images/PENDING.md` permanece como sugestão de imagens futuras.

## Estrutura

```
content/sql-quest/
├── chapters.md        # Metadados dos capítulos (fonte de verdade)
├── lessons/           # ← 95 arquivos .md de unidade
├── images/            # ← imagens locais referenciadas no front matter
└── fixtures/          # Exemplos válidos e inválidos (usados nos testes)
```

## Natureza das unidades

| Natureza | Como representar |
|---|---|
| **Prática** | `challenge.kind: exact` ou `schema` (executa SQL) |
| **Quiz** | `challenge.kind: quiz` (perguntas de múltipla escolha) |
| **Theory** | sem `challenge` (apenas narrativa) |

## Como fornecer suas unidades

1. Crie um arquivo `.md` por unidade em `lessons/`.
2. Use o front matter (entre `---` ... `---`) para os metadados estruturados
   (id semântico, capítulo, XP, pré-requisitos, dicas, referências SQL,
   `setupSql`, schema inicial, `images` e `challenge`).
3. Coloque as imagens em `images/` e referencie-as com `src` relativo e `alt`.
4. Escreva a narrativa no corpo Markdown (com ao menos um título `##`).
5. Valide com:

```bash
npm run validate:sql-quest-content
```

O contrato completo (campos, tipos, exemplos e regras) está em
[`docs/SQL_QUEST_CONTENT.md`](../../docs/SQL_QUEST_CONTENT.md). Exemplos
prontos estão em `fixtures/valid/lessons/`.
