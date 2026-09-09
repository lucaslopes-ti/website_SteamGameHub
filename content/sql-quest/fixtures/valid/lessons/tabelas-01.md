---
id: tabelas-01
title: "Criando tabelas com CREATE TABLE"
summary: "Estruture o armazenamento do NexoPay criando sua primeira tabela."
chapter: 2
chapterSlug: tabelas
lesson: 1
difficulty: iniciante
xp: 60
prerequisites:
  - select-01
hints:
  - "Comece com CREATE TABLE seguido do nome da tabela."
  - "Cada coluna leva um tipo: números inteiros usam INTEGER, textos usam TEXT."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  -- NexoPay: base vazia. Crie a tabela solicitada.
tables: []
challenge:
  kind: schema
  instruction: "Crie a tabela `estabelecimentos` com as colunas `id` (INTEGER) e `nome` (TEXT)."
  expectedTables:
    - name: estabelecimentos
      columns:
        - name: id
          type: INTEGER
        - name: nome
          type: TEXT
---

## Contexto

Consultar é só metade da história: um dia alguém precisa CRIAR as tabelas que
guardam os dados. O comando é `CREATE TABLE`:

```sql
CREATE TABLE nome_da_tabela (coluna tipo, coluna tipo);
```

Cada coluna recebe um nome e um tipo de dado. Por exemplo, `id INTEGER` guarda
números inteiros e `nome TEXT` guarda textos.

## Sua vez

O NexoPay está expandindo e quer cadastrar estabelecimentos parceiros que
aceitam pagamentos pela plataforma. Crie a tabela `estabelecimentos`.