---
id: crud-13
title: "Prática: atualização condicional"
summary: "Use UPDATE com WHERE para corrigir apenas os registros com um valor específico."
chapter: 4
chapterSlug: crud
lesson: 13
difficulty: iniciante
xp: 34
prerequisites:
  - crud-12
hints:
  - "A missão é padronizar o código de país, trocando `USA` por `US` apenas em quem ainda usa o valor antigo."
  - "Use o comando de atualização informando a coluna `country_code`, o novo valor e uma condição."
  - "A condição deve selecionar apenas quem tem `country_code` igual a `USA`; assim, registros que já estão com `US` não são tocados."
  - "Confira depois quantos registros foram afetados: só os que tinham o valor antigo."
references:
  - label: "SQLite — UPDATE"
    url: "https://www.sqlite.org/lang_update.html"
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
    (1, 'David', 34, 'USA', 'DavidDev', 'insertPractice', false),
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false),
    (3, 'Hunter', 30, 'USA', 'Hdev92', 'backendDev', false),
    (4, 'Aiko', 31, 'JP', 'AikoOps', 'sakuraCloud7', false);
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
  kind: data
  instruction: "Escreva uma instrução SQL para atualizar o valor de `country_code` de 'USA' para 'US' em todos os registros aplicáveis. Garanta que apenas os registros marcados com 'USA' sejam alterados."
  expectedTables:
    - name: users
      columns: [id, name, age, country_code, username, password, is_admin]
      rows:
        - [1, "David", 34, "US", "DavidDev", "insertPractice", 0]
        - [2, "Samantha", 29, "BR", "Sammy93", "addingRecords!", 0]
        - [3, "Hunter", 30, "US", "Hdev92", "backendDev", 0]
        - [4, "Aiko", 31, "JP", "AikoOps", "sakuraCloud7", 0]
      orderSensitive: false
---

## Contexto

Usando a consulta anterior, notamos que alguns registros foram salvos
incorretamente com um valor de `country_code` igual a `'USA'` em vez de `'US'`.

## Sua vez

A missão é corrigir dados inconsistentes e deixar só o código de país válido.

Sua instrução deve:

- atuar sobre a tabela `users`;
- alterar `country_code` de `USA` para `US`;
- atingir apenas os registros que ainda têm `USA`.

O filtro é o que garante que nenhuma linha já correta seja alterada.