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

No Packet Tracer, os dois prédios do chamado nº 6 já estão montados, com o
roteador no meio. Mesmo assim, **o ping entre os prédios ainda falha**.

O motivo: nos roteadores Cisco, as portas vêm **desligadas de fábrica**
(*administratively down*). É uma medida de segurança. O técnico precisa
**configurar o IP e ligar cada porta** pelos comandos.

## O que é a CLI

A **CLI** (*Command Line Interface*, interface de linha de comando) é a tela
de texto onde se configura o roteador. No Packet Tracer, clique no roteador e
abra a aba **CLI**.

A CLI tem **modos**, como andares de um prédio. Cada modo tem um sinal
diferente no fim da linha:

| Sinal | Modo | Para que serve |
|---|---|---|
| `Router>` | usuário | só olhar algumas coisas |
| `Router#` | privilegiado | ver tudo e salvar |
| `Router(config)#` | configuração global | mudar o roteador |
| `Router(config-if)#` | configuração da porta (*interface*) | mudar uma porta |

## Os comandos, um por um

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

- `enable`: sobe para o modo privilegiado.
- `configure terminal`: entra no modo de configuração.
- `interface g0/0`: escolhe a porta G0/0.
- `ip address ...`: dá à porta o IP e a máscara (o gateway do prédio 1).
- `no shutdown`: **liga a porta**. Sem ele, nada funciona.
- `end`: volta para o modo privilegiado.

Depois, repita para a **G0/1** com o IP **192.168.20.1**.

## Como conferir

- `show ip interface brief`: mostra cada porta. **up / up** = porta ligada e
  funcionando. **administratively down** = esqueceram o `no shutdown`.
- `show ip route`: mostra as rotas. A letra **C** (*connected*) indica uma rede
  **diretamente conectada** a uma porta do roteador.

## Sua vez

Responda como quem está digitando no CLI do Router0.
