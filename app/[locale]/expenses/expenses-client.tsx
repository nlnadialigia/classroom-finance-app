"use client";

import { ExpenseFormDialog } from "@/components/expenses/expense-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermissions } from "@/hooks/use-permissions";
import { Config } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useTranslations } from "next-intl";

interface ExpensesData {
  expenses: any[];
  userId: string;
  config: Config | null;
}

interface ExpensesClientProps {
  initialData: ExpensesData;
}

export function ExpensesClient({ initialData }: ExpensesClientProps) {
  const t = useTranslations();
  const { canEdit } = usePermissions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: expenses = initialData.expenses } = useQuery({
    queryKey: ["expenses", initialData.userId],
    queryFn: async () => {
      const response = await fetch(`/api/expenses?userId=${initialData.userId}`);
      return response.json();
    },
    initialData: initialData.expenses,
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const handleDeleteExpense = (id: string) => {
    if (confirm(t('expenses.confirmDelete'))) {
      deleteExpenseMutation.mutate(id);
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  const totalExpenses = expenses.reduce((sum: any, expense: { value: any; }) => sum + expense.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('expenses.title')}</h1>
          <p className="text-muted-foreground">{t('expenses.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-bold">
              <p>{t('common.labels.year')}:</p>
              <p>{initialData.config?.year}</p>
            </div>
          </div>
          {canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              {t('expenses.newExpense')}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('expenses.listTitle')}</CardTitle>
          <CardDescription>
            {t('expenses.totalExpenses')}: <span className="font-bold">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.labels.date')}</TableHead>
                <TableHead>{t('common.labels.description')}</TableHead>
                <TableHead className="text-right">{t('common.labels.value')}</TableHead>
                {canEdit && <TableHead className="text-right">{t('common.labels.actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense: { classroomId: any; id: Key | null | undefined; paymentDate: string | number | Date; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; value: number; }) => {
                return (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.paymentDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                            disabled={deleteExpenseMutation.isPending}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id as string)}
                            disabled={deleteExpenseMutation.isPending}
                          >
                            <Trash2 className="size-4" color="red" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              <TableRow className="border-t-2 bg-muted/50">
                <TableCell colSpan={canEdit ? 3 : 2} className="font-bold">
                  {t('common.labels.total').toUpperCase()}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canEdit && (
        <ExpenseFormDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          userId={initialData.userId}
          editingExpense={editingExpense}
        />
      )}
    </div>
  );
}
