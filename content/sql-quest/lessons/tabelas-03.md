---
id: tabelas-03
title: "Alterando tabelas com ALTER TABLE"
summary: "Renomeie tabelas e colunas e adicione novos campos sem apagar os dados existentes."
chapter: 2
chapterSlug: tabelas
lesson: 3
difficulty: iniciante
xp: 50
prerequisites:
  - tabelas-02
hints:
  - "Renomeie a tabela: ALTER TABLE people RENAME TO users;"
  - "Renomeie a coluna: ALTER TABLE users RENAME COLUMN tag TO username;"
  - "Adicione a coluna: ALTER TABLE users ADD COLUMN password TEXT;"
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
setupSql: |
  CREATE TABLE people (
    id INTEGER,
    tag TEXT,
    name TEXT,
    age INTEGER,
    balance REAL,
    is_admin BOOLEAN
  );
tables:
  - name: people
    columns:
      - name: id
        type: INTEGER
      - name: tag
        type: TEXT
      - name: name
        type: TEXT
      - name: age
        type: INTEGER
      - name: balance
        type: REAL
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: schema
  instruction: "Altere a tabela `people` com ALTER TABLE: (1) renomeie a tabela para `users`; (2) renomeie a coluna `tag` para `username`; (3) adicione a coluna `password` do tipo TEXT."
  expectedTables:
    - name: users
      columns:
        - name: id
          type: INTEGER
        - name: username
          type: TEXT
        - name: name
          type: TEXT
        - name: age
          type: INTEGER
        - name: balance
          type: REAL
        - name: is_admin
          type: BOOLEAN
        - name: password
          type: TEXT
      forbidColumns:
        - tag
---

## Contexto

Muitas vezes precisamos alterar o schema do banco **sem apagar tudo e recriar
do zero**. Imagine se uma rede social apagasse o banco cada vez que precisasse
adicionar um recurso: sua conta e todas as suas publicações sumiriam
diariamente. Seria um desastre!

Em vez disso, usamos o comando `ALTER TABLE` para fazer mudanças **no lugar**,
sem excluir nenhum dado. Com o SQLite, o `ALTER TABLE` permite:

**1. Renomear uma tabela ou coluna**

```sql
ALTER TABLE employees RENAME TO contractors;

ALTER TABLE contractors RENAME COLUMN salary TO invoice;
```

**2. Adicionar ou remover uma coluna**

```sql
ALTER TABLE contractors ADD COLUMN job_title TEXT;

ALTER TABLE contractors DROP COLUMN is_manager;
```

> **Atenção (SQLite):** diferente de outros bancos, o SQLite **não** suporta
> fazer várias operações em um único `ALTER TABLE`. Cada mudança precisa de um
> comando separado.

## Sua vez

A tabela `people` do Senai Pay precisa de ajustes. Complete os três passos:

1. Renomeie a tabela `people` para `users`.
2. Renomeie a coluna `tag` para `username`.
3. Adicione a coluna `password` do tipo TEXT.