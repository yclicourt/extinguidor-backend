import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoParteTrabajo } from 'generated/prisma/client';

export class CreateRutaDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  in_charge: string;
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;
  @IsNumber()
  @IsNotEmpty()
  factureId: number;
  @IsString()
  @IsNotEmpty()
  tools: string[];
  @IsDate()
  @IsNotEmpty()
  date: Date;
  @IsString()
  @IsOptional()
  comments?: string;
  @IsEnum(EstadoParteTrabajo)
  @IsNotEmpty()
  state: EstadoParteTrabajo;
}
