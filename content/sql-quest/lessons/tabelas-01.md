---
id: tabelas-01
title: "Criando uma tabela"
summary: "Aprenda a usar CREATE TABLE para criar a primeira tabela do banco do Senai Pay."
chapter: 2
chapterSlug: tabelas
lesson: 1
difficulty: iniciante
xp: 34
prerequisites:
  - select-07
hints:
  - "Cada campo é seguido do seu tipo de dado."
  - "CREATE TABLE people(id INTEGER, tag TEXT, name TEXT, age INTEGER, balance REAL, is_admin BOOLEAN);"
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  -- Nenhum setup necessário: nesta unidade você cria a tabela do zero.
challenge:
  kind: schema
  instruction: "Crie a tabela `people` com os seguintes campos: id (INTEGER), tag (TEXT), name (TEXT), age (INTEGER), balance (REAL) e is_admin (BOOLEAN)."
  expectedTables:
    - name: people
      columns:
        - name: id
          type: INTEGER
        - name: tag
          type: TEXT
        - name: name
          type: TEXT
        - name: age
          type: INTEGER
        - name: balance
          type: REAL
        - name: is_admin
          type: BOOLEAN
---

## Contexto

Para criar uma nova tabela em um banco de dados, usamos o comando `CREATE
TABLE` seguido do nome da tabela e dos campos que ela deve ter:

```sql
CREATE TABLE employees (id INTEGER, name TEXT, age INTEGER, is_manager BOOLEAN, salary INTEGER);
```

Cada campo é seguido do seu **tipo de dado** (vamos falar de tipos em breve).

Também é aceitável — e muito comum — quebrar o `CREATE TABLE` em várias linhas
para ficar mais legível:

```sql
CREATE TABLE employees (
  id INTEGER,
  name TEXT,
  age INTEGER,
  is_manager BOOLEAN,
  salary INTEGER
);
```

Vamos começar a montar o banco do **Senai Pay**.

## Sua vez

Crie a tabela `people` com os seguintes campos:

- `id` — INTEGER
- `tag` — TEXT
- `name` — TEXT
- `age` — INTEGER
- `balance` — REAL
- `is_admin` — BOOLEAN