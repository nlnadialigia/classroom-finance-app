"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logger from "@/lib/logger";
import type { FullStudent } from "@/lib/types";
import { getMonthNames } from "@/utils/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  student?: FullStudent;
  userId: string;
}

export function StudentFormDialog({ open, onOpenChange, student, userId }: StudentFormDialogProps) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const months = getMonthNames(locale);
  const [name, setName] = useState(student?.name || "");
  const [isMonthlyReceipt, setIsMonthlyReceipt] = useState(student?.isMonthlyReceipt ?? true);
  const [monthlyPeriods, setMonthlyPeriods] = useState<number[]>(
    student?.monthlyPeriods || [1,2,3,4,5,6,7,8,9,10,11,12]
  );

  useEffect(() => {
    if (open) {
      if (student) {
        setName(student.name);
        setIsMonthlyReceipt(student.isMonthlyReceipt);
        setMonthlyPeriods(student.monthlyPeriods || [1,2,3,4,5,6,7,8,9,10,11,12]);
      } else {
        setName("");
        setIsMonthlyReceipt(true);
        setMonthlyPeriods([1,2,3,4,5,6,7,8,9,10,11,12]);
      }
    }
  }, [open, student]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (student) {
        const response = await fetch(`/api/students/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            isMonthlyReceipt,
            monthlyPeriods,
          }),
        });
        return response.json();
      } else {
        const response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            isMonthlyReceipt,
            monthlyPeriods,
            userId,
          }),
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
    } catch (error) {
      logger.error("Error saving student:", "STUDENT", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{student ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
          <DialogDescription>
            {student ? "Atualize as informações do aluno" : "Adicione um novo aluno à sala"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Aluno</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="monthly"
                checked={isMonthlyReceipt}
                onCheckedChange={(checked) => setIsMonthlyReceipt(checked as boolean)}
              />
              <Label htmlFor="monthly" className="cursor-pointer">
                Aluno com recebimento mensal
              </Label>
            </div>
            {isMonthlyReceipt && (
              <div className="grid gap-2">
                <Label>Meses de contribuição</Label>
                <div className="grid grid-cols-4 gap-2">
                  {months.map((month, index) => {
                    const monthNumber = index + 1;
                    const isSelected = monthlyPeriods.includes(monthNumber);
                    return (
                      <div key={month} className="flex items-center gap-2">
                        <Checkbox
                          id={`month-${monthNumber}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setMonthlyPeriods(prev => [...prev, monthNumber].sort());
                            } else {
                              setMonthlyPeriods(prev => prev.filter(m => m !== monthNumber));
                            }
                          }}
                        />
                        <Label htmlFor={`month-${monthNumber}`} className="cursor-pointer text-sm">
                          {month.substring(0, 3)}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
