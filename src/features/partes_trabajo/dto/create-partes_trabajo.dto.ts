import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Categoria, EstadoParteTrabajo, TipoTrabajo } from 'generated/prisma/enums';

export class CreatePartesTrabajoDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsNotEmpty()
  clientId: number;
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
  image?: string;
  @IsNumber()
  @IsNotEmpty()
  articleId: number;
  @IsString()
  @IsOptional()
  comment?: string;
  @IsNumber()
  @IsNotEmpty()
  factureId: number;
  @IsNumber()
  @IsNotEmpty()
  routeId: number;
}
