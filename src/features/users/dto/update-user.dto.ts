import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Status } from '../enums/status.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'id user',
    example: '1',
  })
  id?: number;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'name user',
    example: 'john',
  })
  name?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'lastname user',
    example: 'mcmillan',
  })
  lastname?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'email user',
    example: 'test@mail.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'address user',
    example: 'some 123 avenue',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'password user',
    example: 'mypassword',
  })
  password?: string;

  @IsString()
  @IsOptional()
  phone?: string | undefined;

  @IsEnum(['ACTIVO', 'INACTIVO', 'OFFLINE'])
  @IsOptional()
  status?: Status | undefined;
}
