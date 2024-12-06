/*
  Warnings:

  - You are about to drop the column `amount` on the `ProductPrice` table. All the data in the column will be lost.
  - Added the required column `price` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductPrice" DROP COLUMN "amount",
ADD COLUMN     "price" INTEGER NOT NULL;
