import {
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { TipoTrabajo, ReporteState } from 'generated/prisma/enums';

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDate()
  @IsOptional()
  initialHour?: Date;
  @IsDate()
  @IsOptional()
  finalHour?: Date;
  @IsNumber()
  @IsOptional()
  clientId?: number;
  @IsEnum(TipoTrabajo)
  @IsOptional()
  workType?: TipoTrabajo;
  @IsString()
  @IsOptional()
  tools?: string;
  @IsNumber()
  @IsOptional()
  vehicleId?: number;
  @IsEnum(ReporteState)
  @IsOptional()
  stateReport?: ReporteState;
}
