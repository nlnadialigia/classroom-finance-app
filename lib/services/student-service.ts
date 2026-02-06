import z from "zod";
import type {
  ExtraReceipt,
  FullStudent,
  MonthlyReceipt,
  Student,
  studentIncludeFieldSchema,
  StudentInput,
} from "../types";
import { prisma, PrismaService } from "./prisma.service";

class StudentService extends PrismaService<Student, StudentInput> {
  protected model = prisma.student;

  async getStudentsWithInclude(
    userId: string,
    field: z.infer<typeof studentIncludeFieldSchema>,
  ): Promise<FullStudent[]> {
    try {
      const students = await this.model.findMany({
        where: { userId },
        include: { [field]: true },
        orderBy: { name: "asc" },
      });
      return students as unknown as FullStudent[];
    } catch (error) {
      console.error("Error fetching students with include:", error);
      return [];
    }
  }

  async getStudentsWithReceipt(
    userId: string,
  ) {
    try {
      const fullStudents = await this.model.findMany({
        where: { userId },
        include: { extraReceipts: true, monthlyReceipts: true },
      });

      if (fullStudents.length === 0) {
        return null;
      }

      const allExtraReceipts: ExtraReceipt[] = [];
      const allMonthlyReceipts: MonthlyReceipt[] = [];
      const students: Student[] = [];

      for (const student of fullStudents) {
        const {
          extraReceipts: studentExtraReceipts,
          monthlyReceipts: studentMonthlyReceipts,
          ...rest } = student;

        if (studentExtraReceipts.length > 0) {
          allExtraReceipts.push(...studentExtraReceipts);
        }
        if (studentMonthlyReceipts.length > 0) {
          allMonthlyReceipts.push(...studentMonthlyReceipts);
        }
        students.push(rest);
      }

      return { students, extraReceipts: allExtraReceipts, monthlyReceipts: allMonthlyReceipts };
    } catch (error) {
      console.error("Error fetching student with include:", error);
      return null;
    }
  }
}

export const studentService = new StudentService();
