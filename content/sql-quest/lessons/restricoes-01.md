---
id: restricoes-01
title: "Valores NULL"
summary: "Entenda o que é NULL e observe valores nulos na tabela de transações do Senai Pay."
chapter: 3
chapterSlug: restricoes
lesson: 1
difficulty: iniciante
xp: 40
prerequisites:
  - tabelas-10
hints:
  - "Use o coringa * para selecionar todos os campos."
  - "SELECT * FROM transactions;"
references:
  - label: "SQLite — NULL"
    url: "https://www.sqlite.org/lang_expr.html"
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

  INSERT INTO transactions (id, recipient_id, sender_id, note, amount) VALUES
    (1, 2, 1, 'Almoço no restaurante', 25.50),
    (2, 3, 1, 'Café da manhã', 8.90),
    (3, 1, 2, 'Ingresso do cinema', 45.00);
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
  instruction: "Escreva uma consulta que selecione todos os campos de todos os registros da tabela `transactions`."
  expectedColumns:
    - id
    - recipient_id
    - sender_id
    - note
    - amount
    - was_successful
    - transaction_type
  expectedRows:
    - [1, 2, 1, "Almoço no restaurante", 25.5, null, null]
    - [2, 3, 1, "Café da manhã", 8.9, null, null]
    - [3, 1, 2, "Ingresso do cinema", 45.0, null, null]
  orderSensitive: false
---

## Contexto

Em SQL, uma célula com valor **NULL** indica que o valor está **ausente**. Um
valor NULL é muito diferente de um valor zero: zero é um número; NULL é a
ausência de qualquer valor.

### Restrições

Ao criar uma tabela, podemos definir se um campo pode ou não ser NULL — isso é
um tipo de **constraint** (restrição). Vamos falar de constraints em detalhe em
breve; por enquanto, vamos focar nos valores NULL.

### Observando NULL no Senai Pay

Não aplicamos nenhuma constraint nas nossas tabelas quando as criamos, e isso
permitiu que valores NULL entrassem na tabela! Vamos olhar a tabela
`transactions` para ver como esses valores NULL aparecem.

Observe que tanto `transaction_type` quanto `was_successful` têm valores NULL
em todos os 3 registros (nulos aparecem como células vazias). Isso aconteceu
porque rodamos a migração da unidade anterior **depois** de os 3 registros
serem criados.

## Sua vez

Escreva uma consulta que selecione todos os campos de todos os registros da
tabela `transactions`. Use o coringa `*` para selecionar todos os campos.