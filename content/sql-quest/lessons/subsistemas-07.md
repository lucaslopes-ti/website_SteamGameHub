---
id: subsistemas-07
title: "Meios e rotas: plenum, closed riser e CPR"
summary: "Associe a classificação do cabo ao espaço por onde ele passa e evite misturas inadequadas."
chapter: 15
chapterSlug: subsistemas
lesson: 7
difficulty: avancado
xp: 40
prerequisites: [subsistemas-06]
hints:
  - "A classificação acompanha a rota e as exigências do espaço, não o dispositivo na ponta."
  - "Plenum é espaço de manejo de ar; closed riser é um caminho vertical fechado."
references:
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
  - label: "ISO/IEC 11801 — Cabeamento genérico"
    url: "https://www.iso.org/standard/66182.html"
images:
  - alt: "Comparação em corte de dois espaços de instalação de cabo. À esquerda, o plenum: forro falso com duto de ventilação e grelha de ar, um feixe de cabo azul e um cabo comum de capa amarela sob um símbolo de proibição. À direita, o shaft de riser atravessando duas lajes, com cabos sobre esteira e colar de vedação corta-fogo em cada laje, e um cabo verde. O código de cores é azul no plenum, verde no riser e amarelo no cabo não permitido."
    src: "subsistemas_plenum_riser.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas sobre classificação de cabos e espaços."
  questions:
    - prompt: "O que deve orientar a escolha do rating de um cabo?"
      options:
        - "O tipo de computador conectado na ponta, independentemente da rota."
        - "O espaço e as condições de instalação por onde a rota passa."
        - "A classificação usada no trecho anterior, mesmo quando o espaço muda."
        - "A velocidade contratada, sem considerar os requisitos do edifício."
      answer: 1
      explanation: "A classificação necessária depende da rota e das regras para o espaço, como plenum ou riser, e não somente do equipamento atendido."
    - prompt: "Qual par associa corretamente classificações comuns na América do Norte?"
      options:
        - "CMP: cabo de usuário; CMR: patch cord."
        - "CMP: plenum; CMR: riser."
        - "CMP: uso geral; CMR: destinado a espaços plenum."
        - "CMP: uso externo somente; CMR: uso em qualquer espaço sem restrições."
      answer: 1
      explanation: "CMP é classificado para espaços plenum e CMR para aplicações riser, conforme requisitos e código aplicáveis."
    - prompt: "O que expressa, em termos gerais, a classificação CM?"
      options:
        - "Permissão automática para instalar cabo em qualquer plenum."
        - "Uma categoria de desempenho equivalente à classificação do enlace."
        - "Uma classificação de cabo de comunicação de uso geral, que não substitui a classificação exigida para espaços especiais."
        - "Uma classificação de cabo para qualquer riser sem verificar o código local."
      answer: 2
      explanation: "CM é uma classificação de uso geral; espaços com requisitos específicos podem demandar outro tipo, como CMP ou CMR."
    - prompt: "Qual cuidado se aplica a CMX e a cabos de comunicação de uso limitado?"
      options:
        - "Considerar CMX sempre equivalente a CMP."
        - "Usar CMX apenas em instalações internas, independentemente do espaço."
        - "Não presumir que são apropriados a espaços plenum ou riser sem confirmar a classificação e a regra local."
        - "Escolher CMX para substituir qualquer cabo em rota vertical."
      answer: 2
      explanation: "CMX e outras classificações de uso limitado têm aplicações próprias; não são equivalentes automaticamente a classificações plenum ou riser."
    - prompt: "Em nomenclaturas de cabeamento, o que indicam CM-CR, CPR-R e MP?"
      options:
        - "Uma classificação universal de desempenho para cobre, fibra e Ethernet."
        - "Categorias de patch cords que podem ser usadas em qualquer espaço."
        - "Tipos de conector para a tomada do usuário."
        - "Designações cujo significado e adequação devem ser verificados na norma, certificação e código aplicáveis."
      answer: 3
      explanation: "As designações variam conforme sistema e jurisdição. Confirme o listing/certificação e os requisitos locais; não infira equivalência apenas pelas letras."
    - prompt: "Uma rota atravessa um espaço plenum e depois segue por um closed riser. Qual é a conduta correta?"
      options:
        - "Usar cabo comum no plenum se ele estiver dentro de uma manga qualquer."
        - "Escolher o rating pelo equipamento conectado e ignorar o caminho."
        - "Usar sempre CMX, pois a rota muda de espaço."
        - "Especificar cabos aprovados para cada espaço e não misturar cabo não plenum no trecho plenum, mesmo cobrindo-o com material não aprovado."
      answer: 3
      explanation: "O cabo precisa atender aos requisitos de cada trecho. Uma cobertura improvisada não transforma um cabo comum em cabo listado para plenum."
---

## Contexto

A classificação contra propagação de chama e fumaça é definida pelo uso
permitido e pelas regras aplicáveis ao edifício. A escolha considera **onde o
cabo passa**: duto de ar, forro, shaft, espaço fechado, crawl space ou outra
rota. O equipamento atendido não muda os requisitos do caminho.

## Exemplos de classificações

Em nomenclaturas norte-americanas, **CMP** é associado a espaço plenum e
**CMR** a aplicações riser. **CM** é uma classificação de uso geral, e **CMX**
tem aplicação mais limitada. Termos como **CM-CR**, **CPR-R** e **MP** também
podem aparecer em projetos, fichas e códigos. Não presuma equivalência entre
essas designações: confirme o listing do produto e os requisitos da jurisdição.

Um espaço **plenum** é usado para manejo de ar. Um **closed riser** é um
caminho vertical fechado entre pavimentos, mas a forma do espaço, a presença
de barreiras e o código local influenciam a classificação exigida. Até um
crawl space ou forro pode ter requisitos específicos dependendo de sua função.

## Não improvise a classificação

Se a rota atravessa espaços com requisitos diferentes, especifique um cabo
adequado a cada trecho ou um cabo que atenda a todos eles. **Nunca use cabo
comum em espaço plenum** apenas porque foi envolvido por uma capa ou material
que não seja aprovado para esse uso. Uma cobertura improvisada não altera a
certificação do cabo.

## Sua vez

Analise a rota antes de selecionar o cabo. As perguntas avaliam a diferença
entre o uso do espaço e o equipamento conectado na ponta.
