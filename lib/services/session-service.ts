import logger from "../logger";
import { Session, SessionInput } from "../types";
import { prisma, PrismaService } from "./prisma.service";

class SessionService extends PrismaService<Session, SessionInput> {
  protected model = prisma.session;

  async getSessionById(id: string) {
    logger.database("Buscando a sessão do usuário");

    const session = await this.model.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
            publicSlug: true,
          },
        },
      },
    });
    return session ?? null;
  }

  async recreateSession(session: SessionInput) {
    logger.database("Recriando a sessão do usuário");

    const existingSession = await this.model.findFirst({
      where: { userId: session.userId },
    });

    if (existingSession) {
      await this.model.delete({ where: { id: existingSession.id } });
    }

    const newSession = await this.model.create({
      data: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
      },
    });

    return newSession;
  }
}

export const sessionService = new SessionService();