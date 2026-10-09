---
id: subsistemas-09
title: "Consolidando os seis subsistemas"
summary: "Integre a rota inteira, da entrada do serviço às conexões da área de trabalho, em situações de diagnóstico e projeto."
chapter: 15
chapterSlug: subsistemas
lesson: 9
difficulty: avancado
xp: 50
prerequisites: [subsistemas-08]
hints:
  - "Percorra a rota em ordem e pergunte que pontos cada enlace conecta."
  - "Use identificação e resultados do certificador para separar hipótese de evidência."
  - "A escolha do meio e do rating depende da distância, aplicação e espaço da rota."
references:
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
  - label: "Fluke Networks — Cable testing and certification"
    url: "https://www.flukenetworks.com/knowledge-base"
challenge:
  kind: quiz
  instruction: "Responda às questões integradas sobre projeto e diagnóstico da rota completa."
  questions:
    - prompt: "O serviço da operadora chega à entrada, passa pela distribuição principal e precisa alcançar uma sala de telecom em outro pavimento. Qual sequência funcional faz sentido?"
      options:
        - "Área de trabalho → horizontal → entrada → patch cord."
        - "Sala de telecomunicações → keystone → MMR → operadora."
        - "Entrada do edifício → sala de equipamentos/MMR → backbone → sala de telecomunicações."
        - "Backbone → equipamento do usuário → entrada → tomada."
      answer: 2
      explanation: "O serviço entra no edifício, alcança a distribuição principal e segue pelo backbone até a distribuição local."
    - prompt: "O certificador aprova o horizontal entre o patch panel e a tomada, mas o computador continua sem link. Qual próximo passo é mais coerente?"
      options:
        - "Verificar patch cords, portas do switch e do equipamento e a manobra no painel, sem descartar os demais segmentos da rota."
        - "Refazer imediatamente o backbone, pois o horizontal já passou no teste."
        - "Ignorar a tomada, pois todo resultado do certificador cobre o patch cord do usuário."
        - "Trocar o keystone antes de conferir cordões e portas, mesmo com o teste aprovado."
      answer: 0
      explanation: "O teste do horizontal não valida todos os cordões nem a conexão ativa. Verifique as partes fora do enlace testado e siga a rota de forma ordenada."
    - prompt: "Um cabo foi instalado em um shaft entre o MMR e uma sala de telecomunicações. Como você decide se ele é backbone?"
      options:
        - "Pelo fato de o shaft ser vertical, sem precisar saber as terminações."
        - "Pelo fato de o cabo ser necessariamente de pares trançados."
        - "Pela função de interligar pontos de distribuição, não apenas por estar no shaft."
        - "Pela categoria de desempenho impressa na capa do cabo."
      answer: 2
      explanation: "O enlace é backbone pela função de ligar distribuidores; o caminho no shaft é uma característica da rota física, não a definição do subsistema."
    - prompt: "Um percurso passa por um espaço plenum e atende um computador em uma estação de trabalho. Qual escolha de cabo é adequada?"
      options:
        - "Usar cabo comum porque o destino é apenas um computador."
        - "Usar cabo de riser em qualquer plenum, pois ambos atendem a espaços de edifícios."
        - "Escolher cabo listado para os requisitos do espaço plenum e da rota; o computador atendido não reduz essa exigência."
        - "Escolher o rating conforme a velocidade da placa de rede apenas."
      answer: 2
      explanation: "O rating é determinado pelo espaço percorrido e pelas regras aplicáveis, não pelo dispositivo na ponta."
    - prompt: "Uma tomada está sem serviço. O painel e a tomada têm rótulos correspondentes, e o certificador reprova o enlace horizontal por perda excessiva. Onde concentrar primeiro a investigação?"
      options:
        - "No enlace horizontal e suas terminações, percurso e comprimento, corrigindo e retestando antes de aceitar."
        - "Na entrada da operadora, pois qualquer falha final se origina ali."
        - "No equipamento do usuário, mesmo com o teste do enlace reprovado."
        - "No backbone, sem verificar o segmento que falhou na medição."
      answer: 0
      explanation: "O resultado aponta reprovação no horizontal; comece pelo segmento medido e suas terminações. A rota inteira pode ser afetada, mas evidências orientam o diagnóstico."
    - prompt: "Qual combinação de subsistemas atende um edifício de três pavimentos com serviço externo, distribuição central, armários por andar e tomadas para usuários?"
      options:
        - "Somente entrada e área de trabalho, com cabos diretos entre operadora e computadores."
        - "Cabeamento horizontal entre racks e backbone entre cada tomada e computador."
        - "Entrada, backbone e horizontal, com a tomada ligada diretamente ao cabo fixo sem área de trabalho."
        - "Entrada do edifício e sala de equipamentos/MMR, backbone até salas de telecom, horizontal até tomadas e área de trabalho em cada usuário."
      answer: 3
      explanation: "O cenário exige a rota completa: interface externa, distribuição principal, interligação entre distribuidores, distribuição local, trecho horizontal e conexão do usuário."
    - prompt: "Uma sala pequena abriga o rack principal e também distribui cabos para as tomadas próximas. Qual afirmação é correta?"
      options:
        - "A sala deixa de ser sala de equipamentos porque contém um patch panel."
        - "As funções de sala de equipamentos e telecomunicações podem compartilhar ambiente, mantendo distintas as funções de backbone e horizontal."
        - "A presença de um rack transforma todos os cabos em backbone."
        - "O horizontal precisa terminar em outra sala, mesmo quando a tomada fica próxima."
      answer: 1
      explanation: "Ambientes podem ser combinados em edifícios pequenos. A função e os pontos conectados determinam os subsistemas, não o número de salas."
    - prompt: "Um cabo de entrada tem armadura metálica, mas alguém o tratou como fibra totalmente dielétrica e não previu bonding. Qual revisão é necessária?"
      options:
        - "Verificar os elementos metálicos e aplicar o bonding/aterramento previsto no projeto e nas normas."
        - "Ignorar a armadura porque toda fibra é eletricamente não condutora."
        - "Aterrar apenas o patch cord na área de trabalho."
        - "Tratar a armadura como blindagem funcional e dispensar o bonding."
      answer: 0
      explanation: "A fibra pode incluir componentes metálicos. A exigência depende da construção real do cabo e deve ser tratada conforme o projeto de proteção."
