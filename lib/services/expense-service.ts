import { PrismaService, prisma } from "./prisma.service";
import type { Expense } from "../types";

class ExpenseService extends PrismaService<Expense, Omit<Expense, "id" | "createdAt" | "updatedAt">> {
  protected model = prisma.expense;

  async getAll(): Promise<Expense[]> {
    try {
      return await this.model.findMany({
        orderBy: { paymentDate: 'desc' }
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
  }

  async getByClassroomId(classroomId: string): Promise<Expense[]> {
    try {
      return await this.model.findMany({
        where: { classroomId },
        orderBy: { paymentDate: 'desc' }
      });
    } catch (error) {
      console.error("Error fetching expenses by classroom:", error);
      return [];
    }
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    try {
      return await this.model.findMany({
        where: {
          paymentDate: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { paymentDate: 'desc' }
      });
    } catch (error) {
      console.error("Error fetching expenses by date range:", error);
      return [];
    }
  }
}

export const expenseService = new ExpenseService();
