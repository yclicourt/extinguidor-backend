import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService,FileUploadService,ConfigService],
})
export class UsersModule {}
