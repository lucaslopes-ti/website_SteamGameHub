---
id: filtros-01
title: "Apelidando colunas com AS"
summary: "Use a cláusula AS para renomear colunas no resultado de uma consulta."
chapter: 5
chapterSlug: filtros
lesson: 1
difficulty: iniciante
xp: 28
prerequisites:
  - crud-13
hints:
  - "Use AS para renomear o campo note para birthday_message."
  - "Filtre com WHERE sender_id = 10."
  - "SELECT amount, note AS birthday_message FROM transactions WHERE sender_id = 10;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    recipient_id INTEGER,
    sender_id INTEGER,
    note TEXT,
    amount REAL,
    was_successful BOOLEAN,
    transaction_type TEXT
  );

  INSERT INTO transactions (id, recipient_id, sender_id, note, amount, was_successful, transaction_type) VALUES
    (1, 2, 1, 'Almoço no restaurante', 25.5, true, 'purchase'),
    (2, 1, 10, 'Feliz aniversário!', 100.0, true, 'gift'),
    (3, 1, 10, 'Feliz aniversário, neta!', 75.0, true, 'gift'),
    (4, 1, 3, 'Reembolso do cinema', 30.0, true, 'refund'),
    (5, 1, 10, 'Feliz aniversário!', 50.0, true, 'gift');
tables:
  - name: transactions
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: recipient_id
        type: INTEGER
      - name: sender_id
        type: INTEGER
      - name: note
        type: TEXT
      - name: amount
        type: REAL
      - name: was_successful
        type: BOOLEAN
      - name: transaction_type
        type: TEXT
challenge:
  kind: exact
  instruction: "Retorne os campos `amount` e `note` da tabela `transactions` onde `sender_id` é 10 (a avó). O campo `note` deve ser renomeado para `birthday_message`."
  expectedColumns:
    - amount
    - birthday_message
  expectedRows:
    - [100, "Feliz aniversário!"]
    - [75, "Feliz aniversário, neta!"]
    - [50, "Feliz aniversário!"]
  orderSensitive: false
---

## Contexto

Às vezes precisamos estruturar os dados que retornamos das nossas consultas de
uma forma específica. Uma cláusula `AS` nos permite "apelidar" um dado na nossa
consulta. O apelido existe apenas durante a execução da consulta.

### A palavra-chave AS

As consultas a seguir retornam os mesmos dados:

```sql
SELECT
  employee_id AS id,
  employee_name AS name
FROM
  employees;
```

```sql
SELECT
  employee_id,
  employee_name
FROM
  employees;
```

A diferença é que o resultado da consulta com apelidos teria os nomes de
colunas `id` e `name` em vez de `employee_id` e `employee_name`.

> Ao longo do curso, use apelidos apenas quando solicitado.

## Sua vez

Um usuário pediu para encontrarmos todas as transações na conta dele vindas da
avó. Achamos divertido renomear o campo `note` para `birthday_message`, porque
notamos que todas as transações da avó são mensagens de aniversário.

Retorne os campos `amount` e `note` da tabela `transactions` onde `sender_id` é
10 (a avó). O campo `note` deve ser renomeado para `birthday_message`.