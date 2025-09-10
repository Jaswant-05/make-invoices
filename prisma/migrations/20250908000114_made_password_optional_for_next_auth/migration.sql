-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "country_code" DROP NOT NULL,
ALTER COLUMN "number" DROP NOT NULL;
