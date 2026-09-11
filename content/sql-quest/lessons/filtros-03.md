---
id: filtros-03
title: "Filtrando entre valores com BETWEEN"
summary: "Use BETWEEN para filtrar valores em um intervalo inclusivo."
chapter: 5
chapterSlug: filtros
lesson: 3
difficulty: iniciante
xp: 28
prerequisites:
  - filtros-02
hints:
  - "Use a cláusula WHERE com BETWEEN."
  - "SELECT name, age FROM users WHERE age BETWEEN 18 AND 30;"
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
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false),
    (3, 'John', 39, 'CA', 'Jjdev21', 'sqlMaster2024', false),
    (4, 'Ram', 42, 'IN', 'Ram11c', 'queryNinja', false),
    (5, 'Hunter', 30, 'US', 'Hdev92', 'backendDev', false),
    (6, 'Allan', 27, 'US', 'Alires', 'adminPass1', true),
    (7, 'Lance', 20, 'US', 'LanChr', 'lancePass', false),
    (8, 'Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true),
    (9, 'Mia', 18, 'US', 'MiaDev', 'firstAdult', false),
    (10, 'Emma', 16, 'CA', 'EmmaDev', 'mapleSQL', false),
    (11, 'Aiko', 31, 'JP', 'AikoOps', 'sakuraCloud7', false);
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
  instruction: "Consulte a tabela `users` e retorne os campos `name` e `age` de todos os usuários com idade ENTRE 18 e 30 anos (inclusive)."
  expectedColumns:
    - name
    - age
  expectedRows:
    - ["Samantha", 29]
    - ["Hunter", 30]
    - ["Allan", 27]
    - ["Lance", 20]
    - ["Tiffany", 28]
    - ["Mia", 18]
  orderSensitive: false
---

## Contexto

Podemos verificar se valores estão entre dois números usando a cláusula
`WHERE` de uma forma intuitiva! A cláusula `WHERE` nem sempre precisa ser usada
para especificar IDs ou valores específicos. Também podemos usá-la para ajudar
a reduzir nosso conjunto de resultados. Veja um exemplo:

```sql
SELECT
  employee_name,
  salary
FROM
  employees
WHERE
  salary BETWEEN 30000 AND 60000;
```

Essa consulta retorna os campos `employee_name` e `salary` de todas as linhas
em que o salário está ENTRE 30.000 e 60.000, **inclusive**! Também podemos
consultar resultados que NÃO estão entre dois valores especificados:

```sql
SELECT
  product_name,
  quantity
FROM
  products
WHERE
  quantity NOT BETWEEN 20 AND 100;
```

Essa consulta retorna todos os nomes de produtos e quantidades em que a
quantidade não estava entre 20 e 100 (ou seja, excluindo 20 e 100). Podemos
usar condicionais para tornar os resultados da nossa consulta tão específicos
quanto precisarmos.

## Sua vez

Precisamos ver quantos jovens adultos estão usando o Senai Pay!

Consulte a tabela `users` e retorne os campos `name` e `age` de todos os
usuários com idade ENTRE 18 e 30 anos.