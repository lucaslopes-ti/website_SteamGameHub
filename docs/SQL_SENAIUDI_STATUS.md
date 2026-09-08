# 🗄️ SQL SenaiUdi — Status do MVP

> Documento de status do módulo de prática de SQL do **SENAI Games Hub**.
> **Rota técnica:** `/sql-quest` (mantida — o nome de produto é `SQL SenaiUdi`).

---

## 🎯 Propósito

Módulo interativo e gamificado para o aluno aprender SQL na prática, direto no
navegador: cada lição apresenta um cenário com tabelas pré-populadas, um objetivo
claro e um editor SQL integrado com execução e validação em tempo real.

---

## ✅ O que está entregue hoje

- **12 lições originais** distribuídas nos **capítulos 1–3**:
  - Cap. 1 — Consultas com `SELECT` (4 lições)
  - Cap. 2 — Criando e alterando tabelas (4 lições)
  - Cap. 3 — Restrições e integridade dos dados (4 lições)
- **Editor Monaco** com syntax highlighting e autocomplete de SQL, com **fallback
  real para textarea** caso o carregamento do Monaco falhe (ex.: rede/CSP que
  bloqueie a CDN) — o editor continua funcional.
- **Execução local via sql.js (SQLite em WebAssembly)** — 100% client-side, sem
  custo de servidor e sem enviar queries do aluno para o backend.
- **Validação automática** em dois modos: `exact` (comparação de colunas/linhas)
  e `schema` (estrutura do banco, tipos, `NOT NULL`, `UNIQUE`, `PRIMARY KEY`,
  `FOREIGN KEY`), com mensagens de feedback em PT-BR.
- **Progresso local + sincronização autenticada**:
  - Progresso salvo em `localStorage` (funciona offline / sem login).
  - O progresso é **separado por conta**: visitante anônimo usa uma chave fixa;
    usuário autenticado usa uma chave por UID. Não há contaminação entre contas
    e o progresso anônimo **não** é migrado automaticamente ao fazer login.
  - Quando autenticado, sincroniza com o Firestore via API (sincronização
    opcional — a prática sem login continua funcionando).
  - O `PUT` usa o payload explícito `{ completedLessonIds: string[] }` (a lista
    completa de ids que o cliente acredita ter concluído) e devolve o estado
    **normalizado** do servidor.
  - O total de XP é sempre **derivado dos ids de lição do catálogo** (nunca de
    um valor armazenado/enviado), e a resposta autoritativa do `PUT` é aplicada
    ao estado e ao `localStorage`.
- **API segura** (`app/api/sql-quest/progress`):
  - `GET`/`PUT` exigem Bearer token (Firebase ID token).
  - `userId` sempre derivado do token — nunca aceito no corpo.
  - Se `FIREBASE_SERVICE_ACCOUNT_KEY` não estiver configurada, responde `503`
    (`FIREBASE_NOT_CONFIGURED`) **antes mesmo** de tentar autenticar.
  - O `PUT` aceita **apenas** o payload explícito
    `{ completedLessonIds: string[] }` (a lista completa de ids concluídos).
  - XP calculado exclusivamente no servidor a partir do catálogo (não confia no
    cliente); conclusão repetida é idempotente.
  - As conclusões são validadas como **progressão linear estrita**: não aceita
    remoção de conclusões existentes, não aceita saltos nem lições fora da
    próxima disponível e permite **no máximo UMA nova lição por requisição** —
    sempre a próxima na ordem do catálogo (o conjunto final precisa ser um
    prefixo contíguo da trilha em ordem). O XP é derivado apenas do conjunto
    final validado.
- **Regras do Firestore** para `sql_quest_progress` com acesso exclusivo via API
  Admin (server-side).

---

## 🚀 Como executar / verificar

```bash
npm install              # instala dependências (inclui sql.js e @monaco-editor/react)
npm run dev              # sobe o app em modo desenvolvimento
npm test                 # roda os testes Jest (catálogo + validador + progresso)
npm run lint             # lint do Next.js
npm run build            # build de produção (valida tipos/rotas)
npm run test:firebase    # verifica a conexão com Firebase (requer .env.local)
```

