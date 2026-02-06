import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import type { Classroom, Student, Expense, MonthlyReceipt } from "@/lib/types"

// Classrooms Hooks
export function useClassrooms() {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: () => api.getClassrooms(),
  })
}

export function useCreateClassroom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Classroom, "id" | "createdAt" | "updatedAt">) => api.createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
    },
  })
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Classroom> }) => api.updateClassroom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
    },
  })
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] })
    },
  })
}

// Students Hooks
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => api.getStudents(),
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => api.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) => api.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })
}

// Receipts & Expenses Hooks
export function useMonthlyReceipts(month: number, year: number) {
  return useQuery({
    queryKey: ["monthly-receipts", month, year],
    queryFn: () => api.getMonthlyReceipts(month, year),
  })
}

export function useSaveMonthlyReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<MonthlyReceipt, "id" | "createdAt" | "updatedAt">) => api.saveMonthlyReceipt(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["monthly-receipts", variables.month, variables.year] })
    },
  })
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.getExpenses(),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Expense, "id" | "createdAt" | "updatedAt">) => api.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    },
  })
}
