---
id: restricoes-01
title: "Relacionando tabelas com FOREIGN KEY"
summary: "Garanta que toda transferência aponte para um cliente que existe."
chapter: 3
chapterSlug: restricoes
lesson: 1
difficulty: intermediario
xp: 75
prerequisites:
  - tabelas-01
hints:
  - "A FK aponta para a tabela clientes e sua chave primária id."
  - "Use REFERENCES clientes(id) logo após a coluna cliente_id."
references:
  - label: "SQLite — FOREIGN KEY"
    url: "https://www.sqlite.org/foreignkeys.html"
setupSql: |
  CREATE TABLE clientes (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL
  );

  INSERT INTO clientes (id, nome) VALUES
    (1, 'Ana Souza'),
    (2, 'Bruno Lima');
tables:
  - name: clientes
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: nome
        type: TEXT
        notNull: true
challenge:
  kind: schema
  instruction: "Crie a tabela `transferencias` com `id` INTEGER como chave primária, `cliente_id` INTEGER referenciando `clientes(id)` e `valor` REAL."
  expectedTables:
    - name: transferencias
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: cliente_id
          type: INTEGER
        - name: valor
          type: REAL
      foreignKeys:
        - columns: [cliente_id]
          table: clientes
          referencedColumns: [id]
---

## Contexto

Uma chave estrangeira (`FOREIGN KEY`) liga uma tabela a outra. Ela garante que
o valor armazenado em uma coluna SEMPRE exista na tabela referenciada.

No NexoPay, toda transferência pertence a um cliente. Sem uma FK, nada
impediria criar uma transferência para um cliente inexistente.

A forma mais direta de declarar é na própria coluna:

```sql
cliente_id INTEGER REFERENCES clientes(id)
```

## Sua vez

Crie a tabela `transferencias` com `id` INTEGER como chave primária,
`cliente_id` INTEGER referenciando `clientes(id)` e `valor` REAL.