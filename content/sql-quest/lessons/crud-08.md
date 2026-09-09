---
id: crud-08
title: "Excluindo registros com DELETE"
summary: "Aprenda a remover linhas com DELETE e entenda o perigo de um DELETE sem WHERE."
chapter: 4
chapterSlug: crud
lesson: 8
difficulty: iniciante
xp: 30
prerequisites:
  - crud-07
hints: []
references:
  - label: "SQLite — DELETE"
    url: "https://www.sqlite.org/lang_delete.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "O que acontece ao executar DELETE FROM users; sem uma cláusula WHERE?"
      options:
        - "Nada: o comando é ignorado"
        - "Apenas a primeira linha é apagada"
        - "Todas as linhas da tabela são apagadas"
        - "A tabela inteira é removida do banco"
      answer: 2
      explanation: "Um DELETE sem WHERE remove todas as linhas da tabela."
    - prompt: "Qual é a diferença entre DELETE e DROP?"
      options:
        - "DELETE remove dados; DROP remove a estrutura da tabela"
        - "DELETE remove a tabela; DROP remove apenas dados"
        - "Não há diferença"
        - "DELETE é mais rápido que DROP"
      answer: 0
      explanation: "DELETE remove apenas linhas; DROP remove a tabela (estrutura) do banco."
---

## Contexto

`DELETE` remove linhas de uma tabela. **Sempre** combine com `WHERE` — um
`DELETE` sem `WHERE` remove **todas** as linhas da tabela:

```sql
DELETE FROM users WHERE id = 8;
```

Diferente de `DROP` (que remove a estrutura), `DELETE` remove apenas dados. As
linhas excluídas somem, a menos que você tenha um backup.

## Sua vez

Responda às perguntas do desafio.