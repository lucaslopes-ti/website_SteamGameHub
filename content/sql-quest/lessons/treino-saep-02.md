---
id: treino-saep-02
title: "Símbolos, topologias e equipamentos"
summary: "Reconheça o desenho de cada equipamento, a topologia física e o que o switch e o roteador leem."
chapter: 18
chapterSlug: treino-saep
lesson: 2
difficulty: iniciante
xp: 30
prerequisites:
  - treino-saep-01
hints:
  - "Roteador = círculo com setas cruzadas. Switch = retângulo com setas paralelas."
  - "Estrela: cada PC tem o seu cabo até o switch."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
images:
  - alt: "Símbolos dos equipamentos: roteador, switch, firewall, access point, servidor, PC, notebook e nuvem"
    src: "saep_simbolos.png"
  - alt: "Topologias estrela, barramento, anel e malha, com o que acontece quando um cabo falha"
    src: "saep_topologias.png"
challenge:
  kind: quiz
  instruction: "Chamado nº 8: o teste do técnico novo. Use os 4 passos: comando, dados, riscar as absurdas, escolher."
  questions:
    - prompt: "No diagrama da rede que o cliente entregou, há um ícone redondo e azul com quatro setas no meio: duas apontando para dentro e duas para fora. Ele fica entre a nuvem da internet e o switch do escritório. Que equipamento esse ícone representa e qual é a função dele?"
      options:
        - "Roteador: liga redes diferentes, como a rede do escritório e a internet."
        - "Switch: liga os PCs da mesma rede e aprende os MACs."
        - "Access point: dá acesso sem fio à rede."
        - "Firewall: filtra o que entra e sai da rede."
      answer: 0
      explanation: "Círculo (cilindro) com setas cruzadas é o roteador, e ele fica na fronteira entre redes."
    - prompt: "No laboratório, cada um dos 30 PCs tem um cabo próprio que vai até o switch do rack. Numa manhã, o cabo do PC 12 é rompido pela porta do armário. Qual é a topologia física desse laboratório e o que acontece com a rede?"
      options:
        - "Barramento: todos os PCs ficam sem rede, porque o cabo principal foi cortado."
        - "Anel: a rede para até o anel ser fechado de novo."
        - "Estrela: todos os PCs ficam sem rede, porque estão ligados ao mesmo switch."
        - "Estrela: só o PC 12 fica sem rede; os outros continuam funcionando."
      answer: 3
      explanation: "Cada PC com o seu cabo até um ponto central é estrela: cai um cabo, cai só aquele PC."
    - prompt: "O estagiário montou um quadro para o treinamento do cliente, ligando cada equipamento à informação que ele lê para decidir para onde mandar os dados. Qual linha do quadro está correta?"
      options:
        - "Switch: lê o endereço IP, na camada 3 (Rede)."
        - "Roteador: lê o endereço MAC, na camada 2, e repassa o broadcast."
        - "Hub: guarda uma tabela de MACs por porta."
        - "Roteador: lê o IP, na camada 3 (Rede). Switch: lê o MAC, na camada 2 (Enlace)."
      answer: 3
      explanation: "Switch = MAC = camada 2. Roteador = IP = camada 3."
    - prompt: "Na topologia em malha (mesh), se um cabo rompe..."
      options:
        - "A rede toda para"
        - "Os dados seguem por outro caminho"
        - "Só o servidor para"
        - "O switch desliga"
      answer: 1
      explanation: "Na malha há vários caminhos entre os equipamentos. É a topologia que mais aguenta falhas."
---

## Contexto

O cliente entregou o desenho da rede (diagrama) e quer saber se o técnico novo
entende os símbolos. No SAEP, o diagrama aparece muito: é preciso reconhecer
o equipamento só pelo desenho.

## Os símbolos

| Símbolo | Equipamento | Função |
|---|---|---|
| círculo com setas cruzadas | **roteador** (router) | liga redes diferentes |
| retângulo com setas paralelas | **switch** (comutador) | liga os PCs da mesma rede pelo MAC |
| parede de tijolos | **firewall** (parede corta-fogo) | filtra o que entra e sai |
| ondas de rádio | **access point** (ponto de acesso) | dá acesso sem fio |
| nuvem | **internet** ou rede externa | tudo o que está fora |

## As topologias físicas

| Topologia | Como liga | Se um cabo rompe |
|---|---|---|
| **Estrela** | cada PC com o seu cabo até o switch | só aquele PC para |
| **Barramento** | um cabo único para todos | todos param |
| **Anel** | cada um no vizinho, em círculo | o anel se abre |
| **Malha** | vários caminhos | os dados desviam |

## Sua vez

Olhe as imagens e responda às situações do cliente.
