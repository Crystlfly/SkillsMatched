-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FullTime', 'PartTime', 'Contract', 'Internship');

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "benefits" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "requirements" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" "public"."JobType" NOT NULL DEFAULT 'FullTime';
