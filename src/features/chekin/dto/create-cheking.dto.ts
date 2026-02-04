import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { StatusChecking } from 'generated/prisma/enums';

export class CreateChekingDto {
  @IsDate()
  @IsNotEmpty()
  initial_hour: Date;
  @IsString()
  @IsNotEmpty()
  location: string;
  @IsEnum(StatusChecking)
  @IsNotEmpty()
  statusChecking: StatusChecking;
  @IsNumber()
  @IsNotEmpty()
  reporteId: number;
}
