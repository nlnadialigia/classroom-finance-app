"use client"

import React from "react"
import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ExpenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  editingExpense?: any
}

export function ExpenseFormDialog({ open, onOpenChange, userId, editingExpense }: ExpenseFormDialogProps) {
  const queryClient = useQueryClient()
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [pendingExpenses, setPendingExpenses] = useState<any[]>([])

  // Preencher campos quando editando
  React.useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description || "")
      setValue(editingExpense.value?.toString() || "")
      setPaymentDate(editingExpense.paymentDate ? new Date(editingExpense.paymentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0])
    } else {
      setDescription("")
      setValue("")
      setPaymentDate(new Date().toISOString().split("T")[0])
    }
  }, [editingExpense, open])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingExpense) {
        // Editar gasto existente
        const response = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          throw new Error('Erro ao atualizar gasto')
        }
        return await response.json()
      } else {
        // Criar novos gastos
        const results = []
        for (const expense of data) {
          const response = await fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense),
          })
          if (!response.ok) {
            throw new Error('Erro ao salvar gasto')
          }
          results.push(await response.json())
        }
        return results
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", userId] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setPendingExpenses([])
      setDescription("")
      setValue("")
      setPaymentDate(new Date().toISOString().split("T")[0])
      onOpenChange(false)
      if (editingExpense) {
        toast.success("Gasto atualizado com sucesso!")
      } else {
        toast.success(`${Array.isArray(result) ? result.length : 1} gasto(s) salvo(s) com sucesso!`)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingExpense) {
      // Editar gasto existente
      if (!description || !value || !paymentDate) {
        toast.error('Preencha todos os campos')
        return
      }
      mutation.mutate({
        description,
        value: parseFloat(value),
        paymentDate,
        userId,
      })
    } else {
      // Criar novos gastos
      if (pendingExpenses.length === 0) {
        toast.error('Adicione pelo menos um gasto antes de salvar')
        return
      }
      mutation.mutate(pendingExpenses)
    }
  }

  const handleAddMore = () => {
    if (!description || !value || !paymentDate) {
      toast.error('Preencha todos os campos')
      return
    }

    const newExpense = {
      userId,
      description,
      value: parseFloat(value),
      paymentDate: new Date(paymentDate),
    }

    setPendingExpenses(prev => [...prev, newExpense])
    setDescription("")
    setValue("")
    setPaymentDate(new Date().toISOString().split("T")[0])
    toast.success('Gasto adicionado à lista')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingExpense ? "Editar Gasto" : "Adicionar Gasto"}</DialogTitle>
          <DialogDescription>{editingExpense ? "Edite os dados do gasto" : "Adicione gastos ou despesas"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingExpense && pendingExpenses.length > 0 && (
            <div className="bg-muted p-3 rounded space-y-3">
              <h4 className="font-medium">Gastos a salvar:</h4>
              <ul className="text-sm space-y-1">
                {pendingExpenses.map((expense, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{expense.description}</span>
                    <span>R$ {expense.value.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "Salvando..." : `Salvar ${pendingExpenses.length} Gasto(s)`}
              </Button>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Material de Escritório"
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
              placeholder="150.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Data do Pagamento</Label>
            <Input
              id="date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {!editingExpense && (
              <Button
                type="button"
                onClick={handleAddMore}
                className="flex-1"
              >
                Adicionar à Lista
              </Button>
            )}
            {editingExpense && (
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
  )
}
