import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class RutasService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create route
  createRouteItem(createRutaDto: CreateRutaDto) {
    return this.prisma.ruta.create({
      data: {
        title: createRutaDto.title,
        in_charge: createRutaDto.in_charge,
        date: createRutaDto.date,
        tools: createRutaDto.tools,
        comments: createRutaDto.comments || '',
        state: createRutaDto.state,
        amount_facture_route: createRutaDto.amount_facture_route,
        facture: {
          connect: {
            id: createRutaDto.factureId,
          },
        },
        users: {
          connect: {
            id: createRutaDto.userId,
          },
        },
        vehicle: {
          connect: {
            id: createRutaDto.vehicleId,
          },
        },
      },
    });
  }

  // Method to get all routes by month
  getAllRouteByMouth(monthIndex: number) {
    const now = new Date();
    const year = now.getUTCFullYear();

    const initial_month = new Date(Date.UTC(year, monthIndex, 1));
    const final_month = new Date(Date.UTC(year, monthIndex + 1, 1));

    return this.prisma.ruta.findMany({
      where: {
        date: {
          gte: initial_month,
          lt: final_month,
        },
      },
    });
  }

  // Method to get all planned routes for day
  getRoutebyDay(dayIndex: number) {
    const now = new Date();
    const day = now.getDay();

    const initial_day = new Date(Date.UTC(day, dayIndex, 1));
    const final_day = new Date(Date.UTC(day, dayIndex + 1, 1));

    return this.prisma.ruta.findMany({
      where: {
        date: {
          gte: initial_day,
          lt: final_day,
        },
      },
    });
  }

  // Method to get all routes
  async getAllRoutesItems(limit: number = 5, skip: number) {
    return await this.prisma.ruta.findMany({
      include: {
        users: {
          select: {
            name: true,
          },
        },
        vehicle: {
          select: {
            matricule: true,
          },
        },
      },
      take: limit,
      skip: skip,
      orderBy: { id: 'asc' },
    });
  }

  // Method to obtain all routes finalices
  async getTotalRoutesFinalize() {
    const count = await this.prisma.ruta.count({
      where: {
        state: 'FINALIZADO',
      },
    });
    return count;
  }

  // Method to obtain stats to chart
  async getRouteStadistics() {
    // Obtenemos el inicio del mes en formato ISO
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Aqui usamos $queryRaw para optimizar mejor la consulta
    const stats = await this.prisma.$queryRaw`
    SELECT 
      EXTRACT(DAY FROM "createdAt")::text AS day,
      COUNT(*)::int AS total_consulted,
      COUNT(*) FILTER (WHERE state = 'FINALIZADO')::int AS total_completed
    FROM "Ruta"
    WHERE "createdAt" >= ${startOfMonth}
    GROUP BY EXTRACT(DAY FROM "createdAt")
    ORDER BY EXTRACT(DAY FROM "createdAt") ASC
    
    `;

    return stats;
  }

  // Method to get a route
  async getRouteItem(id: number) {
    const routeFounded = await this.prisma.ruta.findFirst({
      where: {
        id,
      },
    });
    if (!routeFounded) throw new HttpException('Route not found', 404);
    return routeFounded;
  }

  // Method to update a route
  async updateRouteItem(id: number, updateRutaDto: UpdateRutaDto) {
    const routeFounded = await this.getRouteItem(id);
    if (!routeFounded) throw new HttpException('Route not found', 404);
    const routeUpdated = this.prisma.ruta.update({
      where: {
        id,
      },
      data: {
        ...updateRutaDto,
      },
    });
    return routeUpdated;
  }

  // Method to delete a route
  async deleteRouteItem(id: number) {
    try {
      const routeFounded = await this.getRouteItem(id);
      if (!routeFounded) throw new HttpException('Route not found', 404);
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new ConflictException('The Field dont not exist in the table');
        }
        if (err.code === 'P2025') {
          throw new ConflictException('Record to delete does not exists');
        }
      }
    }
  }
}
