"use server";

import { verifyPassword } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { createSession } from "@/lib/session";
import { redirect as nextRedirect } from "next/navigation";
import { cookies } from "next/headers";
import { userService } from "../services/user-service";

export async function loginAction(formData: FormData): Promise<void> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await userService.getUserByFilter(username);

  if (!user || !user.password) {
    logger.error("Usuário não encontrado ou sem senha", 'AUTH', { username });
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";
    nextRedirect(`/${locale}/login?error=invalid`);
  }

  const isValid = verifyPassword(password, user.password);

  if (!isValid) {
    logger.error("Senha inválida", 'AUTH', { username });
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";
    nextRedirect(`/${locale}/login?error=invalid`);
  }

  // Criar sessão usando a nova função
  await createSession(user.id, user.role);

  logger.auth(`Login bem-sucedido`, { username: user.username, role: user.role });

  // Get locale for redirect
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt";

  // Redirect baseado no role
  if (user.role === "ADMIN") {
    nextRedirect(`/${locale}/admin`);
  } else {
    nextRedirect(`/${locale}/dashboard`);
  }
}