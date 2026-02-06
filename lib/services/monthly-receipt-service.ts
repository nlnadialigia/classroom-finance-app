import type { MonthlyReceipt, MonthlyReceiptInput } from "../types";
import { PrismaService, prisma } from "./prisma.service";

class MonthlyReceiptService extends PrismaService<MonthlyReceipt, MonthlyReceiptInput> {
  protected model = prisma.monthlyReceipt;

  async getAll(): Promise<MonthlyReceipt[]> {
    try {
      return await this.model.findMany({
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      });
    } catch (error) {
      console.error("Error fetching monthly receipts:", error);
      return [];
    }
  }

  async getByStudentId(studentId: string): Promise<MonthlyReceipt[]> {
    try {
      return await this.model.findMany({
        where: { studentId },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      });
    } catch (error) {
      console.error("Error fetching monthly receipts by student:", error);
      return [];
    }
  }

  async getByMonthYear(month: number, year: number): Promise<MonthlyReceipt[]> {
    try {
      return await this.model.findMany({
        where: { month, year },
      });
    } catch (error) {
      console.error("Error fetching monthly receipts by month/year:", error);
      return [];
    }
  }

  async markAsPaid(id: string, paymentDate: Date): Promise<void> {
    await this.model.update({
      where: { id },
      data: {
        paid: true,
        paymentDate
      }
    });
  }

  async markAsUnpaid(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: {
        paid: false,
        paymentDate: null
      }
    });
  }
}

export const monthlyReceiptService = new MonthlyReceiptService();
