export const dynamic = "force-dynamic";

import { Navigation } from '@/components/navigation';
import prisma from '@/lib/db/prisma';
import { configService } from '@/lib/services/config-service';
import { expenseService } from '@/lib/services/expense-service';
import { studentService } from '@/lib/services/student-service';
import { getSession } from '@/lib/session';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.user.id as string;

  const [rows, expensesData, config, incomes] = await Promise.all([
    studentService.getStudentsWithReceipt(userId),
    expenseService.getByFilter({ userId }),
    configService.findFirst({ where: { userId } }),
    prisma.income.findMany({ where: { userId }, orderBy: { month: 'asc' } }),
  ]);

  const students = rows?.students ?? [];
  const monthlyReceipts = rows?.monthlyReceipts ?? [];
  const extraReceipts = rows?.extraReceipts ?? [];
  const expenses = expensesData ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <DashboardClient
          initialData={{
            students,
            monthlyReceipts,
            extraReceipts,
            expenses,
            config,
            incomes,
            userId
          }}
        />
      </main>
    </div>
  );
}
