---
id: agregacao-03
title: "Maior valor com MAX"
summary: "Use MAX() para encontrar o maior valor de um conjunto, como a idade do usuário mais velho."
chapter: 7
chapterSlug: agregacao
lesson: 3
difficulty: iniciante
xp: 35
prerequisites:
  - agregacao-02
hints:
  - "Use a função agregada MAX sobre a coluna age."
  - "Filtre com WHERE is_admin = true."
  - "SELECT MAX(age) AS age FROM users WHERE is_admin = true;"
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
  instruction: "Use uma agregação MAX para retornar a idade do usuário mais velho do Senai Pay que também é administrador. Dê o apelido (alias) de age à coluna retornada."
  expectedColumns:
    - age
  expectedRows:
    - [41]
  orderSensitive: false
---

## Contexto

Como você deve imaginar, a função `MAX` recupera o **maior valor** de um
conjunto de valores. Por exemplo:

```sql
SELECT MAX(price) FROM products;
```

Essa consulta percorre todas as linhas da tabela `products` e retorna o maior
valor de `price`. Lembre-se: ela retorna apenas o preço, não o restante do
registro! Você sempre precisa especificar cada campo que deseja que a consulta
retorne.

### O contexto do Senai Pay

O time de produto quer saber a idade do usuário mais velho que também é
administrador.

## Sua vez

Use uma agregação `MAX` para retornar a idade do usuário mais velho do Senai
Pay que também é administrador (`is_admin` é `true`). Dê o apelido (alias)
`age` à coluna retornada.