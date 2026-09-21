---
id: performance-01
title: "Índices: acelerando buscas"
summary: "Crie um índice não único na coluna email para acelerar buscas do front-end."
chapter: 11
chapterSlug: performance
lesson: 1
difficulty: intermediario
xp: 41
prerequisites:
  - joins-10
hints:
  - "A missão é criar um índice não único na coluna de e-mail da tabela `users`."
  - "Use a instrução de criação de índice, com um nome para ele e, entre parênteses, a coluna indexada."
  - "O índice deve se chamar `email_idx` e cobrir a coluna `email` da tabela `users`."
  - "Não use a palavra que tornaria o índice único: aqui ele é comum."
references:
  - label: "SQLite — CREATE INDEX"
    url: "https://www.sqlite.org/lang_createindex.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT NOT NULL,
    country_code TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, email, country_code, username, password, is_admin) VALUES
    (1, 'David', 34, 'david@senai.com', 'US', 'DavidDev', 'insertPractice', false),
    (2, 'Samantha', 29, 'samantha@senai.com', 'BR', 'Sammy93', 'addingRecords!', false),
    (3, 'John', 39, 'john@senai.com', 'CA', 'Jjdev21', 'sqlMaster2024', false),
    (4, 'Ram', 42, 'ram@senai.com', 'IN', 'Ram11c', 'queryNinja', false),
    (5, 'Hunter', 30, 'hunter@senai.com', 'US', 'Hdev92', 'backendDev', false),
    (6, 'Allan', 27, 'allan@senai.com', 'US', 'Alires', 'adminPass1', true),
    (7, 'Al', 39, 'al@senai.com', 'JP', 'quickCoder', 'snake_case', false);
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
      - name: email
        type: TEXT
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
  kind: schema
  instruction: "Crie um índice não único chamado `email_idx` na coluna `email` da tabela `users`."
  expectedTables:
    - name: users
      indexes:
        - name: email_idx
          columns: [email]
          unique: false
---

## Contexto

Um **índice** é uma estrutura em memória que garante que as consultas rodem de
forma performática, ou seja, rapidamente.

A maioria dos índices de banco de dados são apenas **árvores binárias** ou
**B-trees**! A árvore pode ficar na RAM ou no disco, e isso facilita encontrar a
localização de uma linha inteira.

Colunas `PRIMARY KEY` são indexadas por padrão, o que garante que buscar uma
linha pelo seu `id` seja muito rápido. No entanto, se você quiser fazer buscas
rápidas em **outras** colunas, precisará indexá-las:

```sql
CREATE INDEX nome_do_indice ON nome_da_tabela (nome_da_coluna);
```

É comum nomear um índice com o nome da coluna seguido do sufixo `_idx`.

### O contexto do Senai Pay

O front-end do Senai Pay frequentemente se encontra em uma situação em que
conhece o **e-mail** de um usuário, mas não o seu `id`. Vamos adicionar um
índice no campo `email` chamado `email_idx` para acelerar essas buscas.

## Sua vez

A missão é acelerar as buscas por e-mail no Senai Pay criando um índice.

Sua instrução deve:

- criar um índice chamado `email_idx`;
- indexar a coluna `email` da tabela `users`;
- ser um índice não único.

Pense no índice como um atalho de busca: ele não altera os dados, só a forma de encontrá-los.
