# Página Gamificada: Atividade Protótipo C#

## Visão Geral

Página interativa gamificada para atividade de 4 horas sobre desenvolvimento de protótipo codificado em C#, integrada ao site SENAI Game Hub.

## Rota

**URL:** `/atividade-prototipo-csharp`

## Estrutura

### Página Principal
- **Arquivo:** `app/atividade-prototipo-csharp/page.tsx`
- Sistema de fases progressivas
- Barra de progresso e XP
- Timer global de 4 horas
- Leaderboard em tempo real

### Componentes de Gamificação

1. **ActivityProgress** (`components/gamification/ActivityProgress.tsx`)
   - Exibe progresso das 4 fases
   - Barra de XP total
   - Status de cada fase (completa/bloqueada/ativa)

2. **Leaderboard** (`components/gamification/Leaderboard.tsx`)
   - Top 10 participantes por XP
   - Atualização automática

3. **ActivityTimer** (`components/atividade/ActivityTimer.tsx`)
   - Timer de 4 horas com contador regressivo
   - Alertas quando falta pouco tempo
   - Pausável pelo professor

### Seções da Atividade

#### 1. Briefing e Treinamento (`BriefingSection.tsx`)
- ✅ Missão e regras da atividade
- ✅ Quiz interativo sobre UC (50 XP)
- ✅ Vídeo tutorial C# (25 XP)
- ✅ Formação de duplas (25 XP)

**Total:** 100 XP

#### 2. Prática C# Guiada (`CSharpPracticeSection.tsx`)
- ✅ Editor de código integrado
- ✅ 3 exercícios sequenciais:
  - Variáveis e Tipos (20 XP)
  - Estrutura Condicional (30 XP)
  - Funções (50 XP)
- ✅ Validação automática de código
- ✅ Download de arquivos .cs

**Total:** 100 XP

#### 3. Modelagem Blender (`BlenderSection.tsx`)
- ✅ Guia passo a passo
- ✅ Timer de 45 minutos
- ✅ Upload de capa 3D (150 XP)
- ✅ GDD Mini com descrição (50 XP)

**Total:** 200 XP

#### 4. Publicação e Reflexão (`PublicationSection.tsx`)
- ✅ Upload final de arquivos (.cs, capa, GDD)
- ✅ Autoavaliação e reflexão (50 XP)
- ✅ Chat em tempo real com Firebase
- ✅ Geração de relatório PDF
- ✅ Badge de conclusão

**Total:** 250 XP

**XP Total da Atividade:** 500 pontos

## APIs Criadas

### 1. Progresso (`/api/atividades/progresso`)
- **GET:** Busca progresso do usuário
- **POST:** Salva progresso (fases, XP, fase atual)

### 2. Leaderboard (`/api/atividades/leaderboard`)
- **GET:** Retorna top 10 por XP

### 3. Chat (`/api/atividades/chat`)
- **GET:** Busca mensagens da atividade
- **POST:** Envia nova mensagem

## Integração Firebase

### Coleções Firestore

1. **atividades_progresso**
   - `userId`: string
   - `phases`: array
   - `totalXP`: number
   - `currentPhase`: number
   - `activityId`: string
   - `createdAt`: timestamp
   - `updatedAt`: timestamp

2. **atividades_chat**
   - `activityId`: string
   - `userId`: string
   - `userName`: string
   - `message`: string
   - `timestamp`: timestamp

## Funcionalidades

### ✅ Gamificação
- Sistema de XP por completar atividades
- Progressão por fases bloqueadas/desbloqueadas
- Leaderboard em tempo real
- Badges visuais para fases completas

### ✅ Validações
- Quiz com validação automática
- Código C# com testes básicos
- Validação de uploads (tipo, tamanho)

### ✅ Tempo Real
- Chat com outros participantes
- Leaderboard atualizado automaticamente
- Timer sincronizado

### ✅ Responsividade
- Design mobile-first
- Tailwind CSS para layout adaptável
- Componentes otimizados para telas pequenas

## Configuração

### Variáveis de Ambiente

Não são necessárias novas variáveis. A página usa:
- Firebase config existente
- Autenticação compartilhada
- Storage para uploads

### Permissões Firebase

Garantir que as regras do Firestore permitam:
- Leitura/escrita em `atividades_progresso`
- Leitura/escrita em `atividades_chat`
- Para usuários autenticados

## Uso

1. Acesse `/atividade-prototipo-csharp` (requer login)
2. Complete as fases sequencialmente
3. Ganhe XP ao completar atividades
4. Compare seu progresso no leaderboard
5. Converse com outros alunos no chat

## Manutenção

### Adicionar Novas Questões no Quiz
Editar `components/atividade/QuizComponent.tsx`, array `questions`

### Adicionar Novos Exercícios C#
Editar `components/atividade/CSharpPracticeSection.tsx`, array `exercises`

### Ajustar XP das Fases
Editar `app/atividade-prototipo-csharp/page.tsx`, array `phases`

## Próximos Passos Sugeridos

1. Validação C# mais robusta (usar Roslyn API se disponível)
2. Integração com sistema de badges existente
3. Relatórios PDF mais detalhados
4. Modo professor para moderar chat e ajustar timer
5. Exportação de dados para avaliação formativa

