---
id: redes-05
title: "Diagramas e topologias: física x lógica"
summary: "Leia e desenhe diagramas de rede; entenda a diferença entre topologia física e lógica."
chapter: 12
chapterSlug: redes
lesson: 5
difficulty: iniciante
xp: 20
prerequisites:
  - redes-04
hints:
  - "Física é o que você vê no corredor; lógica é o caminho que os dados percorrem."
  - "Nas redes, um mesmo padrão de desenho pode representar equipamentos muito diferentes — por isso existem ícones padronizados."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre diagramas e topologias."
  questions:
    - prompt: "O que é um diagrama de topologia?"
      options:
        - "Uma foto dos cabos dentro do rack"
        - "Um desenho que mostra dispositivos, links e a arquitetura da rede"
        - "A nota fiscal dos equipamentos"
        - "Um teste de velocidade"
      answer: 1
      explanation: "O diagrama de topologia usa ícones padronizados para representar dispositivos e links — é a planta da rede."
    - prompt: "A topologia FÍSICA mostra..."
      options:
        - "O caminho que os pacotes seguem entre dispositivos"
        - "Como os cabos e equipamentos estão fisicamente posicionados"
        - "Só o endereço IP dos hosts"
        - "A senha do Wi-Fi"
      answer: 1
      explanation: "Topologia física é a disposição real: cabos, paredes, racks, tomadas — o que existe materialmente."
    - prompt: "A topologia LÓGICA mostra..."
      options:
        - "A posição dos móveis na sala"
        - "A marca dos equipamentos"
        - "Como os dados fluem de um dispositivo a outro, independente da posição física"
        - "O raio de curvatura dos cabos"
      answer: 2
      explanation: "Topologia lógica é o caminho dos dados na rede — pode ser bem diferente da disposição física dos equipamentos."
    - prompt: "Por que usar ícones padronizados nos diagramas?"
      options:
        - "Para deixar o desenho bonito"
        - "Para que qualquer pessoa técnica entenda o desenho do mesmo jeito, em qualquer empresa"
        - "Porque é exigência do professor"
        - "Para economizar tinta"
      answer: 1
      explanation: "Ícones padronizados criam um vocabulário visual comum: um switch tem sempre o mesmo símbolo, em qualquer diagrama do mundo."
---

## Contexto

Descrever uma rede com palavras é confuso. Por isso os profissionais de rede
desenham **diagramas de topologia**: representações com ícones padronizados
que mostram dispositivos, links e a arquitetura da rede.

Existem duas visões complementares:

- **Topologia física**: como as coisas estão posicionadas no espaço — o cabo
  sai do rack, sobe pelo shaft, entra na sala 205 e termina na tomada da
  parede.
- **Topologia lógica**: como os dados fluem — o pacote sai do notebook,
  passa pelo switch, chega ao servidor. Dois computadores ao lado um do outro
  podem conversar por um caminho lógico que passa por três andares.

## Prática da aula

Você desenhou no papel a topologia da sua própria sala: onde está cada
equipamento e por onde os cabos passam. Esse exercício é o básico do
profissional de rede — saber "ler" uma rede e representá-la em papel antes
de mexer em qualquer cabo.
