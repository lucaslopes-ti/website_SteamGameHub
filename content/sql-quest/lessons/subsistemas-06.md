---
id: subsistemas-06
title: "Área de trabalho: tomada, patch cord e equipamento"
summary: "Siga a conexão a partir da tomada até o equipamento e separe o espaço do usuário do limite horizontal."
chapter: 15
chapterSlug: subsistemas
lesson: 6
difficulty: intermediario
xp: 35
prerequisites: [subsistemas-05]
hints:
  - "A área de trabalho começa na tomada, não no rack."
  - "O cordão do usuário não pertence aos 90 m do enlace horizontal fixo."
references:
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
images:
  - alt: "Área de trabalho: tomada de rede na parede com jack keystone e placa de rosto, patch cord de manobra azul em curva larga descendo sobre a mesa até o notebook, e ao lado um painel de detalhe com a tomada e a porta de rede do equipamento."
    src: "subsistemas_area_trabalho.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas sobre os componentes da área de trabalho."
  questions:
    - prompt: "Onde começa o subsistema de área de trabalho?"
      options:
        - "No rack da sala de telecomunicações."
        - "No patch panel, antes do cabeamento horizontal."
        - "Na tomada de rede do usuário."
        - "Na entrada dos serviços da operadora."
      answer: 2
      explanation: "A área de trabalho começa na tomada; o rack está no espaço de distribuição, não na área do usuário."
    - prompt: "Qual é o papel da tomada de rede nessa área?"
      options:
        - "Oferecer o ponto de conexão onde termina o cabeamento fixo e se conecta o cordão do usuário."
        - "Comutar tráfego entre todos os computadores do prédio."
        - "Substituir o patch panel central e o switch local."
        - "Terminar o backbone diretamente no equipamento do usuário."
      answer: 0
      explanation: "A tomada apresenta a terminação do cabeamento horizontal ao usuário, geralmente por meio de um keystone."
    - prompt: "O que é o keystone na tomada?"
      options:
        - "O cordão flexível entre notebook e tomada."
        - "O módulo conector que recebe a terminação do cabo e a interface de rede."
        - "Um adaptador instalado no rack para ligar o switch ao patch panel."
        - "Um equipamento ativo que comuta quadros Ethernet."
      answer: 1
      explanation: "Keystone é um módulo de jack instalado na tomada; não é um cabo nem um equipamento ativo."
    - prompt: "Que componente liga normalmente o equipamento do usuário à tomada?"
      options:
        - "Cabo horizontal permanente terminado diretamente no notebook."
        - "Patch cord do usuário."
        - "Cabo de backbone instalado no shaft."
        - "Patch cord de manobra entre patch panel e switch."
      answer: 1
      explanation: "Um patch cord flexível conecta a interface do computador ou telefone à tomada de rede."
    - prompt: "Qual conjunto pertence à área de trabalho?"
      options:
        - "Tomada, patch cord e equipamento do usuário."
        - "Patch panel, switch e transceiver da entrada."
        - "Tomada e cabo horizontal permanente, sem o equipamento e cordão do usuário."
        - "MMR, rack e backbone."
      answer: 0
      explanation: "A área de trabalho reúne os elementos da conexão final usada pela pessoa, a partir da tomada."
    - prompt: "O patch cord entre tomada e computador deve ser contado como parte do limite de 90 m do horizontal permanente?"
      options:
        - "Sim; os 90 m incluem somente o cordão do usuário."
        - "Não. Ele fica fora do enlace permanente, embora conte no comprimento total do canal."
        - "Não; cordões nunca contam em qualquer limite de comprimento."
        - "Não, pois o limite de 90 m inclui o horizontal e todos os cordões."
      answer: 1
      explanation: "O cordão do usuário não integra os 90 m do enlace permanente, mas integra o canal completo sujeito ao limite aplicável."
---

## Contexto

A **área de trabalho** começa **na tomada de rede**, não no rack. Ela reúne o
ponto de conexão e os elementos usados pela pessoa: tomada, cordão flexível e
equipamento, como computador, telefone ou impressora.

Na tomada, o cabo fixo horizontal termina normalmente em um **keystone**. O
keystone é o módulo conector instalado na placa ou caixa; ele não comuta
tráfego. Um **patch cord** liga esse ponto à interface de rede do equipamento
do usuário e pode ser substituído sem refazer o cabeamento permanente.

## O limite que costuma confundir

O cabo horizontal permanente tem limite de referência de 90 m. O patch cord da
área de trabalho **não faz parte desse limite de 90 m**, mas integra o canal
completo, junto com os demais cordões e conexões. Por isso, não ignore seu
comprimento ao projetar o canal nem o trate como um segmento sem limite.

Se o usuário precisa de uma conexão em outro ponto, avalie a localização da
tomada e o projeto do cabeamento. Evite resolver a distância com extensões
improvisadas ou cordões em cascata, que dificultam a manutenção e podem
comprometer os limites do canal.

## Sua vez

Nas perguntas, trace a conexão a partir da tomada até o equipamento e separe
os componentes do usuário dos elementos instalados no rack.
