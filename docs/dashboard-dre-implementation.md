# Plano de Implementação - Dashboard DRE

## Objetivo
Refazer a página de dashboard como uma DRE (Demonstração do Resultado do Exercício) de contabilidade.

## Alterações Necessárias

### 1. Configurações - Adicionar Saldo Inicial
- Adicionar campo "saldo inicial" no card de ano e valor mensal
- Campo já criado no Prisma

### 2. Dashboard DRE - Estrutura da Tabela

#### Linhas (Receitas e Despesas):
1. **Previsto** - Valor mensal configurado
2. **Saldo Anterior** - Saldo inicial configurado
3. **Recebimento Mensal** - Valor fixo mensal
4. **Recebimento Extra** - Valores adicionais
5. **Rendimentos** - Rendimentos por mês
6. **Recebimento do Ano Anterior** - Valores recebidos de anos anteriores
7. **[Despesas]** - Uma linha para cada categoria de despesa
8. **Total dos Gastos** - Soma de todas as despesas
9. **Saldo** - Receitas - Despesas

#### Colunas:
- 12 colunas para os meses (Jan-Dez)
- 1 coluna "Total" no final

### 3. Modais de Entrada de Dados

#### Modal 1: Recebidos do Ano Anterior
- Campos: Data, Valor, Descrição
- Descrição aparece como tooltip na tabela

#### Modal 2: Rendimentos
- Campos: Valor, Mês

### 4. Componentes a Manter
- Cards existentes do dashboard atual

## Implementação Técnica

### Arquivos a Modificar/Criar:
1. `app/configuracoes/page.tsx` - Adicionar campo saldo inicial
2. `app/dashboard/page.tsx` - Refazer completamente
3. `components/dashboard/dre-table.tsx` - Nova tabela DRE
4. `components/dashboard/income-modals.tsx` - Modais de entrada
5. `lib/types/dashboard.ts` - Tipos TypeScript
6. APIs para CRUD do model Income

### Fluxo de Dados:
1. Configurações → Saldo inicial
2. Income model → Rendimentos e recebimentos anteriores
3. Expenses → Despesas por categoria
4. Cálculos automáticos para totais e saldos

## Próximos Passos:
1. Implementar campo saldo inicial nas configurações
2. Criar componentes da tabela DRE
3. Implementar modais de entrada
4. Criar APIs para o model Income
5. Integrar tudo no dashboard
