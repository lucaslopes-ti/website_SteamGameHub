---
version: 1.0.0
chapters:
  - number: 1
    slug: select
    title: "Consultas com SELECT"
    description: "Dê os primeiros passos lendo dados do Senai Pay: aprenda a buscar todas as colunas de uma tabela, escolher colunas específicas, entender o que é SQL e como o SQLite armazena os dados."
  - number: 2
    slug: tabelas
    title: "Criando e alterando tabelas"
    description: "Nem tudo que o Senai Pay precisa armazenar já existe no banco. Neste capítulo você cria tabelas do zero, escolhe os tipos certos para cada dado, ajusta a estrutura com ALTER TABLE e aprende o básico de migrações."
  - number: 3
    slug: restricoes
    title: "Restrições e integridade dos dados"
    description: "Um banco de pagamentos não pode aceitar dados quebrados. Aprenda a aplicar regras com NOT NULL, UNIQUE, PRIMARY KEY e FOREIGN KEY para garantir que as informações do Senai Pay sejam sempre confiáveis."
  - number: 4
    slug: crud
    title: "CRUD: inserir, atualizar e excluir registros"
    description: "Ler dados é só o começo. Neste capítulo você aprende as quatro operações básicas de um banco — criar, ler, atualizar e excluir — com INSERT, UPDATE, DELETE e consultas com COUNT, WHERE e DISTINCT."
  - number: 5
    slug: filtros
    title: "Filtros, operadores e curingas"
    description: "Deixe as consultas do Senai Pay mais precisas: crie colunas calculadas com aliases e funções, filtre com BETWEEN, DISTINCT, AND, OR e IN, e busque padrões de texto com LIKE e os curingas % e _."
  - number: 6
    slug: ordenacao
    title: "Ordenação e limites de resultados"
    description: "Nem toda consulta precisa devolver tudo. Neste capítulo você aprende a limitar o número de registros com LIMIT, classificar os resultados com ORDER BY em ordem crescente ou decrescente e combinar as duas cláusulas nas práticas do Senai Pay."
  - number: 7
    slug: agregacao
    title: "Funções de agregação"
    description: "Dados crus são ótimos, mas relatórios precisam de resumos. Neste capítulo você aprende a calcular totais, médias, mínimos e máximos com COUNT, SUM, MAX, MIN, AVG, GROUP BY, HAVING e ROUND para responder às perguntas do time de negócios do Senai Pay."
  - number: 8
    slug: subqueries
    title: "Subqueries"
    description: "Algumas perguntas exigem mais de uma consulta. Aprenda a aninhar consultas com subqueries, usando IN e = para filtrar com dados de outra tabela e até para calcular valores sem consultar nenhuma tabela."
  - number: 9
    slug: normalizacao
    title: "Normalização e modelagem de dados"
    description: "Um bom banco evita dados duplicados e inconsistentes. Neste capítulo você modela relacionamentos 1:1, 1:N e N:N com chaves estrangeiras, entende a normalização e aplica as formas normais 1NF, 2NF, 3NF e BCNF às tabelas do Senai Pay."
  - number: 10
    slug: joins
    title: "Juntando tabelas com JOIN"
    description: "Os dados do Senai Pay estão espalhados em várias tabelas. Aprenda a combiná-los com INNER JOIN, LEFT JOIN, RIGHT JOIN e FULL JOIN para montar relatórios completos sobre usuários, países e transações."
  - number: 11
    slug: performance
    title: "Performance e índices"
    description: "Consultas rápidas fazem diferença em escala. Aprenda a criar índices com CREATE INDEX, entender quando eles aceleram (e quando pesam), usar índices de múltiplas colunas e saber quando desnormalizar em nome da velocidade."
  - number: 12
    slug: redes
    title: "Fundamentos de redes"
    description: "Como as redes funcionam: o que é uma rede, quem é cliente e quem é servidor, redes ponto a ponto, os meios físicos (par trançado, fibra e Wi-Fi), topologias físicas e lógicas e os tipos de rede por escopo — LAN, WAN, SOHO, intranet e extranet."
  - number: 13
    slug: cabeamento
    title: "Infraestrutura e cabeamento estruturado"
    description: "A viagem do sinal: dispositivos de interconexão, cabeamento estruturado, par trançado e suas categorias, conectores e pinagem T568, fibra óptica, redes sem fio, normas TIA/EIA e os seis subsistemas que levam o sinal da operadora até a tomada do usuário."
  - number: 14
    slug: packet-tracer
    title: "Cisco Packet Tracer: primeiros passos"
    description: "Sua primeira aula no Cisco Packet Tracer: conheça o simulador, adicione computadores e cabos, configure endereços IPv4 e máscaras de sub-rede e teste a comunicação entre dois PCs com o comando ping."
  - number: 15
    slug: subsistemas
    title: "Os seis subsistemas do cabeamento estruturado"
    description: "Aprofundamento dos seis subsistemas da ANSI/TIA-568: entrada do edifício, sala de equipamentos, cabeamento vertical com MMR e shaft, sala de telecomunicações, cabeamento horizontal com seus limites de distância e a área de trabalho — incluindo meios e rotas (plenum, closed riser, CPR), rotulagem, pathways e teste de aceitação."
---

# Capítulos da SQL Quest

Este arquivo define apenas os **metadados dos capítulos** (número, slug,
título e descrição). As lições ficam em `lessons/*.md`, uma por arquivo.

> **Importante:** este arquivo é a fonte de verdade para `chapter` e
> `chapterSlug` usados no front matter das lições. Consulte
> `docs/SQL_QUEST_CONTENT.md` para o contrato completo.
