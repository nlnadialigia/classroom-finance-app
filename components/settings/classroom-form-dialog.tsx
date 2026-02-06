"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
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
import type { Classroom } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ClassroomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  classroom?: Classroom;
  userId: string;
}

export function ClassroomFormDialog({ open, onOpenChange, classroom, userId }: ClassroomFormDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(classroom?.name || "");
  const [monthlyValue, setMonthlyValue] = useState(classroom?.monthlyValue?.toString() || "");
  const [year, setYear] = useState(classroom?.year?.toString() || "");

  const mutation = useMutation({
    mutationFn: async () => {
      if (classroom) {
        const response = await fetch(`/api/classrooms/${classroom.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            monthlyValue: Number.parseFloat(monthlyValue),
            year: Number.parseInt(year),
            userId,
          }),
        });
        return response.json();
      } else {
        const response = await fetch("/api/classrooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            monthlyValue: Number.parseFloat(monthlyValue),
            year: Number.parseInt(year),
            userId,
          }),
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      onOpenChange(false);
      setName("");
      setMonthlyValue("");
      setYear("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
    } catch (error) {
      logger.error("Error saving classroom:", "CLASSROOM", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{classroom ? "Editar Sala" : "Nova Sala"}</DialogTitle>
          <DialogDescription>
            {classroom ? "Atualize as informações da sala" : "Adicione uma nova sala de aula"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Sala</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Turma A - Matemática"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2023"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyValue">Valor Mensal (R$)</Label>
              <Input
                id="monthlyValue"
                type="number"
                step="0.01"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
                placeholder="350.00"
                required
              />
            </div>
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
