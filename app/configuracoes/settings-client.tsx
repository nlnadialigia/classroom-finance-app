"use client";

import { StudentFormDialog } from "@/components/settings/student-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/hooks/use-permissions";
import type {
  FullStudent,
  Student,
} from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsData {
  students: Student[];
  userId: string;
}

interface SettingsClientProps {
  initialData: SettingsData;
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  const { canEdit } = usePermissions();
  const [selectedStudent, setSelectedStudent] = useState<
    FullStudent | undefined
  >();
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [year, setYear] = useState<string>("");
  const [monthlyValue, setMonthlyValue] = useState<string>("");
  const [previousBalance, setPreviousBalance] = useState<string>("");
  const queryClient = useQueryClient();

  const userId = initialData.userId;

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["config", userId],
    queryFn: async () => {
      const response = await fetch(`/api/config?userId=${userId}`);
      return response.json();
    },
  });

  const { data: students = initialData.students, isLoading: studentsLoading } = useQuery({
    queryKey: ["students", userId],
    queryFn: async () => {
      const response = await fetch(`/api/students?userId=${userId}`);
      return response.json();
    },
    initialData: initialData.students,
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (data: { year: number; monthlyValue: number; previousBalance: number; }) => {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Configuração salva com sucesso");
      queryClient.invalidateQueries({ queryKey: ["config"] });
      setIsEditingConfig(false);
      setYear("");
      setMonthlyValue("");
      setPreviousBalance("");
    },
    onError: () => {
      toast.error("Erro ao salvar configuração");
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Aluno deletado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao deletar aluno");
    },
  });

  const handleEditStudent = (student: FullStudent) => {
    setSelectedStudent(student);
    setStudentDialogOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudentMutation.mutate(id);
  };

  const handleCloseDialogs = () => {
    setStudentDialogOpen(false);
    setSelectedStudent(undefined);
  };

  const handleSaveConfig = () => {
    if (year && monthlyValue) {
      saveConfigMutation.mutate({
        year: parseInt(year),
        monthlyValue: parseFloat(monthlyValue),
        previousBalance: parseFloat(previousBalance) || 0
      });
    }
  };

  const handleEditConfig = () => {
    setIsEditingConfig(true);
    if (config) {
      setYear(config.year?.toString() || "");
      setMonthlyValue(config.monthlyValue?.toString() || "");
      setPreviousBalance(config.previousBalance?.toString() || "");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingConfig(false);
    setYear("");
    setMonthlyValue("");
    setPreviousBalance("");
  };

  const generateBadge = (isMonthlyReceipt: boolean) => {
    if (isMonthlyReceipt) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure o ano letivo, valor mensal, saldo inicial e gerencie os alunos
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Card Configurações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure o ano letivo, valor da mensalidade e saldo inicial
              </CardDescription>
            </div>
            {!isEditingConfig && config && canEdit && (
              <Button onClick={handleEditConfig} variant="outline">
                <Pencil className="size-4 mr-2" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {configLoading ? (
              // Skeleton loading
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : !config && !isEditingConfig ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Nenhuma configuração encontrada
                </p>
                <Button onClick={() => setIsEditingConfig(true)}>
                  <Plus className="size-4 mr-2" />
                  Adicionar Configuração
                </Button>
              </div>
            ) : isEditingConfig ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">Ano Letivo</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyValue">Valor Mensal (R$)</Label>
                  <Input
                    id="monthlyValue"
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={monthlyValue}
                    onChange={(e) => setMonthlyValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="previousBalance">Saldo Inicial (R$)</Label>
                  <Input
                    id="previousBalance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={previousBalance}
                    onChange={(e) => setPreviousBalance(e.target.value)}
                  />
                </div>
                <div className="md:col-span-3 flex gap-2">
                  <Button onClick={handleSaveConfig} className="flex-1">
                    <Save className="size-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Ano Letivo</Label>
                  <p className="text-2xl font-semibold">{config.year}</p>
                </div>
                <div>
                  <Label>Valor Mensal</Label>
                  <p className="text-2xl font-semibold">R$ {config.monthlyValue?.toFixed(2).replace(".", ",")}</p>
                </div>
                <div>
                  <Label>Saldo Inicial</Label>
                  <p className="text-2xl font-semibold">R$ {config.previousBalance?.toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card Alunos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alunos</CardTitle>
            <CardDescription>Gerencie os alunos do sistema</CardDescription>
          </div>
          {canEdit && (
            <Button onClick={() => setStudentDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Novo Aluno
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            // Skeleton loading para tabela de estudantes
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Recebimento Mensal</TableHead>
                  {canEdit && <TableHead>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student: FullStudent) => {
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={"secondary"}
                          className={generateBadge(student.isMonthlyReceipt)}
                        >
                          {student.isMonthlyReceipt ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      {canEdit && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="border-green-700"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Pencil className="size-4" color="green" />
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-500"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="size-4" color="red" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={canEdit ? 3 : 2} className="text-center text-muted-foreground">
                    Nenhum aluno cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <StudentFormDialog
        open={studentDialogOpen}
        onOpenChange={setStudentDialogOpen}
        student={selectedStudent}
        onClose={handleCloseDialogs}
        userId={initialData.userId}
      />
    </div>
  );
}
