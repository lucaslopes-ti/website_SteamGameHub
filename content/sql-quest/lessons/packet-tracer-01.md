---
id: packet-tracer-01
title: "Primeira aula no Cisco Packet Tracer"
summary: "Conheça o simulador Cisco Packet Tracer, monte uma rede com dois PCs, configure endereços IPv4 e teste a comunicação com o ping."
chapter: 14
chapterSlug: packet-tracer
lesson: 1
difficulty: iniciante
xp: 40
prerequisites: []
hints:
  - "No simulador, os computadores ficam em End Devices e os cabos são ligados manualmente no menu Connections."
  - "Verde no link significa ligação física ativa; ele não garante que os endereços IP e as máscaras estejam corretos."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
  - label: "Cisco — Packet Tracer"
    url: "https://www.netacad.com/courses/packet-tracer"
challenge:
  kind: quiz
  instruction: "Responda ao desafio da primeira aula no Cisco Packet Tracer e escolha a alternativa correta em cada situação."
  questions:
    - prompt: "Um notebook tem Wi-Fi e placa de rede a cabo. Cada adaptador recebe um endereço IPv4 próprio. O que o IPv4 identifica nesse caso? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "O notebook inteiro, com um único endereço para os dois adaptadores."
        - "Cada interface de rede do notebook, que pode ter um endereço IPv4 diferente."
        - "A rede inteira, com o mesmo endereço IPv4 para todos os equipamentos conectados."
        - "Somente a rede Wi-Fi, nunca a placa a cabo."
      answer: 1
      explanation: "O IPv4 identifica uma interface de rede. Um mesmo equipamento pode ter endereços diferentes em cada adaptador."
    - prompt: "Como um endereço IPv4 é escrito? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "Quatro grupos separados por pontos, cada um de 0 a 999."
        - "Quatro grupos separados por vírgulas, cada um de 0 a 255."
        - "Três grupos separados por pontos, cada um de 0 a 255."
        - "Quatro grupos separados por pontos, cada grupo de 0 a 255."
      answer: 3
      explanation: "O IPv4 tem quatro grupos separados por pontos, e cada grupo vai de 0 a 255."
    - prompt: "Considerando somente o formato de escrita (sem avaliar se o endereço pode ser atribuído a um host), qual das opções está escrita corretamente como um endereço IPv4? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "192.168.50.10"
        - "192.168.50"
        - "192.168.300.10"
        - "192-168-50-10"
      answer: 0
      explanation: "A escrita tem quatro grupos de 0 a 255 separados por pontos; isso não avalia se o endereço pode ser atribuído a um host nessa rede."
    - prompt: "Durante uma aula, o PC0 e o PC1 receberam por engano o mesmo endereço 10.0.0.5 com máscara 255.255.255.0. A turma notou falhas intermitentes de comunicação entre eles. Qual é o diagnóstico e a correção correta? (Média · Tempo sugerido: 60 segundos)"
      options:
        - "Está tudo certo: dois computadores podem compartilhar o mesmo IP na mesma rede."
        - "O problema é o cabo; trocar o cabo resolve, sem mexer nos endereços."
        - "Endereços IPv4 duplicados na mesma rede geram conflito; deve-se manter um PC com 10.0.0.5 e dar ao outro um endereço diferente na mesma rede."
        - "Os dois PCs precisam mudar para a rede 192.168.0.0/24, mesmo com a máscara atual."
      answer: 2
      explanation: "IP repetido na mesma rede causa conflito e falhas. A correção é deixar cada PC com um endereço único dentro da mesma faixa."
    - prompt: "Na configuração de um computador, para que serve a máscara de sub-rede? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "Para separar a parte que identifica a rede da parte que identifica o host no endereço IPv4."
        - "Para escolher a velocidade do cabo conectado à placa."
        - "Para guardar o nome do computador na rede."
        - "Para informar o endereço usado para sair da rede local."
      answer: 0
      explanation: "A máscara indica quais bits do endereço pertencem à rede e quais pertencem ao host."
    - prompt: "Qual afirmação explica corretamente a equivalência entre 255.255.255.0 e /24? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "O número 24 indica quantos bits identificam o host."
        - "O número 24 indica quantos bits identificam a rede."
        - "O número 24 indica a quantidade máxima de computadores na rede."
        - "O número 24 indica o valor que deve ser usado no último grupo do IPv4."
      answer: 1
      explanation: "255.255.255.0 equivale a /24: os 24 bits da parte de rede correspondem aos três primeiros grupos do endereço."
    - prompt: "O PC0 está com IP 10.0.0.1 e máscara 255.255.255.0. O PC1 está com IP 10.0.0.2 e a mesma máscara 255.255.255.0. Sobre a comunicação entre eles, o que é correto? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "Estão em redes diferentes, porque terminam em números diferentes."
        - "Só se comunicam se houver um roteador entre eles."
        - "Estão em redes diferentes, e cada máscara cria uma rede própria."
        - "Estão na mesma rede, pois os três primeiros grupos coincidem e a máscara /24 dos dois é igual."
      answer: 3
      explanation: "Com máscara 255.255.255.0, os três primeiros grupos definem a rede. Como são iguais (10.0.0), os dois PCs estão na mesma rede."
    - prompt: "O PC0 usa 10.0.0.1 com máscara 255.255.255.0. O PC1 usa 10.0.1.2 com a mesma máscara 255.255.255.0. Qual é a situação? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "Mesma rede, porque os dois começam com 10."
        - "Mesma rede, porque a máscara é a mesma nos dois."
        - "Redes diferentes, porque com a máscara /24 os três primeiros grupos (10.0.0 e 10.0.1) não coincidem."
        - "Redes diferentes, porque os dois últimos grupos nunca podem ser iguais."
      answer: 2
      explanation: "Com /24, a rede é definida pelos três primeiros grupos. 10.0.0 e 10.0.1 são diferentes, então são redes distintas."
    - prompt: "Em uma prática, dois PCs estão ligados diretamente por um cabo, na mesma rede, sem roteador, e ficam sem preencher o campo gateway. Eles conseguem se comunicar? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "Não, sem gateway nenhum PC consegue se comunicar."
        - "Sim, o gateway só é necessário para sair da rede local; dentro da mesma rede a comunicação é direta."
        - "Não, o gateway é o endereço que identifica cada PC."
        - "Sim, mas só se os dois tiverem o mesmo endereço de gateway."
      answer: 1
      explanation: "Dentro da mesma rede os hosts falam direto. O gateway é usado quando o destino está fora da rede local."
    - prompt: "No laboratório com Windows, um aluno quer conferir o IPv4, a máscara e o gateway do seu computador. Qual comando do Prompt de Comando mostra esses valores? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "ping"
        - "ip"
        - "netstat"
        - "ipconfig"
      answer: 3
      explanation: "O ipconfig exibe o endereço IPv4, a máscara de sub-rede e o gateway padrão da máquina."
    - prompt: "Ao dar ping em 127.0.0.1 o PC responde normalmente, mas o ping para o PC vizinho não tem resposta. O que o teste de loopback permite concluir? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "Que o cabo do PC vizinho está quebrado."
        - "Que a placa de rede física está funcionando corretamente."
        - "Que o sistema de rede e o IPv4 do próprio PC respondem; isso não prova que o cabo ou o outro PC estejam funcionando."
        - "Que o PC vizinho está desligado, sem dúvida."
      answer: 2
      explanation: "O loopback 127.0.0.1 testa apenas a pilha de rede do próprio PC. Ele não confirma cabo, placa ou o outro computador."
    - prompt: "Um aluno deu ping em outro PC e recebeu resposta. O que essa resposta prova? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "Que o destino respondeu ao teste de ping; não prova que todos os serviços ou toda a rede estejam funcionando."
        - "Que todos os programas do outro PC estão acessíveis."
        - "Que a Internet da escola está funcionando."
        - "Que não existe nenhum problema na rede inteira."
      answer: 0
      explanation: "O ping confirma que o destino respondeu naquele momento; ele não testa todos os serviços nem toda a rede."
    - prompt: "Em outra rede, com roteador, PC0 usa 10.0.0.10 com máscara 255.255.255.0 e gateway 10.0.0.1. O ping para o gateway responde, mas para um destino fora da rede local não responde. Qual conclusão e verificação são adequadas? (Desafio de aplicação · Tempo sugerido: 60 segundos)"
      options:
        - "O PC0 está sem rede; basta trocar o cabo para resolver tudo."
        - "A Internet funciona, pois o gateway respondeu."
        - "O gateway está desligado, porque o destino externo não respondeu."
        - "O PC0 alcança o gateway, mas isso não comprova acesso à internet; é preciso conferir a configuração e verificar se o destino externo está disponível e permite ping."
      answer: 3
      explanation: "A resposta confirma que o gateway foi alcançado, não que a internet funciona. A falta de resposta externa também pode ocorrer por bloqueio de ping ou indisponibilidade do destino."
    - prompt: "PC0 não recebe resposta ao ping de PC1. Você confirmou que PC1 está ligado, o link está verde e os PCs têm IPs distintos na mesma rede, ambos com máscara 255.255.255.0. Qual é a próxima verificação adequada? (Desafio de aplicação · Tempo sugerido: 60 segundos)"
      options:
        - "Concluir que PC1 está desligado, mesmo com o link verde e os IPs corretos."
        - "Verificar se o firewall do PC1 bloqueia o ping, sem concluir que essa seja necessariamente a causa."
        - "Preencher o gateway nos dois PCs, acreditando que ele é obrigatório mesmo na mesma rede."
        - "Duplicar o endereço IPv4 de PC1 em PC0, acreditando que isso os coloca na mesma rede."
      answer: 1
      explanation: "As verificações já realizadas não mostram se o firewall permite ping. Investigar esse bloqueio é um próximo passo, não uma confirmação da causa."
    - prompt: "Um estudante concluiu a simulação no simulador e acha que isso basta para validar o cabo real que ele crimpou. Qual é a análise correta? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "A simulação ajuda a montar, configurar e testar a topologia, mas não substitui a crimpagem e as condições reais do cabo."
        - "A simulação substitui qualquer teste no cabo real."
        - "Se a simulação funcionou, o cabo real está garantidamente correto."
        - "A simulação só serve para desenhar, sem testar nada."
      answer: 0
      explanation: "O simulador apoia o aprendizado da topologia, mas o cabo real precisa ser crimpado e testado fisicamente."
    - prompt: "No simulador, onde ficam os computadores e como os cabos são adicionados à topologia? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "Os PCs ficam em Connections e os cabos em End Devices."
        - "Os PCs ficam em Switches e os cabos são criados sozinhos."
        - "Os PCs ficam em End Devices e os cabos são adicionados manualmente no menu Connections."
        - "Os PCs ficam em Wireless e os cabos no menu Desktop."
      answer: 2
      explanation: "Computadores são dispositivos finais (End Devices) e os cabos são ligados manualmente em Connections."
    - prompt: "Para reproduzir a ligação direta entre os dois PCs desta aula, nas portas FastEthernet0, qual cabo deve ser selecionado em Connections? (Fácil · Tempo sugerido: 30 segundos)"
      options:
        - "Cabo de console."
        - "Cabo de fibra óptica."
        - "Copper Cross-Over (crossover)."
        - "Copper Straight-Through (cabo direto)."
      answer: 2
      explanation: "A aula usa o Copper Cross-Over entre dois PCs. Em equipamentos com auto-MDI-X o cabo direto pode funcionar, mas não é o cabo escolhido nesta prática."
    - prompt: "No simulador, o PC0 e o PC1 estão ligados em FastEthernet0 e o indicador ficou verde. Um aluno conclui que os IPs estão corretos só porque a luz ficou verde. Qual é a conduta correta? (Desafio de aplicação · Tempo sugerido: 60 segundos)"
      options:
        - "O verde indica apenas que o enlace físico está ativo; é preciso conferir endereços, máscaras e testar o ping para validar a conectividade IP."
        - "O verde garante que os endereços IP estão certos."
        - "O verde dispensa qualquer teste de ping entre os PCs."
        - "O verde mostra que a Internet está configurada."
      answer: 0
      explanation: "O link verde confirma a ligação física na porta. Ele não garante que IP e máscara estejam corretos."
    - prompt: "Qual conjunto de configurações reproduz EXATAMENTE a aula, em que PC0 e PC1 se comunicam na mesma rede? (Média · Tempo sugerido: 45 segundos)"
      options:
        - "PC0 10.0.0.1 e PC1 10.0.0.1, ambos com máscara 255.255.255.0."
        - "PC0 10.0.0.1 e PC1 10.0.1.2, ambos com máscara 255.255.255.0."
        - "PC0 10.0.0.1 e PC1 10.0.0.2, ambos com máscara 255.255.255.0 e gateway preenchido com o próprio endereço IPv4."
        - "PC0 10.0.0.1 e PC1 10.0.0.2, ambos com máscara 255.255.255.0 e gateway em branco."
      answer: 3
      explanation: "Na aula os dois PCs usam 10.0.0.1 e 10.0.0.2 com máscara 255.255.255.0 e gateway vazio, pois não precisam sair da rede local."
    - prompt: "No simulador, PC0 está com 192.168.50.10 e PC1 com 192.168.51.11, ambos com máscara 255.255.255.0, sem roteador, e o link está verde. Mantenha o endereço do PC0 e as máscaras; altere somente PC1. Qual correção e validação estão corretas? (Desafio de aplicação · Tempo sugerido: 60 segundos)"
      options:
        - "Configurar PC1 com 192.168.50.10, mantendo a máscara 255.255.255.0, e testar o ping."
        - "Corrigir PC1 para 192.168.50.11 mantendo a máscara 255.255.255.0 e o gateway vazio, e do PC0 dar ping em 192.168.50.11 antes de salvar o arquivo .pkt."
        - "Deixar como está, pois o link verde já garante a comunicação."
        - "Alterar PC1 para 192.168.51.10, mantendo a máscara, e testar o ping."
      answer: 1
      explanation: "Mantendo PC0 e as máscaras, PC1 deve ficar na rede 192.168.50.x. Se a primeira tentativa de ping não responder, pode ser só a descoberta do vizinho (ARP); repita o teste e, se continuar, verifique cabo, portas, endereços e máscara antes de salvar."
