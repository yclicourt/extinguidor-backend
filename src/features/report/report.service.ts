import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a report
  createReportItem(createReportDto: CreateReportDto) {
    try {
      return this.prisma.reporte.create({
        data: {
          title: createReportDto.title,
          description: createReportDto.description || '',
          initial_hour: createReportDto.initialHour,
          final_hour: createReportDto.finalHour,
          work_type: createReportDto.workType,
          tools: createReportDto.tools,
          state_report: createReportDto.stateReport,
          user: {
            connect: {
              id: createReportDto.userId,
            },
          },
          checking: {
            connect: {
              id: createReportDto.checkingId,
            },
          },
          client: {
            connect: {
              id: createReportDto.clientId,
            },
          },
          vehicle: {
            connect: {
              id: createReportDto.vehicleId,
            },
          },
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

  // Method to get all reports
  getReportAllItems() {
    return this.prisma.reporte.findMany({
      include: {
        checking: {
          select: {
            status_checking: true,
          },
        },
        client: {
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
    });
  }

  // Method to get a report
  async getReportItem(id: number) {
    const reportFound = await this.prisma.reporte.findFirst({
      where: {
        id,
      },
    });
    if (!reportFound) throw new HttpException('Report not found', 404);
    return reportFound;
  }

  // Method to update a report
  async updateReportItem(id: number, updateReportDto: UpdateReportDto) {
    const reportFound = await this.getReportItem(id);
    if (!reportFound) throw new HttpException('Report not found', 404);
    const reportUpdated = this.prisma.reporte.update({
      where: {
        id: reportFound.id,
      },
      data: {
        ...updateReportDto,
      },
    });
    return reportUpdated;
  }

  // Method to delete a report
  async deleteReportItem(id: number) {
    try {
      const reportFound = await this.getReportItem(id);
      if (!reportFound) throw new HttpException('Report not found', 404);
      return this.prisma.reporte.delete({
        where: {
          id: reportFound.id,
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
