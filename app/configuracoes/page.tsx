export const dynamic = "force-dynamic";

import { Navigation } from "@/components/navigation";
import { userService } from "@/lib/services/user-service";
import { getSession } from "@/lib/session";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await getSession();
  const userId = session?.user.id as string;
  const user = await userService.getFullUser(userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <SettingsClient
          initialData={{
            students: user?.students ?? [],
            userId,
          }}
        />
      </main>
    </div>
  );
}
