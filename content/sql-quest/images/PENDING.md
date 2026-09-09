# Manifesto de imagens pendentes — SQL Quest

> **Status:** pendente. Nenhuma imagem foi enviada pelo usuário ainda, então
> **nenhuma unidade referencia imagens** no front matter (o build falharia com
> "Imagem não encontrada"). Este manifesto registra, por unidade, as imagens
> que **poderiam** ser associadas quando o usuário enviar os arquivos.
>
> Quando as imagens chegarem: coloque os arquivos em `content/sql-quest/images/`
> e adicione o bloco `images:` no front matter da unidade correspondente,
> usando o `src` relativo proposto abaixo.

## Convenção de nomes

- `sql_logos.png` — logos de bancos de dados SQL (SQLite, PostgreSQL, MySQL...)
- `venn/innerjoin.png` — diagrama de Venn do INNER JOIN
- `venn/leftjoin.png` — diagrama de Venn do LEFT JOIN
- `venn/rightjoin.png` — diagrama de Venn do RIGHT JOIN
- `venn/fulljoin.png` — diagrama de Venn do FULL JOIN
- `relacional.png` — exemplo visual de banco relacional (tabelas conectadas)
- `nao-relacional.png` — exemplo visual de banco não relacional (dados aninhados)

## Associação por unidade

| Unidade | Imagem sugerida | Alt sugerido |
|---|---|---|
| `select-01` | `sql_logos.png` | Logos de bancos de dados SQL |
| `select-04` | `sql_logos.png` | Logos de bancos de dados SQL |
| `select-05` | `sql_logos.png` | Logos de bancos de dados SQL |
| `select-06` | `nao-relacional.png` | Exemplo de dados aninhados em banco NoSQL |
| `restricoes-06` | `relacional.png` | Tabelas Students, Courses e StudentCourses conectadas |
| `restricoes-07` | `nao-relacional.png` | Exemplo de dados aninhados em banco NoSQL |
| `joins-01` | `venn/innerjoin.png` | Diagrama de Venn do INNER JOIN |
| `joins-03` | `venn/leftjoin.png` | Diagrama de Venn do LEFT JOIN |
| `joins-04` | `venn/rightjoin.png` | Diagrama de Venn do RIGHT JOIN |
| `joins-05` | `venn/fulljoin.png` | Diagrama de Venn do FULL JOIN |
| `joins-06` | `venn/innerjoin.png` | Diagrama de Venn do INNER JOIN |
| `joins-07` | `venn/leftjoin.png` | Diagrama de Venn do LEFT JOIN |
| `joins-08` | `venn/rightjoin.png` | Diagrama de Venn do RIGHT JOIN |

> As demais unidades (práticas de SQL e quizzes conceituais) não dependem de
> imagens para o aprendizado; podem receber ilustrações decorativas depois, se
> o usuário desejar.