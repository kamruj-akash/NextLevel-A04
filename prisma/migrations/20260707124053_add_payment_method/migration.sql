-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'STRIPE';
