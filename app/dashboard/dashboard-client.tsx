"use client";

import { DRETable } from "@/components/dashboard/dre-table";
import { IncomeModals } from "@/components/dashboard/income-modals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Config, Expense, ExtraReceipt, MonthlyReceipt, Student } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { getLocalMonth } from "@/utils/date";

interface DashboardData {
  students: Student[];
  monthlyReceipts: MonthlyReceipt[];
  extraReceipts: ExtraReceipt[];
  expenses: Expense[];
  config: Config | null;
  incomes: any[];
  userId: string;
}

interface DashboardClientProps {
  initialData: DashboardData;
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const { canEdit } = usePermissions();
  const [previousIncomeOpen, setPreviousIncomeOpen] = useState(false);
  const [rendimentosOpen, setRendimentosOpen] = useState(false);

  const year = initialData.config?.year || new Date().getFullYear();

  const { data: incomes = initialData.incomes } = useQuery({
    queryKey: ["incomes", initialData.userId],
    queryFn: async () => {
      const response = await fetch(`/api/incomes?userId=${initialData.userId}`);
      return response.json();
    },
    initialData: initialData.incomes,
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", initialData.userId],
    queryFn: async () => {
      const response = await fetch(`/api/expenses?userId=${initialData.userId}`);
      return response.json();
    },
    initialData: initialData.expenses || [],
  });

  // Preparar dados para a tabela DRE
  const dreData = {
    config: {
      monthlyValue: initialData.config?.monthlyValue || 0,
      previousBalance: initialData.config?.previousBalance || 0,
    },
    monthlyReceipts: initialData.monthlyReceipts.map(r => ({
      month: r.month,
      value: r.value,
    })),
    extraReceipts: initialData.extraReceipts.map(r => ({
      month: getLocalMonth(r.receiptDate),
      value: r.value,
    })),
    incomes,
    expenses: Array.isArray(expenses) ? expenses.map((e: Expense) => ({
      month: getLocalMonth(e.paymentDate),
      value: e.value,
      description: e.description,
    })) : [],
  };

  // Calcular saldo líquido igual ao da tabela DRE (saldo de dezembro)
  const totalReceitas = dreData.monthlyReceipts.reduce((sum, r) => sum + r.value, 0) +
    dreData.extraReceipts.reduce((sum, r) => sum + r.value, 0) +
    incomes.reduce((sum: number, i: any) => sum + i.value, 0);

  const totalDespesas = dreData.expenses.reduce((sum, e) => sum + e.value, 0);

  const saldoLiquidoTabela = dreData.config.previousBalance + totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resumo Financeiro {year}</h1>
          <p className="text-muted-foreground">
            Resumo de receitas, despesas e rendimentos
          </p>
        </div>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <Button onClick={() => setPreviousIncomeOpen(true)} variant="outline">
                <Plus className="size-4 mr-2" />
                Recebidos Ano Anterior
              </Button>
              <Button onClick={() => setRendimentosOpen(true)} variant="outline">
                <TrendingUp className="size-4 mr-2" />
                Rendimentos
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Inicial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {dreData.config.previousBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoLiquidoTabela >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldoLiquidoTabela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela DRE */}
      <Card>
        <CardHeader>
          <CardTitle>Demonstração do Resultado do Exercício</CardTitle>
          <CardDescription>
            Receitas e despesas detalhadas por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DRETable data={dreData} />
        </CardContent>
      </Card>

      {/* Links Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/recebimento-mensal" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium">Recebimento Mensal</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/recebimento-extra" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium">Recebimento Extra</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/gastos" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium">Gastos</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/configuracoes" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium">Configurações</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Modais */}
      {canEdit && (
        <IncomeModals
          userId={initialData.userId}
          previousIncomeOpen={previousIncomeOpen}
          setPreviousIncomeOpen={setPreviousIncomeOpen}
          rendimentosOpen={rendimentosOpen}
          setRendimentosOpen={setRendimentosOpen}
        />
      )}
    </div>
  );
}
