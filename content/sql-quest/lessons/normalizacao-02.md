---
id: normalizacao-02
title: "Um para muitos: dispositivos"
summary: "Crie a tabela devices ligada a users por uma chave estrangeira."
chapter: 9
chapterSlug: normalizacao
lesson: 2
difficulty: intermediario
xp: 34
prerequisites:
  - normalizacao-01
hints:
  - "id INTEGER PRIMARY KEY"
  - "mac_address e type são colunas TEXT."
  - "user_id INTEGER REFERENCES users(id) cria a chave estrangeira."
references:
  - label: "SQLite — Foreign Keys"
    url: "https://www.sqlite.org/foreignkeys.html"
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

  INSERT INTO users (id, name, age, country_code, username, password, is_admin) VALUES
    (1, 'David', 34, 'US', 'DavidDev', 'insertPractice', false),
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false),
    (3, 'John', 39, 'CA', 'Jjdev21', 'sqlMaster2024', false);
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
  kind: schema
  instruction: "Crie a tabela `devices` com os campos: id (INTEGER, PRIMARY KEY), mac_address (TEXT), type (TEXT) e user_id (INTEGER) como chave estrangeira para `users(id)`."
  expectedTables:
    - name: devices
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: mac_address
          type: TEXT
        - name: type
          type: TEXT
        - name: user_id
          type: INTEGER
      foreignKeys:
        - columns: [user_id]
          table: users
          referencedColumns: [id]
---

## Contexto

Quando falamos de relacionamentos, o **um para muitos** (1:N) é provavelmente o
mais usado. Ele acontece quando um único registro de uma tabela se relaciona
com potencialmente muitos registros de outra.

A seta vai apenas em uma direção: um registro da segunda tabela **não** pode se
relacionar com vários registros da primeira.

### O contexto do Senai Pay

Por segurança, é importante rastrear de quais dispositivos os usuários fazem
login no Senai Pay. Um usuário pode entrar de vários dispositivos (um celular,
um tablet e um notebook), mas cada dispositivo específico pertence a um único
usuário.

Vamos criar o relacionamento 1:N entre `users` e seus `devices`. A chave
estrangeira `user_id` fica na tabela `devices` e aponta para o `id` de `users`.

## Sua vez

Crie uma tabela chamada `devices` com quatro campos:

- `id` — um inteiro que é chave primária;
- `mac_address` — TEXT;
- `type` — TEXT;
- `user_id` — um inteiro que é chave estrangeira para o campo `id` da tabela
  `users`.
