---
id: treino-saep-06
title: "Unidades, instrumentos e segurança"
summary: "A conta do download em bits e bytes, o instrumento certo e o procedimento seguro na troca de peças."
chapter: 18
chapterSlug: treino-saep
lesson: 6
difficulty: iniciante
xp: 30
prerequisites:
  - treino-saep-05
hints:
  - "Byte (B) é arquivo; bit (b) é velocidade. 1 byte = 8 bits."
  - "Peça na mão: PC desligado, fora da tomada e pulseira antiestática."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
  - label: "Cisco — IT Essentials"
    url: "https://www.netacad.com/courses/it-essentials"
challenge:
  kind: quiz
  instruction: "Chamado nº 8: o teste do técnico novo. Use os 4 passos: comando, dados, riscar as absurdas, escolher."
  questions:
    - prompt: "O cliente contratou internet de 200 Mbit/s e precisa baixar um arquivo de 100 MB (megabytes). Ele acha que vai demorar meio segundo. Qual é o tempo ideal do download, sem contar perdas?"
      options:
        - "0,5 segundo: 100 ÷ 200."
        - "4 segundos: 100 MB = 800 Mbit; 800 ÷ 200 = 4."
        - "2 segundos: 100 MB = 400 Mbit; 400 ÷ 200 = 2."
        - "800 segundos: 100 × 8."
      answer: 1
      explanation: "Byte (B) é arquivo; bit (b) é velocidade. Multiplique por 8 e divida pela velocidade."
    - prompt: "O técnico vai trocar a placa de rede de um PC do financeiro. O PC está em cima da mesa, ligado na tomada. Qual é o procedimento seguro?"
      options:
        - "Desligar o PC, tirar da tomada e usar a pulseira antiestática presa ao gabinete."
        - "Tocar nos contatos dourados da placa para descarregar a eletricidade estática."
        - "Desligar o PC e usar luvas de lã para isolar."
        - "Trabalhar com o PC ligado, para ver o LED da placa nova acender na hora."
      answer: 0
      explanation: "Desligado, fora da tomada e com pulseira antiestática: protege o técnico e a peça."
    - prompt: "O técnico crimpou 10 patch cords novos e quer conferir, antes de instalar, se os 8 fios de cada cabo têm continuidade e estão na ordem certa. Qual instrumento ele deve usar?"
      options:
        - "OTDR."
        - "Power meter óptico."
        - "Multímetro na tomada elétrica."
        - "Testador de cabo de rede (o dos LEDs de 1 a 8)."
      answer: 3
      explanation: "Testador de cabo: acende os LEDs 1 a 8 na ordem. Fora de ordem ou apagado = refazer a ponta."
    - prompt: "A NR-35 é a norma de segurança para..."
      options:
        - "Trabalho com eletricidade"
        - "Trabalho em altura (acima de 2 m)"
        - "Cabos de fibra"
        - "Senhas do Wi-Fi"
      answer: 1
      explanation: "NR-35 = trabalho em altura, como passar cabo no forro. NR-10 = eletricidade."
---

## Contexto

O cliente reclamou da velocidade da internet e pediu a troca de uma placa de
rede. Para atender, o técnico precisa fazer a conta certa, escolher o
instrumento certo e trabalhar com segurança.

## Unidades

| Unidade | Mede | Exemplo |
|---|---|---|
| **MB** (megabyte, B maiúsculo) | tamanho de arquivo | arquivo de 100 MB |
| **Mbit/s** (megabit por segundo, b minúsculo) | velocidade | internet de 200 Mbit/s |
| **ms** (milissegundo) | tempo de resposta (latência) | ping de 20 ms |

Conta do download: **MB × 8 = Mbit**, depois **÷ velocidade** = segundos.

## Instrumentos

| Instrumento | Serve para |
|---|---|
| Testador de cabo | conferir os 8 fios do par trançado |
| OTDR | achar a quebra ou a perda na fibra óptica |
| Power meter óptico | medir a potência da luz na fibra |
| Multímetro | medir a tensão da tomada elétrica |

## Segurança

- **ESD** (descarga eletrostática): pulseira antiestática presa ao gabinete.
- **NR-10**: eletricidade. **NR-35**: trabalho em altura.
- Nunca olhe para a ponta de uma fibra ligada.

## Sua vez

Três situações de atendimento: conta, instrumento e segurança.
