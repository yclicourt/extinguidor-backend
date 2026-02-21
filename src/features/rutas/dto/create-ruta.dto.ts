import { Type } from 'class-transformer';
import {
  IsArray,
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
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tools: string[];
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;
  @IsString()
  @IsOptional()
  comments?: string;
  @IsEnum(EstadoParteTrabajo)
  @IsNotEmpty()
  state: EstadoParteTrabajo;
  @IsNumber()
  @IsNotEmpty()
  amount_facture_route: number;
}
