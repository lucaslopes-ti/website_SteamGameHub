---
id: crud-05
title: "Contando registros com COUNT"
summary: "Use COUNT(*) para descobrir quantos registros existem em uma tabela."
chapter: 4
chapterSlug: crud
lesson: 5
difficulty: iniciante
xp: 28
prerequisites:
  - crud-04
hints:
  - "Use a função agregada COUNT com o coringa *."
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
  instruction: "Use COUNT(*) para recuperar o número de registros na tabela `users`."
  expectedColumns:
    - COUNT(*)
  expectedRows:
    - [12]
  orderSensitive: false
---

## Contexto

Podemos usar uma instrução `SELECT` para obter uma contagem dos registros de
uma tabela. Isso é muito útil quando precisamos saber quantos registros existem,
mas não nos importamos com o conteúdo deles.

Exemplo no SQLite:

```sql
SELECT
  COUNT(*)
FROM
  employees;
```

O `*` neste caso se refere a uma coluna. Não nos importamos com a contagem de
uma coluna específica — queremos saber o número total de registros, então
podemos usar o coringa (`*`).

O time de estratégia de negócios do Senai Pay quer saber quantos usuários do
aplicativo temos. Não podemos usar o número do `id` para calcular a contagem,
porque contas de usuário podem ser excluídas!

## Sua vez

Use uma instrução `COUNT(*)` para recuperar o número de registros na tabela
`users`. Neste curso, use `*` com `COUNT` a menos que as instruções peçam
especificamente para contar uma coluna em particular.