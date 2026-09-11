---
id: joins-04
title: "RIGHT JOIN"
summary: "Entenda o RIGHT JOIN e quando ele é útil, sem executar SQL."
chapter: 10
chapterSlug: joins
lesson: 4
difficulty: intermediario
xp: 21
prerequisites:
  - joins-03
hints: []
references:
  - label: "SQLite — JOIN"
    url: "https://www.sqlite.org/lang_select.html"
---

## Contexto

Um `RIGHT JOIN` é, como você pode esperar, o oposto de um `LEFT JOIN`: ele
retorna todos os registros da tabela da direita (table_b) independentemente de
haver correspondência, além de todos os registros correspondentes entre as duas
tabelas.

Na prática, um `RIGHT JOIN` é apenas um `LEFT JOIN` com a ordem das tabelas
invertida — por isso, na maioria dos casos, o `LEFT JOIN` é preferido por ser
mais legível.

> **Nota sobre o SQLite:** o SQLite não implementa `RIGHT JOIN` nativamente
> (em versões mais antigas). Para obter o mesmo resultado, invertemos a ordem
> das tabelas e usamos `LEFT JOIN`.

## Observação

Esta é uma unidade de **teoria**: não há desafio executável. Leia o conteúdo e
siga para a próxima unidade.