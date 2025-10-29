/*
  Warnings:

  - The `benefits` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requirements` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "benefits",
ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[];
