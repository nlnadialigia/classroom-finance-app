# Problema: Config retornando null

## Descrição do Problema
O arquivo `app/recebimento-mensal/page.tsx` está recebendo `null` no `config` porque não existe nenhum registro de configuração criado para o usuário no banco de dados.

## Causa Raiz
1. O usuário ainda não configurou o ano e valor mensal na página de configurações
2. Não existe um valor padrão sendo criado automaticamente

## Soluções Possíveis

### Solução 1: Tratar o caso null no componente (Recomendada)
Modificar o componente para usar valores padrão quando config for null:

```tsx
// No monthly-receipts-client.tsx
const currentYear = initialData.config?.year || new Date().getFullYear();
const monthlyValue = initialData.config?.monthlyValue || 0;
```

### Solução 2: Criar configuração padrão no serviço
Modificar o `configService` para criar uma configuração padrão se não existir:

```tsx
async findOrCreateDefault(userId: string): Promise<Config> {
  let config = await this.model.findUnique({ where: { userId } });
  
  if (!config) {
    config = await this.model.create({
      data: {
        userId,
        year: new Date().getFullYear(),
        monthlyValue: 0
      }
    });
  }
  
  return config;
}
```

### Solução 3: Corrigir inconsistência na consulta
Usar `findUnique()` em vez de `findFirst()` para consistência com a API:

```tsx
configService.findUnique({ where: { userId } })
```

## Próximos Passos
1. Implementar a Solução 1 para tratamento imediato
2. Considerar implementar a Solução 2 para melhor UX
3. Garantir que o usuário seja direcionado para configurações na primeira utilização
