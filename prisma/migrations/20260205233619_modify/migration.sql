-- DropForeignKey
ALTER TABLE "ParteTrabajo" DROP CONSTRAINT "ParteTrabajo_factureId_fkey";

-- DropForeignKey
ALTER TABLE "ParteTrabajo" DROP CONSTRAINT "ParteTrabajo_routeId_fkey";

-- AlterTable
ALTER TABLE "Checking" ALTER COLUMN "reporteId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ParteTrabajo" ALTER COLUMN "factureId" DROP NOT NULL,
ALTER COLUMN "routeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facturacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Ruta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
