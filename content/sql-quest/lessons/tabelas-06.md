---
id: tabelas-06
title: "Migração para trás (down)"
summary: "Escreva uma migração down para reverter com segurança as mudanças da migração up."
chapter: 2
chapterSlug: tabelas
lesson: 6
difficulty: iniciante
xp: 34
prerequisites:
  - tabelas-05
hints:
  - "Use ALTER TABLE transactions DROP COLUMN ..."
  - "Remova was_successful e transaction_type."
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
setupSql: |
  CREATE TABLE transactions (
    id INTEGER,
    recipient_id INTEGER,
    sender_id INTEGER,
    note TEXT,
    amount REAL,
    was_successful BOOLEAN,
    transaction_type TEXT
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
      - name: was_successful
        type: BOOLEAN
      - name: transaction_type
        type: TEXT
challenge:
  kind: schema
  instruction: "Complete a migração down: remova a coluna `was_successful` e depois a coluna `transaction_type` da tabela `transactions`, revertendo o schema ao estado original."
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
      forbidColumns:
        - was_successful
        - transaction_type
---

## Contexto

A migração que aplicamos acabou causando problemas em produção! É possível que
o aplicativo ainda não estivesse pronto para as novas colunas.

Em situações assim, precisamos reverter as mudanças com segurança usando uma
**migração down**.

### Por que migrações down importam

Migrações down nos permitem:

- Desfazer mudanças introduzidas por uma migração up;
- Recuperar rapidamente de bugs ou problemas de compatibilidade em produção;
- Manter o schema consistente entre ambientes (local, homologação, produção).

Uma migração down bem escrita deve **reverter completamente** as mudanças da
migração up. No nosso caso, isso significa remover as duas colunas que
acabamos de adicionar.

Para remover uma coluna, usamos o comando `DROP COLUMN`:

```sql
ALTER TABLE users DROP COLUMN email;
```

## Sua vez

Complete a migração down:

1. Remova a coluna `was_successful` da tabela `transactions`.
2. Remova a coluna `transaction_type` da tabela `transactions`.

Isso vai reverter o schema ao estado original.