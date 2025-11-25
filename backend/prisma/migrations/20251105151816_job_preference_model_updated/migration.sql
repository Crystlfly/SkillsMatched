/*
  Warnings:

  - Made the column `candiId` on table `JobPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resumeUrl` on table `JobPreference` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."JobPreference" DROP CONSTRAINT "JobPreference_candiId_fkey";

-- AlterTable
ALTER TABLE "public"."JobPreference" ALTER COLUMN "candiId" SET NOT NULL,
ALTER COLUMN "resumeUrl" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."JobPreference" ADD CONSTRAINT "JobPreference_candiId_fkey" FOREIGN KEY ("candiId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
