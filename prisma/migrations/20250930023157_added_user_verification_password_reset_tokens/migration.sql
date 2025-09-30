-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailToken" TEXT,
ADD COLUMN     "passwordToken" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);
