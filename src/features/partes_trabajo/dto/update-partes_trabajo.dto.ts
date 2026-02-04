import { IsString, IsOptional, IsNumber, IsDate, IsEnum } from "class-validator";
import { EstadoParteTrabajo, TipoTrabajo, Categoria } from "generated/prisma/enums";

export class UpdatePartesTrabajoDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  clientId?: number;
  @IsDate()
  @IsOptional()
  date?: Date;
  @IsString()
  @IsOptional()
  address?: string;
  @IsEnum(EstadoParteTrabajo)
  @IsOptional()
  state?: EstadoParteTrabajo;
  @IsEnum(TipoTrabajo)
  @IsOptional()
  type_work?: TipoTrabajo;
  @IsEnum(Categoria)
  @IsOptional()
  category?: Categoria;
  @IsString()
  @IsOptional()
  docs?: string;
  @IsString()
  @IsOptional()
  image?: string;
  @IsNumber()
  @IsOptional()
  articleId?: number;
  @IsString()
  @IsOptional()
  comment?: string;
  @IsNumber()
  @IsOptional()
  factureId?: number;
  @IsNumber()
  @IsOptional()
  routeId?: number;
}