---

## Contexto

Nesta primeira aula usamos o **Cisco Packet Tracer** para montar uma pequena
rede com dois computadores. O objetivo é perder o medo da ferramenta:
adicionar os PCs, ligá-los com o cabo certo, configurar endereços IPv4 e
testar a comunicação com o **ping**. A simulação ajuda a entender o que
acontece no mundo real, mas não substitui a crimpagem e o teste do cabo
verdadeiro.

## Adicionando os dispositivos

No canto inferior esquerdo ficam as categorias. Os computadores estão em
**End Devices** (dispositivos finais): arraste dois PCs para a área de
trabalho. Os cabos **não** aparecem sozinhos — escolha o cabo e ligue-o
manualmente no menu **Connections**, clicando primeiro em um PC e depois no
outro.

Na aula manual de PC com PC usa-se o **Copper Cross-Over** (crossover).
Equipamentos modernos com **auto-MDI-X** também aceitam cabo direto, mas a
prática pede o cross-over. Ligue sempre nas portas **FastEthernet0** dos dois
PCs. Quando a ligação física fica ativa, o indicador fica **verde** — e o
verde mostra apenas que o enlace físico está de pé, não que os endereços IP
estejam corretos.

## Configurando o endereço IPv4

Clique em um PC, abra a aba **Desktop** e depois **IP Configuration**. Marque
**Static** para digitar os valores à mão. Nesta rede de laboratório:

