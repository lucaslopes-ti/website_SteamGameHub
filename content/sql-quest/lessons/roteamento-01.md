---
id: roteamento-01
title: "Mesma rede ou outra rede?"
summary: "Descubra quando o PC entrega direto e quando usa o gateway padrão."
chapter: 17
chapterSlug: roteamento
lesson: 1
difficulty: iniciante
xp: 20
prerequisites: []
hints:
  - "Com /24, compare os 3 primeiros números."
  - "Destino em outra rede: o PC manda para o gateway padrão."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
images:
  - alt: "Animação: o PC compara a rede do destino e entrega direto ou manda pelo gateway"
    src: "roteamento_local_gateway.gif"
challenge:
  kind: quiz
  instruction: "Chamado nº 6: o prédio 2 não acessa o servidor do prédio 1. Decida o caminho de cada mensagem."
  questions:
    - prompt: "O PC0 (192.168.10.11/24) vai pingar o Server0 (192.168.10.10). A mensagem..."
      options:
        - "Vai direto, porque é a mesma rede"
        - "Vai primeiro ao gateway"
        - "Vai para a internet"
        - "Não pode ser enviada"
      answer: 0
      explanation: "Os 3 primeiros números são iguais (192.168.10): mesma rede, entrega direta."
    - prompt: "O PC0 (192.168.10.11/24) vai pingar o PC2 (192.168.20.11). A mensagem..."
      options:
        - "Vai direto pelo switch"
        - "Vai para o gateway padrão, porque é outra rede"
        - "Volta para o PC0"
        - "Vai para o broadcast"
      answer: 1
      explanation: "192.168.20 é diferente de 192.168.10: outra rede. O PC manda para o gateway."
    - prompt: "O que é o gateway padrão (default gateway)?"
      options:
        - "O cabo do PC"
        - "O IP da porta do roteador na rede do PC: a saída da rede"
        - "O nome do Wi-Fi"
        - "O servidor de arquivos"
      answer: 1
      explanation: "O gateway padrão é a porta do roteador que fica na mesma rede do PC. Tudo que é de outra rede sai por ele."
    - prompt: "Qual comando do Windows mostra o gateway padrão do PC?"
      options:
        - "ping"
        - "ipconfig"
        - "tracert"
        - "cls"
      answer: 1
      explanation: "O ipconfig mostra Endereço IPv4, Máscara de Sub-rede e Gateway Padrão."
    - prompt: "O gateway de um PC 192.168.20.11/24 precisa estar..."
      options:
        - "Em qualquer rede"
        - "Na mesma rede do PC, por exemplo 192.168.20.1"
        - "Na rede do servidor"
        - "Na internet"
      answer: 1
      explanation: "O PC só alcança direto quem está na rede dele. Por isso o gateway fica na mesma rede: 192.168.20.1."
---

## Contexto

Chamado nº 6 do Escritório Horizonte: **"o prédio 2 não acessa o servidor do prédio 1"**. Agora cada prédio tem uma rede /24.

## A pergunta que o PC faz

Antes de enviar, o PC compara a rede do destino com a dele:

- **Mesma rede** → entrega direto (pergunta o MAC do destino com ARP).
- **Outra rede** → manda para o **gateway padrão** (*default gateway*), a porta do roteador.

Veja o seu: no `cmd`, digite `ipconfig` e procure **Gateway Padrão**.
