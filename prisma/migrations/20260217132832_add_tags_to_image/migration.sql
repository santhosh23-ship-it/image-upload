-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
