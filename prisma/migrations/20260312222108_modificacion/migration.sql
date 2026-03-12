/*
  Warnings:

  - The `state` column on the `Ruta` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RutaState" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'FINALIZADO');

-- AlterTable
ALTER TABLE "Ruta" DROP COLUMN "state",
ADD COLUMN     "state" "RutaState" NOT NULL DEFAULT 'PENDIENTE';
