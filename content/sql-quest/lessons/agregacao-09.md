---
id: agregacao-09
title: "Prática: média de idades por país"
summary: "Combine AVG, ROUND e GROUP BY para calcular a idade média dos usuários de cada país."
chapter: 7
chapterSlug: agregacao
lesson: 9
difficulty: intermediario
xp: 60
prerequisites:
  - agregacao-08
hints:
  - "Selecione country_code e ROUND(AVG(age)) com o apelido (alias) average_age."
  - "Agrupe por country_code com GROUP BY."
  - "SELECT country_code, ROUND(AVG(age)) AS average_age FROM users GROUP BY country_code;"
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
  instruction: "Escreva uma instrução SQL que retorne duas colunas: o country_code e a idade média dos usuários daquele country_code. Arredonde a média para o número inteiro mais próximo e renomeie a coluna da idade média para average_age."
  expectedColumns:
    - country_code
    - average_age
  expectedRows:
    - ["US", 30]
    - ["BR", 29]
    - ["CA", 39]
    - ["IN", 42]
    - ["JP", 39]
    - ["ES", 36]
    - ["AU", 41]
  orderSensitive: false
---

## Contexto

O time de marketing do Senai Pay conseguiu otimizar a publicidade com a ajuda
dos dados de usuários que consultamos. Agora eles querem que você consulte a
idade média dos usuários de **cada país** em que a empresa opera — não apenas
dos Estados Unidos.

### Prática de consultas — idades médias

Vamos combinar o que aprendemos neste capítulo: agregação com `AVG`,
arredondamento com `ROUND`, apelidos com `AS` e agrupamento com `GROUP BY`.

## Sua vez

Escreva uma instrução SQL que retorne duas colunas: o `country_code` e a idade
média dos usuários daquele `country_code`. O time de marketing pediu que a
média seja arredondada para o número inteiro mais próximo e que a coluna com a
idade média seja renomeada para `average_age`.