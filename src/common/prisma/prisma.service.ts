import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Conexión a base de datos exitosa');
    } catch (error) {
      console.error('❌ Error al conectar con Prisma:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
