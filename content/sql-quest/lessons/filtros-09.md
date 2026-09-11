---
id: filtros-09
title: "O curinga de caractere único (_)"
summary: "Use o curinga _ para corresponder exatamente a um caractere em um padrão LIKE."
chapter: 5
chapterSlug: filtros
lesson: 9
difficulty: iniciante
xp: 28
prerequisites:
  - filtros-08
hints:
  - "Combine LIKE 'Bo___' para nomes que começam com Bo e têm exatamente 5 caracteres."
  - "SELECT * FROM users WHERE name LIKE 'Bo___';"
references:
  - label: "SQLite — Expressions"
    url: "https://www.sqlite.org/lang_expr.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country_code TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, country_code, username, password, is_admin) VALUES
    (1, 'David', 34, 'US', 'DavidDev', 'insertPractice', false),
    (2, 'Bonnie', 33, 'CA', 'BonnieSQL', 'bonniePass', false),
    (3, 'Bodhi', 26, 'US', 'BodhiApp', 'zenQuery', false),
    (4, 'Bo', 40, 'US', 'BoCoder', 'boPass', false),
    (5, 'Bobby', 29, 'CA', 'BobbySQL', 'bobbyPass', false),
    (6, 'Ram', 42, 'IN', 'Ram11c', 'queryNinja', false);
tables:
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
challenge:
  kind: exact
  instruction: "Escreva uma consulta que retorne todos os dados da tabela `users` para usuários cujos nomes começam com Bo e têm exatamente 5 caracteres."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
  expectedRows:
    - [3, "Bodhi", 26, "US", "BodhiApp", "zenQuery", 0]
    - [5, "Bobby", 29, "CA", "BobbySQL", "bobbyPass", 0]
  orderSensitive: false
---

## Contexto

Como discutimos, o operador curinga `%` corresponde a zero ou mais caracteres.
O operador curinga `_`, por outro lado, corresponde a apenas um único
caractere.

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE '_oot';
```

A consulta acima corresponde a produtos como:

- `boot`
- `root`
- `foot`

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE '__oot';
```

A consulta acima corresponde a produtos como:

- `shoot`
- `groot`

## Sua vez

O RH conseguiu refinar ainda mais a consulta! Eles querem um relatório de todos
os dados da tabela `users` para usuários cujos nomes começam com Bo e têm
exatamente 5 caracteres.