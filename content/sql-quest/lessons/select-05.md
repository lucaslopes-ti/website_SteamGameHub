---
id: select-05
title: "Quais bancos usam SQL?"
summary: "Conheça os bancos que usam SQL e descubra como o SQLite guarda valores booleanos."
chapter: 1
chapterSlug: select
lesson: 5
difficulty: iniciante
xp: 28
prerequisites:
  - select-04
hints:
  - "A missão é inspecionar três colunas específicas para ver como o SQLite mostra valores booleanos."
  - "Escolha as colunas pelo nome, separadas por vírgula, em vez de usar o coringa `*`."
  - "As colunas são `id`, `name` e `is_admin`, nessa ordem, todas da tabela `users`."
  - "Ao ler o resultado, observe a coluna `is_admin`: o SQLite guarda verdadeiro e falso como `1` e `0`."
references:
  - label: "SQLite — Datatypes"
    url: "https://www.sqlite.org/datatype3.html"
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
  instruction: "Selecione todas as colunas `id`, `name` e `is_admin` da tabela `users` para ver como o SQLite representa valores booleanos."
  expectedColumns:
    - id
    - name
    - is_admin
  expectedRows:
    - [1, "Ana Souza", 1]
    - [2, "Bruno Lima", 1]
    - [3, "Carla Mendes", 0]
  orderSensitive: false
---

## Contexto

SQL é apenas uma linguagem de consulta. Você normalmente a usa para interagir
com uma tecnologia de banco de dados específica, como:

- SQLite
- PostgreSQL
- MySQL
- Oracle

Embora muitos bancos usem a linguagem SQL, a maioria tem o seu próprio
**dialeto**. É importante entender que nem todos os bancos são iguais: só
porque um banco compatível com SQL faz algo de um jeito, não significa que
todos farão igual.

### Estamos usando SQLite

Neste curso usaremos o **SQLite**. Ele é ótimo para projetos embarcados,
navegadores e projetos de estudo: é leve e simples. Porém, tem funcionalidades
limitadas se comparado ao PostgreSQL ou MySQL, que são tecnologias mais comuns
em produção. Sempre que usarmos algo exclusivo do SQLite, vamos avisar!

### Booleanos no SQLite

Uma diferença do SQLite é que ele armazena valores booleanos como **inteiros**:

- `0` = falso
- `1` = verdadeiro

A tabela `users` tem uma coluna booleana `is_admin` que guarda se o usuário é
administrador ou não. Vamos ver como esse campo aparece no resultado.

## Sua vez

A missão é observar como o SQLite representa um valor booleano.

Sua consulta deve:

- consultar a tabela `users`;
- devolver as colunas `id`, `name` e `is_admin`, nessa ordem;
- trazer todas as linhas.

No resultado, compare a coluna `is_admin` com o que você esperaria: `1` significa verdadeiro e `0`, falso.