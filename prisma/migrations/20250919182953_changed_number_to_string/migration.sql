/*
  Warnings:

  - You are about to drop the column `country_code` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "country_code",
ALTER COLUMN "number" SET DATA TYPE TEXT;