- PC0: endereço IPv4 `10.0.0.1`
- PC1: endereço IPv4 `10.0.0.2`
- Máscara de sub-rede dos dois: `255.255.255.0`
- Gateway padrão: **em branco**

Um endereço IPv4 é formado por quatro grupos de 0 a 255 separados por pontos,
como `192.168.50.10`. Ele identifica uma **interface** de rede: um mesmo
computador com Wi-Fi e placa a cabo pode ter um endereço diferente em cada
adaptador. Dois computadores na mesma rede **não podem** usar o mesmo
endereço, pois isso gera conflito e falhas intermitentes.

A máscara `255.255.255.0`, também escrita como **/24**, separa a parte da
rede da parte do host. Com /24, os **três primeiros grupos** identificam a
rede. Por isso `10.0.0.1` e `10.0.0.2` estão na mesma rede, enquanto
`10.0.0.1` e `10.0.1.2` estão em redes diferentes. O gateway **em branco**
funciona aqui porque os PCs falam direto entre si, sem sair da rede local —
o gateway padrão normalmente é o endereço de uma interface do roteador,
usado para alcançar outra rede. A regra dos três primeiros grupos vale
para /24, não para todas as máscaras.

## Testando com ping

Abra o **Command Prompt** (também na aba Desktop) e teste:

