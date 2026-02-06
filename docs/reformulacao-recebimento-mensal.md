# Reformulação - Tela de Recebimento Mensal

## Mudanças nos Cards
- ❌ Remover: "Média por Aluno"
- ❌ Remover: "Total de Alunos" 
- ✅ Manter: "Total Arrecadado"
- ✅ Adicionar: "Total Previsto" (valor mensal × alunos × 12 meses)

## Mudanças na Tabela
- ✅ Reformular: 2 colunas por mês
  - Coluna 1: Valor recebido (editável)
  - Coluna 2: Data de recebimento (editável)
- ✅ Permitir: Preenchimento de valores e datas
- ✅ Considerar: Pagamentos atrasados

## Estrutura da Nova Tabela
```
| Aluno | Jan Valor | Jan Data | Fev Valor | Fev Data | ... | Total |
```

## Funcionalidades
- Campos editáveis para valor e data
- Salvamento automático ou manual
- Indicação visual de status (pago/pendente)
