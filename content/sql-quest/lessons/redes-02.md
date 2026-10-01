---
id: redes-02
title: "Hosts, clientes e servidores"
summary: "Diferencie cliente de servidor e classifique os dispositivos finais e intermediários de uma rede."
chapter: 12
chapterSlug: redes
lesson: 2
difficulty: iniciante
xp: 20
prerequisites:
  - redes-01
hints:
  - "Todo computador conectado à rede é um host — o que muda é o papel que ele exerce."
  - "O switch e o roteador não ficam na mesa do usuário: eles estão no caminho."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre hosts e papéis na rede."
  questions:
    - prompt: "O que é um host?"
      options:
        - "Somente um servidor de arquivos"
        - "Qualquer dispositivo final conectado à rede, com um endereço próprio"
        - "O cabo que conecta dois computadores"
        - "Um software antivírus"
      answer: 1
      explanation: "Host é todo dispositivo final conectado à rede — computador, celular, impressora, câmera — cada um com sua identificação."
    - prompt: "Num laboratório, quando você abre o navegador e acessa o site da escola, quem é o cliente?"
      options:
        - "O computador que você está usando"
        - "O servidor web que responde"
        - "O roteador do prédio"
        - "O site em si"
      answer: 0
      explanation: "O cliente é quem faz o pedido (seu computador); o servidor é quem responde, fornecendo o serviço ou o dado."
    - prompt: "Qual dispositivo é intermediário — ele encaminha o tráfego, mas não é o destino final?"
      options:
        - "A impressora do laboratório"
        - "O celular do professor"
        - "O switch"
        - "O notebook do aluno"
      answer: 2
      explanation: "Switch, roteador e access point são dispositivos intermediários: conectam hosts e encaminham dados, sem serem o fim da comunicação."
    - prompt: "Um mesmo computador pode ser cliente e servidor ao mesmo tempo?"
      options:
        - "Não, o papel é fixo para sempre"
        - "Sim, depende do papel que ele está exercendo naquela comunicação"
        - "Somente se for um Mac"
        - "Somente em redes sem fio"
      answer: 1
      explanation: "Cliente e servidor são papéis, não tipos de máquina. Num compartilhamento simples, o mesmo host pode pedir e oferecer serviços."
---

## Contexto

Todo dispositivo conectado à rede é chamado de **host** (ou **dispositivo
final**, *end device*): computadores, celulares, impressoras, câmeras. Cada
host tem uma identificação própria na rede, e é nele que o dado começa ou
termina a viagem.

O que diferencia um host do outro é o **papel**:

- **Cliente**: pede o serviço. O navegador do seu notebook é cliente quando
  pede uma página ao site da escola.
- **Servidor**: responde o pedido, oferecendo o serviço — armazenar arquivos,
  servir páginas web, controlar logins.

E entre os dois existe uma terceira categoria: os **dispositivos
intermediários** — switch, roteador, access point. Eles não são o destino da
mensagem; trabalham no caminho, recebendo e encaminhando os dados.

## Observação

Cliente e servidor são **papéis**, não tipos de máquina. Em uma rede
doméstica simples, o mesmo computador pode ser servidor de arquivos para um
colega e cliente do site da escola — às vezes na mesma tarde.
