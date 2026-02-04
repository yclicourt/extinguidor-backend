import { Module } from '@nestjs/common';
import { MailModule } from './integrations/mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArticlesModule } from './features/articles/articles.module';
import { AuthModule } from './features/auth/auth.module';
import { ChekinModule } from './features/chekin/cheking.module';
import { FacturacionModule } from './features/facturacion/facturacion.module';
import { PartesTrabajoModule } from './features/partes_trabajo/partes_trabajo.module';
import { ReportModule } from './features/report/report.module';
import { RutasModule } from './features/rutas/rutas.module';
import { UsersModule } from './features/users/users.module';
import { VehiclesModule } from './features/vehicles/vehicles.module';
import { FileUploadService } from './common/file-upload/file-upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ArticlesModule,
    AuthModule,
    ChekinModule,
    FacturacionModule,
    PartesTrabajoModule,
    ReportModule,
    RutasModule,
    UsersModule,
    VehiclesModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 2,
        },
      ],
    }),
    MailModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [FileUploadService],
})
export class AppModule {}
