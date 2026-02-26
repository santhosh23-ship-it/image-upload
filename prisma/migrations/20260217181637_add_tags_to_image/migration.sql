/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "imageUrls";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
