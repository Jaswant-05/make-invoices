-- CreateEnum
CREATE TYPE "public"."Plan" AS ENUM ('FREE', 'BASIC', 'PLUS', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."Frequency" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('TRAIL', 'PAID', 'ENDED');

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripe_sub_id" TEXT NOT NULL,
    "plan" "public"."Plan" NOT NULL,
    "frequency" "public"."Frequency" NOT NULL,
    "Status" "public"."Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "public"."Subscription"("userId");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
