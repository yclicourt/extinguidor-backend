import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReporteState, TipoTrabajo } from 'generated/prisma/enums';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDate()
  @IsNotEmpty()
  initialHour: Date;
  @IsDate()
  @IsNotEmpty()
  finalHour: Date;
  @IsNumber()
  @IsNotEmpty()
  clientId: number;
  @IsEnum(TipoTrabajo)
  @IsNotEmpty()
  workType: TipoTrabajo;
  @IsString()
  @IsNotEmpty()
  tools: string;
  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;
  @IsNumber()
  @IsNotEmpty()
  checkingId: number;
  @IsEnum(ReporteState)
  @IsNotEmpty()
  stateReport: ReporteState;
}
