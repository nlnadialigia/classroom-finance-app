import { Navigation } from '@/components/navigation';
import { configService } from '@/lib/services/config-service';
import { expenseService } from '@/lib/services/expense-service';
import { getSession } from '@/lib/session';
import { ExpensesClient } from './expenses-client';

export const dynamic = 'force-dynamic';

export default async function GastosPage() {
  const session = await getSession();
  const userId = session?.user.id as string;

  const [expenses, config] = await Promise.all([
    expenseService.getByFilter({ userId }),
    configService.findFirst({ where: { userId } })
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <ExpensesClient
          initialData={{
            expenses,
            userId,
            config
          }}
        />
      </main>
    </div>
  );
}
