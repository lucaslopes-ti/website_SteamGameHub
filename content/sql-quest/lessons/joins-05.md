---
id: joins-05
title: "FULL JOIN"
summary: "Entenda o FULL JOIN e compare os quatro tipos de JOIN, sem executar SQL."
chapter: 5
chapterSlug: joins
lesson: 5
difficulty: intermediario
xp: 30
prerequisites:
  - joins-04
hints: []
references:
  - label: "SQLite — JOIN"
    url: "https://www.sqlite.org/lang_select.html"
---

## Contexto

Um `FULL JOIN` combina o conjunto de resultados do `LEFT JOIN` e do `RIGHT
JOIN`. Ele retorna **todos** os registros de ambas as tabelas (table_a e
table_b), independentemente de haver correspondência.

### Comparando os tipos de JOIN

Considere as tabelas abaixo:

**employees**

| emp_id | name     | dept_id |
|--------|----------|---------|
| 1      | Ada      | eng     |
| 2      | Grace    | eng     |
| 3      | Linus    | ops     |
| 4      | Margaret | NULL    |

**departments**

| dept_id | dept_name    |
|---------|--------------|
| eng     | Engineering  |
| ops     | Operations   |
| design  | Design       |

- **INNER JOIN:** apenas as linhas com `dept_id` correspondente nas duas
  tabelas (Ada, Grace e Linus).
- **LEFT JOIN:** todas as linhas de `employees` (Margaret aparece com
  `dept_name` NULL).
- **RIGHT JOIN:** todas as linhas de `departments` (Design aparece sem
  funcionários).
- **FULL JOIN:** tudo — Margaret (sem departamento) e Design (sem
  funcionários) só aparecem quando chegamos ao `FULL JOIN`.

> **Nota sobre o SQLite:** o SQLite não implementa `FULL JOIN` nativamente. Na
> prática, combinamos `LEFT JOIN` e `RIGHT JOIN` (ou usamos `UNION`) para
> obter o mesmo resultado.

## Observação

Esta é uma unidade de **teoria**: não há desafio executável. Leia o conteúdo e
siga para a próxima unidade.