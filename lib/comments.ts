export interface Comment {
  id: string;
  gameId: string;
  author: string;
  /** Não é exposto publicamente na leitura. */
  authorEmail?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  /** Informado apenas quando autenticado; indica se o usuário pode deletar. */
  canDelete?: boolean;
}

