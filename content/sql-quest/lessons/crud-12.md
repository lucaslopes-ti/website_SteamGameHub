---
id: crud-12
title: "Prática: contando usuários"
summary: "Use COUNT para descobrir quantos usuários existem no banco do Senai Pay."
chapter: 4
chapterSlug: crud
lesson: 12
difficulty: iniciante
xp: 50
prerequisites:
  - crud-11
hints:
  - "Use a função agregada COUNT."
  - "SELECT COUNT(*) FROM users;"
references:
  - label: "SQLite — Aggregates"
    url: "https://www.sqlite.org/lang_aggfunc.html"
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
    (7, 'Al', 39, 'JP', 'quickCoder', 'snake_case', false);
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
  instruction: "Escreva uma consulta que conte quantos usuários existem na tabela `users`."
  expectedColumns:
    - COUNT(*)
  expectedRows:
    - [7]
  orderSensitive: false
---

## Contexto

O time do Senai Pay quer saber quantos usuários estão cadastrados na
plataforma. Para isso, usamos a função agregada `COUNT`, que colapsa todas as
linhas em um único valor: a quantidade de registros.

```sql
SELECT COUNT(*) FROM users;
```

## Sua vez

Escreva uma consulta que conte quantos usuários existem na tabela `users`.