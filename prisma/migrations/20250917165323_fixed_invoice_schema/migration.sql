/*
  Warnings:

  - You are about to drop the column `address` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `billTo` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `companyAddress` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyEmail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceSerialNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toCompany` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toEmail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Made the column `quantity` on table `InvoiceItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" DROP COLUMN "address",
DROP COLUMN "billTo",
ADD COLUMN     "additionalNotes" TEXT,
ADD COLUMN     "companyAddress" TEXT NOT NULL,
ADD COLUMN     "companyEmail" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "companyPhone" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'CAD',
ADD COLUMN     "invoiceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoiceNumber" TEXT NOT NULL,
ADD COLUMN     "invoicePrefix" TEXT NOT NULL DEFAULT 'INV-',
ADD COLUMN     "invoiceSerialNumber" TEXT NOT NULL,
ADD COLUMN     "paymentTerms" TEXT NOT NULL DEFAULT 'Due upon receipt',
ADD COLUMN     "toAddress" TEXT,
ADD COLUMN     "toCompany" TEXT NOT NULL,
ADD COLUMN     "toEmail" TEXT NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."InvoiceItem" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;
