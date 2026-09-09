---
id: crud-data
title: "Inserindo registros"
summary: "Insira registros e confira o estado final da tabela."
chapter: 3
chapterSlug: restricoes
lesson: 3
difficulty: iniciante
xp: 50
prerequisites: []
hints: []
references: []
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
challenge:
  kind: data
  instruction: "Insira dois registros na tabela `users`."
  expectedTables:
    - name: users
      columns: [id, name]
      rows:
        - [1, "Ana"]
        - [2, "Bruno"]
      orderSensitive: false
---

## Contexto

Desafios `data` comparam o estado final das tabelas após a execução do SQL do
aluno (INSERT/UPDATE/DELETE).

## Sua vez

Insira os registros na tabela `users`.