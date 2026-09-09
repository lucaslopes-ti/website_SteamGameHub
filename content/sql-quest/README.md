# SQL Quest — Base de Conteúdo (Markdown versionado)

Este diretório é a **fonte de conteúdo** da SQL Quest em Markdown. As 12
lições atuais do runtime (`data/sql-quest/lessons.ts`) **não são tocadas** —
esta base é paralela e será ativada quando o currículo real for enviado.

## Estado atual

O currículo completo foi convertido de `docs/sql_bootdev.md` para esta base:
**48 unidades** em Português do Brasil, ambientadas no **Senai Pay** (aplicativo
de pagamentos fictício) e no **Senai Pay Comunidade** (recurso de rede social),
organizadas em **5 capítulos**:

| Capítulo | Slug | Unidades |
|---|---|---|
| 1 — Consultas com SELECT | `select` | 7 |
| 2 — Criando e alterando tabelas | `tabelas` | 10 |
| 3 — Restrições e integridade dos dados | `restricoes` | 8 |
| 4 — CRUD: inserir, atualizar e excluir registros | `crud` | 13 |
| 5 — Juntando tabelas com JOIN | `joins` | 10 |

Nenhuma imagem foi enviada ainda: as unidades **não** referenciam imagens no
front matter. O manifesto de imagens pendentes está em `images/PENDING.md`.

## Estrutura

```
content/sql-quest/
├── chapters.md        # Metadados dos capítulos (fonte de verdade)
├── lessons/           # ← 48 arquivos .md de unidade
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