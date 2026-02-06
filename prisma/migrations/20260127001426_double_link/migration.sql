/*
  Warnings:

  - You are about to drop the column `magicToken` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[editorToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[viewerToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_magicToken_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "magicToken",
ADD COLUMN     "editorToken" TEXT,
ADD COLUMN     "viewerToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_editorToken_key" ON "users"("editorToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_viewerToken_key" ON "users"("viewerToken");
