---
id: subsistemas-08
title: "Rotulagem, pathways e teste de aceitação"
summary: "Planeje caminhos, separe energia e dados, identifique as pontas e valide a instalação com certificador."
chapter: 15
chapterSlug: subsistemas
lesson: 8
difficulty: avancado
xp: 40
prerequisites: [subsistemas-07]
hints:
  - "Pathways organizam e protegem a rota física."
  - "Um teste reprovado pede localizar e corrigir a falha, não apenas repetir a medição."
references:
  - label: "Fluke Networks — Cable testing and certification"
    url: "https://www.flukenetworks.com/knowledge-base"
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
images:
  - alt: "Cena de identificação e teste de rede. À esquerda, o painel patch com um marcador amarelo em uma das portas e as demais faixas de etiqueta em branco. No centro, a tomada de parede com uma pequena etiqueta, ligada ao marcador do painel por um filete fino e contínuo. À direita, o certificador de cabo portátil com um tique verde no visor e um conector RJ45 ainda solto no fim do cabo."
    src: "subsistemas_rotulagem_certificador.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas sobre rotas, identificação e aceitação."
  questions:
    - prompt: "Qual opção contém exemplos de pathways para cabeamento?"
      options:
        - "Patch cord, keystone e switch."
        - "Bandeja, eletroduto e calha."
        - "Eletrocalha, patch panel e tomada de usuário."
        - "Transceiver, servidor e firewall."
      answer: 1
      explanation: "Bandejas, eletrodutos e calhas são caminhos físicos que organizam e protegem a instalação."
    - prompt: "Por que separar cabos de rede de cabos de força conforme o projeto e as normas?"
      options:
        - "Para reduzir acoplamento e interferência eletromagnética e manter segurança e desempenho."
        - "Para fazer os cabos de rede funcionarem como aterramento."
        - "Para permitir que os dois tipos compartilhem o mesmo eletroduto sem restrições."
        - "Para aumentar o comprimento permitido do canal."
      answer: 0
      explanation: "A proximidade inadequada de circuitos de força pode introduzir EMI; separação e cruzamentos apropriados reduzem riscos e seguem os requisitos de instalação."
    - prompt: "Onde devem estar as identificações de um enlace horizontal?"
      options:
        - "Apenas na porta do switch, sem identificar a tomada."
        - "Nas duas pontas, incluindo a terminação no patch panel e a tomada correspondente."
        - "No patch panel e no cabo junto à sala, sem identificar a tomada."
        - "Somente no equipamento do usuário."
      answer: 1
      explanation: "Identificar ambas as pontas permite relacionar painel e tomada e reduz erros de manobra e diagnóstico."
    - prompt: "O que faz um certificador de cabeamento durante o teste de aceitação?"
      options:
        - "Apenas confirma que há luz no equipamento ativo."
        - "Configura endereços IP automaticamente."
        - "Certifica o enlace a partir de um ping entre os equipamentos."
        - "Mede parâmetros do enlace e compara os resultados com limites de desempenho definidos."
      answer: 3
      explanation: "O certificador mede parâmetros do cabeamento e registra se o enlace atende aos limites especificados; uma luz de link não é certificação."
    - prompt: "O certificador informa um resultado de perda ou atenuação fora do limite. Qual é a conclusão adequada?"
      options:
        - "O enlace não atende ao critério medido; investigue terminação, dano, comprimento e instalação antes de aceitar."
        - "O canal está aprovado porque o switch ainda acende."
        - "A reprovação indica sempre defeito na porta do switch, não no enlace passivo."
        - "A perda pode ser ignorada se o cabo estiver identificado."
      answer: 0
      explanation: "Uma medição fora do limite reprova o critério correspondente. É necessário localizar a causa e corrigir antes de registrar aceitação."
    - prompt: "Se um teste reprova um enlace da rota até o usuário, como isso afeta os subsistemas seguintes?"
      options:
        - "Os subsistemas seguintes continuam garantidamente funcionais para aquele usuário."
        - "A falha pode interromper o serviço no destino; é preciso localizar o segmento reprovado e verificar a rota a partir dele."
        - "Um teste do horizontal valida automaticamente entrada e backbone."
        - "A falha sempre está no equipamento conectado à tomada."
      answer: 1
      explanation: "Os segmentos formam uma rota: uma falha em um ponto pode impedir a conectividade no destino, mas o diagnóstico deve apontar qual enlace ou componente falhou."
---

## Contexto

**Pathways** são os caminhos físicos pelos quais os cabos passam. Bandejas,
eletrodutos e calhas organizam, sustentam e protegem a rota. O projeto deve
prever ocupação, acesso, suportação, curvas e requisitos do espaço, sem
comprimir ou danificar os cabos.

## Separação e identificação

Cabos de rede e de força devem ser separados de acordo com as normas e o
projeto. A proximidade indevida pode aumentar o acoplamento eletromagnético
(EMI), além de criar riscos de instalação. Quando cruzamentos forem
necessários, siga as distâncias e práticas especificadas para a situação.

Identifique as duas pontas de cada enlace: a porta correspondente no
**patch panel** e a **tomada** da área de trabalho. Use uma convenção consistente
e mantenha registros atualizados. Etiqueta apenas em uma ponta não resolve a
ambiguidade durante uma mudança ou diagnóstico.

## Teste de aceitação

Um certificador mede parâmetros do enlace e compara os resultados com os
limites do padrão e da configuração selecionada. O relatório pode indicar
perda/atenuação, comprimento e outras medidas relevantes. Uma luz de link ou
um ping não substitui a certificação do cabeamento instalado.

Se houver reprovação, investigue terminações, comprimento, curvatura, dano e
conexões. Corrija a causa e faça o teste novamente antes de aceitar o trecho.
Como os subsistemas compõem uma rota, a falha de um ponto pode derrubar a
conectividade nos seguintes até o usuário; isso não significa que todos os
segmentos estejam defeituosos, por isso localize a falha com medições.

## Sua vez

Nas perguntas, relacione o caminho físico, a documentação e a evidência de
aceitação. Um enlace só deve ser considerado aprovado quando os critérios de
teste forem atendidos.
