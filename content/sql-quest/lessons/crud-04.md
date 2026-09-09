---
id: crud-04
title: "Inserção manual de IDs"
summary: "Entenda quando inserir o id manualmente e o que acontece se ele já existir."
chapter: 4
chapterSlug: crud
lesson: 4
difficulty: iniciante
xp: 30
prerequisites:
  - crud-03
hints: []
references:
  - label: "SQLite — INSERT"
    url: "https://www.sqlite.org/lang_insert.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "O que acontece se você inserir manualmente um id que já existe na tabela?"
      options:
        - "O registro antigo é sobrescrito"
        - "O INSERT falha com uma violação de PRIMARY KEY"
        - "O id é ignorado e um novo é gerado"
        - "O banco cria uma cópia do registro"
      answer: 1
      explanation: "A PRIMARY KEY não aceita duplicatas: o INSERT falha com erro de constraint."
    - prompt: "Em quais situações faz sentido inserir o id manualmente?"
      options:
        - "Em imports, migrações e restauração de backups"
        - "Nunca, em nenhuma situação"
        - "Sempre, em toda aplicação"
        - "Apenas em tabelas sem chave primária"
      answer: 0
      explanation: "Controlar o id manualmente é útil ao importar dados, migrar ou restaurar backups."
---

## Contexto

Às vezes você **quer** controlar o `id` — por exemplo, em imports, migrações ou
restauração de backups. Inserir um id explícito é permitido, desde que não
viole a PRIMARY KEY:

```sql
INSERT INTO users (id, name, age, country_code, username, password)
VALUES (9, 'Lance', 20, 'US', 'LanChr', 'hash-lance');
```

Se o `id` já existir, o INSERT falha com um erro de constraint.

## Sua vez

Responda às perguntas do desafio.