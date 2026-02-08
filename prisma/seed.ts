import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Seeding 30 registros con reglas de negocio...');

  /* ───────────────── CLEAN DEV ───────────────── */
  await prisma.reporte.deleteMany();
  await prisma.checking.deleteMany();
  await prisma.ruta.deleteMany();
  await prisma.facturacion.deleteMany();
  await prisma.parteTrabajo.deleteMany();
  await prisma.articulo.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.cliente.deleteMany();

  /* ───────────────── USUARIOS ───────────────── */
  const admin = await prisma.usuario.create({
    data: {
      name: 'Admin',
      lastname: 'Sistema',
      email: 'admin@extinguidor.cl',
      phone: '900000000',
      address: 'Casa Central',
      password: 'hashed_password',
      status: 'ACTIVO',
      role: ['ADMINISTRADOR'],
    },
  });

  const workers = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.usuario.create({
        data: {
          name: `Worker${i + 1}`,
          lastname: 'Tecnico',
          email: `worker${i + 1}@extinguidor.cl`,
          phone: `90000000${i + 1}`,
          address: 'Zona Operativa',
          password: 'hashed_password',
          status: 'ACTIVO',
          role: ['TRABAJADOR'],
        },
      }),
    ),
  );

  /* ───────────────── VEHÍCULOS ───────────────── */
  const vehicles = await Promise.all(
    ['EXT-101', 'EXT-202', 'EXT-303'].map((plate) =>
      prisma.vehiculo.create({
        data: {
          type: 'MECANICO',
          matricule: plate,
        },
      }),
    ),
  );

  /* ───────────────── CLIENTES ───────────────── */
  const clients = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.cliente.create({
        data: {
          name: `Cliente ${i + 1}`,
          lastname: 'Empresa',
          genre: 'MASCULINO',
          address: `Av. Seguridad ${100 + i}`,
        },
      }),
    ),
  );

  /* ───────────────── ARTÍCULOS ───────────────── */
  const articles = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.articulo.create({
        data: {
          title: `Extintor Tipo ${i + 1}`,
          description: 'Extintor certificado',
        },
      }),
    ),
  );

  /* ───────────────── 30 PARTES / RUTAS ───────────────── */
  for (let i = 0; i < 30; i++) {
    const client = clients[i % clients.length];
    const worker = workers[i % workers.length];
    const vehicle = vehicles[i % vehicles.length];
    const article = articles[i % articles.length];

    const date = new Date();
    date.setDate(date.getDate() + (i % 15) + 1);

    // PARTE
    const part = await prisma.parteTrabajo.create({
      data: {
        title: `Parte #${i + 1}`,
        description: 'Trabajo programado',
        clientId: client.id,
        address: client.address,
        date,
        state: 'PENDIENTE',
        type_work: 'MANTENIMIENTO',
        category: 'EXTINTORES',
        docs: 'doc.pdf',
        image: 'image.jpg',
        articuleId: article.id,
        comment: 'Generado por seed',
        amount_facture_parte: 50000,
      },
    });

    // FACTURA
    const facture = await prisma.facturacion.create({
      data: {
        facture_parts: 1,
        facture_work_parts: 1,
        facture_amount: part.amount_facture_parte,
      },
    });

    // RUTA
    const route = await prisma.ruta.create({
      data: {
        title: `Ruta Día ${i + 1}`,
        in_charge: `${worker.name} ${worker.lastname}`,
        userId: worker.id,
        vehicleId: vehicle.id,
        factureId: facture.id,
        tools: ['Manómetro', 'Llave'],
        amount_facture_route: part.amount_facture_parte,
        comments: 'Ruta generada automáticamente',
        state: 'PENDIENTE',
        parts: {
          connect: { id: part.id },
        },
      },
    });

    // CHECKING
    const checking = await prisma.checking.create({
      data: {
        location: client.address,
        status_checking: 'EN_PROGRESO',
      },
    });

    // REPORTE
    await prisma.reporte.create({
      data: {
        title: `Reporte Parte #${i + 1}`,
        description: 'Trabajo realizado correctamente',
        checkingId: checking.id,
        clientId: client.id,
        userId: worker.id,
        vehicleId: vehicle.id,
        tools: 'Herramientas estándar',
        state_report: 'APROBADO',
      },
    });
  }

  console.log('✅ Seed completado: 30 registros creados');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });