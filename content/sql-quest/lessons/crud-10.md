---
id: crud-10
title: "Atualizando registros com UPDATE"
summary: "Use UPDATE com SET e WHERE para modificar campos de um registro específico."
chapter: 4
chapterSlug: crud
lesson: 10
difficulty: iniciante
xp: 50
prerequisites:
  - crud-09
hints:
  - "Use UPDATE users SET is_admin = true seguido de WHERE."
  - "Filtre pelo nome: WHERE name = 'Lane'."
  - "UPDATE users SET is_admin = true WHERE name = 'Lane';"
references:
  - label: "SQLite — UPDATE"
    url: "https://www.sqlite.org/lang_update.html"
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
    (2, 'Lane', 27, 'US', 'wagslane', 'update_me', false),
    (3, 'Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true);
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
  kind: data
  instruction: "Atualize o registro do Lane na tabela `users` para que o campo `is_admin` seja definido como true."
  expectedTables:
    - name: users
      columns: [id, name, age, country_code, username, password, is_admin]
      rows:
        - [1, "David", 34, "US", "DavidDev", "insertPractice", 0]
        - [2, "Lane", 27, "US", "wagslane", "update_me", 1]
        - [3, "Tiffany", 28, "US", "Tifferoon", "autoincrement", 1]
      orderSensitive: false
---

## Contexto

Sempre que você atualiza sua foto de perfil ou troca sua senha online, você está
mudando os dados de um campo em uma tabela de um banco! Imagine se toda vez que
você errasse uma publicação em uma rede social, tivesse que excluir a publicação
inteira e postar uma nova em vez de apenas editá-la...

### Instrução UPDATE

A instrução `UPDATE` no SQL nos permite atualizar os campos de um registro.
Podemos até atualizar muitos registros dependendo de como escrevemos a
instrução.

Uma instrução `UPDATE` especifica a tabela que precisa ser atualizada, seguida
dos campos e seus novos valores usando a palavra-chave `SET`. Por fim, uma
cláusula `WHERE` indica o(s) registro(s) a atualizar.

```sql
UPDATE employees
SET
  job_title = 'Backend Engineer',
  salary = 150000
WHERE
  id = 251;
```

## Sua vez

Precisamos atualizar o registro do Lane na tabela `users`. Ele fundou o Senai
Pay, mas nem é reconhecido como administrador!

Atualize o registro do Lane na tabela `users` para que o campo `is_admin` seja
definido como `true`!