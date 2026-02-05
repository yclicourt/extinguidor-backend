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
        facture_amount: createFacturacionDto.facture_amount,
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

  // Method to obtain total of the facture
  async getTotalFactureItems(factureId: number) {
    // 1. Obtenemos el registro de facturación con sus partes y rutas relacionadas
    const factureFound = await this.prisma.facturacion.findUnique({
      where: {
        id: factureId,
      },
      include: {
        work_parts: true,
        routes: {
          include: {
            parts: true,
          },
        },
      },
    });
    if (!factureFound) throw new HttpException('Facture not found', 404);

    // 2. Cálculo para Partes de Trabajo independientes o vinculados
    const totalPartes = factureFound.work_parts
      .filter((parte) => parte.state === 'FINALIZADO')
      .reduce((acc, parte) => {
        return acc + (parte.amount_facture_parte || 0);
      }, 0);

    // 3. Cálculo basado en Rutas (Agregación de sus partes)
    const totalRutas = factureFound.routes.reduce((accRuta, ruta) => {
      const montoRuta = ruta.parts
        .filter((p) => p.state === 'FINALIZADO')
        .reduce((accParte, p) => accParte + (p.amount_facture_parte || 0), 0);
      return accRuta + montoRuta;
    }, 0);

    // 4. Actualización de los campos en el modelo Facturacion
    return await this.prisma.facturacion.update({
      where: {
        id: factureId,
      },
      data: {
        facture_parts: totalPartes,
        facture_work_parts: totalRutas,
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
        facture_amount: updateFacturacionDto.facture_amount,
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
