import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Seeding con reglas de negocio...');

  /* ─────────────────────────────
   * LIMPIEZA (DEV ONLY)
   * ───────────────────────────── */
  await prisma.reporte.deleteMany();
  await prisma.checking.deleteMany();
  await prisma.ruta.deleteMany();
  await prisma.facturacion.deleteMany();
  await prisma.parteTrabajo.deleteMany();
  await prisma.articulo.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.cliente.deleteMany();

  /* ─────────────────────────────
   * USUARIOS
   * ───────────────────────────── */
  const admin = await prisma.usuario.create({
    data: {
      name: 'Admin',
      lastname: 'Extinguidor',
      email: 'admin@extinguidor.cl',
      phone: '900000001',
      address: 'Casa Central',
      password: 'hashed_password',
      status: 'ACTIVO',
      role: ['ADMINISTRADOR'],
    },
  });

  const worker = await prisma.usuario.create({
    data: {
      name: 'Pedro',
      lastname: 'Técnico',
      email: 'pedro@extinguidor.cl',
      phone: '900000002',
      address: 'Zona Norte',
      password: 'hashed_password',
      status: 'ACTIVO',
      role: ['TRABAJADOR'],
    },
  });

  /* ─────────────────────────────
   * VEHÍCULO
   * ───────────────────────────── */
  const vehicle = await prisma.vehiculo.create({
    data: {
      type: 'MECANICO',
      matricule: 'EXT-2024',
    },
  });

  /* ─────────────────────────────
   * CLIENTE (ACTIVO IMPLÍCITO)
   * ───────────────────────────── */
  const client = await prisma.cliente.create({
    data: {
      name: 'Empresa Seguridad Total',
      lastname: 'SpA',
      genre: 'MASCULINO',
      address: 'Av. Prevención 456',
    },
  });

  /* ─────────────────────────────
   * ARTÍCULO
   * ───────────────────────────── */
  const article = await prisma.articulo.create({
    data: {
      title: 'Extintor PQS 6kg',
      description: 'Extintor normado para incendios clase ABC',
    },
  });

  /* ─────────────────────────────
   * PARTE DE TRABAJO (FECHA FUTURA)
   * ───────────────────────────── */
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 2);

  const part = await prisma.parteTrabajo.create({
    data: {
      title: 'Revisión de Extintores',
      description: 'Inspección y certificación anual',
      clientId: client.id,
      address: client.address,
      date: futureDate,
      state: 'PENDIENTE',
      type_work: 'MANTENIMIENTO',
      category: 'EXTINTORES',
      docs: 'certificado.pdf',
      image: 'revision.jpg',
      articuleId: article.id,
      comment: 'Trabajo programado',
      amount_facture_parte: 60000,
    },
  });

  /* ─────────────────────────────
   * FACTURACIÓN
   * ───────────────────────────── */
  const facture = await prisma.facturacion.create({
    data: {
      facture_parts: 1,
      facture_work_parts: 1,
      facture_amount: part.amount_facture_parte,
    },
  });

  /* ─────────────────────────────
   * RUTA (ENCARGADO OBLIGATORIO)
   * ───────────────────────────── */
  const route = await prisma.ruta.create({
    data: {
      title: 'Ruta Industrial Día 1',
      in_charge: `${worker.name} ${worker.lastname}`,
      userId: worker.id,
      vehicleId: vehicle.id,
      factureId: facture.id,
      tools: ['Manómetro', 'Destornillador'],
      amount_facture_route: part.amount_facture_parte,
      comments: 'Ruta creada desde seed',
      state: 'PENDIENTE',
      parts: {
        connect: { id: part.id }, // un parte → una ruta
      },
    },
  });

  /* ─────────────────────────────
   * CHECKING
   * ───────────────────────────── */
  const checking = await prisma.checking.create({
    data: {
      location: client.address,
      status_checking: 'EN_PROGRESO',
    },
  });

  /* ─────────────────────────────
   * REPORTE (1–1 con Checking)
   * ───────────────────────────── */
  await prisma.reporte.create({
    data: {
      title: 'Reporte Revisión Extintores',
      description: 'Revisión realizada sin observaciones',
      checkingId: checking.id,
      clientId: client.id,
      userId: worker.id,
      vehicleId: vehicle.id,
      tools: 'Herramientas certificadas',
      state_report: 'APROBADO',
    },
  });

  console.log('✅ Seed con reglas de negocio completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
