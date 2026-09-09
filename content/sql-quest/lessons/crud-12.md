---
id: crud-12
title: "Prática: contagem condicional"
summary: "Combine COUNT com WHERE para contar apenas os usuários de um país específico."
chapter: 4
chapterSlug: crud
lesson: 12
difficulty: iniciante
xp: 50
prerequisites:
  - crud-11
hints:
  - "Use COUNT(*) com uma cláusula WHERE."
  - "Filtre por country_code = 'US'."
  - "SELECT COUNT(*) FROM users WHERE country_code = 'US';"
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
    (7, 'Lance', 20, 'US', 'LanChr', 'lancePass', false),
    (8, 'Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true),
    (9, 'Aiko', 31, 'JP', 'AikoOps', 'sakuraCloud7', false),
    (10, 'Marta', 36, 'ES', 'MartaDBA', 'oliveSQLtree', true),
    (11, 'Kwame', 24, 'GH', 'KDev24', 'accraAPI', false),
    (12, 'Noah', 41, 'AU', 'NoahRoot', 'koalaKernel', true);
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
  instruction: "Escreva uma consulta SQL que retorne a contagem de todos os registros da tabela `users` cujo `country_code` seja igual a 'US'."
  expectedColumns:
    - COUNT(*)
  expectedRows:
    - [4]
  orderSensitive: false
---

## Contexto

O Senai Pay tem um painel no site que mostra estatísticas sobre onde os
usuários estão localizados. Um membro do time de QA está preocupado porque o
número de usuários localizados nos EUA parece pequeno.

## Sua vez

Escreva uma consulta SQL que retorne a contagem de **todos** os registros da
tabela `users` cujo `country_code` seja igual a `'US'`.

Lembre-se: queremos saber o número total de registros, então podemos usar o
coringa (`*`) em `COUNT(*)`. Embora você normalmente pudesse usar a coluna `id`,
ou seja, `COUNT(id)`, nesta tarefa use o coringa.