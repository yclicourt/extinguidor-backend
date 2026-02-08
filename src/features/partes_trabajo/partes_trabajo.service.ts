import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreatePartesTrabajoDto } from './dto/create-partes_trabajo.dto';
import { UpdatePartesTrabajoDto } from './dto/update-partes_trabajo.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PartesTrabajoService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a work part
  createParteTrabajoItem(createPartesTrabajoDto: CreatePartesTrabajoDto) {
    return this.prisma.parteTrabajo.create({
      data: {
        title: createPartesTrabajoDto.title,
        description: createPartesTrabajoDto.description ?? '',
        date: createPartesTrabajoDto.date,
        address: createPartesTrabajoDto.address ?? '',
        state: createPartesTrabajoDto.state,
        type_work: createPartesTrabajoDto.type_work,
        category: createPartesTrabajoDto.category,
        docs: createPartesTrabajoDto.docs ?? '',
        image: createPartesTrabajoDto.image ?? '',
        comment: createPartesTrabajoDto.comment ?? '',
        amount_facture_parte: createPartesTrabajoDto.amount_facture_parte,
        client: {
          connect: {
            id: createPartesTrabajoDto.clientId,
          },
        },
        facture: {
          connect: {
            id: createPartesTrabajoDto.factureId,
          },
        },
        articule: {
          connect: {
            id: createPartesTrabajoDto.articleId,
          },
        },
        route: {
          connect: {
            id: createPartesTrabajoDto.routeId,
          },
        },
      },
    });
  }

  // Method to get all works parts
  getAllParteTrabajoItems() {
    return this.prisma.parteTrabajo.findMany({
      include: {
        articule: {
          select: {
            title: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
        facture: {
          select: {
            facture_work_parts: true,
          },
        },
        route: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  // Method to check assign o unassign works parts
  async getAssignORUnassignedParts(
    month: number,
    year: number,
    assigned?: boolean,
    page: number = 1,
    limit: number = 5,
  ) {
    const initial_month = new Date(Date.UTC(year, month, 1));
    const final_month = new Date(Date.UTC(year, month + 1, 1));

    // 1. Definimos el filtro en una variable para reusarlo
    const whereCondition = {
      date: {
        gte: initial_month,
        lt: final_month,
      },
      routeId:
        assigned === undefined ? undefined : assigned ? { not: null } : null,
    };

    // 2. Ejecutamos el conteo y la búsqueda en paralelo
    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.parteTrabajo.findMany({
        where: whereCondition,
        include: {
          client: true,
          route: { select: { in_charge: true } },
        },
        orderBy: { date: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.parteTrabajo.count({ where: whereCondition }),
    ]);

    // 3. Devolvemos el objeto con la metadata necesaria para el frontend
    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  // Method to obtain Pending Work Orders
  async getDashboardWorkOrderStats() {
    const [pendingExecution, unassigned] = await Promise.all([
      this.prisma.parteTrabajo.count({ where: { state: 'PENDIENTE' } }),
      this.prisma.parteTrabajo.count({ where: { routeId: undefined } }),
    ]);
    const totalPending = pendingExecution + unassigned;

    return totalPending;
  }

  // Method to get a work part
  async getParteTrabajoItem(id: number) {
    const workPartFound = await this.prisma.parteTrabajo.findFirst({
      where: {
        id,
      },
    });
    if (!workPartFound) throw new HttpException('Work Part not found', 404);

    return workPartFound;
  }

  // Method to update a work part
  async updateParteTrabajoItem(
    id: number,
    updatePartesTrabajoDto: UpdatePartesTrabajoDto,
  ) {
    const workPartFound = await this.getParteTrabajoItem(id);
    if (!workPartFound) throw new HttpException('Work Part not found', 404);
    const workPartUpdated = await this.prisma.parteTrabajo.update({
      where: {
        id: workPartFound.id,
      },
      data: {
        ...updatePartesTrabajoDto,
      },
    });
    return workPartUpdated;
  }

  // Method to assign part to route from calendar
  asignPartsToRoute(routeId: number, partIds: number[]) {
    return this.prisma.parteTrabajo.updateMany({
      where: {
        id: {
          in: partIds,
        },
      },
      data: {
        routeId,
      },
    });
  }

  // Method to assign part to route from calendar
  asignPartToRoute(partId: number, routeId: number) {
    return this.prisma.parteTrabajo.updateMany({
      where: {
        id: partId,
      },
      data: {
        routeId,
      },
    });
  }

  // Method to delete a work part
  async deleteParteTrabajoItem(id: number) {
    try {
      const workPartFound = await this.getParteTrabajoItem(id);
      if (!workPartFound) throw new HttpException('Work Part not found', 404);
      return this.prisma.parteTrabajo.delete({
        where: {
          id: workPartFound.id,
        },
      });
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
