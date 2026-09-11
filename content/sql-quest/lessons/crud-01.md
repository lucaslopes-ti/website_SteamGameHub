---
id: crud-01
title: "CRUD: as quatro operações básicas"
summary: "Entenda o que é CRUD e use SELECT para ler todos os dados de uma tabela."
chapter: 4
chapterSlug: crud
lesson: 1
difficulty: iniciante
xp: 28
prerequisites:
  - restricoes-08
hints:
  - "READ (ler) é o mesmo que recuperar dados."
  - "Use SELECT * para ler todos os campos de todos os registros."
  - "SELECT * FROM crud;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE crud (c TEXT, r TEXT, u TEXT, d TEXT);

  INSERT INTO crud (c, r, u, d) VALUES
    ('CREATE = CREATE', 'READ = SELECT', 'UPDATE = UPDATE', 'DELETE = DELETE');
tables:
  - name: crud
    columns:
      - name: c
        type: TEXT
      - name: r
        type: TEXT
      - name: u
        type: TEXT
      - name: d
        type: TEXT
challenge:
  kind: exact
  instruction: "Determine qual comando SQL é usado para uma operação READ e use-o para ler todos os campos de todos os registros da tabela `crud`."
  expectedColumns:
    - c
    - r
    - u
    - d
  expectedRows:
    - ["CREATE = CREATE", "READ = SELECT", "UPDATE = UPDATE", "DELETE = DELETE"]
  orderSensitive: false
---

## Contexto

**CRUD** é um acrônimo que descreve as quatro formas básicas de uma aplicação
trabalhar com dados armazenados: **CREATE**, **READ**, **UPDATE** e **DELETE**.
Essas quatro operações são a base de quase todo banco de dados e se conectam
diretamente a muita funcionalidade real de aplicações:

- **CREATE**: cadastrar um novo usuário, publicar um comentário.
- **READ**: carregar o perfil de um usuário, ver uma lista de produtos.
- **UPDATE**: editar um comentário, trocar sua senha.
- **DELETE**: remover uma publicação, encerrar uma conta.

No Senai Pay, criamos uma tabela chamada `crud` — uma tabela de brinquedo usada
para praticar entrevistas. Cada coluna guarda o nome do comando SQL
correspondente a uma operação.

## Sua vez

Determine qual comando SQL pode ser usado para uma operação **READ** e use-o
para ler todos os campos de todos os registros da tabela `crud`!