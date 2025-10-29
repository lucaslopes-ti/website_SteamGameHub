# 🎮 SENAI Dr. Celso Charuri Game HUB

Repositório de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri.

## 📋 Sobre o Projeto

O **SENAI Dr. Celso Charuri Game HUB** é uma plataforma web inspirada no visual da Steam, criada para servir como vitrine de jogos desenvolvidos pelos estudantes. Os alunos podem publicar seus projetos, que passam por aprovação dos professores antes de serem exibidos publicamente.

## ✨ Funcionalidades

- 🏠 **Página Inicial** com destaques e jogos recentes
- 🎯 **Exploração de Jogos** com sistema de busca e filtros
- ⭐ **Sistema de Avaliação** (1 a 5 estrelas)
- 📤 **Upload de Arquivos Executáveis** - Upload direto de arquivos .exe, .zip, .rar, etc.
- 🔐 **Sistema de Autenticação** básico para professores e administradores
- 👨‍🏫 **Painel Administrativo** para aprovação de jogos
- 📥 **Download de Jogos** direto da plataforma
- 💬 **Sistema de Comentários** nos jogos
- 👤 **Perfil de Usuário** com dashboard e estatísticas
- 📊 **Estatísticas Pessoais** (jogos enviados, aprovados, avaliações)
- 🖼️ **Preview de Imagens** antes do upload
- 👤 **Perfis de Autores** com informações dos desenvolvedores
- 🎨 **Visual Moderno** inspirado na Steam
- 📱 **Design Responsivo** para mobile e cada desktop

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones
- **React 18** - Biblioteca UI
- **API Routes** - Backend integrado no Next.js
- **File System** - Armazenamento local de arquivos

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório ou baixe os arquivos
2. Instale as dependências:

```bash
npm install
```

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse `http://localhost:3000` no seu navegador

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
senai-games-hub/
├── app/                    # Páginas e rotas (App Router)
│   ├── page.tsx           # Página inicial
│   ├── games/             # Páginas de jogos
│   ├── upload/            # Página de upload
│   └── about/             # Sobre o projeto
├── components/            # Componentes React
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── GameCard.tsx
│   ├── GameGrid.tsx
│   └── ...
├── lib/                   # Utilitários e dados
│   └── games.ts          # Mock de dados dos jogos
└── public/               # Arquivos estáticos
```

## 🔧 Próximos Passos (Melhorias Futuras)

### Backend e Banco de Dados
- [ ] Integração com Firebase ou API backend
- [ ] Sistema de autenticação (login/logout)
- [ ] Banco de dados real (Firestore, PostgreSQL, etc.)
- [ ] Upload de imagens e arquivos

### Funcionalidades Adicionais
- [x] Sistema de comentários nos jogos
- [x] Perfil de usuário com dashboard
- [x] Estatísticas pessoais
- [x] Preview de imagens no upload
- [ ] Favoritos/Wishlist
- [ ] Sistema de notificações
- [ ] Analytics avançadas
- [ ] Edição de jogos após publicação

### UI/UX
- [ ] Animações e transições
- [ ] Modo escuro/claro
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (ARIA)

## 📝 Notas Importantes

- Os dados são armazenados em **arquivos JSON** localmente (`data/games.json`)
- Os arquivos executáveis são salvos em `public/uploads/games/`
- As imagens são salvas em `public/uploads/images/`
- Sistema de autenticação básico incluído (para produção, use Firebase Auth ou NextAuth.js)
- Para produção, você pode migrar para:
  - Firebase Storage ou AWS S3 para arquivos
  - Firebase Firestore ou PostgreSQL para banco de dados
  - NextAuth.js ou Firebase Auth para autenticação

## 📦 Formatos de Arquivo Suportados

### Executáveis:
- `.exe` (Windows)
- `.zip`, `.rar`, `.7z` (Arquivos compactados)
- `.app`, `.dmg` (macOS)

### Imagens:
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### Limites:
- Arquivo executável: máximo 500MB
- Imagem: máximo 10MB

## 🎨 Paleta de Cores

O projeto usa uma paleta inspirada na Steam:

- **Dark**: `#1b2838` - Fundo principal
- **Darker**: `#171a21` - Fundo secundário
- **Blue**: `#1e3a5f` - Destaques
- **Blue Light**: `#66c0f4` - Links e acentos
- **Green**: `#5c7e10` - Botões de ação

## 👥 Contribuindo

Este é um projeto educacional. Contribuições são bem-vindas! Se você é aluno do SENAI Dr. Celso Charuri e quer adicionar features ou melhorias, sinta-se à vontade para fazer um fork e submeter pull requests.

## 📄 Licença

Este projeto é desenvolvido para fins educacionais no contexto do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri.

## 🙏 Agradecimentos

- Inspiração visual da **Steam**
- Comunidade **Next.js** e **React**
- Alunos e professores do **SENAI Dr. Celso Charuri**

---

## 👨‍💻 Autor

**Lucas Lopes**

Desenvolvido com ❤️ por Lucas Lopes para a comunidade educacional do SENAI Dr. Celso Charuri

---

© 2025 Lucas Lopes - Todos os direitos reservados

