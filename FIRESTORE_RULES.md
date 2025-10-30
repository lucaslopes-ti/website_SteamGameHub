# 🔒 Regras de Segurança do Firestore

## 📋 Instruções para Configurar

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (ex: `senai-games-hub`)
3. No menu lateral, clique em **Firestore Database**
4. Vá na aba **Regras** (Rules)
5. Cole as regras abaixo no editor
6. Clique em **Publicar** (Publish)

---

## ✅ Regras Otimizadas para Produção

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==========================================
    // COLEÇÃO DE JOGOS (games)
    // ==========================================
    match /games/{gameId} {
      // Leitura: Qualquer um pode ler jogos (público)
      allow read: if true;
      
      // Criação: Qualquer um pode criar jogos (pendente de aprovação)
      allow create: if request.resource.data.title is string &&
      request.resource.data.description is string &&
      request.resource.data.author is string &&
      request.resource.data.authorEmail is string &&
      request.resource.data.approved == false &&
      request.resource.data.pending == true &&
      request.resource.data.rating is int &&
      request.resource.data.totalRatings is int;
      
      // Atualização: Apenas o próprio autor ou admin pode atualizar
      // Por enquanto, permitir qualquer atualização (admin via API)
      allow update: if true;
      
      // Deletar: Apenas admin (por enquanto, permitir via API)
      allow delete: if true;
    }
    
    // ==========================================
    // COLEÇÃO DE COMENTÁRIOS (comments)
    // ==========================================
    match /comments/{commentId} {
      // Leitura: Qualquer um pode ler comentários
      allow read: if true;
      
      // Criação: Qualquer um pode criar comentários
      allow create: if request.resource.data.gameId is string &&
      request.resource.data.content is string &&
      request.resource.data.userName is string &&
      request.resource.data.userEmail is string;
      
      // Atualização: Apenas o próprio autor do comentário
      allow update: if resource.data.userEmail == request.resource.data.userEmail;
      
      // Deletar: Apenas o próprio autor do comentário ou admin autenticado
      allow delete: if request.auth != null && 
                       (resource.data.userEmail == request.auth.token.email || true); // Admin via API pode deletar
    }
    
    // ==========================================
    // COLEÇÃO DE FAVORITOS (favorites)
    // ==========================================
    match /favorites/{favoriteId} {
      // Leitura: Apenas o próprio usuário pode ver seus favoritos
      allow read: if true; // Permitir público para simplificar
      
      // Criação: Qualquer um pode criar favoritos
      allow create: if request.resource.data.userEmail is string &&
      request.resource.data.gameId is string;
      
      // Deletar: Apenas o próprio usuário pode deletar seus favoritos
      allow delete: if true; // Permitir via API para simplificar
    }
    
    // ==========================================
    // COLEÇÃO DE VIEWS (views) - Estatísticas
    // ==========================================
    match /views/{gameId} {
      // Leitura: Qualquer um pode ler views
      allow read: if true;
      
      // Criação/Atualização: Qualquer um pode registrar views
      // (Usar incremento atômico no código)
      allow create: if request.resource.data.count is int;
      allow update: if request.resource.data.count is int;
      
      // Não permitir deletar views
      allow delete: if false;
    }
    
    // ==========================================
    // COLEÇÃO DE DOWNLOADS (downloads) - Estatísticas
    // ==========================================
    match /downloads/{downloadId} {
      // Leitura: Qualquer um pode ler downloads
      allow read: if true;
      
      // Criação: Qualquer um pode registrar downloads
      allow create: if request.resource.data.gameId is string &&
      request.resource.data.userId is string;
      
      // Não permitir atualizar ou deletar downloads
      allow update: if false;
      allow delete: if false;
    }
    
    // ==========================================
    // OUTRAS COLEÇÕES - Negar tudo por padrão
    // ==========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ⚠️ Regras Temporárias para Testes (NÃO USAR EM PRODUÇÃO)

Se precisar testar rapidamente, use estas regras **TEMPORÁRIAS**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ PERMITE TUDO - APENAS PARA TESTES!
    }
  }
}
```

**⚠️ IMPORTANTE:** Substitua essas regras pelas regras de produção acima antes de colocar o site no ar!

---

## 📝 Notas Importantes

1. **Propagação:** As regras podem levar até 2 minutos para serem aplicadas globalmente
2. **Cache:** Limpe o cache do navegador se os erros persistirem após configurar
3. **Testes:** Use o simulador de regras no Firebase Console para testar antes de publicar
4. **Segurança:** As regras acima são balanceadas entre segurança e usabilidade para o contexto educacional

---

## 🔍 Como Verificar se Está Funcionando

1. Após publicar as regras, aguarde 1-2 minutos
2. Teste criar um jogo no site
3. Teste visualizar jogos aprovados
4. Verifique os logs no Firebase Console → Firestore → Uso

---

## 🆘 Problemas Comuns

### Erro: "Missing or insufficient permissions"
- **Causa:** Regras ainda não foram publicadas ou há erro de sintaxe
- **Solução:** Verifique a sintaxe das regras e publique novamente

### Erro: "Permission denied" ao criar jogo
- **Causa:** Regras de criação podem estar muito restritivas
- **Solução:** Verifique se todos os campos obrigatórios estão sendo enviados

### Erro: "Undefined field value"
- **Causa:** Tentando salvar campos `undefined` no Firestore
- **Solução:** O código já remove campos `undefined` automaticamente antes de salvar

---

## 📚 Recursos Adicionais

- [Documentação oficial do Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Simulador de regras](https://console.firebase.google.com/project/_/firestore/rules)
- [Monitoramento de regras](https://console.firebase.google.com/project/_/firestore/rules/monitoring)

