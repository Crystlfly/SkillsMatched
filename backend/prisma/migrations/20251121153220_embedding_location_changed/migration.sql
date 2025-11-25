/*
  Warnings:

  - You are about to drop the column `embedding` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JobPreference" ADD COLUMN     "embedding" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "embedding";
