"use server";

import { verifyPassword } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { userService } from "../services/user-service";

export async function loginAction(formData: FormData): Promise<void> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = await userService.getUserByFilter(username);

  if (!user || !user.password) {
    logger.error("Usuário não encontrado ou sem senha", 'AUTH', { username });
    redirect("/login?error=invalid");
  }

  const isValid = verifyPassword(password, user.password);

  if (!isValid) {
    logger.error("Senha inválida", 'AUTH', { username });
    redirect("/login?error=invalid");
  }

  // Criar sessão usando a nova função
  await createSession(user.id, user.role);

  logger.auth(`Login bem-sucedido`, { username: user.username, role: user.role });

  // Redirect baseado no role
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}