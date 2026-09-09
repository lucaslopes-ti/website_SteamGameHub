---
id: agregacao-04
title: "Menor valor com MIN"
summary: "Use MIN() para encontrar o menor valor de um conjunto, como a idade do usuário mais jovem."
chapter: 7
chapterSlug: agregacao
lesson: 4
difficulty: iniciante
xp: 50
prerequisites:
  - agregacao-03
hints:
  - "Use a função agregada MIN sobre a coluna age."
  - "Filtre com WHERE country_code = 'US'."
  - "SELECT MIN(age) AS age FROM users WHERE country_code = 'US';"
references:
  - label: "SQLite — Aggregate Functions"
    url: "https://www.sqlite.org/lang_aggfunc.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country_code TEXT NOT NULL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, country_code, is_admin) VALUES
    (1, 'David', 34, 'US', false),
    (2, 'Samantha', 29, 'BR', false),
    (3, 'John', 39, 'CA', false),
    (4, 'Ram', 42, 'IN', false),
    (5, 'Hunter', 30, 'US', false),
    (6, 'Allan', 27, 'US', true),
    (7, 'Al', 39, 'JP', false),
    (8, 'Tiffany', 28, 'US', true),
    (9, 'Marta', 36, 'ES', true),
    (10, 'Noah', 41, 'AU', true);
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
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Use uma agregação MIN para descobrir apenas a idade do usuário mais jovem do Senai Pay nos Estados Unidos (country_code = 'US'). Dê o apelido (alias) de age à coluna retornada."
  expectedColumns:
    - age
  expectedRows:
    - [27]
  orderSensitive: false
---

## Contexto

A função `MIN` funciona da mesma forma que a `MAX`, mas encontra o **menor
valor** em vez do maior.

```sql
SELECT product_name, MIN(price) FROM products;
```

Essa consulta retorna os campos `product_name` e `price` do registro com o menor
preço.

### O contexto do Senai Pay

O time de marketing quer saber a idade do usuário mais jovem nos Estados
Unidos.

## Sua vez

Use uma agregação `MIN` para descobrir apenas a idade do usuário mais jovem do
Senai Pay nos Estados Unidos (o `country_code` dos Estados Unidos é `US`). Dê o
apelido (alias) `age` à coluna retornada.