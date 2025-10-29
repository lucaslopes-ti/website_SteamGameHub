# 📝 Changelog

## [2.0.0] - 2024

### ✨ Novas Funcionalidades

#### Sistema de Comentários
- ✅ Adicionado sistema completo de comentários nos jogos
- ✅ Usuários podem comentar nos jogos (requer login)
- ✅ Autores e administradores podem deletar comentários
- ✅ Comentários ordenados por data (mais recentes primeiro)
- ✅ Interface intuitiva com contador de comentários

#### Perfil de Usuário
- ✅ Nova página `/profile` com dashboard pessoal
- ✅ Exibição de informações do usuário
- ✅ Listagem de todos os jogos do usuário
- ✅ Estatísticas pessoais:
  - Total de jogos enviados
  - Jogos aprovados
  - Jogos aguardando aprovação
  - Avaliação média dos jogos
- ✅ Status visual dos jogos (Aprovado/Aguardando)
- ✅ Acesso rápido ao perfil pelo header

#### Melhorias de UX
- ✅ Preview de imagens antes do upload
- ✅ Interface melhorada para seleção de arquivos
- ✅ Melhor feedback visual durante uploads
- ✅ Link para perfil no header quando logado

### 🔧 Melhorias Técnicas

- ✅ Substituído pacote `uuid` por `crypto.randomUUID()` nativo
- ✅ Removidas dependências desnecessárias
- ✅ API routes organizadas e otimizadas
- ✅ Armazenamento de comentários em JSON separado
- ✅ Melhor tratamento de erros

### 📁 Novos Arquivos

- `app/api/games/[id]/comments/route.ts` - API de comentários
- `app/api/comments/[id]/route.ts` - Deletar comentários
- `app/profile/page.tsx` - Página de perfil
- `components/CommentsSection.tsx` - Componente de comentários
- `lib/comments.ts` - Tipos e interfaces de comentários
- `data/comments.json` - Banco de dados de comentários

### 🐛 Correções

- ✅ Corrigido erro de módulo `uuid` não encontrado
- ✅ Melhorada validação de arquivos
- ✅ Corrigida navegação após login/logout

---

## [1.0.0] - 2024

### Funcionalidades Iniciais

- ✅ Sistema de upload de arquivos executáveis
- ✅ Painel administrativo para aprovação
- ✅ Sistema de autenticação básico
- ✅ Sistema de avaliação (1-5 estrelas)
- ✅ Busca e filtros de jogos
- ✅ Páginas de detalhes dos jogos
- ✅ Visual inspirado na Steam

