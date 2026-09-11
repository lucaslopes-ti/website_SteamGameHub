---
id: tabelas-02
title: "Prática: criando a tabela de transações"
summary: "Crie a tabela transactions para registrar as transferências entre usuários do Senai Pay."
chapter: 2
chapterSlug: tabelas
lesson: 2
difficulty: iniciante
xp: 34
prerequisites:
  - tabelas-01
hints:
  - "Use CREATE TABLE seguido do nome da tabela."
  - "CREATE TABLE transactions(id INTEGER, recipient_id INTEGER, sender_id INTEGER, note TEXT, amount REAL);"
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  -- Nenhum setup necessário: nesta unidade você cria a tabela do zero.
challenge:
  kind: schema
  instruction: "Crie a tabela `transactions` com os campos: id (INTEGER), recipient_id (INTEGER), sender_id (INTEGER), note (TEXT) e amount (REAL)."
  expectedTables:
    - name: transactions
      columns:
        - name: id
          type: INTEGER
        - name: recipient_id
          type: INTEGER
        - name: sender_id
          type: INTEGER
        - name: note
          type: TEXT
        - name: amount
          type: REAL
---

## Contexto

Na maioria dos bancos de dados relacionais, uma única tabela não é suficiente
para guardar todos os dados de que precisamos! Normalmente criamos **uma tabela
por entidade**. Por exemplo, um aplicativo de rede social pode ter as tabelas:

- `users`
- `posts`
- `comments`
- `likes`

No Senai Pay, cada transferência de dinheiro entre dois usuários precisa ser
registrada. Vamos criar uma tabela para isso.

## Sua vez

Crie a tabela `transactions` com os seguintes campos:

- `id` — INTEGER
- `recipient_id` — INTEGER (quem recebe)
- `sender_id` — INTEGER (quem envia)
- `note` — TEXT (uma mensagem opcional)
- `amount` — REAL (o valor)