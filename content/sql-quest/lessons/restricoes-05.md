---
id: restricoes-05
title: "Schema: projetando a tabela de transações"
summary: "Aplique constraints na tabela transactions para garantir a integridade dos dados financeiros."
chapter: 3
chapterSlug: restricoes
lesson: 5
difficulty: iniciante
xp: 34
prerequisites:
  - restricoes-04
hints:
  - "id INTEGER PRIMARY KEY"
  - "memo, amount e balance são NOT NULL"
  - "CREATE TABLE transactions(id INTEGER PRIMARY KEY, sender_id INTEGER, recipient_id INTEGER, memo TEXT NOT NULL, amount REAL NOT NULL, balance REAL NOT NULL);"
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  -- Nenhum setup necessário: nesta unidade você cria a tabela do zero.
challenge:
  kind: schema
  instruction: "Crie a tabela `transactions` com os campos e constraints: id (INTEGER, PRIMARY KEY), sender_id (INTEGER), recipient_id (INTEGER), memo (TEXT, NOT NULL), amount (REAL, NOT NULL) e balance (REAL, NOT NULL)."
  expectedTables:
    - name: transactions
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: sender_id
          type: INTEGER
        - name: recipient_id
          type: INTEGER
        - name: memo
          type: TEXT
          notNull: true
        - name: amount
          type: REAL
          notNull: true
        - name: balance
          type: REAL
          notNull: true
---

## Contexto

Já usamos a palavra **schema** algumas vezes; vamos falar sobre o que ela
significa. O schema de um banco de dados descreve **como os dados estão
organizados** dentro dele.

Tipos de dados, nomes de tabelas, nomes de campos, constraints e os
relacionamentos entre todas essas entidades fazem parte do schema de um banco.

### Não existe schema perfeito

Ao projetar um schema, normalmente não existe uma solução "correta". Fazemos o
melhor possível para escolher um conjunto razoável de tabelas, campos,
constraints etc. que atenda aos objetivos do projeto. Como muitas coisas em
programação, designs diferentes de schema trazem **trade-offs** diferentes.

### Decidindo um schema sensato

Vamos usar o Senai Pay como exemplo. Uma decisão importante é: **qual tabela
vai armazenar o saldo de um usuário**? Como você pode imaginar, garantir a
precisão dos dados quando lidamos com dinheiro é crítico. Queremos ser capazes
de:

- Acompanhar o saldo atual de um usuário;
- Ver o saldo histórico em qualquer ponto do passado;
- Ver um log de quais transações mudaram o saldo ao longo do tempo.

Há muitas formas de abordar esse problema. Para a nossa primeira tentativa,
vamos usar o schema mais simples que atende às necessidades do projeto.

### A decisão da arquitetura

O time de arquitetura do Senai Pay decidiu usar uma única tabela
`transactions`. Ela armazena transações individuais, e podemos acompanhar o
"saldo atual" em cada registro de transação. Se quisermos o saldo atual, basta
olhar a transação mais recente!

## Sua vez

Crie a tabela `transactions` com os seguintes campos e constraints:

- `id` — INTEGER, PRIMARY KEY
- `sender_id` — INTEGER
- `recipient_id` — INTEGER
- `memo` — TEXT, NOT NULL
- `amount` — REAL, NOT NULL
- `balance` — REAL, NOT NULL