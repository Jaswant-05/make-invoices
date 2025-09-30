-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "tax" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_with_tax" INTEGER NOT NULL DEFAULT 0;
