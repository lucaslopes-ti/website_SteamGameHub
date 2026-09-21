---
id: select-01
title: "Sua primeira consulta: SELECT *"
summary: "Busque todas as colunas da tabela de usuários do Senai Pay com SELECT *."
chapter: 1
chapterSlug: select
lesson: 1
difficulty: iniciante
xp: 34
prerequisites: []
hints:
  - "A missão é ler TODAS as colunas e TODOS os registros da tabela `users` do Senai Pay."
  - "Para ler dados use o comando `SELECT`. Para pedir todas as colunas de uma vez, use o coringa `*` no lugar da lista de colunas."
  - "Monte na ordem: primeiro o comando `SELECT`, depois o que você quer ver (o coringa) e por último a palavra `FROM` com o nome da tabela."
  - "Não use filtro, ordenação nem limite: o resultado deve ter uma linha para cada usuário cadastrado e todas as cinco colunas."
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
images:
  - alt: "Logos de bancos de dados SQL, como SQLite, PostgreSQL e MySQL"
    src: "sql_logos.png"
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

A missão é ler o cadastro completo dos usuários do Senai Pay.

Sua consulta deve:

- consultar a tabela `users`;
- devolver todas as colunas, na ordem em que foram criadas (`id`, `name`, `age`, `balance`, `is_admin`);
- devolver todas as linhas, sem filtros, sem ordenação e sem limite.

Ao ler o resultado, repare que cada linha representa um usuário e cada coluna, um atributo dele.