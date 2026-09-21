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
  - "A missão é devolver o valor e a anotação das transações enviadas pela avó, com a anotação renomeada."
  - "Selecione as duas colunas pedidas e use o recurso de apelido para dar outro nome apenas à coluna da anotação."
  - "A condição identifica as transações pelo `sender_id` igual a 10, que é a avó."
  - "A ordem no resultado é `amount` primeiro e a anotação renomeada depois."
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

A missão é montar um recorte das transações vindas da avó, com um nome mais amigável para a mensagem.

Sua consulta deve:

- consultar a tabela `transactions`;
- devolver as colunas `amount` e `note`;
- renomear `note` para `birthday_message`;
- trazer apenas as transações em que `sender_id` é 10.

O apelido não muda o dado: ele só muda o nome da coluna no resultado.