---
id: ordenacao-06
title: "Prática: vazamento de senhas"
summary: "Combine IN e ORDER BY para listar usuários afetados por um vazamento, em ordem alfabética."
chapter: 6
chapterSlug: ordenacao
lesson: 6
difficulty: intermediario
xp: 41
prerequisites:
  - ordenacao-05
hints:
  - "Selecione apenas name e username."
  - "Use WHERE password IN ('backendDev', 'welovebootdev', 'SQLrocks')."
  - "SELECT name, username FROM users WHERE password IN ('backendDev', 'welovebootdev', 'SQLrocks') ORDER BY name;"
references:
  - label: "SQLite — SELECT"
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
    (6, 'Allan', 27, 'US', 'Alires', 'welovebootdev', true),
    (7, 'Al', 44, 'JP', 'quickCoder', 'SQLrocks', false),
    (8, 'Tiffany', 28, 'US', 'TiffT', 'tiffanyPass', true),
    (9, 'Marta', 36, 'ES', 'MartaDBA', 'spainPass', true),
    (10, 'Yuki', 58, 'JP', 'YukiSensei', 'retireSoon', false);
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
  instruction: "Retorne `name` e `username` de todos os usuários cujo `password` é igual a `backendDev`, `welovebootdev` ou `SQLrocks`, ordenados por `name` em ordem alfabética (A-Z)."
  expectedColumns:
    - name
    - username
  expectedRows:
    - ["Al", "quickCoder"]
    - ["Allan", "Alires"]
    - ["Hunter", "Hdev92"]
  orderSensitive: true
---

## Contexto

Más notícias: o Senai Pay sofreu seu primeiro vazamento de segurança. Um
estagiário deixou escapar um arquivo sensível com algumas senhas de usuários.
Pior ainda: a tabela `users` guarda as senhas em **texto puro**.

```sql
SELECT
  *
FROM
  users
WHERE
  password = 'hunter2';
```

Como sabemos exatamente quais senhas vazaram, podemos localizar os usuários
afetados e avisá-los antes de migrar para um sistema moderno de armazenamento
de senhas. Para verificar vários valores em uma única coluna, usamos o
operador `IN`.

## Sua vez

Escreva uma consulta na tabela `users` que:

- Retorne o `name` e o `username` de todos os usuários cuja `password` é igual
  a `backendDev`, `welovebootdev` ou `SQLrocks`.
- Ordene os registros de modo que os nomes fiquem em ordem alfabética (A-Z).
