---
id: treino-saep-05
title: "Dentro da rede: ARP, roteador e portas"
summary: "A primeira mensagem do ping, a porta desligada no roteador e a porta bloqueada no firewall."
chapter: 18
chapterSlug: treino-saep
lesson: 5
difficulty: iniciante
xp: 30
prerequisites:
  - treino-saep-04
hints:
  - "Cache ARP vazio: primeiro pergunta a todos (broadcast)."
  - "administratively down = desligada por comando: no shutdown."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
challenge:
  kind: quiz
  instruction: "Chamado nº 8: o teste do técnico novo. Use os 4 passos: comando, dados, riscar as absurdas, escolher."
  questions:
    - prompt: "O PC0 (192.168.1.10) acabou de ser ligado e o cache ARP dele está vazio. O usuário digita ping 192.168.1.12, um PC da mesma rede, no mesmo switch. Qual é a primeira mensagem que o PC0 envia?"
      options:
        - "Um ARP Request em broadcast (FFFF.FFFF.FFFF): “quem tem 192.168.1.12?”."
        - "Um ping (ICMP) direto para o MAC do 192.168.1.12."
        - "Um ARP Reply em unicast para o 192.168.1.12."
        - "Uma consulta DNS para descobrir o MAC."
      answer: 0
      explanation: "Cache vazio: primeiro o ARP pergunta a todos (broadcast), só depois sai o ping."
    - prompt: "Depois da troca do roteador, o prédio 2 parou de acessar o prédio 1. O técnico digita show ip interface brief e vê a linha: GigabitEthernet0/1  192.168.20.1  YES  manual  administratively down  down. Qual ação resolve?"
      options:
        - "Trocar o cabo da G0/1, porque down quer dizer cabo solto."
        - "Reiniciar o switch do prédio 2."
        - "Criar com ip route a rota da rede 192.168.20.0."
        - "Entrar em interface g0/1 no modo de configuração e digitar no shutdown."
      answer: 3
      explanation: "Porta de roteador vem desligada: interface g0/1 → no shutdown → conferir up/up."
    - prompt: "Depois que o firewall do escritório foi configurado, os sites com “http://” abrem, mas os sites com cadeado (“https://”) não abrem. O ping para os servidores funciona. Qual porta provavelmente ficou bloqueada no firewall?"
      options:
        - "80 (HTTP)"
        - "53 (DNS)"
        - "443 (HTTPS)"
        - "25 (SMTP, envio de e-mail)"
      answer: 2
      explanation: "Site com cadeado = HTTPS = porta 443. A porta leva ao programa certo no servidor."
    - prompt: "O comando nslookup serve para..."
      options:
        - "Testar o cabo"
        - "Perguntar ao DNS qual é o IP de um nome"
        - "Desligar a porta do roteador"
        - "Ver o MAC do PC"
      answer: 1
      explanation: "nslookup www.google.com pergunta ao DNS o IP do nome. Se falhar e o ping 8.8.8.8 funcionar, o problema é o DNS."
---

## Contexto

Três chamados que só se resolvem sabendo o que acontece **por dentro** da
rede: o que o PC envia primeiro, como o roteador mostra uma porta desligada e
qual porta (número) cada serviço usa.

## Caixa de ferramentas do técnico

| Sintoma | Comando |
|---|---|
| Ver IP, máscara e gateway | `ipconfig` |
| Pedir um IP novo ao DHCP | `ipconfig /release` e depois `ipconfig /renew` |
| Testar se o outro responde | `ping` |
| Ver o caminho até o destino | `tracert` |
| Perguntar ao DNS o IP de um nome | `nslookup` |
| Ver as portas do roteador | `show ip interface brief` |

## Portas que mais caem

| Serviço | Porta |
|---|---|
| HTTP (site sem cadeado) | 80 |
| HTTPS (site com cadeado) | 443 |
| DNS (nome → IP) | 53 |

## Sua vez

Leia o resultado de cada comando no contexto antes de escolher.
