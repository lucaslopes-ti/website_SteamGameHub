---
id: joins-08
title: "Quiz de JOINs (3)"
summary: "Identifique qual tipo de JOIN mantém todas as transações, mesmo sem usuário correspondente."
chapter: 10
chapterSlug: joins
lesson: 8
difficulty: intermediario
xp: 40
prerequisites:
  - joins-07
hints: []
references:
  - label: "SQLite — JOIN"
    url: "https://www.sqlite.org/lang_select.html"
challenge:
  kind: quiz
  instruction: "Dadas as tabelas e o resultado abaixo, responda qual tipo de JOIN produziria esse resultado."
  questions:
    - prompt: "Qual tipo de JOIN produz o resultado mostrado?"
      options:
        - "RIGHT JOIN"
        - "INNER JOIN"
        - "FULL JOIN"
      answer: 0
      explanation: "Todas as transações aparecem (inclusive a do usuário 10, sem usuário correspondente), mas usuários sem transações não aparecem — é um RIGHT JOIN."
---

## Contexto

Vamos praticar a leitura de resultados de JOINs. Considere as tabelas abaixo.

**Users**

| id | name     | age | country_code | username   | password        | is_admin |
|----|----------|-----|--------------|------------|-----------------|----------|
| 1  | David    | 34  | US           | DavidDev   | insertPractice  | 0        |
| 2  | Samantha | 29  | BR           | Sammy93    | addingRecords!  | 0        |
| 3  | John     | 39  | CA           | Jjdev21    | sqlMaster2024   | 0        |
| 4  | Ram      | 42  | IN           | Ram11c     | queryNinja      | 0        |
| 5  | Hunter   | 30  | US           | Hdev92     | backendDev      | 0        |
| 6  | Allan    | 27  | US           | Alires     | adminPass1      | 1        |
| 7  | Al       | 39  | JP           | quickCoder | snake_case      | 0        |

**Transactions**

| id | user_id | recipient_id | sender_id | amount |
|----|---------|--------------|-----------|--------|
| 1  | 1       | NULL         | 4         | 10.5   |
| 2  | 3       | 10           | NULL      | 9.56   |
| 3  | 1       | NULL         | 2         | 256.21 |
| 4  | 10      | 2            | NULL      | 50     |

**Result**

| id   | name  | age | country_code | username | password       | is_admin | id | user_id | recipient_id | sender_id | amount |
|------|-------|-----|--------------|----------|----------------|----------|----|---------|--------------|-----------|--------|
| 1    | David | 34  | US           | DavidDev | insertPractice | 0        | 1  | 1       | NULL         | 4         | 10.5   |
| 3    | John  | 39  | CA           | Jjdev21  | sqlMaster2024  | 0        | 2  | 3       | 10           | NULL      | 9.56   |
| 1    | David | 34  | US           | DavidDev | insertPractice | 0        | 3  | 1       | NULL         | 2         | 256.21 |
| NULL | NULL  | NULL | NULL         | NULL     | NULL           | NULL     | 4  | 10      | 2            | NULL      | 50     |

**Query**

```sql
SELECT *
FROM users ________ transactions ON users.id = transactions.user_id;
```

## Sua vez

Dadas as tabelas e a consulta, responda qual tipo de JOIN produziria o
resultado mostrado.