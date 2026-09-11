---
id: crud-07
title: "Encontrando valores NULL"
summary: "Use IS NULL e IS NOT NULL para filtrar registros com valores ausentes."
chapter: 4
chapterSlug: crud
lesson: 7
difficulty: iniciante
xp: 28
prerequisites:
  - crud-06
hints:
  - "Quando o dono RECEBE dinheiro, sender_id identifica quem enviou e recipient_id é NULL."
  - "Filtre com WHERE sender_id IS NOT NULL."
  - "SELECT * FROM transactions WHERE sender_id IS NOT NULL;"
references:
  - label: "SQLite — NULL"
    url: "https://www.sqlite.org/lang_expr.html"
setupSql: |
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recipient_id INTEGER,
    sender_id INTEGER,
    note TEXT,
    amount REAL
  );

  INSERT INTO transactions (id, user_id, recipient_id, sender_id, note, amount) VALUES
    (1, 1, NULL, 4, 'Recebi um pagamento', 50.00),
    (2, 2, 5, NULL, 'Enviei dinheiro', 25.50),
    (3, 3, NULL, 1, 'Recebi outro pagamento', 12.75),
    (4, 4, 2, NULL, 'Paguei o almoço', 30.00);
tables:
  - name: transactions
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: user_id
        type: INTEGER
        notNull: true
      - name: recipient_id
        type: INTEGER
      - name: sender_id
        type: INTEGER
      - name: note
        type: TEXT
      - name: amount
        type: REAL
challenge:
  kind: exact
  instruction: "Da tabela `transactions`, selecione todas as colunas das transações em que o dono está RECEBENDO dinheiro (ou seja, sender_id não é NULL)."
  expectedColumns:
    - id
    - user_id
    - recipient_id
    - sender_id
    - note
    - amount
  expectedRows:
    - [1, 1, null, 4, "Recebi um pagamento", 50.0]
    - [3, 3, null, 1, "Recebi outro pagamento", 12.75]
  orderSensitive: false
---

## Contexto

Você pode usar uma cláusula `WHERE` para filtrar valores por serem ou não NULL.

### IS NULL

```sql
SELECT
  name
FROM
  users
WHERE
  first_name IS NULL;
```

### IS NOT NULL

```sql
SELECT
  name
FROM
  users
WHERE
  first_name IS NOT NULL;
```

### Como o Senai Pay armazena transações

A forma como armazenamos transações no Senai Pay é interessante. O usuário
identificado por `user_id` é o "dono" de cada transação. Como `user_id` já
identifica o dono, apenas o usuário do outro lado precisa de outro ID:

- Se o dono **recebe** dinheiro, `sender_id` identifica quem enviou e
  `recipient_id` é NULL.
- Se o dono **envia** dinheiro, `recipient_id` identifica quem recebeu e
  `sender_id` é NULL.

## Sua vez

Da tabela `transactions`, selecione todas as colunas das transações em que o
dono está **recebendo** dinheiro.