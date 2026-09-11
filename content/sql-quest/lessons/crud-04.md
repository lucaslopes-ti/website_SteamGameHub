---
id: crud-04
title: "Inserção manual e injeção de SQL"
summary: "Entenda como sistemas reais geram consultas SQL e por que interpolar strings é perigoso."
chapter: 4
chapterSlug: crud
lesson: 4
difficulty: iniciante
xp: 21
prerequisites:
  - crud-03
hints: []
references:
  - label: "SQLite — Lang"
    url: "https://www.sqlite.org/lang.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Toda vez que alguém cria uma conta no Senai Pay, um desenvolvedor precisa adicioná-la manualmente no banco escrevendo uma consulta SQL à mão."
      options:
        - "Verdadeiro"
        - "Falso"
      answer: 1
      explanation: "Sistemas reais geram as consultas SQL por código, não à mão, para cada novo usuário."
    - prompt: "Em sistemas backend, consultas SQL normalmente são ____"
      options:
        - "Escritas à mão"
        - "Geradas por código"
      answer: 1
      explanation: "Um servidor backend usa uma linguagem de programação para montar e executar as consultas dinamicamente."
    - prompt: "Por que interpolar strings diretamente em uma consulta SQL é perigoso?"
      options:
        - "Pode permitir injeção de SQL (SQL injection)"
        - "Deixa a consulta mais lenta"
        - "Não é perigoso"
        - "Gera sempre um erro de sintaxe"
      answer: 0
      explanation: "Interpolar entrada do usuário sem cuidado permite que um atacante injete comandos SQL maliciosos."
---

## Contexto

Inserir manualmente **todos** os registros de um banco seria uma tarefa
extremamente demorada! Trabalhar com SQL cru como estamos fazendo agora não é
muito comum ao projetar sistemas backend.

Ao trabalhar com SQL dentro de um sistema de software — como uma aplicação web
backend — você normalmente tem acesso a uma linguagem de programação como Go ou
Python. Por exemplo, um servidor backend escrito em Go pode usar concatenação
de strings para criar instruções SQL dinamicamente, e é assim que geralmente é
feito:

```go
sqlQuery := fmt.Sprintf(`
INSERT INTO users(name, age, country_code)
VALUES ('%s', %v, '%s');
`, user.Name, user.Age, user.CountryCode)
```

### Injeção de SQL

O exemplo acima é uma simplificação do que realmente acontece quando você
acessa um banco usando código Go. Em essência, está correto: a interpolação de
strings é como sistemas de produção acessam bancos de dados. Dito isso, isso
deve ser feito com cuidado para não virar uma vulnerabilidade de segurança.
Falaremos mais sobre isso depois!

## Sua vez

Responda às perguntas do desafio.