"use server";

import { cookies } from "next/headers";
import logger from "../logger";
import { sessionService } from "../services/session-service";
import { redirect as nextRedirect } from "next/navigation";

export async function logout() {
  logger.auth("Logout iniciado");

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    await sessionService.delete(sessionId);

    cookieStore.delete("session_id");
    logger.session("Sessão removida", {sessionId});
  }

  // Get locale from cookie or default to 'pt'
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";
  nextRedirect(`/${locale}/login`);
}
