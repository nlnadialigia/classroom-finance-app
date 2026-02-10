export const dynamic = 'force-dynamic'

import { userService } from '@/lib/services/user-service'
import { Navigation } from '@/components/navigation'
import { AdminClient } from './admin-client'

export default async function AdminPage() {
  const users = await userService.getAll()

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <AdminClient 
          initialUsers={users}
        />
      </main>
    </div>
  )
}
