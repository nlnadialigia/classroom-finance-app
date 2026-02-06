/*
  Warnings:

  - A unique constraint covering the columns `[magicToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'VIEWER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "magicToken" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_magicToken_key" ON "users"("magicToken");
