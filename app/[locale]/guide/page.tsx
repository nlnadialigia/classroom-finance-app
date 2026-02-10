export const dynamic = 'force-dynamic';

import { Navigation } from '@/components/navigation';
import { OrientacaoClient } from './orientacao-client';

export default async function OrientacaoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <OrientacaoClient />
      </main>
    </div>
  );
}
