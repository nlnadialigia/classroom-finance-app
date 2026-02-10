# Classroom Finance App

Sistema de gestão financeira para professores particulares, desenvolvido com Next.js 16 e Prisma.

## 📋 Funcionalidades

### 🎯 Gestão de Alunos
- Cadastro e gerenciamento de alunos
- Configuração de períodos de mensalidade personalizados
- Controle de recebimentos mensais e extras
- Relatórios individuais por aluno

### 💰 Controle Financeiro Completo
- **Recebimentos Mensais**: 
  - Controle de mensalidades por aluno
  - Marcação de pagamentos com data
  - Visualização em tabela por mês/aluno
  - Edição e exclusão de recebimentos
  - Relatórios detalhados por estudante
  
- **Recebimentos Extras**: 
  - Registro de valores adicionais
  - CRUD completo (criar, editar, excluir)
  - Filtro por ano letivo
  - Associação com alunos específicos
  
- **Gastos/Despesas**: 
  - Controle completo de despesas
  - CRUD completo (criar, editar, excluir)
  - Categorização por descrição
  - Controle por data de pagamento
  
- **Rendimentos e Recebimentos Anteriores**:
  - Registro de rendimentos de investimentos
  - Controle de recebimentos de anos anteriores
  - Integração com dashboard principal

### 📊 Dashboard Inteligente
- **Demonstração do Resultado do Exercício (DRE)**:
  - Visão mensal completa de receitas e despesas
  - Cálculo automático de saldos
  - Formatação monetária brasileira (pt-BR)
  - Separação por tipo de receita/despesa
  
- **Cards de Resumo**:
  - Saldo inicial configurável
  - Total de receitas do período
  - Total de despesas do período
  - Saldo líquido calculado automaticamente
  
- **Correção de Timezone**:
  - Processamento correto de datas no timezone brasileiro
  - Evita divergências de mês por problemas de UTC

### 👥 Sistema de Usuários Avançado
- **Autenticação Segura**:
  - Magic links por email
  - Sessões com expiração automática
  - Tokens únicos por usuário
  
- **Níveis de Acesso**:
  - **Admin**: Acesso total + gerenciamento de usuários
  - **Editor**: Pode criar, editar e excluir dados
  - **Viewer**: Apenas visualização
  
- **Painel Administrativo**:
  - Criação e gerenciamento de usuários
  - Geração de magic links para acesso
  - Controle de permissões por usuário

### ⚙️ Configurações Flexíveis
- **Configuração Anual**:
  - Definição de ano letivo
  - Valor mensal padrão configurável
  - Saldo anterior/inicial
  
- **Interface Otimizada**:
  - Loading states e skeletons
  - Prevenção de flash de conteúdo
  - Experiência de usuário suave

### 📱 Interface Moderna
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Componentes Reutilizáveis**: Interface consistente em todo o sistema
- **Feedback Visual**: Toasts, loading states e confirmações
- **Formatação Brasileira**: Valores monetários e datas no padrão nacional

## 🚀 Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **UI**: Tailwind CSS + Radix UI
- **Autenticação**: Sistema próprio com magic links
- **Validação**: Zod
- **Formulários**: React Hook Form
- **Tabelas**: AG Grid
- **Notificações**: Sonner
- **Estado**: TanStack Query (React Query)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd classroom-finance-app
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados:
```bash
pnpm migrate
pnpm seed
```

5. Execute o projeto:
```bash
pnpm dev
```

## 🗄️ Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm start` - Inicia servidor de produção
- `pnpm migrate` - Executa migrações do banco
- `pnpm studio` - Abre Prisma Studio
- `pnpm seed` - Popula banco com dados iniciais
- `pnpm reset` - Reseta o banco de dados

## 🏗️ Estrutura do Projeto

```
├── app/                    # App Router (Next.js 16)
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard principal com DRE
│   ├── recebimento-mensal/# Controle de mensalidades
│   ├── recebimento-extra/ # Recebimentos extras
│   ├── gastos/           # Controle de gastos/despesas
│   ├── configuracoes/    # Configurações do sistema
│   └── admin/            # Painel administrativo
├── components/           # Componentes reutilizáveis
│   ├── dashboard/        # Componentes do dashboard
│   ├── receipts/         # Formulários de recebimentos
│   ├── expenses/         # Formulários de gastos
│   ├── settings/         # Componentes de configuração
│   └── ui/              # Componentes base da UI
├── lib/                 # Utilitários e configurações
│   ├── services/        # Serviços de dados
│   ├── db/             # Configuração do banco
│   └── types.ts        # Tipos TypeScript
├── prisma/              # Schema e migrações
├── hooks/               # Custom hooks
├── providers/           # Context providers
├── utils/               # Utilitários (formatação, datas)
└── docs/               # Documentação técnica
```

## 🔐 Sistema de Autenticação

O sistema utiliza magic links para autenticação segura:
- **Magic Links**: Links únicos enviados por email
- **Sessões Seguras**: Tokens com expiração automática
- **Controle Granular**: Diferentes níveis de acesso por usuário
- **Tokens Únicos**: Editor e Viewer tokens separados

## 📊 Modelo de Dados

### Principais Entidades:
- **User**: Usuários com diferentes níveis de acesso
- **Student**: Alunos com configurações personalizadas
- **MonthlyReceipt**: Mensalidades com controle de pagamento
- **ExtraReceipt**: Recebimentos extras/avulsos
- **Expense**: Gastos e despesas categorizados
- **Income**: Rendimentos e recebimentos anteriores
- **Config**: Configurações por usuário (ano, valores, saldos)

## 🌐 Deploy

Para deploy no Vercel:
```bash
pnpm build:vercel
```

## 🔧 Funcionalidades Técnicas

### Correções Implementadas
- **Timezone**: Processamento correto de datas no timezone brasileiro
- **Formatação**: Valores monetários no padrão pt-BR (1.234,56)
- **Loading States**: Skeletons e estados de carregamento
- **Validação**: Verificações de array e tratamento de erros
- **CRUD Completo**: Operações completas em todas as entidades

### Melhorias de UX
- **Feedback Visual**: Confirmações e notificações em todas as ações
- **Navegação Intuitiva**: Interface clara e organizada
- **Responsividade**: Funciona perfeitamente em todos os dispositivos
- **Performance**: Queries otimizadas e cache inteligente

## 👨‍💻 Autor

**Nádia Ligia**
- Email: nlnadialigia@gmail.com
