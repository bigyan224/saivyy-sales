/*
  Warnings:

  - Added the required column `category` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sale" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "client" TEXT NOT NULL;
