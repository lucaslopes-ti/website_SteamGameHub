---
id: crud-11
title: "Mapeamento objeto-relacional (ORMs)"
summary: "Entenda o que é um ORM, seus benefícios e quando faz sentido usá-lo."
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
    - prompt: "Ao usar um ORM, você ____"
      options:
        - "Escreve muito SQL cru"
        - "Chama métodos e funções disponibilizados pela API do ORM"
      answer: 1
      explanation: "Um ORM expõe métodos na linguagem de programação que geram o SQL por baixo dos panos."
    - prompt: "Uma vantagem de um ORM é que ele..."
      options:
        - "Deixa seu código menos verboso"
        - "É mais fácil de depurar em baixo nível"
        - "Dá mais controle sobre o banco"
        - "Garante consultas mais rápidas"
      answer: 0
      explanation: "ORMs reduzem código repetitivo, mas limitam o controle e podem ser mais difíceis de depurar."
    - prompt: "Você deve usar um ORM?"
      options:
        - "Depende do projeto/time"
        - "Sempre"
        - "Quase nunca"
        - "Quase sempre"
      answer: 0
      explanation: "Um ORM normalmente troca controle por simplicidade; a decisão é do time."
---

## Contexto

Um **Object-Relational Mapping** — ou **ORM**, para encurtar — é uma ferramenta
que permite realizar operações CRUD em um banco de dados usando uma linguagem
de programação tradicional. Normalmente vem na forma de uma biblioteca ou
framework que você usa no seu código backend.

O principal benefício de um ORM é que ele mapeia seus registros do banco para
objetos em memória. Por exemplo, em Go podemos ter um struct que usamos no
código:

```go
type User struct {
    ID int
    Name string
    IsAdmin bool
}
```

Essa definição de struct representa convenientemente uma tabela chamada
`users`, e uma instância do struct representa uma linha da tabela.

### Exemplo: usando um ORM

Com um ORM, podemos escrever código simples assim:

```go
user := User{
    ID: 10,
    Name: "Lane",
    IsAdmin: false,
}

// gera uma instrução SQL e a executa,
// criando um novo registro na tabela users
db.Create(user)
```

### Exemplo: usando SQL direto

Usando SQL direto, normalmente precisamos escrever mais código e lidar com as
coisas de forma mais manual:

```go
user := User{
    ID: 10,
    Name: "Lane",
    IsAdmin: false,
}

db.Exec("INSERT INTO users (id, name, is_admin) VALUES (?, ?, ?);",
    user.ID, user.Name, user.IsAdmin)
```

### Você deve usar um ORM?

Depende! Um ORM normalmente troca **controle** por **simplicidade**. Usando SQL
direto, você pode aproveitar todo o poder da linguagem SQL. Usando um ORM, você
fica limitado à funcionalidade que o ORM tem. Se você encontrar problemas com
uma consulta específica, pode ser mais difícil depurar com um ORM, porque você
precisa vasculhar o código e a documentação do framework para descobrir como as
consultas subjacentes estão sendo geradas.

Recomendo fazer projetos das duas formas para aprender sobre os trade-offs. No
final das contas, quando você trabalha em um time de desenvolvedores, será uma
decisão do time.

## Sua vez

Responda às perguntas do desafio.