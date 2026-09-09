---
id: crud-03
title: "Auto incremento de IDs"
summary: "Descubra como os bancos geram IDs automaticamente para você."
chapter: 4
chapterSlug: crud
lesson: 3
difficulty: iniciante
xp: 30
prerequisites:
  - crud-02
hints: []
references:
  - label: "SQLite — Autoincrement"
    url: "https://www.sqlite.org/autoinc.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "No SQLite, qual tipo de coluna gera valores automaticamente quando omitida no INSERT?"
      options:
        - "TEXT"
        - "INTEGER PRIMARY KEY"
        - "REAL"
        - "BLOB"
      answer: 1
      explanation: "No SQLite, uma coluna INTEGER PRIMARY KEY recebe um valor automático quando o id é omitido."
    - prompt: "Qual é a principal vantagem do auto incremento?"
      options:
        - "Deixar o banco mais rápido"
        - "Evitar erros de digitação e conflitos de id escritos à mão"
        - "Permitir valores negativos"
        - "Impedir a exclusão de registros"
      answer: 1
      explanation: "Escrever ids à mão é propenso a erros; o banco gera valores únicos automaticamente."
---

## Contexto

Escrever valores de `id` à mão é propenso a erros. A maioria dos bancos de
dados consegue gerar esses valores automaticamente:

- **SQLite**: uma coluna `INTEGER PRIMARY KEY` recebe um valor automático
  quando o `id` é omitido no INSERT.
- **MySQL**: atributo `AUTO_INCREMENT` na coluna.
- **PostgreSQL**: `SERIAL` ou `GENERATED ALWAYS AS IDENTITY`.

Com auto incremento, o INSERT fica mais simples:

```sql
INSERT INTO users (name, age, country_code, username, password)
VALUES ('Yuki', 31, 'JP', 'yuki31', 'hash-yuki');
```

No MySQL, a tabela precisa declarar isso na criação:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  ...
);
```

## Sua vez

Responda às perguntas do desafio.