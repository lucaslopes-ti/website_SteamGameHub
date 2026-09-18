---
id: normalizacao-05
title: "Formas normais"
summary: "Conheça a 1NF, 2NF, 3NF e BCNF e o que significa 'chave primária' na normalização."
chapter: 9
chapterSlug: normalizacao
lesson: 5
difficulty: intermediario
xp: 28
prerequisites:
  - normalizacao-04
hints:
  - "A 1NF é a forma menos normalizada; a BCNF é a mais normalizada deste curso."
  - "Na normalização, a chave primária pode ser formada por várias colunas (chave composta)."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
images:
  - alt: "Tabelas de exemplo comparando a 1ª, 2ª e 3ª forma normal (1NF, 2NF e 3NF)"
    src: "normalizacao1fn2fn3fn.png"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre as formas normais."
  questions:
    - prompt: "Qual forma normal tem mais dados duplicados?"
      options:
        - "BCNF"
        - "3NF"
        - "2NF"
        - "1NF"
      answer: 3
      explanation: "A 1NF é a menos normalizada, então é a que ainda admite mais duplicação."
    - prompt: "Qual forma normal incentiva mais informação exata e atualizada?"
      options:
        - "BCNF"
        - "3NF"
        - "2NF"
        - "1NF"
      answer: 0
      explanation: "A BCNF é a mais normalizada das formas cobertas: mais integridade e menos duplicação."
    - prompt: "No contexto da normalização, a chave primária é formada por quantas colunas?"
      options:
        - "1 a muitas colunas"
        - "Sempre 1 e 2 colunas"
        - "A menor combinação de colunas que identifica cada linha"
        - "0 a 1 coluna"
      answer: 2
      explanation: "Na normalização, 'chave primária' é o conjunto mínimo de colunas que identifica uma linha — pode ser uma só ou uma chave composta."
    - prompt: "Quanto mais normalizado é um banco de dados..."
      options:
        - "maior a integridade e menor a duplicação de dados"
        - "maior a duplicação de dados"
        - "menor a integridade dos dados"
        - "mais chaves primárias únicas ele precisa ter"
      answer: 0
      explanation: "Quanto mais normalizado, melhor a integridade dos dados e menos dados duplicados."
---

## Contexto

O criador da "normalização de banco de dados", **Edgar F. Codd**, descreveu
diferentes **formas normais** que um banco pode seguir. Vamos falar das mais
comuns:

- Primeira forma normal (**1NF**);
- Segunda forma normal (**2NF**);
- Terceira forma normal (**3NF**);
- Forma normal de Boyce-Codd (**BCNF**).

Em resumo: a 1NF é a forma menos normalizada, e a BCNF é a mais normalizada que
vamos cobrir aqui. Quanto mais normalizado um banco, melhor sua integridade e
menor a quantidade de dados duplicados.

### "Chave primária" nas formas normais

No contexto da normalização, usamos o termo "chave primária" de forma um pouco
diferente do SQLite. No SQLite, uma chave primária é uma única coluna que
identifica uma linha. Na normalização, "chave primária" significa a **coleção
de colunas** que identifica uma linha de forma única — pode ser uma única
coluna ou várias, formando uma **chave composta**. É a quantidade mínima de
colunas necessária para identificar uma linha.

Lembre da tabela de junção `product_suppliers`: a "chave primária" dela era, na
verdade, a combinação de `product_id` e `supplier_id`:

```sql
CREATE TABLE product_suppliers (
  product_id INTEGER,
  supplier_id INTEGER,
  UNIQUE (product_id, supplier_id)
);
```

## Sua vez

Responda às perguntas do desafio.
