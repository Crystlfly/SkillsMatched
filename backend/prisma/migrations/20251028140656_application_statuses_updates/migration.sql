/*
  Warnings:

  - The values [UNDER_REVIEW,SHORTLISTED,OFFERED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ApplicationStatus_new" AS ENUM ('APPLIED', 'INTERVIEW_SCHEDULED', 'HIRED', 'REJECTED');
ALTER TABLE "public"."Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Application" ALTER COLUMN "status" TYPE "public"."ApplicationStatus_new" USING ("status"::text::"public"."ApplicationStatus_new");
ALTER TYPE "public"."ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "public"."ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "public"."ApplicationStatus_old";
ALTER TABLE "public"."Application" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
COMMIT;
