"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getLocalMonth } from "@/utils/date";

interface IncomeModalsProps {
  userId: string;
  previousIncomeOpen: boolean;
  setPreviousIncomeOpen: (open: boolean) => void;
  rendimentosOpen: boolean;
  setRendimentosOpen: (open: boolean) => void;
}

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export function IncomeModals({
  userId,
  previousIncomeOpen,
  setPreviousIncomeOpen,
  rendimentosOpen,
  setRendimentosOpen,
}: IncomeModalsProps) {
  const [previousIncomeData, setPreviousIncomeData] = useState({
    date: "",
    value: "",
    description: "",
  });

  const [rendimentosData, setRendimentosData] = useState({
    value: "",
    month: "",
  });

  const queryClient = useQueryClient();

  const createIncomeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Registro salvo com sucesso");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Erro ao salvar registro");
    },
  });

  const handlePreviousIncomeSubmit = () => {
    if (!previousIncomeData.date || !previousIncomeData.value) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const month = getLocalMonth(previousIncomeData.date);

    createIncomeMutation.mutate({
      type: "PREVIOUS",
      value: parseFloat(previousIncomeData.value),
      month,
      description: previousIncomeData.description,
    });

    setPreviousIncomeData({ date: "", value: "", description: "" });
    setPreviousIncomeOpen(false);
  };

  const handleRendimentosSubmit = () => {
    if (!rendimentosData.value || !rendimentosData.month) {
      toast.error("Preencha todos os campos");
      return;
    }

    createIncomeMutation.mutate({
      type: "INCOME",
      value: parseFloat(rendimentosData.value),
      month: parseInt(rendimentosData.month),
    });

    setRendimentosData({ value: "", month: "" });
    setRendimentosOpen(false);
  };

  return (
    <>
      {/* Modal Recebidos do Ano Anterior */}
      <Dialog open={previousIncomeOpen} onOpenChange={setPreviousIncomeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recebidos do Ano Anterior</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={previousIncomeData.date}
                onChange={(e) =>
                  setPreviousIncomeData({ ...previousIncomeData, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={previousIncomeData.value}
                onChange={(e) =>
                  setPreviousIncomeData({ ...previousIncomeData, value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição do recebimento..."
                value={previousIncomeData.description}
                onChange={(e) =>
                  setPreviousIncomeData({ ...previousIncomeData, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePreviousIncomeSubmit} className="flex-1">
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviousIncomeOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Rendimentos */}
      <Dialog open={rendimentosOpen} onOpenChange={setRendimentosOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rendimentos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rendimento-value" className="mr-2">Valor (R$)</Label>
              <Input
                id="rendimento-value"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={rendimentosData.value}
                onChange={(e) =>
                  setRendimentosData({ ...rendimentosData, value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="month">Mês</Label>
              <Select
                value={rendimentosData.month}
                onValueChange={(value) =>
                  setRendimentosData({ ...rendimentosData, month: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRendimentosSubmit} className="flex-1">
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setRendimentosOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
