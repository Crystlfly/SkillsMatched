-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "about" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "respnsblts" TEXT[] DEFAULT ARRAY[]::TEXT[];
