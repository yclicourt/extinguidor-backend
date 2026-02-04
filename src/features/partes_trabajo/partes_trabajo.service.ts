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

  // Method to show part unassigned by month
  getUnassignedParts(month: number, year: number) {
    const initial_month = new Date(Date.UTC(year, month, 1));
    const final_month = new Date(Date.UTC(year, month + 1, 1));
    return this.prisma.parteTrabajo.findMany({
      where: {
        routeId: undefined,
        date: {
          gte: initial_month,
          lt: final_month,
        },
      },
    });
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
