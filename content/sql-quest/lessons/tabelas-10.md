---
id: tabelas-10
title: "Prática: migração da tabela de posts"
summary: "Escreva uma migração up para ajustar a tabela posts do Senai Pay Comunidade."
chapter: 2
chapterSlug: tabelas
lesson: 10
difficulty: iniciante
xp: 34
prerequisites:
  - tabelas-09
hints:
  - "A missão é escrever uma migração para frente com três mudanças na tabela `posts`."
  - "São três instruções de alteração de tabela, uma por passo, na ordem do enunciado."
  - "Passo 1: renomear a coluna `author_id` para `poster_id`. Passo 2: adicionar `is_edited` como BOOLEAN. Passo 3: remover `is_sponsored`."
  - "Antes de rodar, confira o estado final esperado: deve existir `poster_id` e `is_edited`, e não deve mais existir `is_sponsored`."
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
setupSql: |
  CREATE TABLE posts (
    id INTEGER,
    image_url TEXT,
    description TEXT,
    author_id INTEGER,
    is_sponsored BOOLEAN
  );
tables:
  - name: posts
    columns:
      - name: id
        type: INTEGER
      - name: image_url
        type: TEXT
      - name: description
        type: TEXT
      - name: author_id
        type: INTEGER
      - name: is_sponsored
        type: BOOLEAN
challenge:
  kind: schema
  instruction: "Escreva uma migração up para a tabela `posts`: (1) renomeie `author_id` para `poster_id`; (2) adicione a coluna `is_edited` (BOOLEAN); (3) remova a coluna `is_sponsored`."
  expectedTables:
    - name: posts
      columns:
        - name: id
          type: INTEGER
        - name: image_url
          type: TEXT
        - name: description
          type: TEXT
        - name: poster_id
          type: INTEGER
        - name: is_edited
          type: BOOLEAN
      forbidColumns:
        - author_id
        - is_sponsored
---

## Contexto

O Senai Pay Comunidade é um sucesso! Depois de várias semanas de uso, os
engenheiros do Senai Pay decidiram que algumas mudanças precisam ser feitas na
tabela `posts`. Você foi chamado para escrever uma **migração up** para alterar
a tabela.

## Sua vez

Escreva uma migração up para a tabela `posts` que faça o seguinte:

1. A coluna `author_id` deve ser renomeada para `poster_id`.
2. Adicione uma nova coluna chamada `is_edited` com tipo BOOLEAN.
3. Remova a coluna `is_sponsored`.