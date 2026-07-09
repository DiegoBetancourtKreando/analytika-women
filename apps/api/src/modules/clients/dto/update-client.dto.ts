import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType } from '@prisma/client';

export class UpdateClientDto {
  @ApiPropertyOptional({ enum: ClientType, example: 'INDIVIDUAL', description: 'Tipo de cliente' })
  @IsOptional()
  @IsEnum(ClientType)
  type?: ClientType;

  @ApiPropertyOptional({ example: 'Empresa XYZ', description: 'Nombre del cliente' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'contacto@empresa.com', description: 'Correo electrónico' })
  @IsOptional()
  @IsEmail()
  email?: string;

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

  @ApiPropertyOptional({ example: true, description: '¿Está activo?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Notas' })
  @IsOptional()
  @IsString()
  notes?: string;
}
