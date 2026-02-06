import logger from "../logger";
import type { FullUser, User, UserInput, UserList } from "../types";
import { PrismaService, prisma } from "./prisma.service";

class UserService extends PrismaService<UserList, UserInput> {
  protected model = prisma.user;

  async getAll(): Promise<UserList[]> {
    try {
      const users = await this.model.findMany({
        orderBy: { username: "asc" }
      });

      if (!users) {
        return [];
      }

      return users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        publicSlug: user.publicSlug,
      }));
    } catch (error) {
      logger.error("Error fetching users:", "DATABASE", error);
      return [];
    }
  }

  async getUserByFilter(username: string): Promise<User | null> {
    try {
      const user = await this.model.findUnique({
        where: { username }
      });

      return user ?? null;
    } catch (error) {
      logger.error("Error fetching user:", "DATABASE", error);
      return null;
    }
  }

  async getFullUser(id: string): Promise<FullUser | null> {
    try {
      const user = await this.model.findUnique({
        where: { id },
        include: {
          students: true
        }
      });

      return user ?? null;
    } catch (error) {
      logger.error("Error fetching user:", "DATABASE", error);
      return null;
    }
  }
}

export const userService = new UserService();
