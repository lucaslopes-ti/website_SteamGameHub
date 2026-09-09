---
id: restricoes-07
title: "Bancos relacionais vs. não relacionais"
summary: "Compare como bancos SQL e NoSQL organizam e aninham os dados."
chapter: 3
chapterSlug: restricoes
lesson: 7
difficulty: iniciante
xp: 30
prerequisites:
  - restricoes-06
hints: []
references:
  - label: "SQLite — Lang"
    url: "https://www.sqlite.org/lang.html"
---

## Contexto

A grande diferença entre bancos relacionais e não relacionais é que os bancos
**não relacionais** tendem a **aninhar** os dados. Em vez de manter registros
sempre em tabelas separadas, eles costumam armazenar registros **dentro** de
outros registros.

Para simplificar (talvez demais), você pode pensar em bancos não relacionais
como grandes blocos de JSON. Se um usuário pode ter vários cursos, você pode
simplesmente adicionar todos os cursos ao registro do usuário:

```json
{
  "users": [
    {
      "id": 0,
      "name": "Ana",
      "courses": [
        { "name": "Biologia", "id": 0 }
      ]
    },
    {
      "id": 1,
      "name": "Bruno",
      "courses": [
        { "name": "Biologia", "id": 0 }
      ]
    }
  ]
}
```

Isso muitas vezes resulta em **dados duplicados** dentro do banco. Obviamente
isso não é o ideal, mas tem alguns benefícios que veremos mais adiante no
curso.

### Comparação visual

- **Banco relacional:** dados organizados em tabelas separadas, conectadas por
  chaves (primárias e estrangeiras). Cada fato é armazenado uma única vez.
- **Banco não relacional:** dados aninhados em documentos, muitas vezes com
  duplicação, mas com leitura mais direta para certos casos de uso.

## Observação

Esta é uma unidade de **teoria**: não há desafio executável. Leia o conteúdo e
siga para a próxima unidade.