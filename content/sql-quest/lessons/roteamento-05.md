---
id: roteamento-05
title: "Caça à falha: o laudo do técnico"
summary: "Diagnostique gateway errado, IP errado e porta desligada seguindo o método de perto para longe."
chapter: 17
chapterSlug: roteamento
lesson: 5
difficulty: iniciante
xp: 40
prerequisites:
  - roteamento-04
hints:
  - "Método: olhar o PC (ipconfig), pingar o gateway, olhar o roteador, pingar o destino."
  - "Laudo: sintoma, evidência, causa, correção e teste."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
challenge:
  kind: quiz
  instruction: "Cada pergunta é um chamado. Escolha o diagnóstico certo."
  questions:
    - prompt: "O PC2 pinga o PC3 e o 192.168.20.1, mas não pinga o servidor. O ipconfig mostra Gateway Padrão 192.168.20.254. A causa é..."
      options:
        - "Porta do roteador desligada"
        - "Gateway errado no PC2"
        - "Servidor desligado"
        - "Cabo cruzado"
      answer: 1
      explanation: "O gateway certo é 192.168.20.1. Com .254, o PC2 manda para um endereço que não existe."
    - prompt: "O PC2 não pinga ninguém, nem o PC3 do lado. O ipconfig mostra IPv4 192.168.21.11. A causa é..."
      options:
        - "IP do PC2 digitado errado: 21 não é a rede do prédio 2"
        - "Gateway em branco"
        - "Porta G0/0 desligada"
        - "Máscara certa"
      answer: 0
      explanation: "O prédio 2 é 192.168.20.0/24. Com 192.168.21.11, as respostas não acham o caminho de volta."
    - prompt: "Ninguém do prédio 2 pinga o gateway 192.168.20.1. O show ip interface brief mostra G0/1 administratively down. A correção é..."
      options:
        - "Trocar o IP dos PCs"
        - "no shutdown na G0/1"
        - "Reiniciar o servidor"
        - "Apagar o roteador"
      answer: 1
      explanation: "A porta foi desligada por comando. Entre na interface g0/1 e digite no shutdown."
    - prompt: "Qual é a ordem do método do técnico?"
      options:
        - "Destino → roteador → gateway → PC"
        - "PC → gateway → roteador → destino"
        - "Roteador → PC → destino → gateway"
        - "Trocar tudo de uma vez"
      answer: 1
      explanation: "De perto para longe: começa pelo PC e vai até o destino. Quem pula passo, chuta."
    - prompt: "Num laudo técnico, a evidência é..."
      options:
        - "A opinião do técnico"
        - "O comando usado e o resultado que ele mostrou"
        - "O nome do cliente"
        - "O preço do serviço"
      answer: 1
      explanation: "Evidência é prova: por exemplo, ipconfig mostrando Gateway Padrão 192.168.20.254."
---

## Contexto

Na aula, cada dupla **provoca uma falha** escondida na rede do Packet Tracer e
a dupla vizinha precisa **descobrir o problema**, como um técnico de verdade
atendendo um chamado. Nesta lição você treina esse diagnóstico.

## As falhas mais comuns

| Sintoma | Causa provável |
|---|---|
| O PC pinga os vizinhos e o gateway, mas não pinga a outra rede | **gateway errado** no PC |
| O PC não pinga ninguém, nem o vizinho do lado | **IP ou máscara errados** (o PC ficou em outra rede) |
| Ninguém da rede pinga o gateway | **porta do roteador desligada** (falta `no shutdown`) |

## Método do técnico: de perto para longe

Comece pelo que está mais perto do usuário e vá se afastando. Assim você acha
o problema sem chutar:

1. **Olhar o PC**: rode `ipconfig`. O IP, a máscara e o gateway batem com o
   plano de endereçamento?
2. **Pingar o gateway**: se falhar, o problema está entre o PC e o roteador.
3. **Olhar o roteador**: `show ip interface brief`. As portas estão **up/up**?
4. **Pingar o destino**: se agora funciona, a falha foi resolvida.

## O laudo técnico

O **laudo técnico** é o documento que o técnico entrega depois de resolver o
chamado. Ele tem 5 partes:

1. **Sintoma**: o que o usuário reclamou ("o PC2 não acessa o servidor").
2. **Evidência**: o **comando** que você rodou **e o resultado** que apareceu
   (por exemplo, `ipconfig` mostrando o gateway 192.168.20.254).
3. **Causa**: o que estava errado.
4. **Correção**: o que você mudou.
5. **Teste de confirmação**: o comando que prova que voltou a funcionar.

A evidência é o que separa um diagnóstico de um palpite: sem comando e
resultado, não há prova.

## Sua vez

Cada pergunta é um chamado. Leia o sintoma e a evidência e escolha o
diagnóstico certo.
