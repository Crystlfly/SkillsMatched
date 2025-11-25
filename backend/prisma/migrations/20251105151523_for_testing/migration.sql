/*
  Warnings:

  - A unique constraint covering the columns `[candiId]` on the table `JobPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."JobPreference" ADD COLUMN     "candiId" INTEGER,
ADD COLUMN     "resumeUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "JobPreference_candiId_key" ON "public"."JobPreference"("candiId");

-- AddForeignKey
ALTER TABLE "public"."JobPreference" ADD CONSTRAINT "JobPreference_candiId_fkey" FOREIGN KEY ("candiId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
