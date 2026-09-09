---
id: crud-data
title: "Desafio data com columns vazias"
summary: "Teste."
chapter: 3
chapterSlug: restricoes
lesson: 3
difficulty: iniciante
xp: 50
prerequisites: []
hints: []
references: []
setupSql: |
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
tables: []
challenge:
  kind: data
  instruction: "Teste."
  expectedTables:
    - name: users
      columns: []
      rows:
        - [1, "Ana"]
---

## Contexto

Corpo de teste.