---
id: tabelas-08
title: "Tipos de dados do SQLite"
summary: "Conheça os tipos de dados do SQLite e como valores booleanos e monetários são armazenados."
chapter: 2
chapterSlug: tabelas
lesson: 8
difficulty: iniciante
xp: 30
prerequisites:
  - tabelas-07
hints: []
references:
  - label: "SQLite — Datatypes"
    url: "https://www.sqlite.org/datatype3.html"
---

## Contexto

Vamos revisar os tipos de dados suportados pelo SQLite e como eles são
armazenados:

- **NULL** — valor nulo (ausência de valor).
- **INTEGER** — inteiro com sinal, armazenado em 0, 1, 2, 3, 4, 6 ou 8 bytes.
- **REAL** — número de ponto flutuante armazenado como um número IEEE de 64
  bits.
- **TEXT** — texto armazenado usando a codificação do banco, normalmente UTF-8.
- **BLOB** — abreviação de *Binary Large Object*; usado para imagens, áudio e
  outros dados multimídia.
- **BOOLEAN** — valores booleanos são escritos nas consultas como `true` ou
  `false`, mas são registrados como `1` ou `0`.

### Sobre valores monetários

Neste curso usamos o tipo `REAL` para alguns campos que representam valores em
dinheiro, por simplicidade. No mundo real, para evitar problemas com aritmética
de ponto flutuante, a boa prática é usar `INTEGER` para valores monetários,
guardando a **menor denominação**. Por exemplo, R$ 42,67 seria armazenado como
`4267` (centavos).

### Valores booleanos

É importante notar que o SQLite **não tem uma classe de armazenamento BOOLEAN
separada**. Valores booleanos são armazenados como inteiros:

- `0` = falso
- `1` = verdadeiro

Não é tão estranho quanto parece — valores booleanos são apenas bits binários,
afinal! O SQLite permite escrever consultas usando expressões booleanas e as
palavras-chave `true`/`false`, mas converte tudo para inteiros nos bastidores.

## Observação

Esta é uma unidade de **teoria**: não há desafio executável. Leia o conteúdo e
siga para a próxima unidade.