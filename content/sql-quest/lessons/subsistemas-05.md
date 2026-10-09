---
id: subsistemas-05
title: "Cabeamento horizontal: limites e keystone"
summary: "Acompanhe o cabo fixo entre o armário e a tomada e aplique limites de comprimento e instalação."
chapter: 15
chapterSlug: subsistemas
lesson: 5
difficulty: intermediario
xp: 35
prerequisites: [subsistemas-04]
hints:
  - "O horizontal fixo termina na tomada; patch cords também contam para o canal total."
  - "Não dobre nem puxe o cabo além dos limites definidos pelo fabricante."
references:
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
  - label: "Fluke Networks — Cable testing and certification"
    url: "https://www.flukenetworks.com/knowledge-base"
challenge:
  kind: quiz
  instruction: "Responda às perguntas sobre o trecho horizontal e seus limites."
  questions:
    - prompt: "Qual trecho corresponde ao cabeamento horizontal fixo?"
      options:
        - "Da entrada da operadora até a sala de equipamentos."
        - "Da tomada até o notebook, incluindo o patch cord do usuário."
        - "Do armário ou sala de telecomunicações até a tomada de rede."
        - "Entre distribuidores de salas de telecomunicações diferentes."
      answer: 2
      explanation: "O horizontal fixo vai do distribuidor local à tomada; os cordões de equipamento são partes separadas do canal."
    - prompt: "Onde normalmente termina o cabo horizontal no espaço do usuário?"
      options:
        - "Em um módulo keystone instalado na tomada de rede."
        - "Em uma porta de switch embutida na parede."
        - "Em um patch panel instalado junto ao computador."
        - "Diretamente na placa de rede do computador."
      answer: 0
      explanation: "O cabo fixo termina em um jack, frequentemente um keystone, montado na tomada de rede."
    - prompt: "Qual valor é o limite de referência para o comprimento do cabo horizontal permanente?"
      options:
        - "100 m, sem incluir cordões."
        - "100 m incluindo cordões, como limite do canal."
        - "90 m para cada lado do distribuidor."
        - "90 m."
      answer: 3
      explanation: "O limite usual do enlace horizontal permanente é 90 m; o canal completo tem limite de referência de 100 m, sujeito às condições da norma."
    - prompt: "Como se entende o limite de referência de 100 m para o canal?"
      options:
        - "Como 100 m de cabo fixo, mais patch cords sem limite."
        - "Como 90 m de cabo fixo e necessariamente 10 m de folga armazenada."
        - "Como o conjunto do enlace fixo e cordões, considerando as condições de projeto e folgas."
        - "Como o comprimento do cabo fixo, sem contar os cordões nas extremidades."
      answer: 2
      explanation: "O canal inclui o enlace permanente e cordões; o comprimento disponível para cordões depende das condições aplicáveis. Slack é reserva de cabo, não uma parcela automaticamente somada além do limite."
    - prompt: "Por que o comprimento do canal é limitado?"
      options:
        - "Para controlar efeitos de transmissão, como atenuação, retardo e perda de desempenho."
        - "Para garantir que o canal tenha a mesma perda em qualquer categoria."
        - "Para limitar apenas o comprimento dos patch cords."
        - "Para manter cada tomada no mesmo pavimento que o rack."
      answer: 0
      explanation: "O canal precisa manter desempenho elétrico dentro dos parâmetros; comprimento excessivo pode elevar atenuação e retardo e comprometer a transmissão."
    - prompt: "Qual procedimento protege o cabo durante a instalação?"
      options:
        - "Puxar com força extra e dobrar em ângulo fechado para economizar espaço."
        - "Respeitar a tensão de tração e o raio de curvatura mínimo especificados pelo fabricante."
        - "Respeitar o raio mínimo, mas exceder a tração se a capa não romper."
        - "Considerar os limites de tração apenas em cabos de fibra óptica."
      answer: 1
      explanation: "Tração excessiva ou curvatura apertada pode deformar os pares e alterar o desempenho mesmo sem dano externo evidente."
---

## Contexto

O **cabeamento horizontal** é o trecho permanente entre a sala de
telecomunicações e a tomada de rede da área de trabalho. Na parede, o cabo
termina em um conector modular, frequentemente um **keystone**, instalado em
uma placa ou caixa. O cordão que liga a tomada ao equipamento do usuário não
faz parte desse trecho fixo.

## Comprimentos do enlace e do canal

Como referência usual, o enlace horizontal permanente pode ter até **90 m**.
O **canal** completo tem limite de referência de **100 m** e inclui também os
patch cords e conexões previstos. Não interprete isso como 90 m mais uma
quantidade ilimitada de cordões, nem como autorização para ultrapassar o limite
por haver uma reserva de cabo (slack). O comprimento dos cordões deve caber no
canal e respeitar as condições da norma e do projeto.

Esses limites ajudam a manter o desempenho. Conforme a distância aumenta,
atenuação, retardo e perdas podem comprometer a qualidade do sinal. Se o
percurso real for longo, revise a arquitetura em vez de esconder cabo excedente
ou acrescentar emendas improvisadas.

## Instalação sem dano

Durante o lançamento, respeite a tensão de tração máxima e o **raio de
curvatura mínimo** definidos para o cabo. Curvas muito fechadas, esmagamento,
amarração apertada ou força excessiva podem deformar os pares e prejudicar o
desempenho. A capa parecer intacta não prova que o cabo foi instalado
corretamente.

## Sua vez

Nas perguntas, diferencie o enlace permanente do canal completo e identifique
os cuidados que preservam o desempenho do cabo.
