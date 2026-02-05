/*
  Warnings:

  - Added the required column `amount_facture_parte` to the `ParteTrabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount_facture_route` to the `Ruta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParteTrabajo" ADD COLUMN     "amount_facture_parte" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ruta" ADD COLUMN     "amount_facture_route" INTEGER NOT NULL;
