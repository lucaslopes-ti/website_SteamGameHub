# Configuração do Firebase para a Prova de Lógica de Programação

Este guia explica como configurar o Firebase para salvar as respostas da prova de Lógica de Programação.

## Opções de Configuração

Existem duas formas de configurar o Firebase:

1. **Service Account Key (Recomendado para Produção)** - Usa Firebase Admin SDK
2. **Client SDK (Desenvolvimento)** - Usa variáveis NEXT_PUBLIC_FIREBASE_*

## Método 1: Service Account Key (Recomendado)

Este método é mais seguro e recomendado para produção (Vercel).

### Passo 1: Criar Service Account no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Configurações do Projeto** (ícone de engrenagem)
4. Clique na aba **Contas de serviço**
5. Clique em **Gerar nova chave privada**
6. Uma janela de confirmação aparecerá - clique em **Gerar chave**
7. Um arquivo JSON será baixado (ex: `projeto-firebase-adminsdk-xxxxx.json`)

### Passo 2: Configurar na Vercel (Produção)

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Configure a variável:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Cole o conteúdo **COMPLETO** do arquivo JSON baixado
   - **Environments**: Marque todas (Production, Preview, Development)
6. Clique em **Save**

⚠️ **IMPORTANTE**: 
- Cole o JSON **COMPLETO** em uma única linha ou mantenha a formatação
- Não remova nenhuma parte do JSON
- A chave privada deve começar com `-----BEGIN PRIVATE KEY-----` e terminar com `-----END PRIVATE KEY-----`

### Passo 3: Configurar Localmente (Desenvolvimento)

Crie um arquivo `.env.local` na raiz do projeto:

```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"seu-projeto-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

⚠️ **ATENÇÃO**: 
- O JSON deve estar em uma única linha ou com `\n` para quebras de linha
- Use aspas simples externas e escape as aspas internas se necessário

## Método 2: Client SDK (Alternativa)

Se preferir usar o Client SDK (menos seguro, mas mais simples para desenvolvimento):

### Passo 1: Obter Credenciais do Firebase

1. No Console do Firebase, vá em **Configurações do Projeto**
2. Role até a seção **Seus apps**
3. Se não tiver um app web, clique em **Adicionar app** → **Web** (ícone `</>`)
4. Copie as credenciais mostradas

### Passo 2: Configurar Variáveis de Ambiente

#### Na Vercel:
Adicione as seguintes variáveis de ambiente:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Localmente (`.env.local`):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Configurar Regras de Segurança do Firestore

Para que a aplicação possa salvar dados, você precisa configurar as regras de segurança do Firestore:

1. No Console do Firebase, vá em **Firestore Database**
2. Clique na aba **Regras**
3. Configure as regras para permitir escrita na coleção `prova_logica_programacao`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita na coleção de provas
    match /prova_logica_programacao/{document=**} {
      allow read, write: if true; // Em produção, adicione validações de segurança
    }
    
    // Outras coleções existentes
    match /{document=**} {
      allow read, write: if false; // Negar acesso padrão
    }
  }
}
```

⚠️ **IMPORTANTE**: As regras acima permitem acesso total. Para produção, você deve adicionar validações de segurança adequadas.

### Regras Mais Seguras (Recomendado para Produção)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /prova_logica_programacao/{documentId} {
      // Permitir escrita apenas se tiver studentId e provaVersion válidos
      allow create: if request.resource.data.keys().hasAll(['studentId', 'provaVersion', 'answers'])
                   && request.resource.data.studentId is string
                   && request.resource.data.provaVersion in [1, 2, 3];
      
      // Permitir atualização apenas do mesmo studentId
      allow update: if resource.data.studentId == request.resource.data.studentId;
      
      // Permitir leitura (ou restringir conforme necessário)
      allow read: if true;
    }
  }
}
```

## Verificar Configuração

Após configurar, você pode verificar se está funcionando:

1. **Teste Local**: Execute `npm run dev` e tente enviar uma prova
2. **Verificar Logs**: Os logs do servidor mostrarão se o Firebase foi inicializado corretamente
3. **Console do Firebase**: Verifique se os dados aparecem na coleção `prova_logica_programacao`

## Solução de Problemas

### Erro: "Service account JSON inválido"
- Verifique se copiou o JSON completo
- Certifique-se de que todas as chaves estão presentes
- Verifique se não há caracteres especiais corrompidos

### Erro: "Chave privada mal formatada"
- A chave privada deve ter quebras de linha (`\n`)
- Se estiver na Vercel, o sistema normaliza automaticamente
- Verifique se começa com `-----BEGIN PRIVATE KEY-----`

### Erro: "Permission denied"
- Verifique as regras de segurança do Firestore
- Certifique-se de que a coleção `prova_logica_programacao` tem permissão de escrita
- Verifique se o Service Account tem as permissões corretas no Firebase

### Erro: "Firebase não está configurado"
- Verifique se as variáveis de ambiente estão configuradas
- Na Vercel, certifique-se de que as variáveis estão marcadas para o ambiente correto
- Reinicie o servidor após adicionar variáveis de ambiente

## Estrutura dos Dados Salvos

Os dados são salvos na coleção `prova_logica_programacao` com a seguinte estrutura:

```typescript
{
  userId: string;              // ID único do usuário
  studentId: string;           // Identificação do aluno
  userName: string;            // Nome do aluno
  provaVersion: number;        // Versão da prova (1, 2 ou 3)
  answers: {                   // Respostas por questão
    "1.1": "código C#...",
    "1.2": "código C#...",
    // ...
  };
  violations: string[];        // Lista de violações de segurança
  startTime: string;           // ISO timestamp de início
  endTime?: string;            // ISO timestamp de fim (se enviado)
  lastSaved?: string;          // ISO timestamp do último salvamento
  submitted: boolean;          // Se a prova foi enviada
  createdAt: Timestamp;       // Timestamp do Firebase
  updatedAt: Timestamp;       // Timestamp do Firebase
}
```

## Notas Importantes

1. **Segurança**: O Service Account Key tem acesso total ao Firebase. Mantenha-o seguro e nunca o commite no Git.

2. **Fallback**: Se o Firebase não estiver configurado, a aplicação ainda funcionará, mas os dados serão salvos apenas localmente (não persistirão após recarregar a página).

3. **Produção**: Para produção, sempre use o Service Account Key (Método 1) e configure regras de segurança adequadas.

4. **Desenvolvimento**: Para desenvolvimento local, você pode usar qualquer um dos métodos, mas o Service Account Key é mais confiável.


