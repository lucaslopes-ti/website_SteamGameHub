---
id: normalizacao-09
title: "Forma normal de Boyce-Codd (BCNF)"
summary: "Entenda as chaves candidatas sobrepostas e o que falta para chegar à BCNF."
chapter: 9
chapterSlug: normalizacao
lesson: 9
difficulty: intermediario
xp: 28
prerequisites:
  - normalizacao-08
hints:
  - "Releia no contexto a regra extra que a BCNF impõe em relação à 3NF."
  - "Releia também o que são chaves candidatas e o que significa dizer que elas se sobrepõem."
  - "Na pergunta sobre frequência, pense em como a teoria costuma descrever a ocorrência prática desse caso."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre a BCNF."
  questions:
    - prompt: "Quando uma tabela pode estar na 3NF, mas não na BCNF?"
      options:
        - "Quando Boyce e Codd decretam que sim"
        - "Quando ela tem múltiplas chaves primárias possíveis"
        - "Quando tem múltiplas chaves candidatas sobrepostas e uma coluna de uma chave depende de uma coluna fora dela"
        - "Quando a chave primária depende de uma coluna que não é chave"
      answer: 2
      explanation: "A BCNF restringe como colunas que fazem parte da chave primária podem depender de colunas que não fazem parte dela."
    - prompt: "O que significa 'chaves candidatas sobrepostas'?"
      options:
        - "Várias combinações de colunas que poderiam ser a chave primária e que compartilham colunas"
        - "Duas tabelas diferentes com o mesmo nome"
        - "Uma chave primária com dois tipos de dados diferentes"
        - "Chaves estrangeiras que apontam para a mesma tabela"
      answer: 0
      explanation: "Chaves candidatas são combinações que identificam uma linha; 'sobrepostas' quer dizer que elas compartilham colunas."
    - prompt: "Com que frequência uma tabela na 3NF deixa de atender à BCNF?"
      options:
        - "Sempre"
        - "Na maioria dos casos"
        - "Apenas em casos raros"
        - "Nunca"
      answer: 2
      explanation: "É raro encontrar problemas específicos de BCNF na prática."
---

## Contexto

Uma tabela na **forma normal de Boyce-Codd** (BCNF), criada por Raymond Boyce
e Edgar Codd, segue todas as regras da terceira forma normal e mais uma:

> Uma coluna que faz parte da chave primária **não pode** depender inteiramente
> de uma coluna que não faz parte dessa chave primária.

Isso só entra em jogo quando existem **várias combinações possíveis de chave
primária que se sobrepõem** — o que chamamos de "chaves candidatas
sobrepostas".

Apenas em casos raros uma tabela na 3NF deixa de atender aos requisitos da
BCNF!

### Exemplo na 3NF, mas não na BCNF

| release_year | release_date | sales | name |
|---|---|---|---|
| 2001 | 2001-01-02 | 100 | Kiss me tender |
| 2001 | 2001-01-02 | 200 | Bloody Mary |
| 2002 | 2002-04-14 | 100 | I wanna be them |
| 2002 | 2002-04-14 | 200 | He got me |

Aqui existem três chaves candidatas possíveis:

- `release_year` + `sales`;
- `release_date` + `sales`;
- `name`.

Por definição, a tabela está na 2NF e na 3NF, porque essas formas só restringem
como colunas que **não** fazem parte da chave primária podem depender. Porém,
ela **não** está na BCNF, porque `release_year` depende inteiramente de
`release_date`.

### Exemplo na BCNF

A forma mais fácil de corrigir é remover o dado duplicado de `release_date`,
transformando a coluna em `release_month_and_day`:

| release_year | release_month_and_day | sales | name |
|---|---|---|---|
| 2001 | 01-02 | 100 | Kiss me tender |
| 2001 | 02-04 | 200 | Bloody Mary |
| 2002 | 04-14 | 100 | I wanna be them |
| 2002 | 06-24 | 200 | He got me |

### BCNF costuma ser uma boa ideia

A mesma regra prática vale para a 2NF, a 3NF e a BCNF: otimize primeiro a
integridade e a desduplicação. Se houver problemas de velocidade,
desnormalize conforme a necessidade.

## Sua vez

Responda às perguntas sobre a forma normal de Boyce-Codd.

- Compare a BCNF com a 3NF para identificar a regra extra.
- Releia o que são chaves candidatas e o que significa elas se sobreporem.

Depois de enviar, leia as explicações para conferir.
