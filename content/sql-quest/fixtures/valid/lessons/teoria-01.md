---
id: teoria-01
title: "RIGHT JOIN"
summary: "Entenda o RIGHT JOIN e quando ele é útil, sem executar SQL."
chapter: 3
chapterSlug: restricoes
lesson: 2
difficulty: intermediario
xp: 30
prerequisites:
  - restricoes-01
hints: []
references:
  - label: "SQLite — JOIN"
    url: "https://www.sqlite.org/lang_select.html"
images:
  - alt: "Diagrama de Venn do RIGHT JOIN"
    src: "innerjoin.jpg"
---

## Contexto

Um `RIGHT JOIN` é, como você pode esperar, o oposto de um `LEFT JOIN`: ele
retorna todos os registros da tabela da direita (table_b) independentemente de
haver correspondência, além de todos os registros correspondentes entre as duas
tabelas.

Na prática, um `RIGHT JOIN` é apenas um `LEFT JOIN` com a ordem das tabelas
invertida — por isso, na maioria dos casos, o `LEFT JOIN` é preferido por ser
mais legível.

## Observação

Esta é uma unidade de **teoria**: não há desafio executável. Leia o conteúdo e
siga para a próxima unidade.