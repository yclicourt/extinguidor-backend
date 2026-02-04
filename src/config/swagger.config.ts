import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Extinguidor API')
  .setDescription('Extinguidor API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
