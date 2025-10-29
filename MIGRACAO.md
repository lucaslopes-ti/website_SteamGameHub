# 🔄 Guia de Migração para Produção

Este documento explica como migrar o **SENAI Dr. Celso Charuri Game HUB** do ambiente de desenvolvimento (storage local + JSON) para produção (Firebase + Vercel).

## 📋 Arquitetura Atual vs Produção

### Desenvolvimento (Atual)
- ✅ Storage: Sistema de arquivos local (`public/uploads/`)
- ✅ Database: Arquivos JSON (`data/*.json`)
- ✅ Auth: Mock localStorage simples
- ✅ Deploy: Local apenas

### Produção (Alvo)
- 🚀 Storage: Firebase Storage
- 🚀 Database: Firebase Firestore
- 🚀 Auth: Firebase Authentication
- 🚀 Deploy: Vercel + CDN

## 🔧 Mudanças Implementadas

### 1. Sistema de Abstração

Criamos camadas de abstração que permitem trocar entre local e Firebase automaticamente:

- **`lib/storage/index.ts`**: Abstração de storage
- **`lib/database/index.ts`**: Abstração de database
- **`lib/firebase/config.ts`**: Configuração Firebase

### 2. Variáveis de Ambiente

O sistema detecta automaticamente qual modo usar baseado em:

```env
# Para desenvolvimento local
ENABLE_LOCAL_STORAGE=true

# Para produção (ou não definir essa variável)
ENABLE_LOCAL_STORAGE=false
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### 3. Componentes

- **`components/AuthProvider.tsx`**: Auth local (desenvolvimento)
- **`components/AuthProviderFirebase.tsx`**: Auth Firebase (produção)
- **`components/AuthProviderWrapper.tsx`**: Escolhe automaticamente

## 📝 Passo a Passo da Migração

### Fase 1: Preparação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Criar projeto Firebase:**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie novo projeto
   - Configure Authentication, Firestore e Storage

3. **Configurar variáveis:**
   - Copie `.env.local.example` para `.env.local`
   - Preencha com credenciais Firebase

### Fase 2: Configuração Firebase

1. **Firestore Rules:**
   - Copie as regras do `DEPLOY.md`
   - Cole no Firebase Console > Firestore > Rules

2. **Storage Rules:**
   - Copie as regras do `DEPLOY.md`
   - Cole no Firebase Console > Storage > Rules

3. **Authentication:**
   - Habilite Email/Password
   - Configure domínios autorizados

### Fase 3: Migração de Dados

1. **Migrar JSON para Firestore:**
   ```bash
   npm run migrate:firebase
   ```

2. **Migrar arquivos para Storage:**
   - Faça upload manual ou use script customizado
   - Arquivos em `public/uploads/games/` → Firebase Storage `games/`
   - Arquivos em `public/uploads/images/` → Firebase Storage `images/`

### Fase 4: Teste Local

1. **Configurar `.env.local`:**
   ```env
   ENABLE_LOCAL_STORAGE=false
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   # ... outras variáveis
   ```

2. **Testar localmente:**
   ```bash
   npm run dev
   ```

3. **Verificar funcionalidades:**
   - ✅ Login/Registro
   - ✅ Upload de jogos
   - ✅ Listagem de jogos
   - ✅ Comentários
   - ✅ Favoritos
   - ✅ Downloads

### Fase 5: Deploy

1. **Preparar código:**
   ```bash
   npm run build
   ```

2. **Configurar Vercel:**
   - Conecte repositório
   - Configure variáveis de ambiente
   - **Não inclua** `ENABLE_LOCAL_STORAGE` em produção

3. **Deploy:**
   - Push para branch principal
   - Vercel faz deploy automático

## 🔄 Compatibilidade Retroativa

O sistema mantém compatibilidade com ambos os modos:

- **Se `ENABLE_LOCAL_STORAGE=true`**: Usa sistema local
- **Se Firebase configurado**: Usa Firebase automaticamente
- **Fallback**: Se Firebase falhar, pode voltar para local

## ⚠️ Avisos Importantes

1. **Arquivos não migrados automaticamente:**
   - Executáveis e imagens precisam ser migrados manualmente
   - Ou reenviados pelos usuários

2. **Autenticação:**
   - Usuários precisam criar novas contas no Firebase
   - Ou migrar manualmente usando Firebase Admin SDK

3. **Regras de segurança:**
   - Revise e ajuste conforme necessário
   - Teste em ambiente de staging primeiro

4. **Backup:**
   - Faça backup dos dados JSON antes de migrar
   - Mantenha backup do Firebase regularmente

## 🐛 Troubleshooting

### Erro: "Firebase not initialized"
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique se `NEXT_PUBLIC_*` variáveis estão presentes

### Erro: "Permission denied"
- Verifique as regras do Firestore/Storage
- Verifique se o usuário está autenticado

### Build falha no Vercel
- Verifique se todas as variáveis estão no painel do Vercel
- Verifique logs de build para mais detalhes

## 📚 Próximos Passos

Após migração bem-sucedida:

1. ✅ Monitorar uso e performance
2. ✅ Configurar Firebase Analytics
3. ✅ Configurar backups automáticos
4. ✅ Revisar e otimizar regras de segurança
5. ✅ Configurar domínio customizado (opcional)

## 🔗 Links Úteis

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

