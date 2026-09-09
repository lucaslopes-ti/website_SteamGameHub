---
id: select-01
title: "Sua primeira consulta: SELECT *"
summary: "Busque todas as colunas da tabela de usuários do Senai Pay com SELECT *."
chapter: 1
chapterSlug: select
lesson: 1
difficulty: iniciante
xp: 50
prerequisites: []
hints:
  - "Use o comando SELECT seguido do coringa *."
  - "A tabela se chama users."
  - "SELECT * FROM users;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER,
    name TEXT,
    age INTEGER,
    balance REAL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, balance, is_admin) VALUES
    (1, 'Ana Souza', 28, 450, 1),
    (2, 'Bruno Lima', 27, 200, 1),
    (3, 'Carla Mendes', 33, 496.24, 0);
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
      - name: name
        type: TEXT
      - name: age
        type: INTEGER
      - name: balance
        type: REAL
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Escreva uma consulta que traga todas as colunas e todos os registros da tabela `users` do Senai Pay."
  expectedColumns:
    - id
    - name
    - age
    - balance
    - is_admin
  expectedRows:
    - [1, "Ana Souza", 28, 450, 1]
    - [2, "Bruno Lima", 27, 200, 1]
    - [3, "Carla Mendes", 33, 496.24, 0]
  orderSensitive: false
---

## Contexto

Bem-vindo ao curso de SQL! SQL (Structured Query Language) é a linguagem usada
para conversar com bancos de dados relacionais. Neste curso, vamos trabalhar no
banco de dados de um aplicativo de pagamentos fictício chamado **Senai Pay**.

Bancos de dados relacionais guardam informações em **tabelas**, organizadas em
**colunas** (campos) e **linhas** (registros). Para LER dados de uma tabela
usamos o comando `SELECT`.

O asterisco (`*`) funciona como um coringa: ele pede TODAS as colunas da
tabela. A estrutura básica é:

```sql
SELECT * FROM nome_da_tabela;
```

No Senai Pay, a tabela `users` guarda quem usa a plataforma. O banco já vem
populado — seu trabalho é apenas consultá-lo.

## Sua vez

Escreva uma consulta que traga todas as colunas e todos os registros da tabela
`users`.