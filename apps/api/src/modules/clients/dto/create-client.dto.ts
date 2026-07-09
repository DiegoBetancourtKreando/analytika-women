import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType } from '@prisma/client';

export class CreateClientDto {
  @ApiProperty({ enum: ClientType, example: 'INDIVIDUAL', description: 'Tipo de cliente' })
  @IsEnum(ClientType)
  type: ClientType;

  @ApiProperty({ example: 'Empresa XYZ', description: 'Nombre del cliente' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contacto@empresa.com', description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+521234567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Empresa XYZ S.A.', description: 'Nombre de la organización' })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({ example: '12345678901', description: 'RUC' })
  @IsOptional()
  @IsString()
  ruc?: string;

  @ApiPropertyOptional({ example: 'Av. Principal 123', description: 'Dirección' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Juan Pérez', description: 'Persona de contacto' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Notas' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'ID del usuario asociado' })
  @IsOptional()
  @IsString()
  userId?: string;
}
