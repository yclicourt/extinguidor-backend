import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Categoria,
  EstadoParteTrabajo,
  TipoTrabajo,
} from 'generated/prisma/enums';

export class CreatePartesTrabajoDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  clientId: number;
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;
  @IsString()
  @IsOptional()
  address?: string;
  @IsEnum(EstadoParteTrabajo)
  @IsNotEmpty()
  state: EstadoParteTrabajo;
  @IsEnum(TipoTrabajo)
  @IsNotEmpty()
  type_work: TipoTrabajo;
  @IsEnum(Categoria)
  @IsNotEmpty()
  category: Categoria;
  @IsString()
  @IsOptional()
  docs?: string;
  @IsString()
  @IsOptional()
  imageDoc?: string;
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  articuleId?: number;
  @IsString()
  @IsOptional()
  comment?: string;
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  factureId?: number;
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  routeId?: number;
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount_facture_parte: number;
}
