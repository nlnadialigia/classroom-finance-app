import { Config } from "@prisma/client";
import { prisma, PrismaService } from "./prisma.service";

type ConfigInput = Omit<Config, "id">;

class ConfigService extends PrismaService<Config, ConfigInput> {
  protected model = prisma.config;

  async findFirst(filter: any): Promise<Config | null> {
    try {
      return await this.model.findFirst(filter);
    } catch (error) {
      console.error(`Error fetching ${this.model}:`, error);
      return null;
    }
  }

  async upSert(userId: string, year: number, monthlyValue: number, previousBalance?: number): Promise<Config> {
    try {
      return await prisma.config.upsert({
        where: { userId },
        update: {
          year,
          monthlyValue,
          previousBalance: previousBalance ?? 0
        },
        create: {
          userId,
          year,
          monthlyValue,
          previousBalance: previousBalance ?? 0
        }
      });
    } catch (error) {
      console.error(`Error saving ${this.model}:`, error);
      throw error;
    }
  }
}

export const configService = new ConfigService();