---
id: joins-04
title: "RIGHT JOIN"
summary: "Entenda o RIGHT JOIN e quando ele Ã© Ãºtil, sem executar SQL."
chapter: 10
chapterSlug: joins
lesson: 4
difficulty: intermediario
xp: 30
prerequisites:
  - joins-03
hints: []
references:
  - label: "SQLite â€” JOIN"
    url: "https://www.sqlite.org/lang_select.html"
---

## Contexto

Um `RIGHT JOIN` Ã©, como vocÃª pode esperar, o oposto de um `LEFT JOIN`: ele
retorna todos os registros da tabela da direita (table_b) independentemente de
haver correspondÃªncia, alÃ©m de todos os registros correspondentes entre as duas
tabelas.

Na prÃ¡tica, um `RIGHT JOIN` Ã© apenas um `LEFT JOIN` com a ordem das tabelas
invertida â€” por isso, na maioria dos casos, o `LEFT JOIN` Ã© preferido por ser
mais legÃ­vel.

> **Nota sobre o SQLite:** o SQLite nÃ£o implementa `RIGHT JOIN` nativamente
> (em versÃµes mais antigas). Para obter o mesmo resultado, invertemos a ordem
> das tabelas e usamos `LEFT JOIN`.

## ObservaÃ§Ã£o

Esta Ã© uma unidade de **teoria**: nÃ£o hÃ¡ desafio executÃ¡vel. Leia o conteÃºdo e
siga para a prÃ³xima unidade.