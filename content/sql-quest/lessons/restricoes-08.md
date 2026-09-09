---
id: restricoes-08
title: "Revisão de constraints"
summary: "Consolide o que aprendeu sobre PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT e FOREIGN KEY."
chapter: 3
chapterSlug: restricoes
lesson: 8
difficulty: iniciante
xp: 40
prerequisites:
  - restricoes-07
hints: []
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual constraint identifica cada linha de forma única e não aceita NULL?"
      options:
        - "PRIMARY KEY"
        - "NOT NULL"
        - "DEFAULT"
        - "UNIQUE"
      answer: 0
      explanation: "A PRIMARY KEY identifica cada linha de forma única; não aceita duplicatas nem NULL."
    - prompt: "Qual constraint garante que uma coluna sempre tenha um valor em todo INSERT?"
      options:
        - "NOT NULL"
        - "UNIQUE"
        - "DEFAULT"
        - "FOREIGN KEY"
      answer: 0
      explanation: "NOT NULL impede que a coluna receba valores NULL."
    - prompt: "Qual constraint impede que duas linhas tenham o mesmo valor em uma coluna?"
      options:
        - "PRIMARY KEY"
        - "NOT NULL"
        - "UNIQUE"
        - "DEFAULT"
      answer: 2
      explanation: "UNIQUE garante que não existam valores duplicados na coluna."
    - prompt: "Qual constraint exige que o valor da coluna exista em outra tabela?"
      options:
        - "PRIMARY KEY"
        - "FOREIGN KEY"
        - "UNIQUE"
        - "NOT NULL"
      answer: 1
      explanation: "FOREIGN KEY referencia uma PRIMARY KEY (ou coluna UNIQUE) de outra tabela."
    - prompt: "Qual constraint usa um valor automático quando nenhum é fornecido no INSERT?"
      options:
        - "DEFAULT"
        - "NOT NULL"
        - "UNIQUE"
        - "FOREIGN KEY"
      answer: 0
      explanation: "DEFAULT define um valor usado automaticamente quando o campo é omitido."
---

## Contexto

Uma **constraint** é uma regra no banco de dados que impõe um comportamento
específico, verificada automaticamente em todo INSERT e UPDATE.

### Tipos de constraints

- **PRIMARY KEY**: identifica cada linha de forma única; sem duplicatas e sem
  NULL.
- **NOT NULL**: a coluna deve ter um valor em todo INSERT.
- **UNIQUE**: nenhuma linha pode ter o mesmo valor nessa coluna.
- **DEFAULT**: um valor usado automaticamente quando nenhum é fornecido.
- **FOREIGN KEY**: o valor deve referenciar uma linha existente em outra
  tabela.

### Limitação do SQLite

O SQLite **não suporta** `ADD CONSTRAINT` dentro de um `ALTER TABLE`. Em MySQL,
você pode adicionar constraints com `ALTER TABLE ... ADD CONSTRAINT`; no
SQLite, todas as constraints devem ser declaradas no `CREATE TABLE`.

### Solução de referência

Reconstruindo a tabela `users` com as constraints corretas:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN
);
```

## Sua vez

Responda às perguntas do desafio.