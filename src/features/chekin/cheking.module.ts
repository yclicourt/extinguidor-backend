import { Module } from '@nestjs/common';
import { ChekinService } from './cheking.service';
import { ChekinController } from './cheking.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChekinController],
  providers: [ChekinService],
})
export class ChekinModule {}
