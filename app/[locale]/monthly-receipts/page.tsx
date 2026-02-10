export const dynamic = 'force-dynamic';

import { Navigation } from '@/components/navigation';
import { configService } from '@/lib/services/config-service';
import { studentService } from '@/lib/services/student-service';
import { getSession } from '@/lib/session';
import { MonthlyReceiptsClient } from './monthly-receipts-client';

export default async function MonthlyReceiptPage() {
  const session = await getSession();

  const userId = session?.user.id as string;

  const [students, config] = await Promise.all([
    studentService.getStudentsWithInclude(userId, 'monthlyReceipts'),
    configService.findFirst({ where: { userId } })
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <MonthlyReceiptsClient
          initialData={{
            students,
            userId,
            config
          }}
        />
      </main>
    </div>
  );
}
