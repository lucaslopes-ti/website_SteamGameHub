---
id: filtros-02
title: "Funções SQL e colunas calculadas"
summary: "Crie colunas calculadas com a função IIF e apelide o resultado com AS."
chapter: 5
chapterSlug: filtros
lesson: 2
difficulty: iniciante
xp: 28
prerequisites:
  - filtros-01
hints:
  - "Use IIF(was_successful, 'No action required', 'Perform an audit') AS audit."
  - "Selecione todas as colunas com * e adicione a coluna calculada no final."
  - "SELECT *, IIF(was_successful, 'No action required', 'Perform an audit') AS audit FROM transactions;"
references:
  - label: "SQLite — Core Functions"
    url: "https://www.sqlite.org/lang_corefunc.html"
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
    (3, 1, 5, 'Transferência para investimento', 200.0, false, 'purchase'),
    (4, 3, 1, 'Café da manhã', 8.9, true, 'purchase'),
    (5, 1, 8, 'Reembolso de compra', 45.0, false, 'refund'),
    (6, 2, 1, 'Ingresso do cinema', 32.5, true, 'purchase');
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
  instruction: "Retorne todos os dados da tabela `transactions` e adicione uma coluna extra no final com o alias `audit`. Se `was_successful` for true, o campo deve dizer 'No action required'; se for false, 'Perform an audit'."
  expectedColumns:
    - id
    - recipient_id
    - sender_id
    - note
    - amount
    - was_successful
    - transaction_type
    - audit
  expectedRows:
    - [1, 2, 1, "Almoço no restaurante", 25.5, 1, "purchase", "No action required"]
    - [2, 1, 10, "Feliz aniversário!", 100, 1, "gift", "No action required"]
    - [3, 1, 5, "Transferência para investimento", 200, 0, "purchase", "Perform an audit"]
    - [4, 3, 1, "Café da manhã", 8.9, 1, "purchase", "No action required"]
    - [5, 1, 8, "Reembolso de compra", 45, 0, "refund", "Perform an audit"]
    - [6, 2, 1, "Ingresso do cinema", 32.5, 1, "purchase", "No action required"]
  orderSensitive: false
---

## Contexto

SQL é uma linguagem de programação e, como quase todas as linguagens de
programação, suporta funções. Podemos usar funções e apelidos para calcular
novas colunas em uma consulta. Isso é parecido com usar fórmulas em uma
planilha.

Uma **coluna calculada** é uma coluna nova que não existe na tabela original,
mas é criada na hora quando você executa uma consulta.

### A função IIF

No SQLite, a função `IIF` funciona como uma expressão ternária. Por exemplo:

```sql
IIF(carA > carB, 'Car A is bigger', 'Car B is bigger')
```

Se `carA` for maior que `carB`, essa expressão avalia para a string
`'Car A is bigger'`. Caso contrário, avalia para `'Car B is bigger'`.

Veja como usar `IIF()` e um apelido para adicionar uma coluna calculada ao
resultado:

```sql
SELECT
  quantity,
  IIF(quantity < 10, 'Order more', 'In Stock') AS directive
FROM
  products;
```

| quantity | directive   |
|----------|-------------|
| 4        | Order more  |
| 25       | In Stock    |

## Sua vez

Precisamos analisar os dados de transações do Senai Pay e determinar se alguma
delas precisa ser auditada.

Retorne todos os dados da tabela `transactions` e adicione uma coluna extra no
final com o alias `audit`.

- Se o campo `was_successful` de uma linha for `true`, o campo `audit` deve
  dizer `'No action required'`.
- Se o campo `was_successful` for `false`, o campo `audit` deve dizer
  `'Perform an audit'`.