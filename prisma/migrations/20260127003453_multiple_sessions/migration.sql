/*
  Warnings:

  - A unique constraint covering the columns `[userId,role]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sessions_userId_key";

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'EDITOR';

-- CreateIndex
CREATE UNIQUE INDEX "sessions_userId_role_key" ON "sessions"("userId", "role");
