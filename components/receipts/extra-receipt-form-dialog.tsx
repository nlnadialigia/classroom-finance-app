"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface ExtraReceiptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  editingReceipt?: any;
}

export function ExtraReceiptFormDialog({ open, onOpenChange, userId, editingReceipt }: ExtraReceiptFormDialogProps) {
  const queryClient = useQueryClient();
  const [studentId, setStudentId] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split("T")[0]);
  const [pendingReceipts, setPendingReceipts] = useState<any[]>([]);

  // Preencher campos quando editando
  React.useEffect(() => {
    if (editingReceipt) {
      setStudentId(editingReceipt.studentId || "");
      setDescription(editingReceipt.description || "");
      setValue(editingReceipt.value?.toString() || "");
      setReceiptDate(editingReceipt.receiptDate ? new Date(editingReceipt.receiptDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    } else {
      setStudentId("");
      setDescription("");
      setValue("");
      setReceiptDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingReceipt, open]);

  const { data: students = [] } = useQuery({
    queryKey: ["students", userId],
    queryFn: async () => {
      const response = await fetch(`/api/students?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingReceipt) {
        // Editar recebimento existente
        const response = await fetch(`/api/extra-receipts/${editingReceipt.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Erro ao atualizar recebimento');
        }
        return await response.json();
      } else {
        // Criar novos recebimentos
        const results = [];
        for (const receipt of data) {
          const response = await fetch("/api/extra-receipts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(receipt),
          });
          if (!response.ok) {
            throw new Error('Erro ao salvar recebimento');
          }
          results.push(await response.json());
        }
        return results;
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["extraReceipts", userId] });
      setPendingReceipts([]);
      setStudentId("");
      setDescription("");
      setValue("");
      setReceiptDate(new Date().toISOString().split("T")[0]);
      onOpenChange(false);
      if (editingReceipt) {
        toast.success("Recebimento atualizado com sucesso!");
      } else {
        toast.success(`${Array.isArray(result) ? result.length : 1} recebimento(s) salvo(s) com sucesso!`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingReceipt) {
      // Editar recebimento existente
      if (!studentId || !description || !value || !receiptDate) {
        toast.error('Preencha todos os campos');
        return;
      }
      mutation.mutate({
        studentId,
        description,
        value: parseFloat(value),
        receiptDate,
      });
    } else {
      // Criar novos recebimentos
      if (pendingReceipts.length === 0) {
        toast.error('Adicione pelo menos um recebimento antes de salvar');
        return;
      }
      mutation.mutate(pendingReceipts);
    }
  };

  const handleAddMore = () => {
    if (!studentId || !description || !value || !receiptDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    const newReceipt = {
      studentId,
      description,
      value: parseFloat(value),
      receiptDate: new Date(receiptDate),
    };

    setPendingReceipts(prev => [...prev, newReceipt]);
    setStudentId("");
    setDescription("");
    setValue("");
    setReceiptDate(new Date().toISOString().split("T")[0]);
    toast.success('Recebimento adicionado à lista');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingReceipt ? "Editar Recebimento Extra" : "Adicionar Recebimento Extra"}</DialogTitle>
          <DialogDescription>{editingReceipt ? "Edite os dados do recebimento" : "Adicione recebimentos extras ou avulsos"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingReceipt && pendingReceipts.length > 0 && (
            <div className="bg-muted p-3 rounded space-y-3">
              <h4 className="font-medium">Recebimentos a salvar:</h4>
              <ul className="text-sm space-y-1">
                {pendingReceipts.map((receipt, index) => {
                  const student = Array.isArray(students) ? students.find(s => s.id === receipt.studentId) : null;
                  return (
                    <li key={index} className="flex justify-between">
                      <span>{student?.name} - {receipt.description}</span>
                      <span>R$ {receipt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                  );
                })}
              </ul>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Salvando..." : `Salvar ${pendingReceipts.length} Recebimento(s)`}
              </Button>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="student">Aluno</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Material Didático"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="50.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Data do Recebimento</Label>
            <Input
              id="date"
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {!editingReceipt && (
              <Button
                type="button"
                onClick={handleAddMore}
                className="flex-1"
              >
                Adicionar à Lista
              </Button>
            )}
            {editingReceipt && (
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
