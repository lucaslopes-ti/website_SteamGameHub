---
id: agregacao-06
title: "Calculando médias com AVG"
summary: "Use AVG() para calcular a média de um conjunto de valores não nulos."
chapter: 7
chapterSlug: agregacao
lesson: 6
difficulty: iniciante
xp: 34
prerequisites:
  - agregacao-05
hints:
  - "Use a função agregada AVG sobre a coluna age."
  - "Filtre com WHERE country_code = 'US'."
  - "SELECT AVG(age) FROM users WHERE country_code = 'US';"
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
  instruction: "Retorne um único valor representando a idade média de todos os usuários cujo country_code é 'US'."
  expectedColumns:
    - AVG(age)
  expectedRows:
    - [29.75]
  orderSensitive: false
---

## Contexto

Assim como podemos querer encontrar os valores mínimo ou máximo de um conjunto
de dados, às vezes precisamos saber a **média**!

O SQL oferece a função `AVG()`. Assim como `MAX()`, `AVG()` calcula a média de
todos os valores **não nulos**.

```sql
SELECT AVG(song_length) FROM songs;
```

Essa consulta retorna a média de `song_length` na tabela `songs`.

### O contexto do Senai Pay

O time de marketing está tentando determinar os melhores canais de publicidade,
mas precisa de mais informações sobre os usuários atuais. Eles querem saber a
idade média dos usuários nos Estados Unidos.

## Sua vez

Retorne um único valor representando a idade média de todos os usuários cujo
`country_code` é `US`.