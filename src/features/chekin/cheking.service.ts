import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateChekingDto } from './dto/create-cheking.dto';
import { UpdateChekinDto } from './dto/update-cheking.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ChekinService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a checking
  createCheckinItem(createChekinDto: CreateChekingDto) {
    return this.prisma.checking.create({
      data: {
        initial_hour: createChekinDto.initial_hour,
        location: createChekinDto.location,
        status_checking: createChekinDto.statusChecking ,
        reporteId: createChekinDto.reporteId,
      },
    });
  }

  // Method to get all checkings
  getAllCheckingsItems() {
    return this.prisma.checking.findMany({});
  }

  // Method to get a checking
  async getCheckingItem(id: number) {
    const checkingFound = await this.prisma.checking.findFirst({
      where: {
        id,
      },
    });
    if (!checkingFound) throw new HttpException('Checking not found', 404);
    return checkingFound;
  }

  // Method to update a checking
  async updateCheckingItem(id: number, updateChekinDto: UpdateChekinDto) {
    const checkingFound = await this.getCheckingItem(id);
    if (!checkingFound) throw new HttpException('Checking not found', 404);

    const checkingUpdated = this.prisma.checking.update({
      where: {
        id: checkingFound.id,
      },
      data: {
        ...updateChekinDto,
      },
    });
    return checkingUpdated;
  }

  // Method to delete a checking
  async deleteCheckingItem(id: number) {
    try {
      const checkingFound = await this.getCheckingItem(id);
      if (!checkingFound) throw new HttpException('Checking not found', 404);

      return this.prisma.checking.delete({
        where: {
          id: checkingFound.id,
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