```
ping 10.0.0.2
```

No Windows, o comando **ipconfig** mostra o IPv4, a máscara e o gateway da
interface de rede ativa. O endereço real do laboratório não precisa ser igual
ao endereço configurado no simulador. O ping envia um pedido de teste e aguarda
resposta; uma resposta comprova apenas que o destino respondeu àquele teste,
não que todos os serviços ou toda a rede funcionem.
O resultado do ping traz tempo, quantidade de bytes e **TTL**, que
podem variar de uma rede para outra — isso é normal.

O ping tem limites que precisam ser entendidos:

- `ping 127.0.0.1` (loopback) testa apenas o sistema de rede do próprio PC.
  Se ele responde, isso não significa que o cabo, a placa ou o outro
  computador estejam funcionando.
- O ping no gateway mostra se o PC alcança o gateway. Se o destino externo
  não responde mas o gateway sim, isso confirma o alcance local — não
  comprova acesso à internet; a resposta externa pode faltar por bloqueio de
  ping ou por o destino estar indisponível.
- Sem resposta pode haver várias causas: cabo, endereço, máscara ou um
  **firewall** bloqueando o ping. A ausência de resposta não prova que o
  destino está desligado.

Na primeira tentativa, é possível que o ping não responda por causa da
descoberta do endereço físico do vizinho (ARP). Isso não acontece
obrigatoriamente em todo ping: repita o teste e, se a falha persistir,
revise cabo, portas, endereços distintos e máscara.

## Limites do simulador e diagnóstico

O simulador é ótimo para **montar, configurar e testar** topologias, mas não
substitui a crimpagem nem todas as condições reais de um cabo. No laboratório
virtual, use End Devices para os PCs, Connections para os cabos e
FastEthernet0 para as ligações PC-PC.

A atividade individual usou PC0 `192.168.50.10` e PC1 `192.168.50.11`,
ambos com máscara `255.255.255.0` e gateway vazio.

No desafio final, o link do PC1 pode estar verde e, mesmo assim, os endereços
estarem errados. Um caso comum é PC0 `192.168.50.10` e PC1 `192.168.51.11`,
ambos com `255.255.255.0` e sem roteador. Como /24 usa os três primeiros
grupos, os dois estão em redes diferentes: a correção é ajustar PC1 para
`192.168.50.11`, manter a máscara `255.255.255.0` e o gateway vazio, e do PC0
dar ping em `192.168.50.11` antes de salvar o arquivo `.pkt`.

## O que vem a seguir

Com a rede de dois PCs funcionando, você já conhece o ciclo do Packet Tracer:
montar, endereçar, testar e diagnosticar. Nas próximas aulas, novos
dispositivos ampliam essa topologia.
