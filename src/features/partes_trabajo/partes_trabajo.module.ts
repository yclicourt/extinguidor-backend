import { Module } from '@nestjs/common';
import { PartesTrabajoService } from './partes_trabajo.service';
import { PartesTrabajoController } from './partes_trabajo.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PartesTrabajoController],
  providers: [PartesTrabajoService],
})
export class PartesTrabajoModule {}
