-- CreateEnum
CREATE TYPE "EstadoParteTrabajo" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TipoTrabajo" AS ENUM ('OBRA', 'MANTENIMIENTO', 'CORRECTIVO', 'VISITAS');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('EXTINTORES', 'INCENDIO', 'ROBO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'TRABAJADOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVO', 'INACTIVO', 'OFFLINE');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('FEMENINO', 'MASCULINO');

-- CreateEnum
CREATE TYPE "StateContract" AS ENUM ('APROBADO', 'EN_PROGRESO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "TipoVehiculo" AS ENUM ('MECANICO', 'AUTOMATICO');

-- CreateEnum
CREATE TYPE "ReporteState" AS ENUM ('APROBADO', 'EN_PROGRESO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "StatusChecking" AS ENUM ('APROBADO', 'EN_PROGRESO', 'PENDIENTE');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "genre" "Genre" DEFAULT 'FEMENINO',
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state_contract" "StateContract" NOT NULL DEFAULT 'PENDIENTE',
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checking" (
    "id" SERIAL NOT NULL,
    "initial_hour" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "status_checking" "StatusChecking" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporteId" INTEGER NOT NULL,

    CONSTRAINT "Checking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "initial_hour" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "final_hour" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkingId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "work_type" "TipoTrabajo" NOT NULL DEFAULT 'OBRA',
    "tools" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "state_report" "ReporteState" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facturacion" (
    "id" SERIAL NOT NULL,
    "facture_parts" INTEGER NOT NULL,
    "facture_work_parts" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facturacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParteTrabajo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "state" "EstadoParteTrabajo" NOT NULL DEFAULT 'PENDIENTE',
    "type_work" "TipoTrabajo" NOT NULL DEFAULT 'OBRA',
    "category" "Categoria" NOT NULL DEFAULT 'EXTINTORES',
    "docs" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "articuleId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "factureId" INTEGER NOT NULL,
    "routeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParteTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "in_charge" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "factureId" INTEGER NOT NULL,
    "tools" TEXT[],
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comments" TEXT NOT NULL,
    "state" "EstadoParteTrabajo" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'user name',
    "lastname" TEXT NOT NULL DEFAULT 'user lastname',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "status" "Status" NOT NULL DEFAULT 'INACTIVO',
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role"[] DEFAULT ARRAY['ADMINISTRADOR']::"Role"[],
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" SERIAL NOT NULL,
    "type" "TipoVehiculo" NOT NULL DEFAULT 'MECANICO',
    "matricule" TEXT NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articulo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zona" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Zona_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reporte_checkingId_key" ON "Reporte"("checkingId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_phone_key" ON "Usuario"("phone");

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_checkingId_fkey" FOREIGN KEY ("checkingId") REFERENCES "Checking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_articuleId_fkey" FOREIGN KEY ("articuleId") REFERENCES "Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facturacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParteTrabajo" ADD CONSTRAINT "ParteTrabajo_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facturacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