Verificação manual: acessar `/sql-quest`, navegar por capítulos/lições, executar
uma query e confirmar validação + progresso.

Verificação da API (com o app rodando em `http://localhost:3000`):

```bash
# Sem FIREBASE_SERVICE_ACCOUNT_KEY configurada → deve responder 503
# com { error, code: "FIREBASE_NOT_CONFIGURED" }:
curl -i http://localhost:3000/api/sql-quest/progress

# Com Firebase configurado, sem token → deve responder 401:
curl -i http://localhost:3000/api/sql-quest/progress

# Com Firebase configurado e token válido, concluir a 1ª lição:
curl -i -X PUT http://localhost:3000/api/sql-quest/progress \
  -H "Authorization: Bearer <ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"completedLessonIds":["1-1"]}'

# Tentar concluir 2 lições de uma vez → deve responder 400:
curl -i -X PUT http://localhost:3000/api/sql-quest/progress \
  -H "Authorization: Bearer <ID_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"completedLessonIds":["1-1","1-2"]}'
```

---

## 🔥 Pré-requisitos / limitações do Firebase

- A sincronização de progresso exige **Firebase configurado** com a variável de
  ambiente `FIREBASE_SERVICE_ACCOUNT_KEY`.
- Sem essa variável, a API responde `503` com mensagem clara
  (`FIREBASE_NOT_CONFIGURED`) e o progresso continua funcionando apenas em
  `localStorage`.
- A autenticação usa os mesmos usuários já cadastrados no projeto (Firebase Auth).
- O Firestore é usado **somente** para armazenar progresso — nunca executa SQL.

---

## ⚠️ Limitações de integridade (modelo client-side)

O SQL é executado **no navegador** (sql.js / SQLite em WebAssembly), 100%
client-side. Isso traz custo zero de servidor e privacidade (as queries do aluno
não saem do dispositivo), mas tem consequências de integridade que precisam ser
honestas:

- **O servidor não consegue provar que a query foi digitada.** A validação
  server-side impõe **ordem** (progressão linear estrita: sem saltos, sem
  remoções e no máximo uma nova lição por requisição — sempre a próxima da
  trilha) e reduz a adulteração de XP, mas um usuário técnico ainda pode marcar
  uma lição como concluída sem realmente resolvê-la (ex.: chamando a API
  diretamente com um `{ "completedLessonIds": [...] }` válido). Não há como
  verificar no servidor o conteúdo do editor, porque a execução do SQL é
  **local** (sql.js/WASM no navegador) — o servidor nunca recebe a query
  digitada.
- **O XP é um indicador de progresso, não uma prova de proficiência.** Para
  fins de certificação/avaliação formal, seria necessário executar e validar o
  SQL no servidor (fora do escopo atual).
- **A validação de conteúdo (exact/schema) é client-side** e pode ser contornada
  por quem inspecionar o código do navegador.

---

## 📋 Itens que ainda faltam (por prioridade)

### Alta
- [ ] Conteúdo dos capítulos 4+ (CRUD, consultas avançadas, JOINs, etc.).
- [ ] Revisão/expansão do conteúdo das 12 lições atuais, se necessário.

### Média
- [ ] Gamificação: XP por lição, streaks, conquistas/badges e leaderboard.
- [ ] Sistema de dicas progressivas mais robusto.
- [ ] Visualização de schema (diagrama ER).

### Baixa
- [ ] Sandbox livre (criar tabelas, importar CSV).
- [ ] Assistente IA (mentor socrático).
- [ ] Salvar e compartilhar queries.
- [ ] Suporte a mais dialetos SQL (PostgreSQL, MySQL).
- [ ] Internacionalização (PT-BR / EN).

---

## 📝 Nota sobre o conteúdo

O conteúdo das lições foi **escrito originalmente** a partir de tópicos de
referência (temas e conceitos de SQL), **não é cópia** de material externo. Todo
o texto é autoral, ambientado na plataforma fictícia "NexoPay".

---

> **Status:** MVP entregue (12 lições, capítulos 1–3)
> **Projeto:** SENAI Games Hub (website_SteamGameHub)
> **Rota:** `/sql-quest`
> **Licença:** MIT