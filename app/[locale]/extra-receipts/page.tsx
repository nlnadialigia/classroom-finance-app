export const dynamic = 'force-dynamic';

import { Navigation } from '@/components/navigation';
import { configService } from '@/lib/services/config-service';
import { extraReceiptService } from '@/lib/services/extra-receipt-service';
import { studentService } from '@/lib/services/student-service';
import { getSession } from '@/lib/session';
import { ExtraReceiptsClient } from './extra-receipts-client';

export default async function ExtraReceiptPage() {
  const session = await getSession();
  const userId = session?.user.id as string;

  const [students, extraReceipts, config] = await Promise.all([
    studentService.getStudentsWithInclude(userId, 'extraReceipts'),
    extraReceiptService.getByFilter({ student: { userId } }),
    configService.findFirst({ where: { userId } })
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <ExtraReceiptsClient
          initialData={{
            students,
            extraReceipts,
            userId,
            config
          }}
        />
      </main>
    </div>
  );
}
