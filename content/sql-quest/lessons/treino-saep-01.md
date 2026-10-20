---
id: treino-saep-01
title: "Como ler uma questão do SAEP"
summary: "Contexto, comando e alternativas: o método dos 4 passos aplicado a três chamados de diagnóstico."
chapter: 18
chapterSlug: treino-saep
lesson: 1
difficulty: iniciante
xp: 30
prerequisites: []
hints:
  - "Leia o comando primeiro: ele diz o que a questão quer."
  - "Sublinhe os números do contexto (IP, máscara, gateway, resultado do ping)."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
challenge:
  kind: quiz
  instruction: "Chamado nº 8: o teste do técnico novo. Use os 4 passos: comando, dados, riscar as absurdas, escolher."
  questions:
    - prompt: "A recepção do Escritório Horizonte liga: “a internet caiu, nenhum site abre”. No PC, o ipconfig mostra IP 192.168.10.57, máscara 255.255.255.0 e gateway 192.168.10.1. O ping 8.8.8.8 responde. O ping www.google.com mostra “não foi possível encontrar o host”. Qual é a causa mais provável e qual é o próximo teste?"
      options:
        - "O cabo de rede está danificado. Próximo teste: testador de cabo."
        - "O gateway está errado. Próximo teste: trocar o gateway para 192.168.10.254."
        - "A tradução do nome em IP (DNS) falhou. Próximo teste: nslookup www.google.com."
        - "O IP está duplicado. Próximo teste: apagar o cache com arp -d."
      answer: 2
      explanation: "O IP chega à internet (ping 8.8.8.8 ok), mas o nome não vira IP: o problema está no DNS, camada 7."
    - prompt: "Um usuário reclama que está “sem internet”. O técnico roda ipconfig e vê: Endereço IPv4 169.254.33.10, máscara 255.255.0.0 e gateway padrão em branco. O que essa tela mostra?"
      options:
        - "O PC não recebeu endereço do servidor DHCP e criou sozinho um endereço APIPA."
        - "O PC recebeu um IP público do provedor."
        - "É um IP privado de classe B, normal na rede do escritório."
        - "É o endereço de loopback do PC."
      answer: 0
      explanation: "169.254.x.x = APIPA: o DHCP não respondeu. Conferir o cabo e o DHCP; depois ipconfig /renew."
    - prompt: "No prédio 2 (rede 192.168.20.0/24, gateway 192.168.20.1), todos os PCs acessam o servidor 192.168.10.10, menos o PC2. O PC2 pinga os vizinhos do prédio 2. O ipconfig do PC2 mostra: IP 192.168.20.11, máscara 255.255.255.0, gateway 192.168.10.1. Qual é a causa e a correção?"
      options:
        - "Máscara errada: trocar para 255.255.0.0."
        - "Gateway fora da rede do PC2: trocar para 192.168.20.1."
        - "Servidor desligado: ligar o servidor."
        - "Cabo do PC2 com defeito: trocar o cabo."
      answer: 1
      explanation: "O gateway tem de estar na rede do PC: é o IP da porta do roteador naquela rede."
    - prompt: "Numa questão do SAEP, o “comando” é..."
      options:
        - "A história do cliente"
        - "A pergunta que diz o que você precisa responder"
        - "A alternativa certa"
        - "O nome do técnico"
      answer: 1
      explanation: "O comando é a pergunta. Leia ele primeiro e depois volte ao contexto procurando os dados."
---

## Contexto

**Chamado nº 8 do Escritório Horizonte:** o cliente vai contratar um técnico
novo e montou um teste com situações da própria rede. Antes do candidato, quem
resolve é você. O **SAEP** (Sistema de Avaliação da Educação Profissional) usa
questões nesse mesmo formato.

## As 3 partes de uma questão

| Parte | O que é | O que fazer |
|---|---|---|
| **Contexto** | a situação: o cliente, a rede, o que aconteceu | sublinhar os números e os resultados dos comandos |
| **Comando** | a pergunta | ler primeiro |
| **Alternativas** | 4 respostas; 3 são erros comuns | riscar as que não batem com o contexto |

## Os 4 passos

1. Leia o **comando** (a pergunta).
2. Volte ao **contexto** e sublinhe os dados.
3. **Risque** as alternativas que contradizem um dado.
4. Escolha e diga **por quê** em uma frase.

## Sua vez

Três chamados de diagnóstico. Use os 4 passos em cada um.
