"use client";

import { ExtraReceiptFormDialog } from "@/components/receipts/extra-receipt-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePermissions } from "@/hooks/use-permissions";
import { Config } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Plus, Trash2 } from "lucide-react";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { toast } from "sonner";

interface ExtraReceiptsData {
  students: any[];
  extraReceipts: any[];
  userId: string;
  config: Config | null;
}

interface ExtraReceiptsClientProps {
  initialData: ExtraReceiptsData;
}

export function ExtraReceiptsClient({ initialData }: ExtraReceiptsClientProps) {
  const { canEdit } = usePermissions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ["students", initialData.userId],
    queryFn: async () => {
      const response = await fetch(`/api/students?userId=${initialData.userId}`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
    initialData: initialData.students || [],
  });

  const { data: extraReceipts = [] } = useQuery({
    queryKey: ["extraReceipts", initialData.userId],
    queryFn: async () => {
      const response = await fetch(`/api/extra-receipts?userId=${initialData.userId}`);
      if (!response.ok) throw new Error('Failed to fetch extra receipts');
      return response.json();
    },
    initialData: initialData.extraReceipts || [],
  });

  const deleteReceiptMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/extra-receipts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error('Erro ao excluir recebimento');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extraReceipts", initialData.userId] });
      toast.success("Recebimento excluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir recebimento");
    }
  });

  // Filter receipts for selected year
  const yearReceipts = Array.isArray(extraReceipts) ? extraReceipts.filter((r: { receiptDate: string | number | Date; }) => {
    const date = new Date(r.receiptDate);
    return date.getFullYear() === initialData.config?.year;
  }) : [];

  const totalValue = yearReceipts.reduce((sum: any, receipt: { value: any; }) => sum + receipt.value, 0);

  const handleEdit = (receipt: any) => {
    setEditingReceipt(receipt);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este recebimento?")) {
      deleteReceiptMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingReceipt(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Recebimento Extra</h1>
          <p className="text-muted-foreground">Controle de recebimentos extras dos alunos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-bold">
              <p>Ano:</p>
              <p>{initialData.config?.year}</p>
            </div>
          </div>
          {canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Novo Recebimento
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recebimentos Extras de {initialData.config?.year}</CardTitle>
          <CardDescription>
            Total arrecadado: <span className="font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                {canEdit && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearReceipts.map((receipt: { studentId: any; id: Key | null | undefined; receiptDate: string | number | Date; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; value: number; }) => {
                const student = Array.isArray(students) ? students.find((s: { id: any; }) => s.id === receipt.studentId) : null;
                return (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      {format(new Date(receipt.receiptDate), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {student?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{receipt.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      {receipt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(receipt)}
                            disabled={deleteReceiptMutation.isPending}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(receipt.id as string)}
                            disabled={deleteReceiptMutation.isPending}
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
                <TableCell colSpan={canEdit ? 4 : 3} className="font-bold">
                  TOTAL
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExtraReceiptFormDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        userId={initialData.userId}
        editingReceipt={editingReceipt}
      />
    </div>
  );
}
