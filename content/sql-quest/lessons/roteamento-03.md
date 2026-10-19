---
id: roteamento-03
title: "Ligando as portas: no shutdown"
summary: "Configure a porta do roteador pelo CLI e leia o show ip interface brief e as rotas C."
chapter: 17
chapterSlug: roteamento
lesson: 3
difficulty: iniciante
xp: 30
prerequisites:
  - roteamento-02
hints:
  - "As portas do roteador vêm desligadas: administratively down."
  - "enable → configure terminal → interface g0/0 → ip address → no shutdown."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
challenge:
  kind: quiz
  instruction: "Responda como quem está no CLI do Router0 no Packet Tracer."
  questions:
    - prompt: "As portas de um roteador Cisco novo vêm..."
      options:
        - "Ligadas e com IP"
        - "Desligadas por comando (administratively down)"
        - "Queimadas"
        - "Em modo Wi-Fi"
      answer: 1
      explanation: "De fábrica as portas vêm desligadas. Por isso as bolinhas ficam vermelhas no Packet Tracer."
    - prompt: "Qual comando liga uma porta do roteador?"
      options:
        - "shutdown"
        - "no shutdown"
        - "enable"
        - "ping"
      answer: 1
      explanation: "O no shutdown tira a porta do estado administratively down."
    - prompt: "Qual é a ordem certa para chegar ao modo de configurar a porta?"
      options:
        - "interface g0/0 → enable → configure terminal"
        - "enable → configure terminal → interface g0/0"
        - "configure terminal → enable → interface g0/0"
        - "no shutdown → enable → interface g0/0"
      answer: 1
      explanation: "Primeiro sobe para o modo privilegiado (enable), depois o de configuração (configure terminal) e por fim entra na porta."
    - prompt: "No show ip interface brief, a G0/1 aparece como 'administratively down / down'. O que fazer?"
      options:
        - "Trocar o PC"
        - "Entrar na interface e digitar no shutdown"
        - "Apagar o roteador"
        - "Reiniciar o Windows"
      answer: 1
      explanation: "Administratively down quer dizer desligada por comando. A correção é o no shutdown."
    - prompt: "No show ip route, a letra C antes de 192.168.20.0/24 indica..."
      options:
        - "Uma rede com problema"
        - "Uma rede diretamente conectada a uma porta ligada do roteador"
        - "Uma rota da internet"
        - "Um cabo cruzado"
      answer: 1
      explanation: "C (connected) é rota diretamente conectada: aparece quando a porta tem IP e está up/up."
---

## Contexto

Com os prédios montados no Packet Tracer, o ping entre eles ainda falha: as portas do roteador estão **desligadas**.

## Os comandos

```
Router> enable
Router# configure terminal
Router(config)# interface g0/0
Router(config-if)# ip address 192.168.10.1 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# end
Router# show ip interface brief
Router# show ip route
```

**CLI** (*Command Line Interface*) = linha de comando. **up/up** = porta ligada e funcionando.
