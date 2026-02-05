import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFacturacionDto {
  @IsNumber()
  @IsNotEmpty()
  facture_parts: number;
  @IsNumber()
  @IsNotEmpty()
  facture_work_parts: number;
  @IsNumber()
  @IsNotEmpty()
  facture_amount:number
}