---

## Contexto

Você já percorreu os seis subsistemas separadamente. Agora use a rota completa
como um mapa de diagnóstico e projeto:

1. **Entrada do edifício** recebe o serviço externo.
2. **Sala de equipamentos/MMR** concentra a distribuição principal.
3. **Backbone** interliga pontos de distribuição.
4. **Sala de telecomunicações** distribui a rede localmente.
5. **Cabeamento horizontal** liga o distribuidor local à tomada.
6. **Área de trabalho** conecta a tomada ao equipamento do usuário.

Em uma instalação real, salas podem compartilhar espaço e os caminhos podem
ser verticais, horizontais ou mistos. Classifique cada trecho pelo que ele
conecta, e não apenas pelo lugar por onde passa.

## Diagnóstico em sequência

Quando o serviço não chega ao usuário, comece pela evidência disponível:

- Confira a identificação entre patch panel e tomada.
- Verifique o segmento indicado pelo teste de aceitação e suas terminações.
- Confirme manobras, patch cords, portas e equipamentos ativos.
- Se o problema estiver antes da distribuição local, siga para backbone,
  MMR/sala de equipamentos e entrada.

Um teste aprovado em um enlace não certifica automaticamente os demais. Da
mesma forma, uma falha em um subsistema pode interromper os seguintes na rota,
sem provar que cada um deles também esteja defeituoso.

## Projetar a rota inteira

Considere simultaneamente distância, capacidade, meio de transmissão,
transceivers, caminhos físicos e classificação de segurança do cabo. O trecho
que passa por plenum precisa atender aos requisitos desse espaço mesmo que
termine em um único computador. Planeje a sala e os racks para operação,
identificação e manutenção; especifique testes de aceitação para comprovar o
resultado.

## Sua vez

As perguntas combinam dois ou mais subsistemas. Em cada cenário, escolha a
função correta do enlace, identifique que evidência falta e selecione a
combinação de infraestrutura que atende ao uso descrito.
