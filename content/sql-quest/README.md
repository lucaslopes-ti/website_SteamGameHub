# SQL Quest — Base de Conteúdo (Markdown versionado)

Este diretório é a **fonte de conteúdo** da SQL Quest em Markdown. O runtime usa
esta base: `lib/sql-quest/catalog.ts` consome o catálogo gerado
(`data/sql-quest/generated.ts`), produzido a partir de
`content/sql-quest/lessons/*.md` e `chapters.md` em tempo de build.

## Estado atual

O currículo completo foi convertido de `docs/sql_bootdev.md` para esta base,
em Português do Brasil, ambientado no **Senai Pay** (aplicativo de pagamentos
fictício) e no **Senai Pay Comunidade** (recurso de rede social). São
**120 unidades** organizadas em **15 capítulos**:

| Capítulo | Slug | Unidades |
|---|---|---|
| 1 — Consultas com SELECT | `select` | 7 |
| 2 — Criando e alterando tabelas | `tabelas` | 10 |
| 3 — Restrições e integridade dos dados | `restricoes` | 8 |
| 4 — CRUD: inserir, atualizar e excluir registros | `crud` | 13 |
| 5 — Filtros, operadores e curingas | `filtros` | 11 |
| 6 — Ordenação e limites de resultados | `ordenacao` | 6 |
| 7 — Funções de agregação | `agregacao` | 9 |
| 8 — Subqueries | `subqueries` | 5 |
| 9 — Normalização e modelagem de dados | `normalizacao` | 11 |
| 10 — Juntando tabelas com JOIN | `joins` | 10 |
| 11 — Performance e índices | `performance` | 5 |
| 12 — Fundamentos de redes | `redes` | 6 |
| 13 — Infraestrutura e cabeamento estruturado | `cabeamento` | 9 |
| 14 — Cisco Packet Tracer: primeiros passos | `packet-tracer` | 1 |
| 15 — Os seis subsistemas do cabeamento estruturado | `subsistemas` | 9 |

As imagens ficam em `images/` e são referenciadas no front matter das unidades
(a UI resolve o `src` relativo para `/uploads/images/<src>`):

| Arquivo | Unidade | Tema |
|---|---|---|
| `sql_logos.png` | `select-01` | Logos de bancos de dados SQL |
| `cardinalidade.png` | `normalizacao-01` | Relacionamentos e cardinalidade (1:1, 1:N, N:N) |
| `normalizacao1fn2fn3fn.png` | `normalizacao-05` | Comparação das formas normais (1NF, 2NF, 3NF) |
| `redes_conceito_geral.jpg` | `redes-01` | Conceito geral de rede |
| `redes_cliente_servidor.jpg` | `redes-02` | Relação cliente e servidor |
| `redes_p2p_vs_servidor.jpg` | `redes-03` | Rede ponto a ponto x rede com servidor |
| `redes_dispositivos.jpg` | `redes-04` | Dispositivos de rede |
| `redes_meios_transmissao.jpg` | `redes-05` | Meios de transmissão |
| `redes_topologias.jpg` | `redes-06` | Topologias físicas e lógicas |
| `redes_escopos_lan_wan.jpg` | `redes-06` | Escopos de rede (LAN, WAN, SOHO, intranet, extranet) |
| `cabeamento_par_trancado.jpg` | `cabeamento-03` | Par trançado e blindagem |
| `cabeamento_pinagem_t568.jpg` | `cabeamento-04` | Conectores 8P8C e pinagem T568A/T568B |
| `cabeamento_fibra_optica.jpg` | `cabeamento-05` | Fibra óptica monomodo x multimodo |
| `cabeamento_seis_subsistemas.jpg` | `cabeamento-08`, `subsistemas-01` | Os seis subsistemas em corte de edifício |
| `subsistemas_entrada_sala_equipamentos.jpg` | `subsistemas-02` | Entrada da operadora e sala de equipamentos |
| `subsistemas_backbone_mmr_shaft.jpg` | `subsistemas-03` | Cabeamento vertical ligando MMR e sala de telecom |
| `subsistemas_rack_patch_panel.jpg` | `subsistemas-04` | Rack com patch panel, switches e patch cords |
| `subsistemas_horizontal_90m.jpg` | `subsistemas-05` | Trecho horizontal do rack até a tomada e a cota de distância |
| `subsistemas_area_trabalho.jpg` | `subsistemas-06` | Tomada, patch cord de manobra e equipamento do usuário |
| `subsistemas_plenum_riser.jpg` | `subsistemas-07` | Comparação plenum x riser e o cabo não permitido |
| `subsistemas_rotulagem_certificador.jpg` | `subsistemas-08` | Identificação nas duas pontas e teste com certificador |

Prompts prontos para gerar as imagens do capítulo 15 no Gemini estão em
`images/SUBSISTEMAS_PENDING.md`; o manifesto `images/PENDING.md` mantém as
sugestões de imagens futuras dos demais capítulos.

## Estrutura

```
content/sql-quest/
├── chapters.md        # Metadados dos capítulos (fonte de verdade)
├── lessons/           # ← 95 arquivos .md de unidade
├── images/            # ← imagens locais referenciadas no front matter
└── fixtures/          # Exemplos válidos e inválidos (usados nos testes)
```

## Natureza das unidades

| Natureza | Como representar |
|---|---|
| **Prática** | `challenge.kind: exact` ou `schema` (executa SQL) |
| **Quiz** | `challenge.kind: quiz` (perguntas de múltipla escolha) |
| **Theory** | sem `challenge` (apenas narrativa) |

## Como fornecer suas unidades

1. Crie um arquivo `.md` por unidade em `lessons/`.
2. Use o front matter (entre `---` ... `---`) para os metadados estruturados
   (id semântico, capítulo, XP, pré-requisitos, dicas, referências SQL,
   `setupSql`, schema inicial, `images` e `challenge`).
3. Coloque as imagens em `images/` e referencie-as com `src` relativo e `alt`.
4. Escreva a narrativa no corpo Markdown (com ao menos um título `##`).
5. Valide com:

```bash
npm run validate:sql-quest-content
```

O contrato completo (campos, tipos, exemplos e regras) está em
[`docs/SQL_QUEST_CONTENT.md`](../../docs/SQL_QUEST_CONTENT.md). Exemplos
prontos estão em `fixtures/valid/lessons/`.
