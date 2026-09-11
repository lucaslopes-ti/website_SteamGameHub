---
id: agregacao-07
title: "Filtrando grupos com HAVING"
summary: "Use HAVING para filtrar grupos após o GROUP BY e entenda a diferença entre HAVING e WHERE."
chapter: 7
chapterSlug: agregacao
lesson: 7
difficulty: intermediario
xp: 41
prerequisites:
  - agregacao-06
hints:
  - "Filtre as linhas com WHERE antes de agrupar: was_successful = true, note LIKE '%lunch%' e sender_id IS NOT NULL."
  - "Agrupe por sender_id e use HAVING SUM(amount) > 20."
  - "Ordene com ORDER BY balance ASC."
  - "SELECT sender_id, SUM(amount) AS balance FROM transactions WHERE was_successful = true AND note LIKE '%lunch%' AND sender_id IS NOT NULL GROUP BY sender_id HAVING SUM(amount) > 20 ORDER BY balance ASC;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
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
    (8, 4, 4, 2, 'Lunch', 18, true),
    (9, 5, 5, 3, 'Lunch', 12, true),
    (10, 6, 6, 4, 'Lunch', 15, true),
    (11, 6, 6, 5, 'Lunch', 12, true),
    (12, 7, 7, 6, 'Lunch', 8, true),
    (13, 8, 8, 7, 'Lunch', 20, true),
    (14, 9, 9, 8, 'Lunch', 100, true),
    (15, 9, 9, 1, 'Lunch', 250, true),
    (16, 10, 10, 2, 'Lunch', 5, true),
    (17, 11, 11, 3, 'Lunch', 50, false);
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
  kind: exact
  instruction: "Escreva uma consulta na tabela transactions que retorne o total gasto por cada usuário em almoços (lunch) quando esse saldo for maior que 20. Retorne sender_id e balance (a soma de amount), sem linhas com sender_id nulo, apenas transações bem-sucedidas cuja note contenha 'lunch', agrupando por sender_id e ordenando pelo balance em ordem crescente."
  expectedColumns:
    - sender_id
    - balance
  expectedRows:
    - [1, 25]
    - [6, 27]
    - [2, 30]
    - [4, 40]
    - [9, 350]
  orderSensitive: true
---

## Contexto

Quando precisamos filtrar ainda mais os resultados de uma consulta com
`GROUP BY`, podemos usar a cláusula `HAVING`. O `HAVING` especifica uma condição
de busca para um **grupo**.

A cláusula `HAVING` é semelhante à cláusula `WHERE`, mas opera sobre os grupos
**depois** que eles foram agrupados, em vez de operar sobre as linhas **antes**
do agrupamento.

```sql
SELECT album_id, COUNT(id) AS count
FROM songs
GROUP BY album_id
HAVING COUNT(id) > 5;
```

Essa consulta retorna o `album_id` e a contagem de músicas, mas apenas para os
álbuns com mais de 5 músicas.

### HAVING vs. WHERE

É comum que desenvolvedores confundam `HAVING` e `WHERE` — afinal, eles são bem
parecidos. A diferença, porém, é simples:

- Uma condição `WHERE` é aplicada a **todos os dados** da consulta **antes** do
  agrupamento feito pelo `GROUP BY`.
- Uma condição `HAVING` é aplicada **apenas às linhas agrupadas** retornadas
  **depois** da aplicação do `GROUP BY`.

Ou seja: se você quer filtrar com base no **resultado de uma agregação**, use
`HAVING`. Se quer filtrar um valor que está presente nos **dados crus**, use
`WHERE`.

### O contexto do Senai Pay

Uma nova página do Senai Pay permite que os usuários vejam quanto gastaram em
um tipo específico de transação e os alerta quando esse valor é alto.

## Sua vez

Escreva uma consulta na tabela `transactions` que retorne o total gasto por cada
usuário em almoços (`lunch`) quando esse saldo for maior que 20. Sua consulta
deve:

- Retornar um `sender_id` (a pessoa que gastou) e um `balance`. O `balance` é o
  `SUM()` de todos os valores (`amount`).
- Não retornar linhas com `sender_id` nulo.
- Retornar apenas transações bem-sucedidas.
- Incluir na agregação apenas transações cuja `note` contenha a palavra `lunch`.
- Agrupar por `sender_id`.
- Ter o saldo agregado maior que 20.
- Ordenar os resultados pelo `balance` em ordem crescente.

### Reflexão: HAVING ou WHERE?

Considere o exemplo:

```sql
SELECT class_id, COUNT(id) AS class_size
FROM students
WHERE ...
GROUP BY class_id
HAVING ...
```

1. **Pergunta 1:** no exemplo, você deve usar `WHERE` ou `HAVING` para filtrar
   valores específicos de `class_id`?
   **Resposta:** `WHERE` — `class_id` é um valor presente nos dados crus, então
   o filtro deve acontecer antes do agrupamento.

2. **Pergunta 2:** no exemplo, você deve usar `WHERE` ou `HAVING` para filtrar
   turmas de um tamanho específico?
   **Resposta:** `HAVING` — o tamanho da turma (`class_size`) é o resultado de
   uma agregação (`COUNT`), então o filtro deve acontecer depois do
   agrupamento.