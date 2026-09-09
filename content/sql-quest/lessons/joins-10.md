---
id: joins-10
title: "PrÃ¡tica: tickets de suporte"
summary: "Use INNER JOIN com agregaÃ§Ã£o para encontrar usuÃ¡rios com vÃ¡rios chamados de suporte."
chapter: 10
chapterSlug: joins
lesson: 10
difficulty: intermediario
xp: 60
prerequisites:
  - joins-09
hints:
  - "Junte users com support_tickets usando INNER JOIN."
  - "Exclua tickets com issue_type 'Account Access' usando WHERE."
  - "Agrupe por usuÃ¡rio e filtre com HAVING COUNT > 1."
references:
  - label: "SQLite â€” JOIN"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country_code TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, country_code, username, password, is_admin) VALUES
    (1, 'David', 34, 'US', 'DavidDev', 'insertPractice', false),
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false),
    (3, 'John', 39, 'CA', 'Jjdev21', 'sqlMaster2024', false),
    (4, 'Ram', 42, 'IN', 'Ram11c', 'queryNinja', false),
    (5, 'Hunter', 30, 'US', 'Hdev92', 'backendDev', false),
    (6, 'Allan', 27, 'US', 'Alires', 'adminPass1', true),
    (7, 'Al', 39, 'JP', 'quickCoder', 'snake_case', false);

  CREATE TABLE support_tickets (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT
  );

  INSERT INTO support_tickets (id, user_id, issue_type, description) VALUES
    (1, 1, 'Account Access', 'NÃ£o consigo acessar minha conta'),
    (2, 1, 'Payment', 'TransferÃªncia nÃ£o chegou ao destino'),
    (3, 1, 'Payment', 'CobranÃ§a duplicada no cartÃ£o'),
    (4, 2, 'Account Access', 'Esqueci minha senha'),
    (5, 2, 'Refund', 'Quero solicitar um reembolso'),
    (6, 3, 'Account Access', 'Conta bloqueada apÃ³s login'),
    (7, 3, 'Payment', 'Pagamento recusado sem motivo'),
    (8, 3, 'Refund', 'Reembolso estÃ¡ atrasado'),
    (9, 3, 'Payment', 'Taxa cobrada indevidamente'),
    (10, 4, 'Account Access', 'Preciso trocar meu e-mail'),
    (11, 5, 'Payment', 'TransferÃªncia enviada para a pessoa errada'),
    (12, 5, 'Payment', 'Saldo nÃ£o foi debitado'),
    (13, 5, 'Refund', 'Cancelar assinatura do plano'),
    (14, 5, 'Payment', 'CobranÃ§a nÃ£o reconhecida'),
    (15, 6, 'Account Access', 'Acesso de administrador nÃ£o funciona'),
    (16, 7, 'Payment', 'Saldo nÃ£o atualizou apÃ³s depÃ³sito');
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
        notNull: true
      - name: age
        type: INTEGER
        notNull: true
      - name: country_code
        type: TEXT
        notNull: true
      - name: username
        type: TEXT
        unique: true
        notNull: true
      - name: password
        type: TEXT
        notNull: true
      - name: is_admin
        type: BOOLEAN
  - name: support_tickets
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: user_id
        type: INTEGER
        notNull: true
      - name: issue_type
        type: TEXT
        notNull: true
      - name: description
        type: TEXT
challenge:
  kind: exact
  instruction: "Escreva uma consulta com INNER JOIN que retorne: o nome do usuÃ¡rio, o username e a contagem de tickets de suporte (renomeada para `support_ticket_count`). Exclua tickets com issue_type 'Account Access'. Retorne apenas usuÃ¡rios com mais de 1 ticket que nÃ£o seja 'Account Access'. Ordene do usuÃ¡rio com mais tickets para o com menos."
  expectedColumns:
    - name
    - username
    - support_ticket_count
  expectedRows:
    - ["Hunter", "Hdev92", 4]
    - ["John", "Jjdev21", 3]
    - ["David", "DavidDev", 2]
  orderSensitive: true
---

## Contexto

O Senai Pay armazena pedidos de suporte ao cliente em uma tabela
`support_tickets`. Um bug recente causou uma enxurrada de tickets do tipo
"Account Access", escondendo outros problemas importantes. Agora que o bug foi
corrigido, o Suporte quer focar nos usuÃ¡rios com **vÃ¡rios** problemas que nÃ£o
sejam "Account Access".

## Sua vez

Escreva uma instruÃ§Ã£o SQL que inclua um `INNER JOIN` e retorne:

- O nome do usuÃ¡rio
- O username do usuÃ¡rio
- A contagem de tickets de suporte atribuÃ­dos Ã quele usuÃ¡rio, rotulada como
  `support_ticket_count`

Com as seguintes restriÃ§Ãµes:

- Exclua qualquer ticket que tenha `issue_type` igual a `'Account Access'`.
- Retorne registros apenas para usuÃ¡rios que tenham **mais de 1** ticket que
  nÃ£o seja "Account Access".
- Ordene os registros para que os usuÃ¡rios com mais tickets de suporte
  apareÃ§am primeiro.