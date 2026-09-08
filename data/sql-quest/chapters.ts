/**
 * Metadados dos capítulos da SQL Quest.
 *
 * Conteúdo original em PT-BR, ambientado na plataforma de pagamentos fictícia
 * "NexoPay". Apenas os TEMAS são inspirados em materiais de referência — todo o
 * texto é autoral.
 */
import type { SQLChapter } from "../../lib/sql-quest/types";

export const chapters: SQLChapter[] = [
  {
    number: 1,
    slug: "select",
    title: "Consultas com SELECT",
    description:
      "Dê os primeiros passos lendo dados do NexoPay: aprenda a buscar todas as colunas de uma tabela, escolher colunas específicas e dar apelidos (aliases) para deixar seus relatórios mais legíveis.",
  },
  {
    number: 2,
    slug: "tabelas",
    title: "Criando e alterando tabelas",
    description:
      "Nem tudo que o NexoPay precisa armazenar já existe no banco. Neste capítulo você cria tabelas do zero, escolhe os tipos certos para cada dado e ajusta a estrutura com ALTER TABLE.",
  },
  {
    number: 3,
    slug: "restricoes",
    title: "Restrições e integridade dos dados",
    description:
      "Um banco de pagamentos não pode aceitar dados quebrados. Aprenda a aplicar regras com NOT NULL, UNIQUE, PRIMARY KEY e FOREIGN KEY para garantir que as informações do NexoPay sejam sempre confiáveis.",
  },
];
