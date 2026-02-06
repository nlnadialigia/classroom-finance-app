import { z } from "zod";

export const studentIncludeFieldSchema = z.enum([
  "user",
  "monthlyReceipts",
  "extraReceipts",
]);

export const expenseSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  value: z.number().min(0, "Value must be non-negative"),
  paymentDate: z.date(),
});

export const studentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Student name is required"),
  isMonthlyReceipt: z.boolean(),
  monthlyPeriods: z.array(z.number().min(1).max(12)).default([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  userId: z.string(),
});

export const monthlyReceiptSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number(),
  value: z.number().min(0, "Value must be non-negative"),
  paymentDate: z.date().nullable(),
  paid: z.boolean(),
});

export const extraReceiptSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  description: z.string().min(1, "Description is required"),
  value: z.number().min(0, "Value must be non-negative"),
  receiptDate: z.date(),
});

export const fullStudentSchema = studentSchema.extend({
  monthlyReceipts: z.array(monthlyReceiptSchema).nullable(),
  extraReceipt: z.array(extraReceiptSchema).nullable(),
});

export const getStudentsWithIncludeSchema = z.object({
  userId: z.string(),
  field: studentIncludeFieldSchema,
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
  role: z.string().default("EDITOR"),
  publicSlug: z.string().nullable(),
});

export const userListSchema = userSchema.omit({
  password: true,
});

export const fullUserSchema = userSchema.extend({
  students: studentSchema.array().nullable(),
});

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
});

export const configSchema = z.object({
  id: z.string(),
  year: z.number(),
  monthlyValue: z.number(),
  previousBalance: z.number(),
  userId: z.string(),
});

export const roleMap = {
  ADMIN: "Admin",
  EDITOR: "Usuário",
  VIEWER: "Usuário",
};

export type Student = z.infer<typeof studentSchema>;
export type StudentInput = Omit<Student, "id">;
export type FullStudent = z.infer<typeof fullStudentSchema>;
export type StudentsWithInclude = z.infer<typeof getStudentsWithIncludeSchema>;
export type StudentFieldEnum = z.infer<typeof studentIncludeFieldSchema>;

export type MonthlyReceipt = z.infer<typeof monthlyReceiptSchema>;
export type MonthlyReceiptInput = Omit<MonthlyReceipt, "id">;

export type ExtraReceipt = z.infer<typeof extraReceiptSchema>;
export type ExtraReceiptInput = Omit<ExtraReceipt, "id">;

export type Expense = z.infer<typeof expenseSchema>;
export type ExpenseInput = Omit<Expense, "id">;

export type User = z.infer<typeof userSchema>;
export type UserInput = Omit<User, "id" | "url">;
export type UserList = z.infer<typeof userListSchema>;
export type FullUser = z.infer<typeof fullUserSchema>;

export type Session = z.infer<typeof sessionSchema>;
export type SessionInput = Omit<Session, "token">;

export type Config = z.infer<typeof configSchema>;
export type ConfigInput = Omit<Config, "id">;
