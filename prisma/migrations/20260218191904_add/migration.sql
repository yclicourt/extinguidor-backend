-- DropForeignKey
ALTER TABLE "ParteTrabajo" DROP CONSTRAINT "ParteTrabajo_articuleId_fkey";

-- AlterTable
ALTER TABLE "ParteTrabajo" ALTER COLUMN "articuleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_articuleId_fkey" FOREIGN KEY ("articuleId") REFERENCES "Articulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
