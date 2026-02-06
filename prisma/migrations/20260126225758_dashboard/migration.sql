-- CreateEnum
CREATE TYPE "income_enum" AS ENUM ('INCOME', 'PREVIOUS');

-- AlterTable
ALTER TABLE "config" ADD COLUMN     "previous_balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "income" (
    "id" TEXT NOT NULL,
    "type" "income_enum" NOT NULL DEFAULT 'INCOME',
    "value" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "income_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
