---
id: crud-06
title: "Filtrando com WHERE"
summary: "Use a cláusula WHERE para tornar suas consultas mais específicas."
chapter: 4
chapterSlug: crud
lesson: 6
difficulty: iniciante
xp: 40
prerequisites:
  - crud-05
hints:
  - "Adicione a cláusula WHERE ao final do SELECT."
  - "Filtre por is_admin = true (ou is_admin = 1)."
  - "SELECT username FROM users WHERE is_admin = true;"
references:
  - label: "SQLite — WHERE"
    url: "https://www.sqlite.org/lang_expr.html"
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
    (3, 'John', 39, 'CA', 'Jjdev21', 'sqlMaster2024', false),
    (4, 'Ram', 42, 'IN', 'Ram11c', 'queryNinja', false),
    (5, 'Hunter', 30, 'US', 'Hdev92', 'backendDev', false),
    (6, 'Allan', 27, 'US', 'Alires', 'adminPass1', true),
    (7, 'Lance', 20, 'US', 'LanChr', 'lancePass', false),
    (8, 'Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true),
    (9, 'Aiko', 31, 'JP', 'AikoOps', 'sakuraCloud7', false),
    (10, 'Marta', 36, 'ES', 'MartaDBA', 'oliveSQLtree', true),
    (11, 'Kwame', 24, 'GH', 'KDev24', 'accraAPI', false),
    (12, 'Noah', 41, 'AU', 'NoahRoot', 'koalaKernel', true);
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
  instruction: "Escreva uma consulta que retorne o `username` de todos os usuários da tabela `users` que têm privilégios de administrador."
  expectedColumns:
    - username
  expectedRows:
    - ["Alires"]
    - ["Tifferoon"]
    - ["MartaDBA"]
    - ["NoahRoot"]
  orderSensitive: false
---

## Contexto

Para continuar aprendendo sobre operações CRUD em SQL, precisamos aprender a
tornar as instruções que enviamos ao banco mais específicas. O SQL aceita uma
cláusula `WHERE` dentro de uma consulta que nos permite ser muito específicos
com nossas instruções.

Se não pudéssemos especificar o registro que queremos LER, ATUALIZAR ou
EXCLUIR, fazer consultas a um banco seria muito frustrante e muito ineficiente.

### Usando uma cláusula WHERE

Digamos que tivéssemos mais de 9000 registros na tabela `users`. Muitas vezes
queremos olhar dados de um usuário específico sem recuperar todos os outros
registros da tabela. Podemos usar uma instrução `SELECT` seguida de uma cláusula
`WHERE` para especificar quais registros recuperar. A instrução `SELECT`
permanece a mesma; apenas adicionamos a cláusula `WHERE` ao final do SELECT.
Exemplo:

```sql
SELECT
  name
FROM
  users
WHERE
  power_level >= 9000;
```

Isso seleciona apenas o campo `name` de qualquer usuário na tabela `users` em
que o campo `power_level` seja maior ou igual a 9000.

## Sua vez

Precisamos saber o `username` de todos os usuários da tabela `users` que têm
privilégios de administrador! Recupere-os. Consulte o código de setup para ver
quais campos existem.