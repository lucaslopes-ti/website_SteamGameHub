---
id: restricoes-02
title: "Constraints: regras para os dados"
summary: "Reconstrua a tabela users do Senai Pay aplicando NOT NULL, UNIQUE e PRIMARY KEY."
chapter: 3
chapterSlug: restricoes
lesson: 2
difficulty: iniciante
xp: 50
prerequisites:
  - restricoes-01
hints:
  - "id INTEGER PRIMARY KEY"
  - "username TEXT UNIQUE NOT NULL"
  - "name, age, country_code e password são NOT NULL"
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  -- Nenhum setup necessário: nesta unidade você recria a tabela do zero.
challenge:
  kind: schema
  instruction: "Crie a tabela `users` com os campos e constraints: id (INTEGER, PRIMARY KEY), name (TEXT, NOT NULL), age (INTEGER, NOT NULL), country_code (TEXT, NOT NULL), username (TEXT, UNIQUE, NOT NULL), password (TEXT, NOT NULL) e is_admin (BOOLEAN)."
  expectedTables:
    - name: users
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: name
          type: TEXT
          notNull: true
        - name: age
          type: INTEGER
          notNull: true
        - name: country_code
          type: TEXT
          notNull: true
        - name: username
          type: TEXT
          unique: true
          notNull: true
        - name: password
          type: TEXT
          notNull: true
        - name: is_admin
          type: BOOLEAN
---

## Contexto

Uma **constraint** (restrição) é uma regra que criamos no banco para impor um
comportamento específico. Por exemplo, definir uma constraint `NOT NULL` em uma
coluna garante que ela não aceitará valores NULL.

Se tentarmos inserir um valor NULL em uma coluna com `NOT NULL`, o INSERT
falha com uma mensagem de erro. Constraints são extremamente úteis quando
precisamos garantir que certos tipos de dados existam no banco.

### Definindo uma constraint NOT NULL

A constraint `NOT NULL` pode ser adicionada diretamente no `CREATE TABLE`:

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  -- PRIMARY KEY identifica cada linha da tabela de forma única
  name TEXT UNIQUE,
  -- UNIQUE garante que nenhuma linha tenha o mesmo valor na coluna name
  title TEXT NOT NULL
  -- NOT NULL garante que a coluna title não aceite valores NULL
);
```

### Limitação do SQLite

Em outros dialetos de SQL, você pode usar `ADD CONSTRAINT` dentro de um
`ALTER TABLE`. O SQLite **não suporta** esse recurso: por isso, ao criar as
tabelas, precisamos especificar todas as constraints que queremos desde o
início.

### Reconstruindo o banco do Senai Pay

Felizmente, todas as tabelas que criamos até agora foram para fins de teste!
Agora que entendemos melhor as constraints, vamos reconstruir o banco com as
regras corretas.

## Sua vez

Crie a tabela `users` com os seguintes campos e constraints:

- `id` — INTEGER, PRIMARY KEY
- `name` — TEXT, NOT NULL
- `age` — INTEGER, NOT NULL
- `country_code` — TEXT, NOT NULL
- `username` — TEXT, UNIQUE, NOT NULL
- `password` — TEXT, NOT NULL
- `is_admin` — BOOLEAN