---
id: tabelas-05
title: "Migração para frente (up)"
summary: "Escreva uma migração up para adicionar novas colunas à tabela de transações."
chapter: 2
chapterSlug: tabelas
lesson: 5
difficulty: iniciante
xp: 34
prerequisites:
  - tabelas-04
hints:
  - "Use ALTER TABLE transactions ADD COLUMN ..."
  - "Adicione was_successful BOOLEAN e transaction_type TEXT."
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
setupSql: |
  CREATE TABLE transactions (
    id INTEGER,
    recipient_id INTEGER,
    sender_id INTEGER,
    note TEXT,
    amount REAL
  );
tables:
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
challenge:
  kind: schema
  instruction: "Complete a migração up: adicione a coluna `was_successful` (BOOLEAN) e depois a coluna `transaction_type` (TEXT) à tabela `transactions`, nessa ordem."
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
        - name: was_successful
          type: BOOLEAN
        - name: transaction_type
          type: TEXT
---

## Contexto

Para gerenciar migrações, usamos um sistema simples baseado em duas direções:

- A **migração up** aplica mudanças para levar o schema adiante.
- A **migração down** reverte essas mudanças para o estado anterior.

Isso permite que os desenvolvedores naveguem com segurança entre versões do
schema durante o desenvolvimento e em implantações de produção.

### O que o Senai Pay precisa

Vamos adicionar novas colunas à tabela `transactions`. Precisamos saber se cada
transação entre dois usuários foi concluída com sucesso e também o tipo da
transação.

A tabela `transactions` hoje tem estas colunas:

| cid | name            | type    |
|-----|-----------------|---------|
| 0   | id              | INTEGER |
| 1   | recipient_id    | INTEGER |
| 2   | sender_id       | INTEGER |
| 3   | note            | TEXT    |
| 4   | amount          | REAL    |

> **Dica:** `BOOL` é tecnicamente válido, mas o desafio espera `BOOLEAN` — use
> `BOOLEAN` em vez de `BOOL`.

## Sua vez

Complete as instruções SQL **nesta ordem**:

1. Adicione a coluna `was_successful` (BOOLEAN) à tabela `transactions`.
2. Adicione a coluna `transaction_type` (TEXT) à tabela `transactions`.