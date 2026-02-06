import { PrismaService, prisma } from "./prisma.service";
import type { ExtraReceipt, ExtraReceiptInput } from "../types";

class ExtraReceiptService extends PrismaService<ExtraReceipt, ExtraReceiptInput> {
  protected model = prisma.extraReceipt;

  async getAll(): Promise<ExtraReceipt[]> {
    try {
      return await this.model.findMany({
        orderBy: { receiptDate: 'desc' }
      });
    } catch (error) {
      console.error("Error fetching extra receipts:", error);
      return [];
    }
  }

  async getByStudentId(studentId: string): Promise<ExtraReceipt[]> {
    try {
      return await this.model.findMany({
        where: { studentId },
        orderBy: { receiptDate: 'desc' }
      });
    } catch (error) {
      console.error("Error fetching extra receipts by student:", error);
      return [];
    }
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<ExtraReceipt[]> {
    try {
      return await this.model.findMany({
        where: {
          receiptDate: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { receiptDate: 'desc' }
      });
    } catch (error) {
      console.error("Error fetching extra receipts by date range:", error);
      return [];
    }
  }
}

export const extraReceiptService = new ExtraReceiptService();
