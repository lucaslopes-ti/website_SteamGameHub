---
id: performance-05
title: "SQL injection"
summary: "Conheça ataques de injeção de SQL e como as bibliotecas modernas nos protegem."
chapter: 11
chapterSlug: performance
lesson: 5
difficulty: intermediario
xp: 28
prerequisites:
  - performance-04
hints:
  - "Antes de responder, releia o contexto sobre o caminho que a entrada do usuário percorre até chegar ao banco."
  - "No exemplo com apóstrofo e traço duplo, identifique o que o banco passa a executar por causa da entrada."
  - "Ao avaliar a afirmação sobre bibliotecas modernas, pergunte-se em que circunstâncias ela valeria e em quais não."
  - "Confira depois com as explicações."
references:
  - label: "OWASP — SQL Injection"
    url: "https://owasp.org/www-community/attacks/SQL_Injection"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre SQL injection."
  questions:
    - prompt: "SQL injection é melhor evitado usando uma biblioteca moderna de SQL que cuida da sanitização dos valores fornecidos pelo usuário."
      options:
        - "Verdadeiro"
        - "Falso"
      answer: 0
      explanation: "Bibliotecas modernas sanitizam entradas automaticamente; não precisamos mais higienizar tudo na mão."
    - prompt: "O que o exemplo `Robert'); DROP TABLE students;--` demonstra?"
      options:
        - "Que o SQLite apaga tabelas automaticamente"
        - "Que inserir entrada do usuário direto na query permite executar comandos extras"
        - "Que chaves primárias evitam ataques"
        - "Que nomes com apóstrofo são inválidos em SQL"
      answer: 1
      explanation: "Sem sanitização, a entrada fecha a query original e injeta uma segunda instrução que apaga a tabela."
    - prompt: "Qual é a prática recomendada ao usar entrada do usuário em consultas?"
      options:
        - "Concatenar os valores diretamente na string SQL"
        - "Remover manualmente todos os apóstrofos"
        - "Passar os valores como parâmetros para a biblioteca de banco"
        - "Guardar a query em uma coluna TEXT"
      answer: 2
      explanation: "Passe valores como parâmetros: a biblioteca trata a entrada como dado, e não como parte do comando SQL."
    - prompt: "No ataque de exemplo, para que serve o `--` no final da entrada?"
      options:
        - "Comentar o restante da query, ignorando o que vem depois"
        - "Encerrar a conexão com o banco"
        - "Criar um índice temporário"
        - "Indicar que a string é um parâmetro"
      answer: 0
      explanation: "Em SQL, `--` inicia um comentário e descarta o resto da instrução original."
---

## Contexto

SQL é uma forma muito comum de hackers tentarem causar dano ou invadir um
banco. Um dos exemplos mais famosos é o quadrinho do "Bobby Tables": o nome de
um aluno é `Robert'); DROP TABLE students;--`.

Suponha que alguém estivesse usando esta query:

```sql
INSERT INTO students (name) VALUES (?);
```

Ao substituir o `?` pelo nome malicioso, a query resultante seria:

```sql
INSERT INTO students (name) VALUES ('Robert');

DROP TABLE students;

--');
```

Como você pode ver, isso são, na verdade, **duas queries**! A primeira insere
"Robert" no banco e a segunda apaga a tabela `students`!

### Como se proteger contra SQL injection

Você precisa conhecer os ataques de injeção de SQL, mas, para ser honesto, a
solução hoje em dia é simplesmente usar uma **biblioteca moderna** que sanitiza
as entradas. Já não precisamos higienizar entradas na mão no nível da aplicação
na maioria dos casos.

Por exemplo, a biblioteca padrão de SQL do Go protege automaticamente contra
ataques de injeção se usada corretamente.

Resumindo: não interpole a entrada do usuário em strings de query você mesmo —
garanta que a biblioteca de banco tenha uma forma de sanitizar as entradas e
passe os valores fornecidos pelo usuário para ela.

## Sua vez

Responda às perguntas sobre SQL injection e sobre como evitá-la.

- Pense no que acontece quando a entrada do usuário vira parte do comando SQL.
- Considere como as bibliotecas modernas tratam valores passados como parâmetros.

Depois de enviar, leia as explicações para revisar.
