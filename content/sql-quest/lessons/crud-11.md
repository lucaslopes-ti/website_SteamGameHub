---
id: crud-11
title: "Mapeamento objeto-relacional (ORMs)"
summary: "Entenda o que são ORMs e por que aprender SQL continua essencial mesmo usando um."
chapter: 4
chapterSlug: crud
lesson: 11
difficulty: iniciante
xp: 30
prerequisites:
  - crud-10
hints: []
references:
  - label: "SQLite — Lang"
    url: "https://www.sqlite.org/lang.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Verdadeiro ou falso: aprender SQL é inútil depois que você passa a usar um ORM."
      options:
        - "Verdadeiro"
        - "Falso"
      answer: 1
      explanation: "ORMs geram SQL; você ainda precisa de SQL para entender, depurar e ajustar o que eles geram."
    - prompt: "O que um ORM (Object-Relational Mapper) faz?"
      options:
        - "Mapeia tabelas para classes/objetos na linguagem de programação"
        - "Substitui o banco de dados por arquivos JSON"
        - "Cria o banco de dados automaticamente sem SQL"
        - "Remove a necessidade de tabelas"
      answer: 0
      explanation: "Um ORM mapeia tabelas para objetos, gerando o SQL por baixo dos panos."
---

## Contexto

Aplicações raramente enviam SQL cru. Um **ORM** (*Object-Relational Mapper*)
mapeia tabelas para classes/objetos na linguagem de programação:

- Python: SQLAlchemy, Django ORM
- TypeScript/JavaScript: Prisma, Drizzle, TypeORM
- Go: GORM, sqlc

Exemplo conceitual:

```python
user = User(name='Yuki', age=31, country_code='JP')
session.add(user)   # gera o INSERT
session.commit()
```

**Benefícios:** menos código repetitivo, segurança de tipos e ferramentas de
migração. **Custos:** você ainda precisa de SQL para depurar, ajustar e
entender o que o ORM gerou.

## Sua vez

Responda às perguntas do desafio.