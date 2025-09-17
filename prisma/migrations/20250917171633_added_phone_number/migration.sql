/*
  Warnings:

  - You are about to drop the column `companyPhone` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" DROP COLUMN "companyPhone",
ADD COLUMN     "companyNumber" TEXT;
