---
id: tabelas-09
title: "Prática: tabela de posts"
summary: "Crie a tabela posts do Senai Pay Comunidade, a rede social do aplicativo de pagamentos."
chapter: 2
chapterSlug: tabelas
lesson: 9
difficulty: iniciante
xp: 50
prerequisites:
  - tabelas-08
hints:
  - "Cada coluna deve ter um tipo que faça sentido com o nome dela."
  - "image_url e description são TEXT; is_sponsored é BOOLEAN."
  - "CREATE TABLE posts(id INTEGER, image_url TEXT, description TEXT, author_id INTEGER, is_sponsored BOOLEAN);"
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  -- Nenhum setup necessário: nesta unidade você cria a tabela do zero.
challenge:
  kind: schema
  instruction: "Crie a tabela `posts` com as colunas: id, image_url, description, author_id e is_sponsored. Use tipos de dados que façam sentido para cada coluna."
  expectedTables:
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
---

## Contexto

Você está trabalhando no recurso de rede social do Senai Pay, chamado **Senai
Pay Comunidade**, que pretende revolucionar as discussões financeiras online.
Os usuários podem fazer uma publicação típica de rede social: uma foto da sua
última compra, um texto e algumas outras informações.

Você ficou responsável por criar a nova tabela `posts`.

## Sua vez

Escreva uma instrução SQL para criar uma tabela chamada `posts` com as
seguintes colunas:

- `id`
- `image_url`
- `description`
- `author_id`
- `is_sponsored`

Use tipos de dados que façam mais sentido para cada coluna. Para colunas de ID,
podemos usar `INTEGER`.