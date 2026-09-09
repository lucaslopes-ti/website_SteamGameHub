---
id: select-01
title: "Sua primeira consulta: SELECT *"
summary: "Busque todas as colunas da tabela de clientes do NexoPay com SELECT *."
chapter: 1
chapterSlug: select
lesson: 1
difficulty: iniciante
xp: 50
prerequisites: []
hints:
  - "Use o comando SELECT seguido do coringa *."
  - "A tabela se chama clientes."
  - "SELECT * FROM clientes;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE clientes (
    id INTEGER PRIMARY KEY,
    nome TEXT,
    cidade TEXT,
    saldo REAL,
    ativo INTEGER
  );

  INSERT INTO clientes (id, nome, cidade, saldo, ativo) VALUES
    (1, 'Ana Souza', 'São Paulo', 1250.75, 1),
    (2, 'Bruno Lima', 'Rio de Janeiro', 480.5, 1),
    (3, 'Carla Mendes', 'Belo Horizonte', 0, 0),
    (4, 'Diego Ramos', 'Curitiba', 3320, 1),
    (5, 'Elisa Nogueira', 'Salvador', 89.9, 1);
tables:
  - name: clientes
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: nome
        type: TEXT
      - name: cidade
        type: TEXT
      - name: saldo
        type: REAL
      - name: ativo
        type: INTEGER
challenge:
  kind: exact
  instruction: "Escreva uma consulta que traga todas as colunas e todos os registros da tabela `clientes` do NexoPay."
  expectedColumns:
    - id
    - nome
    - cidade
    - saldo
    - ativo
  expectedRows:
    - [1, "Ana Souza", "São Paulo", 1250.75, 1]
    - [2, "Bruno Lima", "Rio de Janeiro", 480.5, 1]
    - [3, "Carla Mendes", "Belo Horizonte", 0, 0]
    - [4, "Diego Ramos", "Curitiba", 3320, 1]
    - [5, "Elisa Nogueira", "Salvador", 89.9, 1]
  orderSensitive: false
---

## Contexto

Bancos de dados relacionais guardam informações em tabelas, organizadas em
colunas (campos) e linhas (registros). Para LER dados de uma tabela usamos o
comando `SELECT`.

O asterisco (`*`) funciona como um coringa: ele pede TODAS as colunas da
tabela. A estrutura básica é:

```sql
SELECT * FROM nome_da_tabela;
```

No NexoPay, a tabela `clientes` guarda quem usa a plataforma. O banco já vem
populado — seu trabalho é apenas consultá-lo.

## Sua vez

Escreva uma consulta que traga todas as colunas e todos os registros da tabela
`clientes`.