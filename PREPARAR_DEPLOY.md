# 🚀 Preparação para Deploy - Guia Rápido

## ✅ Checklist Antes de Fazer Push

1. **Verificar que dados sensíveis não estão commitados:**
   ```bash
   # Verificar se .env.local está ignorado
   git check-ignore .env.local
   ```

2. **Arquivos que NÃO devem ir para o Git:**
   - ✅ `.env.local` (já no .gitignore)
   - ✅ Todos os arquivos `.md` explicativos (já no .gitignore)
   - ✅ `data/*.json` (já no .gitignore)
   - ✅ `public/uploads/*` (já no .gitignore)

3. **Arquivos que DEVEM ir para o Git:**
   - ✅ Código fonte (`.ts`, `.tsx`, `.js`, `.jsx`)
   - ✅ Configurações públicas (`package.json`, `next.config.mjs`)
   - ✅ `README.md` (versão simplificada)
   - ✅ `.env.example` (template sem dados reais)
   - ✅ `.gitignore`

## 📦 Comandos para Fazer Push

```bash
# 1. Verificar status
git status

# 2. Adicionar arquivos (ignore já configurado)
git add .

# 3. Verificar o que será commitado (sem dados sensíveis)
git status

# 4. Commit
git commit -m "feat: preparação para deploy em produção"

# 5. Conectar repositório remoto (se ainda não conectado)
git remote add origin SEU_REPOSITORIO_URL

# 6. Push
git push -u origin main
# ou
git push -u origin master
```

## 🔐 Configurar no Vercel

Após o push, configure as variáveis de ambiente no Vercel:

1. Vá em **Settings > Environment Variables**
2. Adicione cada variável do `.env.local`:
   - **Firebase:**
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - **App:**
     - `NEXT_PUBLIC_APP_URL` (URL do seu domínio)
   - **Admin (se usar autenticação local):**
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD`
     - `NEXT_PUBLIC_ADMIN_EMAIL`
     - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - **NÃO adicione** `ENABLE_LOCAL_STORAGE` (deixe usar Firebase)

## ⚠️ Importante

- ✅ Credenciais Firebase estão seguras (apenas em `.env.local`, não vai pro Git)
- ✅ Credenciais de admin agora usam variáveis de ambiente (não estão mais hardcoded)
- ✅ Em produção, use Firebase Auth real (não o sistema mock atual)
- ✅ Documentação explicativa não vai pro repositório (já está ignorada)

## 🔑 Variáveis de Ambiente Necessárias

### Para Firebase:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Para Admin (apenas desenvolvimento local):
- `ADMIN_EMAIL` (servidor)
- `ADMIN_PASSWORD` (servidor)
- `NEXT_PUBLIC_ADMIN_EMAIL` (cliente)
- `NEXT_PUBLIC_ADMIN_PASSWORD` (cliente)

### Outras:
- `NEXT_PUBLIC_APP_URL` (URL da aplicação)
- `ENABLE_LOCAL_STORAGE` (opcional, para desenvolvimento)

