import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  createVehicleItem(createVehicleDto: CreateVehicleDto) {
    return this.prisma.vehiculo.create({
      data: {
        type: createVehicleDto.type,
        matricule: createVehicleDto.matricule,
      },
    });
  }

  getAllVehicleItems() {
    return this.prisma.vehiculo.findMany({});
  }

  async getVehicleItem(id: number) {
    const vehicleFound = await this.prisma.vehiculo.findFirst({
      where: {
        id,
      },
    });
    if (!vehicleFound) throw new HttpException('Vehicle not found', 404);
    return vehicleFound;
  }

  async updateVehicleItem(id: number, updateVehicleDto: UpdateVehicleDto) {
    const vehicleFound = await this.getVehicleItem(id);
    if (!vehicleFound) throw new HttpException('Vehicle not found', 404);
    const vehicleUpdated = this.prisma.vehiculo.update({
      where: {
        id: vehicleFound.id,
      },
      data: {
        type: updateVehicleDto.type,
        matricule: updateVehicleDto.matricule,
      },
    });
    return vehicleUpdated;
  }

  async deleteVehicleItem(id: number) {
    try {
      const vehicleFound = await this.getVehicleItem(id);
      if (!vehicleFound) throw new HttpException('Vehicle not found', 404);
      return this.prisma.vehiculo.delete({
        where: {
          id: vehicleFound.id,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
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
