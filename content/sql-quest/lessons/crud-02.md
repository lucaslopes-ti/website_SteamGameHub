---
id: crud-02
title: "A instrução INSERT"
summary: "Aprenda a adicionar novos registros e por que listar as colunas explicitamente é boa prática."
chapter: 4
chapterSlug: crud
lesson: 2
difficulty: iniciante
xp: 30
prerequisites:
  - crud-01
hints: []
references:
  - label: "SQLite — INSERT"
    url: "https://www.sqlite.org/lang_insert.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual parte do INSERT lista as colunas que recebem valores?"
      options:
        - "A cláusula WHERE"
        - "A lista de colunas entre o nome da tabela e VALUES"
        - "A cláusula ORDER BY"
        - "O comando SELECT"
      answer: 1
      explanation: "A lista de colunas entre o nome da tabela e VALUES indica quais campos receberão os valores."
    - prompt: "Por que é boa prática listar as colunas explicitamente no INSERT?"
      options:
        - "Para o SQL ficar mais rápido"
        - "Para não quebrar silenciosamente se a tabela ganhar novas colunas"
        - "Porque é obrigatório em todos os bancos"
        - "Para economizar espaço no banco"
      answer: 1
      explanation: "Se a tabela ganhar uma coluna, um INSERT que depende da ordem das colunas pode quebrar ou inserir dados errados."
---

## Contexto

A instrução `INSERT` adiciona novas linhas a uma tabela. Especificamos a
tabela, as colunas que receberão valores e os próprios valores:

```sql
INSERT INTO users (id, name, age, country_code, username, password)
VALUES (8, 'Yuki', 31, 'JP', 'yuki31', 'hash-yuki');
```

### Boa prática

Sempre liste as colunas explicitamente. Se a tabela ganhar uma coluna depois,
um `INSERT` que depende da ordem das colunas pode quebrar silenciosamente ou
inserir dados no lugar errado.

## Sua vez

Responda às perguntas do desafio.