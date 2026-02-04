import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Genre } from 'generated/prisma/client';


export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsEnum(Genre)
  @IsOptional()
  genre?: Genre;
  @IsString()
  @IsNotEmpty()
  address: string;
}
