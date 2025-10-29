# 🚀 Guia de Deploy para Produção

Este guia explica como fazer o deploy do **SENAI Dr. Celso Charuri Game HUB** para produção usando Firebase e Vercel.

## 📋 Pré-requisitos

1. Conta no [Firebase](https://firebase.google.com/)
2. Conta no [Vercel](https://vercel.com/)
3. Node.js 18+ instalado
4. Git configurado

## 🔥 Configuração do Firebase

### 1. Criar Projeto Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Escolha um nome para o projeto (ex: `senai-games-hub`)
4. Configure Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Firebase Authentication

1. No console do Firebase, vá em **Authentication**
2. Clique em "Começar"
3. Habilite **Email/Password**
4. Opcionalmente, configure outros provedores (Google, GitHub, etc.)

### 3. Configurar Firebase Storage

1. Vá em **Storage**
2. Clique em "Começar"
3. Escolha o modo de produção
4. Configure as regras de segurança:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /games/{gameId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /images/{imageId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Configurar Firestore Database

1. Vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha o modo de produção
4. Selecione uma localização (ex: `southamerica-east1` para Brasil)
5. Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Games
    match /games/{gameId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.token.email == resource.data.authorEmail || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'teacher');
    }
    
    // Comments
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        (request.auth.token.email == resource.data.userEmail || 
         request.auth.token.role == 'admin');
    }
    
    // Favorites
    match /favorites/{favoriteId} {
      allow read: if request.auth != null && 
        request.auth.token.email == resource.data.userEmail;
      allow create, delete: if request.auth != null && 
        request.auth.token.email == request.resource.data.userEmail;
    }
    
    // Downloads
    match /downloads/{downloadId} {
      allow read: if request.auth != null && 
        request.auth.token.email == resource.data.userEmail;
      allow create: if request.auth != null;
    }
    
    // Views
    match /views/{gameId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 5. Obter Credenciais Firebase

1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Role até "Seus apps"
3. Clique no ícone da web (`</>`)
4. Registre o app com um nome
5. Copie as credenciais (aparecerão assim):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 🔧 Configuração Local

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Edite `.env.local` e preencha com suas credenciais Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
ENABLE_LOCAL_STORAGE=false
```

**⚠️ Importante:** Em produção, `ENABLE_LOCAL_STORAGE` deve ser `false` ou não estar definido.

### 3. Testar Localmente

```bash
npm run dev
```

Teste todas as funcionalidades antes de fazer deploy.

## 📦 Migração de Dados (Opcional)

Se você já tem dados em desenvolvimento local, use o script de migração:

```bash
npm run migrate:firebase
```

Este script migrará:
- Jogos do `data/games.json` para Firestore
- Comentários do `data/comments.json` para Firestore
- Favoritos do `data/favorites.json` para Firestore
- Downloads do `data/downloads.json` para Firestore
- Visualizações do `data/views.json` para Firestore

**Nota:** Arquivos executáveis e imagens precisam ser reenviados manualmente ou migrados para Firebase Storage.

## 🚀 Deploy no Vercel

### 1. Preparar Repositório Git

```bash
git init
git add .
git commit -m "Preparado para produção"
```

### 2. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Conecte seu repositório Git (GitHub, GitLab, Bitbucket)
4. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 3. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

**⚠️ Não adicione** `ENABLE_LOCAL_STORAGE` em produção!

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse a URL fornecida pelo Vercel

## 🔐 Configurar Autenticação Firebase

### 1. Criar Usuários Administradores

Você pode criar usuários manualmente no Firebase Console ou usar um script:

```typescript
// scripts/create-admin.ts
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

async function createAdmin(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Adicionar role customizada
  await setDoc(doc(db, "users", user.uid), {
    email,
    role: "admin",
    displayName,
  });
  
  console.log(`Admin criado: ${email}`);
}
```

### 2. Configurar Claims Customizados (Opcional)

Para roles mais seguras, use Firebase Admin SDK no backend.

## ✅ Checklist de Produção

- [ ] Firebase configurado com todos os serviços
- [ ] Regras de segurança configuradas
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Build local funcionando (`npm run build`)
- [ ] Testes em produção realizados
- [ ] Domínio customizado configurado (opcional)
- [ ] HTTPS ativado (automático no Vercel)
- [ ] Backup dos dados configurado
- [ ] Monitoramento configurado (opcional)

## 🔄 Atualizações Futuras

O Vercel faz deploy automático quando você faz push para a branch principal. Para atualizar:

```bash
git add .
git commit -m "Sua mensagem"
git push
```

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no Vercel Dashboard
2. Verifique as regras de segurança do Firebase
3. Verifique as variáveis de ambiente
4. Consulte a documentação do [Firebase](https://firebase.google.com/docs) e [Vercel](https://vercel.com/docs)

## 🔒 Segurança Adicional

- Configure rate limiting no Firebase
- Habilite Firebase App Check
- Configure CORS apropriadamente
- Revise regularmente as regras de segurança
- Mantenha dependências atualizadas

