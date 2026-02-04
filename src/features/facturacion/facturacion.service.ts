import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateFacturacionDto } from './dto/create-facturacion.dto';
import { UpdateFacturacionDto } from './dto/update-facturacion.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class FacturacionService {
  constructor(private prisma: PrismaService) {}

  // Method to create a new facture
  createFacturationItem(createFacturacionDto: CreateFacturacionDto) {
    return this.prisma.facturacion.create({
      data: {
        facture_parts: createFacturacionDto.facture_parts,
        facture_work_parts: createFacturacionDto.facture_work_parts,
      },
      include: {
        routes: {
          select: {
            factureId: true,
          },
        },
        work_parts: {
          select: {
            factureId: true,
          },
        },
      },
    });
  }

  // Method to get all factures
  async getAllFacturationsItems() {
    const factFounds = await this.prisma.facturacion.findMany({
      include: {
        routes: {
          select: {
            id: true,
          },
        },
        work_parts: {
          select: {
            id: true,
          },
        },
      },
    });
    return factFounds;
  }

  // Method to get a facture
  async getFactureItem(id: number) {
    return await this.prisma.facturacion.findFirst({
      where: {
        id,
      },
      include: {
        routes: true,
        work_parts: true,
      },
    });
  }

  // Method to update a facture
  async updateFactureItem(
    id: number,
    updateFacturacionDto: UpdateFacturacionDto,
  ) {
    const factFounds = await this.prisma.facturacion.findUnique({
      where: {
        id,
      },
      include: {
        routes: true,
        work_parts: true,
      },
    });
    if (!factFounds) throw new HttpException('Facture not found', 404);
    return await this.prisma.facturacion.update({
      where: {
        id,
      },
      data: {
        facture_parts: updateFacturacionDto.facture_parts,
        facture_work_parts: updateFacturacionDto.facture_work_parts,
      },
      include: {
        routes: {
          select: {
            factureId: true,
          },
        },
        work_parts: {
          select: {
            factureId: true,
          },
        },
      },
    });
  }

  // Method to delete a facture
  async deleteFactureItem(id: number) {
    try {
      const factureFound = await this.getFactureItem(id);
      if (!factureFound) throw new HttpException('Facture not found', 404);
      return this.prisma.facturacion.delete({
        where: {
          id,
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
      throw err;
    }
  }
}
