# 🚀 Guia Rápido de Migração para Produção

## Passos Rápidos

### 1. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Habilite Authentication (Email/Password)
3. Crie Firestore Database
4. Configure Firebase Storage
5. Copie as credenciais do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_APP_URL=http://localhost:3000
ENABLE_LOCAL_STORAGE=false
```

### 3. Configurar Regras de Segurança

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.token.email == resource.data.authorEmail || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'teacher');
    }
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        (request.auth.token.email == resource.data.userEmail || 
         request.auth.token.role == 'admin');
    }
    match /favorites/{favoriteId} {
      allow read: if request.auth != null && 
        request.auth.token.email == resource.data.userEmail;
      allow create, delete: if request.auth != null && 
        request.auth.token.email == request.resource.data.userEmail;
    }
    match /downloads/{downloadId} {
      allow read: if request.auth != null && 
        request.auth.token.email == resource.data.userEmail;
      allow create: if request.auth != null;
    }
    match /views/{gameId} {
      allow read, write: if true;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Storage Rules:
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

### 4. Migrar Dados (Opcional)

Se você tem dados locais:

```bash
npm run migrate:firebase
```

### 5. Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático!

Veja o arquivo `DEPLOY.md` para instruções detalhadas.

## ✅ Checklist

- [ ] Firebase configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Regras de segurança configuradas
- [ ] Build local funcionando (`npm run build`)
- [ ] Variáveis no Vercel configuradas
- [ ] Deploy concluído

## 🔄 Modo de Compatibilidade

O sistema suporta dois modos:

1. **Desenvolvimento** (`ENABLE_LOCAL_STORAGE=true`): Usa JSON files e storage local
2. **Produção** (`ENABLE_LOCAL_STORAGE=false` ou não definido): Usa Firebase

A troca é automática baseada nas variáveis de ambiente!

