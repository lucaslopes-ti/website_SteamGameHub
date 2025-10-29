# 🔐 Como Corrigir Login em Produção

## Problema
O login não funciona porque as variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD` não estão configuradas no Vercel.

⚠️ **Correção de Segurança:** Agora a autenticação é feita no servidor, então NÃO use `NEXT_PUBLIC_` - isso evita expor credenciais no navegador.

## ✅ Solução Passo a Passo

### 1. Acesse o Dashboard do Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login
- Selecione seu projeto

### 2. Configure as Variáveis de Ambiente
1. Clique em **Settings**
2. Clique em **Environment Variables** (no menu superior)

### 3. Adicione as Variáveis de Login

⚠️ **IMPORTANTE:** Use SEM o prefixo `NEXT_PUBLIC_` - isso mantém as credenciais seguras no servidor!

**Variável 1:**
- **Name:** `ADMIN_EMAIL`
- **Value:** `lucas.dalps` *(ou o email que você usa para login)*
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Clique em **Save**

**Variável 2:**
- **Name:** `ADMIN_PASSWORD`
- **Value:** `Tecnologianaveia@` *(ou a senha que você usa)*
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Clique em **Save**

💡 **Segurança:** Essas variáveis ficam apenas no servidor e nunca são expostas ao navegador!

### 4. Fazer Redeploy (IMPORTANTE!)
Após adicionar as variáveis, você DEVE fazer um redeploy:

1. Vá para a aba **Deployments**
2. Clique nos **3 pontos (...)** do deployment mais recente
3. Selecione **Redeploy**
4. Aguarde o redeploy completar

⚠️ **Importante:** As variáveis só são aplicadas em novos deployments!

## 🔍 Verificar se Funcionou

1. Aguarde o redeploy completar
2. Acesse sua aplicação em produção
3. Tente fazer login com:
   - **Email:** `lucas.dalps`
   - **Senha:** `Tecnologianaveia@`

## ⚠️ Problemas Comuns

### Se ainda não funcionar:

1. **Verifique se as variáveis foram salvas:**
   - Vá em Settings > Environment Variables
   - Confirme que aparecem `NEXT_PUBLIC_ADMIN_EMAIL` e `NEXT_PUBLIC_ADMIN_PASSWORD`

2. **Verifique os valores:**
   - Certifique-se de que não há espaços antes/depois
   - Certifique-se de que estão escritos exatamente como no login

3. **Faça um novo redeploy:**
   - Após qualquer mudança nas variáveis, sempre faça redeploy

4. **Limpe o cache do navegador:**
   - Tente em uma aba anônima/privada
   - Ou limpe o cache do navegador

## 🔒 Segurança

✅ **Correção Aplicada:** Agora a autenticação é feita no servidor via API route (`/api/auth/login`), então:
- ✅ As credenciais NUNCA são expostas no navegador
- ✅ As variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` ficam apenas no servidor
- ✅ Não use `NEXT_PUBLIC_` para credenciais - isso seria inseguro!

## 📝 Notas

- Variáveis SEM `NEXT_PUBLIC_` = apenas servidor (seguro para credenciais)
- Variáveis COM `NEXT_PUBLIC_` = cliente + servidor (não usar para senhas!)
- Após adicionar variáveis, sempre faça redeploy
- A autenticação agora é validada no servidor através da rota `/api/auth/login`

