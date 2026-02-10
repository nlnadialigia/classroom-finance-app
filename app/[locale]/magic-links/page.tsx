export const dynamic = "force-dynamic";

import { Navigation } from "@/components/navigation";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { MagicLinksClient } from "./magic-links-client";

export default async function MagicLinksPage() {
  const session = await getSession();
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-6">
        <MagicLinksClient />
      </main>
    </div>
  );
}
