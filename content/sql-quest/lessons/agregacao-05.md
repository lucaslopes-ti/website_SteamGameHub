---
id: agregacao-05
title: "Agrupando dados com GROUP BY"
summary: "Use GROUP BY para agrupar linhas e aplicar agregações a cada grupo."
chapter: 7
chapterSlug: agregacao
lesson: 5
difficulty: iniciante
xp: 35
prerequisites:
  - agregacao-04
hints:
  - "Use SUM(amount) com o apelido (alias) balance."
  - "Agrupe por user_id com GROUP BY."
  - "SELECT user_id, SUM(amount) AS balance FROM transactions WHERE was_successful = true GROUP BY user_id;"
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
  instruction: "Use a agregação SUM com a cláusula GROUP BY. A linha de cada usuário deve conter o user_id e o saldo dele — uma soma com apelido (alias) balance dos valores das transações bem-sucedidas."
  expectedColumns:
    - user_id
    - balance
  expectedRows:
    - [1, 30]
    - [2, 45]
    - [3, 50]
    - [4, 40]
    - [5, 12]
    - [6, 27]
    - [7, 8]
    - [8, 20]
    - [9, 350]
    - [10, 5]
  orderSensitive: false
---

## Contexto

Há momentos em que precisamos **agrupar** dados com base em valores
específicos.

O SQL oferece a cláusula `GROUP BY`, que agrupa linhas com valores semelhantes
em linhas de "resumo". Ela retorna **uma linha para cada grupo**. A parte
interessante é que cada grupo pode ter uma função de agregação aplicada a ele,
que opera apenas sobre os dados agrupados.

### Exemplo de GROUP BY

Imagine um banco de dados com músicas e álbuns:

| song_id | title     | album_id |
| ------- | --------- | -------- |
| 1       | Crawl     | 10       |
| 2       | Oakland   | 10       |
| 3       | Bonfire   | 11       |
| 4       | Fire Fly  | 11       |
| 5       | Heartbeat | 11       |
| 6       | Sober     | 12       |

Para ver quantas músicas há em cada álbum, podemos usar uma consulta assim:

```sql
SELECT album_id, COUNT(song_id) AS song_count
FROM songs
GROUP BY album_id;
```

Essa consulta recupera a contagem de músicas de cada álbum. É retornado um
registro por álbum, cada um com sua própria contagem:

| album_id | song_count |
| -------- | ---------- |
| 10       | 2          |
| 11       | 3          |
| 12       | 1          |

### O contexto do Senai Pay

Vamos obter o saldo de cada usuário com transações bem-sucedidas em uma única
consulta!

## Sua vez

Use a agregação `SUM` com a cláusula `GROUP BY`. A linha de cada usuário deve
conter o `user_id` e o saldo dele — uma soma com apelido (alias) `balance` dos
valores das transações bem-sucedidas.