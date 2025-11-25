-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "jobStatus" "public"."JobStatus" DEFAULT 'ACTIVE';
