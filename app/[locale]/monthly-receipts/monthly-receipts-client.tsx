"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/hooks/use-permissions";
import { Config, FullStudent, Student } from "@/lib/types";
import { getMonthNames } from "@/utils/date";
import { useMutation } from "@tanstack/react-query";
import { Download, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

interface MonthlyReceiptsData {
  students: FullStudent[];
  userId: string;
  config: Config | null;
}

interface MonthlyReceiptsClientProps {
  initialData: MonthlyReceiptsData;
}

export function MonthlyReceiptsClient({
  initialData,
}: MonthlyReceiptsClientProps) {
  const t = useTranslations();
  const { canEdit } = usePermissions();
  const locale = useLocale();
  const months = getMonthNames(locale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState(initialData.students);
  const [pendingReceipts, setPendingReceipts] = useState<any[]>([]);
  const [editingReceipt, setEditingReceipt] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedStudentReport, setSelectedStudentReport] = useState<any>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    month: "",
    value: "",
    paymentDate: "",
  });

  const monthlyStudents = Array.isArray(students) ? students.filter((s: Student) => s.isMonthlyReceipt) : [];

  // Criar matriz de dados para a tabela
  const tableData = monthlyStudents.map((student: FullStudent) => {
    const monthlyReceipts = student.monthlyReceipts;

    if (monthlyReceipts) {
      const studentReceipts = monthlyReceipts.filter(
        (r) => r.year === initialData.config?.year,
      );
      const monthlyData = months.map((_, index) => {
        const monthNumber = index + 1;
        const isInPeriod = student.monthlyPeriods?.includes(monthNumber) ?? true;
        const receipt = studentReceipts.find((r) => r.month === monthNumber);
        return {
          month: monthNumber,
          receipt,
          paid: receipt?.paid || false,
          value: receipt?.value || 0,
          paymentDate: receipt?.paymentDate,
          isInPeriod,
        };
      });
      return {
        student,
        monthlyData,
        totalPaid: studentReceipts.filter((r) => r.paid).length,
        totalValue: studentReceipts
          .filter((r) => r.paid)
          .reduce((sum, r) => sum + r.value, 0),
      };
    }
    return {
      student,
      monthlyData: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        receipt: null,
        paid: false,
        value: 0,
        paymentDate: null,
        isInPeriod: student.monthlyPeriods?.includes(index + 1) ?? true,
      })),
      totalPaid: 0,
      totalValue: 0,
    };
  });

  const yearTotal = tableData.reduce(
    (sum: number, row: any) => sum + row.totalValue,
    0,
  );

  const totalPrevisto = monthlyStudents.reduce((total, student) => {
    const periodsCount = student.monthlyPeriods?.length || 12;
    return total + (initialData.config?.monthlyValue || 0) * periodsCount;
  }, 0);

  const addReceiptMutation = useMutation({
    mutationFn: async (receipts: any[]) => {
      const results = [];
      for (const receipt of receipts) {
        const response = await fetch("/api/monthly-receipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...receipt,
            year: initialData.config?.year,
            paid: true,
          }),
        });
        if (!response.ok) {
          throw new Error(t('common.errors.saveError'));
        }
        results.push(await response.json());
      }
      return results;
    },
    onSuccess: async (newReceipts) => {
      // Atualiza estado local com todos os novos recebimentos
      setStudents(prevStudents =>
        prevStudents.map(student => {
          const studentReceipts = newReceipts.filter(r => r.studentId === student.id);
          if (studentReceipts.length > 0) {
            return {
              ...student,
              monthlyReceipts: [...(student.monthlyReceipts || []), ...studentReceipts]
            };
          }
          return student;
        })
      );
      // Limpa recebimentos pendentes e formulário
      setPendingReceipts([]);
      setFormData({ studentId: "", month: "", value: "", paymentDate: "" });
      setIsModalOpen(false);
      toast.success(t('monthlyReceipts.receiptsSaved', { count: newReceipts.length }));
    },
  });

  const updateReceiptMutation = useMutation({
    mutationFn: async (data: { id: string; value: number; paymentDate: string; }) => {
      const response = await fetch(`/api/monthly-receipts/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: data.value,
          paymentDate: new Date(data.paymentDate),
        }),
      });
      if (!response.ok) {
        throw new Error(t('common.errors.updateError'));
      }
      return response.json();
    },
    onSuccess: (updatedReceipt) => {
      setStudents(prevStudents =>
        prevStudents.map(student => ({
          ...student,
          monthlyReceipts: student.monthlyReceipts?.map(receipt =>
            receipt.id === updatedReceipt.id ? updatedReceipt : receipt
          ) || []
        }))
      );
      setEditModalOpen(false);
      setEditingReceipt(null);
      toast.success(t('monthlyReceipts.receiptUpdated'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingReceipts.length === 0) {
      toast.error(t('monthlyReceipts.addAtLeastOne'));
      return;
    }
    addReceiptMutation.mutate(pendingReceipts);
  };

  const handleAddMore = () => {
    if (!formData.studentId || !formData.month || !formData.value || !formData.paymentDate) {
      toast.error(t('common.errors.fillAllFields'));
      return;
    }

    const newReceipt = {
      studentId: formData.studentId,
      month: parseInt(formData.month),
      value: parseFloat(formData.value),
      paymentDate: new Date(formData.paymentDate),
    };

    setPendingReceipts(prev => [...prev, newReceipt]);
    setFormData({ studentId: "", month: "", value: "", paymentDate: "" });
    toast.success(t('monthlyReceipts.receiptAddedToList'));
  };

  const handleEditReceipt = (receipt: any, student: any) => {
    setEditingReceipt({
      ...receipt,
      studentName: student.name,
      value: receipt.value.toString(),
      paymentDate: receipt.paymentDate ? new Date(receipt.paymentDate).toISOString().split('T')[0] : '',
    });
    setEditModalOpen(true);
  };

  const handleUpdateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReceipt) return;

    updateReceiptMutation.mutate({
      id: editingReceipt.id,
      value: parseFloat(editingReceipt.value),
      paymentDate: editingReceipt.paymentDate,
    });
  };

  const handleOpenReport = (student: any) => {
    setSelectedStudentReport(student);
    setReportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('monthlyReceipts.title')}</h1>
          <p className="text-muted-foreground">
            {t('monthlyReceipts.description')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <p>{t('common.year')}:</p>
            <p>{initialData.config?.year}</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {canEdit && (
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('monthlyReceipts.addReceipt')}
                </Button>
              </DialogTrigger>
            )}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('monthlyReceipts.addReceipt')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {pendingReceipts.length > 0 && (
                  <div className="bg-muted p-3 rounded space-y-3">
                    <h4 className="font-medium">{t('monthlyReceipts.receiptsToSave')}:</h4>
                    <ul className="text-sm space-y-2">
                      {pendingReceipts.map((receipt, index) => {
                        const student = monthlyStudents.find(s => s.id === receipt.studentId);
                        const monthName = months[receipt.month - 1];
                        return (
                          <li key={index} className="flex justify-between items-center bg-background p-2 rounded border">
                            <div className="flex flex-col">
                              <span className="font-medium">{student?.name} - {monthName}</span>
                              <span className="text-xs text-muted-foreground">
                                {t('common.date')}: {new Date(receipt.paymentDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">R$ {receipt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setPendingReceipts(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                ×
                              </Button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <Button
                      type="submit"
                      disabled={addReceiptMutation.isPending}
                      className="w-full"
                    >
                      {addReceiptMutation.isPending ? t('common.saving') : t('monthlyReceipts.saveReceipts', { count: pendingReceipts.length })}
                    </Button>
                  </div>
                )}
                <div>
                  <Label htmlFor="student" className="pb-2">{t('common.student')}</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, studentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.selectStudent')} />
                    </SelectTrigger>
                    <SelectContent>
                      {monthlyStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="month" className="pb-2">{t('common.competence')}</Label>
                  <Select
                    value={formData.month}
                    onValueChange={(value) =>
                      setFormData({ ...formData, month: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.selectMonth')} />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value" className="pb-2">{t('common.value')}</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paymentDate" className="pb-2">{t('common.paymentDate')}</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddMore}
                    className="flex-1"
                  >
                    {t('monthlyReceipts.addToList')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('monthlyReceipts.editReceipt')}</DialogTitle>
          </DialogHeader>
          {editingReceipt && (
            <form onSubmit={handleUpdateReceipt} className="space-y-4">
              <div>
                <Label>{t('common.student')}</Label>
                <Input value={editingReceipt.studentName} disabled />
              </div>
              <div>
                <Label>{t('common.month')}</Label>
                <Input value={months[editingReceipt.month - 1]} disabled />
              </div>
              <div>
                <Label htmlFor="editValue">{t('common.value')}</Label>
                <Input
                  id="editValue"
                  type="number"
                  step="0.01"
                  value={editingReceipt.value}
                  onChange={(e) =>
                    setEditingReceipt({ ...editingReceipt, value: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="editPaymentDate">{t('common.paymentDate')}</Label>
                <Input
                  id="editPaymentDate"
                  type="date"
                  value={editingReceipt.paymentDate}
                  onChange={(e) =>
                    setEditingReceipt({ ...editingReceipt, paymentDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1"
                >
                  {t('common.buttons.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={updateReceiptMutation.isPending}
                  className="flex-1"
                >
                  {updateReceiptMutation.isPending ? t('common.saving') : t('common.buttons.save')}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Relatório */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('monthlyReceipts.report')} - {selectedStudentReport?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedStudentReport && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{t('monthlyReceipts.studentInfo')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('common.name')}:</span> {selectedStudentReport.name}
                  </div>
                  <div>
                    <span className="font-medium">{t('common.monthlyValue')}:</span> R$ {initialData.config?.monthlyValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                  </div>
                  <div>
                    <span className="font-medium">{t('common.periods')}:</span> {selectedStudentReport.monthlyPeriods?.length || 12} {t('common.months')}
                  </div>
                  <div>
                    <span className="font-medium">{t('common.year')}:</span> {initialData.config?.year}
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{t('monthlyReceipts.paymentsCompleted')}</h3>
                {(() => {
                  const receipts = selectedStudentReport.monthlyReceipts?.filter((r: any) => r.year === initialData.config?.year) || [];
                  const paidReceipts = receipts.filter((r: any) => r.paid);
                  const totalPaid = paidReceipts.reduce((sum: number, r: any) => sum + r.value, 0);

                  return (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {paidReceipts.map((receipt: any) => (
                        <div key={receipt.id} className="flex justify-between items-center text-sm bg-background p-2 rounded">
                          <span>{months[receipt.month - 1]}</span>
                          <span>R$ {receipt.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-muted-foreground">
                            {receipt.paymentDate
                              ? new Date(receipt.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                              : 'Sem data'
                            }
                          </span>
                        </div>
                      ))}
                      {paidReceipts.length > 0 && (
                        <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded font-semibold border-t">
                          <span>{t('monthlyReceipts.totalPaid')}</span>
                          <span>R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span></span>
                        </div>
                      )}
                      {paidReceipts.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          {t('monthlyReceipts.noPayments')}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1"
                >
                  {t('common.buttons.close')}
                </Button>
                <Button
                  onClick={() => {
                    const url = `/api/reports/student/${selectedStudentReport.id}?year=${initialData.config?.year}`;
                    const printWindow = window.open(url, '_blank');
                    printWindow?.addEventListener('load', () => {
                      printWindow.print();
                    });
                  }}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('common.buttons.printPDF')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-1/2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monthlyReceipts.totalExpected')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('monthlyReceipts.totalCollected')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {yearTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('monthlyReceipts.receiptsOf')} {initialData.config?.year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto min-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">
                    {t('common.student')}
                  </TableHead>
                  {months.map((month) => (
                    <TableHead key={month} className="text-center min-w-24">
                      {month.substring(0, 3)}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">{t('common.total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row: any) => (
                  <TableRow key={row.student.id}>
                    <TableCell className="sticky left-0 bg-background font-medium">
                      <button
                        onClick={() => handleOpenReport(row.student)}
                        className="text-left hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {row.student.name}
                      </button>
                    </TableCell>
                    {row.monthlyData.map((data: any) => (
                      <TableCell key={data.month} className="text-center">
                        {!data.isInPeriod ? (
                          <span className="text-muted-foreground">N/A</span>
                        ) : data.receipt ? (
                          <div className="flex flex-col items-center gap-1">
                            <Badge
                              variant={data.paid ? "default" : "secondary"}
                              className="cursor-pointer hover:opacity-80"
                              onClick={() => handleEditReceipt(data.receipt, row.student)}
                            >
                              {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Badge>
                            {data.paymentDate && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(data.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-medium text-green-600">
                      R$ {row.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-muted/50">
                  <TableCell className="sticky left-0 bg-muted/50 font-bold">
                    {t('common.total')}
                  </TableCell>
                  {months.map((_, index) => {
                    const monthNumber = index + 1;
                    const monthTotal = tableData.reduce((sum, row) => {
                      const monthData = row.monthlyData.find((d: any) => d.month === monthNumber);
                      return sum + (monthData?.value || 0);
                    }, 0);
                    return (
                      <TableCell key={monthNumber} className="text-center font-bold">
                        {monthTotal > 0 ? `R$ ${monthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right font-bold text-green-600">
                    R$ {yearTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
