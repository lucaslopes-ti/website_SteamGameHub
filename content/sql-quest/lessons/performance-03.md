---
id: performance-03
title: "Índices compostos"
summary: "Crie um índice em user_id e recipient_id para acelerar buscas por pares de usuários."
chapter: 11
chapterSlug: performance
lesson: 3
difficulty: intermediario
xp: 41
prerequisites:
  - performance-02
hints:
  - "Use CREATE INDEX nome ON transactions (coluna1, coluna2)."
  - "A ordem importa: user_id deve ser a primeira coluna do índice."
  - "CREATE INDEX user_id_recipient_id_idx ON transactions (user_id, recipient_id);"
references:
  - label: "SQLite — Query Planning"
    url: "https://www.sqlite.org/queryplanner.html"
setupSql: |
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    sender_id INTEGER,
    recipient_id INTEGER,
    note TEXT,
    amount INTEGER NOT NULL,
    was_successful BOOLEAN NOT NULL
  );

  INSERT INTO transactions (id, user_id, sender_id, recipient_id, note, amount, was_successful) VALUES
    (1, 1, 1, 2, 'Lunch with client', 25, true),
    (2, 1, 1, 3, 'Coffee', 5, true),
    (3, 2, 2, 1, 'Lunch', 30, true),
    (4, 2, NULL, 4, 'Lunch', 15, true),
    (5, 3, 3, 5, 'Lunch', 10, true),
    (6, 3, 3, 6, 'Groceries', 40, true),
    (7, 4, 4, 1, 'Lunch', 22, true),
    (8, 5, 5, 2, 'Lunch', 18, true),
    (9, 6, 6, 3, 'Rent', 12, true),
    (10, 6, 6, 4, 'Lunch', 27, false),
    (11, 4, 4, 6, 'Pizza', 33, true),
    (12, 5, 5, 3, 'Lunch', 12, true);
tables:
  - name: transactions
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: user_id
        type: INTEGER
        notNull: true
      - name: sender_id
        type: INTEGER
      - name: recipient_id
        type: INTEGER
      - name: note
        type: TEXT
      - name: amount
        type: INTEGER
        notNull: true
      - name: was_successful
        type: BOOLEAN
        notNull: true
challenge:
  kind: schema
  instruction: "Crie um índice não único chamado `user_id_recipient_id_idx` nas colunas `user_id` e `recipient_id` da tabela `transactions`, nessa ordem."
  expectedTables:
    - name: transactions
      indexes:
        - name: user_id_recipient_id_idx
          columns: [user_id, recipient_id]
          unique: false
---

## Contexto

Índices de **múltiplas colunas** (ou índices compostos) são úteis exatamente
pelo motivo que você imagina: eles aceleram buscas que dependem de várias
colunas ao mesmo tempo.

```sql
CREATE INDEX first_name_last_name_age_idx ON users (first_name, last_name, age);
```

Um índice composto é ordenado pela **primeira** coluna primeiro, depois pela
segunda, e assim por diante. Uma busca usando **apenas a primeira coluna** do
índice obtém quase todos os ganhos de desempenho que teria com um índice
dedicado a ela. Porém, buscas apenas na segunda ou na terceira coluna têm
desempenho bastante degradado.

### Regra prática

A menos que você tenha motivos específicos para algo diferente, só crie índices
compostos se fizer buscas frequentes em uma **combinação específica** de
colunas.

### O contexto do Senai Pay

Frequentemente precisamos buscar todas as transações entre dois usuários
específicos. Existe uma página no site que permite a um usuário encontrar todos
os pagamentos que fez a um amigo pelo **nome** desse amigo.

Vamos criar um índice nas colunas `user_id` e `recipient_id` para acelerar o
aplicativo. Certifique-se de que `user_id` seja a **primeira** coluna do índice,
para que também possamos usá-lo em consultas que só se importam com `user_id`.

## Sua vez

Crie um índice **não único** chamado `user_id_recipient_id_idx` nas colunas
`user_id` e `recipient_id` da tabela `transactions`, nessa ordem.
