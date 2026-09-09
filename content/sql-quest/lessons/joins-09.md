---
id: joins-09
title: "PrÃ¡tica: pÃ¡gina de perfil"
summary: "Combine mÃºltiplos JOINs para montar o perfil completo de um usuÃ¡rio do Senai Pay."
chapter: 10
chapterSlug: joins
lesson: 9
difficulty: intermediario
xp: 60
prerequisites:
  - joins-08
hints:
  - "Junte users com countries e com transactions."
  - "Filtre apenas transaÃ§Ãµes bem-sucedidas (was_successful = true)."
  - "Filtre o usuÃ¡rio com id 6 e agrupe por users.id."
references:
  - label: "SQLite â€” JOIN"
    url: "https://www.sqlite.org/lang_select.html"
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
    (7, 'Al', 39, 'JP', 'quickCoder', 'snake_case', false),
    (8, 'Lance', 20, 'US', 'LanChr', 'lancePass', false),
    (9, 'Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true),
    (10, 'Lane', 27, 'US', 'wagslane', 'update_me', false),
    (11, 'Darren', 15, 'CA', 'Dshan', 'found_me', false),
    (12, 'Albert', 55, 'BR', 'BertDev', 'one_al_name', false),
    (13, 'Alvin', 27, 'US', 'AlvinA27', 'easter_egg', false),
    (14, 'Al', 39, 'JP', 'AlCoder', 'snake_case2', false),
    (15, 'Marcos', 24, 'BR', 'Marc0sM', 'join_master', false),
    (16, 'Yuki', 31, 'JP', 'YukiRuns', 'sashimi42', false),
    (17, 'Helena', 46, 'DE', 'helena-db', 'berlin_data', false),
    (18, 'Mateo', 22, 'MX', 'mat_codes', 'tacoTuesday', false),
    (19, 'Amara', 37, 'NG', 'amaraN', 'lagosLogic', true);

  CREATE TABLE countries (
    id INTEGER PRIMARY KEY,
    country_code TEXT,
    name TEXT
  );

  INSERT INTO countries (id, country_code, name) VALUES
    (1, 'US', 'United States'),
    (2, 'CA', 'Canada'),
    (3, 'IN', 'India'),
    (4, 'JP', 'Japan'),
    (5, 'BR', 'Brazil'),
    (6, 'DE', 'Germany'),
    (7, 'MX', 'Mexico'),
    (8, 'NG', 'Nigeria');

  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recipient_id INTEGER,
    sender_id INTEGER,
    note TEXT,
    amount REAL,
    was_successful BOOLEAN
  );

  INSERT INTO transactions (id, user_id, recipient_id, sender_id, note, amount, was_successful) VALUES
    (1, 9, NULL, 4, 'Testando transaÃ§Ã£o!', 10.50, true),
    (2, 5, 10, NULL, 'Valeu pelo almoÃ§o!', 9.56, true),
    (3, 6, NULL, 2, 'Problemas com o carro', 256.21, false),
    (4, 7, 8, NULL, 'Feliz aniversÃ¡rio!!', 50, true),
    (5, 9, NULL, 11, 'Draft de cartas', 50, false),
    (6, 6, 4, NULL, 'AlmoÃ§o com os amigos', 12.56, true),
    (7, 6, NULL, 12, 'Te devolvendo o almoÃ§o', 12.22, false),
    (8, 9, 6, NULL, 'Pausa do almoÃ§o', 24.89, true),
    (9, 1, NULL, 13, 'Valeu pelo almoÃ§o de ontem', 10.00, true),
    (10, 6, 14, NULL, 'Pizza de 5 reais no almoÃ§o', 5.00, true),
    (11, 8, NULL, 2, 'AlmoÃ§o estava Ã³timo, valeu!', 47.42, true),
    (12, 13, 4, NULL, 'Encontro para almoÃ§ar, bora de novo', 16.91, false),
    (13, 6, 14, NULL, 'NÃ£o sei quanto foi o almoÃ§o, aqui tem 20', 20.00, true),
    (14, 2, 13, NULL, 'Feliz aniversÃ¡rio, mano! Bora almoÃ§ar', 100.00, true),
    (15, 6, NULL, 17, 'DivisÃ£o da conta da API', 88.40, true),
    (16, 6, 1, NULL, 'CafÃ© e croissant', 7.75, true),
    (17, 6, NULL, 11, 'Bilhete do monotrilho', 65.00, false),
    (18, 14, 6, NULL, 'Taxa do tÃ¡xi compartilhado', 14.20, true),
    (19, 15, NULL, 4, 'Reembolso de assinatura', 42.42, true),
    (20, 16, 12, NULL, 'Lanches da noite de jogos', 19.90, false),
    (21, 17, NULL, 5, 'Reembolso de taxa de atraso', 3.33, true),
    (22, 18, 2, NULL, 'Troca de livros', 11.11, true);
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
  - name: countries
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: country_code
        type: TEXT
      - name: name
        type: TEXT
  - name: transactions
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: user_id
        type: INTEGER
        notNull: true
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
challenge:
  kind: exact
  instruction: "Escreva uma consulta que retorne, para o usuÃ¡rio de id 6: o id, o nome, a idade, o username, o nome do paÃ­s (renomeado para `country_name`) e a soma dos valores de todas as transaÃ§Ãµes bem-sucedidas (renomeada para `balance`)."
  expectedColumns:
    - id
    - name
    - age
    - username
    - country_name
    - balance
  expectedRows:
    - [6, "Allan", 27, "Alires", "United States", 133.71]
  orderSensitive: false
---

## Contexto

Os JOINs levam um tempo para acostumar, mas a chave para entendÃª-los e usÃ¡-los
com eficiÃªncia Ã© a **prÃ¡tica**!

### MÃºltiplos JOINs

Para incorporar dados de mais de duas tabelas, vocÃª pode utilizar vÃ¡rios JOINs
para executar consultas mais complexas:

```sql
SELECT *
FROM employees
LEFT JOIN departments ON employees.department_id = departments.id
INNER JOIN regions ON departments.region_id = regions.id;
```

### O perfil do Senai Pay

O time de frontend estÃ¡ finalizando a pÃ¡gina de perfil do Senai Pay. Precisamos
escrever uma consulta que retorne todos os dados de que eles precisam para o
perfil de um usuÃ¡rio individual.

## Sua vez

Escreva uma consulta que retorne os seguintes campos:

- O `id` do usuÃ¡rio
- O `name` do usuÃ¡rio
- A `age` do usuÃ¡rio
- O `username` do usuÃ¡rio
- O nome do paÃ­s do usuÃ¡rio, renomeado para `country_name`
- A soma dos valores de todas as transaÃ§Ãµes **bem-sucedidas** do usuÃ¡rio,
  renomeada para `balance`

Retorne apenas um Ãºnico registro de usuÃ¡rio â€” especificamente o de `id` 6.