---
id: crud-13
title: "Prática: códigos de país distintos"
summary: "Use DISTINCT para listar os códigos de país presentes na tabela de usuários sem repetições."
chapter: 4
chapterSlug: crud
lesson: 13
difficulty: iniciante
xp: 50
prerequisites:
  - crud-12
hints:
  - "Use a palavra-chave DISTINCT após o SELECT."
  - "SELECT DISTINCT country_code FROM users;"
references:
  - label: "SQLite — SELECT DISTINCT"
    url: "https://www.sqlite.org/lang_select.html"
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
  instruction: "Escreva uma consulta que retorne os códigos de país distintos presentes na tabela `users`."
  expectedColumns:
    - country_code
  expectedRows:
    - ["US"]
    - ["BR"]
    - ["CA"]
    - ["IN"]
    - ["JP"]
  orderSensitive: false
---

## Contexto

O time do Senai Pay quer saber de quais países vêm os usuários. Como vários
usuários podem ser do mesmo país, precisamos listar os códigos de país **sem
repetições**.

A palavra-chave `DISTINCT` remove valores duplicados do resultado:

```sql
SELECT DISTINCT country_code FROM users;
```

## Sua vez

Escreva uma consulta que retorne os códigos de país distintos presentes na
tabela `users`.