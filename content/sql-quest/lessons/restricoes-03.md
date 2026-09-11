---
id: restricoes-03
title: "Chaves primárias (PRIMARY KEY)"
summary: "Entenda o papel da chave primária e corrija um INSERT que viola a constraint de unicidade."
chapter: 3
chapterSlug: restricoes
lesson: 3
difficulty: iniciante
xp: 34
prerequisites:
  - restricoes-02
hints:
  - "O segundo INSERT usa o id 1, que já existe."
  - "Incremente o id em 1 para cada inserção sucessiva."
  - "Depois dos INSERTs, selecione todos os registros com SELECT * FROM users;"
references:
  - label: "SQLite — PRIMARY KEY"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country_code TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN
  );
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
        notNull: true
      - name: age
        type: INTEGER
        notNull: true
      - name: country_code
        type: TEXT
        notNull: true
      - name: username
        type: TEXT
        unique: true
        notNull: true
      - name: password
        type: TEXT
        notNull: true
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Corrija o segundo INSERT: ele usa o id 1, que já existe. Use id 2 e depois selecione todos os registros da tabela `users`."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
  expectedRows:
    - [1, "Rudolf", 33, "DE", "rudolf1234", "thisisnotsecure", 0]
    - [2, "Jerry", 25, "US", "jerrysmith", "mypasswordis1234", 1]
  orderSensitive: false
---

## Contexto

Uma **chave** define e protege os relacionamentos entre tabelas. Uma **chave
primária** (PRIMARY KEY) é uma coluna especial que identifica cada registro de
forma única dentro de uma tabela. Cada tabela pode ter uma, e somente uma,
chave primária.

### A chave primária geralmente é um ID

É muito comum ter uma coluna chamada `id` em cada tabela do banco, e esse `id`
é a chave primária da tabela. Nenhuma linha pode compartilhar o mesmo `id`.

A constraint `PRIMARY KEY` pode ser especificada explicitamente em uma coluna
para garantir a unicidade, rejeitando qualquer INSERT que tente criar um ID
duplicado.

### O bug

Execute o código abaixo e observe: há uma violação da constraint `PRIMARY KEY`
na coluna `id`. Os dois INSERTs usam o mesmo id `1`.

```sql
INSERT INTO users (id, name, age, country_code, username, password, is_admin)
VALUES (1, 'Rudolf', 33, 'DE', 'rudolf1234', 'thisisnotsecure', false);

INSERT INTO users (id, name, age, country_code, username, password, is_admin)
VALUES (1, 'Jerry', 25, 'US', 'jerrysmith', 'mypasswordis1234', true);
```

> **Nota de consistência:** a tabela `users` desta unidade inclui a coluna
> `country_code` (NOT NULL), então os INSERTs também a informam — algo que o
> material original omitia e que causaria erro de constraint.

## Sua vez

Corrija o bug nos dados inseridos. Ao trabalhar com IDs inteiros, a boa prática
é incrementar o `id` em 1 a cada inserção sucessiva. Depois de corrigir,
selecione todos os registros da tabela `users`.