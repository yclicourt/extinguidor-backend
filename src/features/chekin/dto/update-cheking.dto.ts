import { PartialType } from '@nestjs/mapped-types';
import { CreateChekingDto } from './create-cheking.dto';

export class UpdateChekinDto extends PartialType(CreateChekingDto) {}
