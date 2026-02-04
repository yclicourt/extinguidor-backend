import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';


@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a new client
  createClientItem(createClientDto: CreateClientDto) {
    return this.prisma.cliente.create({
      data: {
        name: createClientDto.name,
        lastname: createClientDto.lastname,
        genre: createClientDto.genre,
        address: createClientDto.address,
      },
    });
  }

  // Method to get all clients items
  getAllClientsItems() {
    return this.prisma.cliente.findMany({});
  }

  // Method to get a client item
  async getClientItem(id: number) {
    const clientFound = await this.prisma.cliente.findUnique({
      where: {
        id,
      },
    });
    if (!clientFound) throw new HttpException('Client not found', 404);

    return clientFound;
  }

  // Method to update a client item
  async updateClientItem(id: number, updateClientDto: UpdateClientDto) {
    const clientFound = await this.getClientItem(id);
    if (!clientFound) throw new HttpException('Client not found', 404);
    const clientUpdated = await this.prisma.cliente.update({
      where: {
        id,
      },
      data: {
        name: updateClientDto.name,
        lastname: updateClientDto.lastname,
        genre: updateClientDto.genre,
        address: updateClientDto.address,
      },
    });
    return clientUpdated;
  }

  // Method to delete a client item
  async deleteClientItem(id: number) {
    try {
      const clientFound = await this.getClientItem(id);
      if (!clientFound) throw new HttpException('Client not found', 404);
      return this.prisma.cliente.delete({
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
