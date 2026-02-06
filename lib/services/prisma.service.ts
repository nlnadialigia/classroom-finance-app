import prisma from "../db/prisma";

export abstract class PrismaService<T, TInput> {
  protected abstract model: any;

  async getAll(): Promise<T[]> {
    try {
      return await this.model.findMany();
    } catch (error) {
      console.error(`Error fetching ${this.model.name}:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching ${this.model.name}:`, error);
      return null;
    }
  }

  async getByFilter(filter: any): Promise<T[]> {
    try {
      return await this.model.findMany({
        where: filter,
      });
    } catch (error) {
      console.error(`Error fetching ${this.model.name}:`, error);
      return [];
    }
  }

  async create(data: TInput): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  async update(id: string, data: Partial<TInput>): Promise<void> {
    await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }
}

export { prisma };
