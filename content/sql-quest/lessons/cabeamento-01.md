---
id: cabeamento-01
title: "Dispositivos de interconexão"
summary: "Escolha o dispositivo certo para cada função: switch, roteador, access point e portas."
chapter: 13
chapterSlug: cabeamento
lesson: 1
difficulty: iniciante
xp: 20
prerequisites: []
hints:
  - "O switch conecta hosts dentro da mesma rede local; o roteador conecta redes diferentes."
  - "O access point é a ponte entre o mundo dos cabos e o mundo sem fio."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
images:
  - alt: "Principais dispositivos intermediários de rede: switch, roteador, ponto de acesso sem fio (AP) e modem/ONT"
    src: "redes_dispositivos.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre dispositivos de interconexão."
  questions:
    - prompt: "Num laboratório com 30 computadores ligados na mesma rede, o dispositivo central é..."
      options:
        - "Um roteador de operadora"
        - "Um switch"
        - "Um patch panel"
        - "Um access point"
      answer: 1
      explanation: "O switch é quem conecta os hosts da mesma rede local, encaminhando os dados entre eles."
    - prompt: "Ligar a rede da escola à Internet é função de qual dispositivo?"
      options:
        - "Switch"
        - "Access point"
        - "Roteador"
        - "Keystone"
      answer: 2
      explanation: "O roteador conecta redes diferentes — no caso, a LAN da escola à Internet (outra rede)."
    - prompt: "Para dar acesso Wi-Fi aos celulares e notebooks da sala, instalamos..."
      options:
        - "Um patch panel"
        - "Um access point"
        - "Um segundo switch"
        - "Um keystone"
      answer: 1
      explanation: "O access point estende a rede com fio para o mundo sem fio, atendendo os dispositivos móveis."
    - prompt: "Numa rede pequena de casa, um único aparelho costuma acumular as funções de roteador, switch e access point. Isso é comum?"
      options:
        - "Não, cada função exige um aparelho separado"
        - "Sim, roteadores domésticos integram as três funções"
        - "Só em redes com fibra"
        - "Somente em prédios grandes"
      answer: 1
      explanation: "Em redes domésticas e SOHO, um único equipamento integra roteador, switch (pequenas portas) e access point."
---

## Contexto

Entre os dispositivos finais e o resto do mundo existem os **dispositivos de
interconexão**. Cada um tem uma função específica, e escolher errado é o
mesmo que usar o parafuso errado: pode até funcionar, mas não é o que a
rede pede.

- **Switch**: conecta os hosts de uma mesma rede local. Cada computador,
  impressora e access point do prédio se conecta a uma porta dele.
- **Roteador**: conecta **redes diferentes**. É ele quem liga a rede do
  SENAI à Internet, escolhendo o melhor caminho entre redes.
- **Access point**: ponte entre a rede cabeada e o mundo sem fio — os
  celulares e notebooks falam com ele por ondas de rádio.
- **Portas**: cada ponto de conexão física (no switch, no rack, na parede)
  é uma porta, e contar portas é contar capacidade da rede.

## Observação

Em redes domésticas, um único aparelho acumula as três funções. Em redes de
escola e empresa, os papéis se separam em equipamentos dedicados — e é aí
que entra o cabeamento estruturado, tema das próximas lições.
