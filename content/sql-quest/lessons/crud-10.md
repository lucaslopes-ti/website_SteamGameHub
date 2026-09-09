---
id: crud-10
title: "Atualizando registros com UPDATE"
summary: "Aprenda a modificar registros existentes com UPDATE e a proteger-se com WHERE."
chapter: 4
chapterSlug: crud
lesson: 10
difficulty: iniciante
xp: 30
prerequisites:
  - crud-09
hints: []
references:
  - label: "SQLite — UPDATE"
    url: "https://www.sqlite.org/lang_update.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual cláusula protege um UPDATE de alterar todas as linhas da tabela?"
      options:
        - "WHERE"
        - "ORDER BY"
        - "LIMIT"
        - "GROUP BY"
      answer: 0
      explanation: "Sem WHERE, o UPDATE altera todas as linhas."
    - prompt: "Qual é a forma básica do comando UPDATE?"
      options:
        - "UPDATE tabela SET coluna = valor WHERE condição"
        - "UPDATE tabela WHERE condição SET coluna = valor"
        - "SET tabela UPDATE coluna = valor WHERE condição"
        - "UPDATE coluna SET tabela = valor WHERE condição"
      answer: 0
      explanation: "A forma é UPDATE tabela SET coluna = valor WHERE condição."
---

## Contexto

`UPDATE` altera registros existentes. A forma básica é:

```sql
UPDATE tabela SET coluna = valor WHERE condição;
```

Exemplo:

```sql
UPDATE users SET age = 32 WHERE id = 8;
```

Sem `WHERE`, **todas** as linhas são atualizadas. Você também pode atualizar
várias colunas de uma vez:

```sql
UPDATE users SET age = 32, country_code = 'JP' WHERE id = 8;
```

> **Nota (MySQL):** o modo *safe-update* pode recusar `UPDATE`/`DELETE` sem uma
> coluna de chave no `WHERE` — um guarda-corpo contra acidentes.

## Sua vez

Responda às perguntas do desafio.