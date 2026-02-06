"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DREData {
  config: {
    monthlyValue: number;
    previousBalance: number;
  };
  monthlyReceipts: Array<{ month: number; value: number; }>;
  extraReceipts: Array<{ month: number; value: number; }>;
  incomes: Array<{ type: string; month: number; value: number; }>;
  expenses: Array<{ month: number; value: number; description: string; }>;
}

interface DRETableProps {
  data: DREData;
}

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function DRETable({ data }: DRETableProps) {
  const { config, monthlyReceipts, extraReceipts, incomes, expenses } = data;

  // Calcular valores por mês
  const getMonthlyValue = (month: number, type: string) => {
    switch (type) {
      case "saldo-anterior":
        if (month === 1) return config.previousBalance;
        // Calcular saldo acumulado até o mês anterior
        let saldoAcumulado = config.previousBalance;
        for (let m = 1; m < month; m++) {
          const receitas = getMonthlyValue(m, "recebimento-mensal") + 
                          getMonthlyValue(m, "recebimento-extra") + 
                          getMonthlyValue(m, "rendimentos") + 
                          getMonthlyValue(m, "recebimento-anterior");
          const despesas = getMonthlyValue(m, "despesas");
          saldoAcumulado += receitas - despesas;
        }
        return saldoAcumulado;
      case "recebimento-mensal":
        return monthlyReceipts.filter(r => r.month === month).reduce((sum, r) => sum + r.value, 0);
      case "recebimento-extra":
        return extraReceipts.filter(r => r.month === month).reduce((sum, r) => sum + r.value, 0);
      case "rendimentos":
        return incomes.filter(i => i.type === "INCOME" && i.month === month).reduce((sum, i) => sum + i.value, 0);
      case "recebimento-anterior":
        return incomes.filter(i => i.type === "PREVIOUS" && i.month === month).reduce((sum, i) => sum + i.value, 0);
      case "despesas":
        return expenses.filter(e => e.month === month).reduce((sum, e) => sum + e.value, 0);
      default:
        return 0;
    }
  };

  const getRowTotal = (type: string) => {
    if (type === "saldo-anterior") {
      // Para saldo anterior, o total é apenas o saldo inicial (não soma os acumulados)
      return config.previousBalance;
    }
    return MONTHS.reduce((sum, _, index) => sum + getMonthlyValue(index + 1, type), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const rows = [
    { label: "Saldo Anterior", type: "saldo-anterior", isRevenue: true },
    { label: "Recebimento Mensal", type: "recebimento-mensal", isRevenue: true },
    { label: "Recebimento Extra", type: "recebimento-extra", isRevenue: true },
    { label: "Rendimentos", type: "rendimentos", isRevenue: true },
    { label: "Recebimento Ano Anterior", type: "recebimento-anterior", isRevenue: true },
  ];

  // Obter despesas únicas por descrição
  const uniqueExpenses = expenses.reduce((acc: any[], expense: any) => {
    const existing = acc.find(e => e.description === expense.description);
    if (!existing) {
      acc.push({ description: expense.description });
    }
    return acc;
  }, []);

  // Função para calcular valor de despesa específica por mês
  const getExpenseValueByDescription = (month: number, description: string) => {
    return expenses.filter((e: any) => e.month === month && e.description === description)
                  .reduce((sum: number, e: any) => sum + e.value, 0);
  };

  // Calcular totais
  const totalReceitas = rows.filter(r => r.isRevenue).reduce((sum, row) => sum + getRowTotal(row.type), 0);
  const totalDespesas = getRowTotal("despesas");
  const saldoFinal = totalReceitas - totalDespesas;

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">Descrição</TableHead>
              {MONTHS.map((month) => (
                <TableHead key={month} className="text-center min-w-24">
                  {month}
                </TableHead>
              ))}
              <TableHead className="text-center min-w-24 font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.type}>
                <TableCell>{row.label}</TableCell>
                {MONTHS.map((_, index) => {
                  const value = getMonthlyValue(index + 1, row.type);
                  return (
                    <TableCell key={index} className="text-center">
                      {value > 0 ? formatCurrency(value) : "-"}
                    </TableCell>
                  );
                })}
                <TableCell className="text-center font-bold">
                  {formatCurrency(getRowTotal(row.type))}
                </TableCell>
              </TableRow>
            ))}
            
            {/* Linhas de Despesas Individuais */}
            {uniqueExpenses.map((expense: any) => (
              <TableRow key={expense.description}>
                <TableCell className="text-red-600">{expense.description}</TableCell>
                {MONTHS.map((_, index) => {
                  const value = getExpenseValueByDescription(index + 1, expense.description);
                  return (
                    <TableCell key={index} className="text-center">
                      {value > 0 ? formatCurrency(value) : "-"}
                    </TableCell>
                  );
                })}
                <TableCell className="text-center font-bold text-red-600">
                  {formatCurrency(
                    MONTHS.reduce((sum, _, index) => 
                      sum + getExpenseValueByDescription(index + 1, expense.description), 0
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {/* Linha de Total dos Gastos */}
            <TableRow className="border-t-2">
              <TableCell className="font-bold">Total dos Gastos</TableCell>
              {MONTHS.map((_, index) => {
                const value = getMonthlyValue(index + 1, "despesas");
                return (
                  <TableCell key={index} className="text-center font-bold">
                    {value > 0 ? formatCurrency(value) : "-"}
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-bold text-red-600">
                {formatCurrency(totalDespesas)}
              </TableCell>
            </TableRow>

            {/* Linha de Saldo */}
            <TableRow className="border-t-2 bg-muted/50">
              <TableCell className="font-bold">Saldo</TableCell>
              {MONTHS.map((_, index) => {
                const receitas = rows.filter(r => r.isRevenue).reduce((sum, row) => sum + getMonthlyValue(index + 1, row.type), 0);
                const despesas = getMonthlyValue(index + 1, "despesas");
                const saldo = receitas - despesas;
                return (
                  <TableCell key={index} className={`text-center font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(saldo)}
                  </TableCell>
                );
              })}
              <TableCell className={`text-center font-bold text-lg ${saldoFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(saldoFinal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
