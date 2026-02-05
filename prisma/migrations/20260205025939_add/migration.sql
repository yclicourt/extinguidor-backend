/*
  Warnings:

  - Added the required column `facture_amount` to the `Facturacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facturacion" ADD COLUMN     "facture_amount" INTEGER NOT NULL;
