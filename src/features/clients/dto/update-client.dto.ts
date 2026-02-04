import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Genre } from 'generated/prisma/client';


export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  lastname?: string;
  @IsEnum(Genre)
  @IsOptional()
  genre?: Genre;
  @IsString()
  @IsOptional()
  address?: string;
}
